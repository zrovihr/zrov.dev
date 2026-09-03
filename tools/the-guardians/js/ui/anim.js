// Motion. Reads the state before an action, the state after it, and the action itself, then
// plays what changed. Cosmetic layer only: it never writes game state and never treats the
// DOM as truth. Delete this file and the game is still correct, just abrupt.
//
// The renderer rebuilds the board from scratch on every state change (render.js), so nothing
// here can rely on a DOM node surviving a render. The choreography is therefore split:
//
//   before   runs on the OLD DOM, where the units about to die still exist:
//            card flight, enemy card reveal, lunges, hits, floating damage, deaths
//   render   the caller rebuilds the board from the new state
//   after    runs on the NEW DOM: arrivals, slides (FLIP against rects captured before the
//            rebuild), gains, pulses, banners
//
// Every animation is gated on the diff between prev and next, never on what the new DOM
// happens to contain. A state-gated entrance (".unit { animation: ... }") would replay on
// every rebuild, which is the classic full-rebuild pitfall. That is why no keyframe in
// game.css is attached to a plain component class: motion classes are all fx-* and are added
// here, transiently.
//
// Two rules keep it honest to the engine:
//   - Combat is simultaneous (combat.js), so every attacker lunges at once and every hit lands
//     at once. Sequencing them would show a rule that does not exist.
//   - Strikes are reconstructed with resolveIntent() on the pre-combat state, the same
//     function the engine used on the same board, so the animation cannot disagree with what
//     actually happened.

import { LANES, SLOTS_PER_SIDE, COLOR_LABEL } from '../engine/constants.js';
import { resolveIntent, enemyOf } from '../engine/combat.js';
import { PHASE } from '../engine/phases.js';
import { CARDS } from '../data/cards.js';
import { ME } from './render.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Durations in ms. Feel-tuned, not derived: the only outside constraint is the usual
// interaction band (under ~100ms reads as instant, over ~500ms reads as waiting) and every
// blocking step sits inside it. The longest anything holds input is a lane resolving:
// LUNGE * LUNGE_APEX + HIT + FALL_HERO, about 660ms.
const T = {
  LUNGE: 200,        // attacker steps forward and back
  HIT: 260,          // flash and number pop, before the dead start to fall
  FALL: 340,         // a creep leaves the board
  FALL_HERO: 520,    // a hero leaves the board; slower because it costs more
  FLIGHT: 280,       // a card leaves the hand for its lane
  REVEAL_IN: 220,    // the enemy's card lands in the lane
  REVEAL_LEAD: 420,  // and is readable this long before its effect hits
  REVEAL_HOLD: 1100, // and stays this long after, without blocking
  REVEAL_OUT: 240,
  FLOAT: 800,        // a floating number
  FLIP: 260,         // a unit or card sliding to a new slot
  STAGGER: 45,       // per unit, so a spawn wave reads as a wave
  CHIP: 900,         // "passes" marker
  BANNER: 1200,      // "Round N"
  SHAKE: 300,        // a tower taking a hit
  ENDING_HOLD: 700,  // the final blow stays visible before the verdict covers it
};

// Fraction of LUNGE at which the hit lands: the keyframe has the attacker fully forward here.
const LUNGE_APEX = 0.4;

// 10px. The arrow band is floored at 52px (.battlefield minmax in game.css), so two facing
// units lunging 10px each still leave 32px of band between them and the arrows stay readable
// mid-strike.
const LUNGE_PX = 10;

const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.5, 0, 0.9, 0.4)';
const EASE_STD = 'cubic-bezier(0.4, 0, 0.2, 1)';

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
// Read live rather than cached, so flipping the OS setting mid-game takes effect at once.
// Under reduced motion nothing translates or shakes; numbers still appear, in place, because
// they carry information the board itself no longer shows once it has rebuilt.
const still = () => motionQuery.matches;
const dur = (ms) => (still() ? 0 : ms);

// ---------------------------------------------------------------- lifecycle

let gen = 0;               // bumped by cancelAll; every await checks it and bails out
const live = new Set();    // running Animation objects, so cancelAll can stop them
const reveals = new Map(); // laneIdx -> reveal element, so a second reveal replaces the first

export function cancelAll(dom) {
  gen += 1;
  for (const a of live) {
    try { a.cancel(); } catch { /* already finished */ }
  }
  live.clear();
  reveals.clear();
  if (dom?.fx) dom.fx.replaceChildren();
}

// Web Animations wrapper that never rejects: a cancelled animation resolves like a finished
// one, so a resign mid-combat cannot leave a dangling promise behind.
function run(el, keyframes, opts) {
  let anim;
  try { anim = el.animate(keyframes, opts); } catch { return Promise.resolve(); }
  live.add(anim);
  return anim.finished.catch(() => {}).then(() => { live.delete(anim); });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Re-adds a class so its CSS animation restarts on an element that persists across renders.
function retrigger(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth; // forces a style flush; without it the browser merges remove and add
  el.classList.add(cls);
}

// ---------------------------------------------------------------- lookups

const unitEl = (dom, uid) => dom.lanes.querySelector(`[data-unit="${uid}"]`);
const unitAt = (dom, lane, side, slot) =>
  dom.lanes.querySelector(`.unit[data-lane="${lane}"][data-side="${side}"][data-slot="${slot}"]`);
const towerEl = (dom, lane, side) => dom.lanes.querySelector(`.lane[data-lane="${lane}"] [data-tower="${side}"]`);
const laneEl = (dom, lane) => dom.lanes.querySelector(`.lane[data-lane="${lane}"]`);
const fieldBox = (dom, lane) => laneEl(dom, lane)?.querySelector('.battlefield')?.getBoundingClientRect();
const center = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

// Rects of everything that might slide, taken before any transform is applied and before the
// rebuild. getBoundingClientRect includes transforms, so this has to be the very first step.
function snapshot(dom) {
  const units = new Map();
  for (const el of dom.lanes.querySelectorAll('[data-unit]')) {
    units.set(Number(el.dataset.unit), el.getBoundingClientRect());
  }
  const cards = [...dom.hand.querySelectorAll('[data-card]')].map((el) => el.getBoundingClientRect());
  return { units, cards };
}

// ---------------------------------------------------------------- diff

function indexUnits(state) {
  const map = new Map();
  state.lanes.forEach((lane, l) => {
    lane.slots.forEach((row, side) => {
      row.forEach((unit, slot) => { if (unit) map.set(unit.uid, { unit, lane: l, side, slot }); });
    });
  });
  return map;
}

function diff(prev, next) {
  const before = indexUnits(prev);
  const after = indexUnits(next);
  const d = {
    hurt: [], healed: [], died: [], moved: [], appeared: [], atk: [], silenced: [],
    towers: [], resolvedLane: -1,
  };

  for (const [uid, p] of before) {
    const n = after.get(uid);
    if (!n) { d.died.push(p); continue; }
    const dHp = n.unit.hp - p.unit.hp;
    if (dHp < 0) d.hurt.push({ ...n, amount: -dHp });
    else if (dHp > 0) d.healed.push({ ...n, amount: dHp });
    const dAtk = n.unit.atk - p.unit.atk;
    if (dAtk !== 0) d.atk.push({ ...n, amount: dAtk });
    if (n.lane !== p.lane || n.side !== p.side || n.slot !== p.slot) d.moved.push({ ...n, from: p });
    if (n.unit.silenced && !p.unit.silenced) d.silenced.push(n);
  }
  for (const [uid, n] of after) if (!before.has(uid)) d.appeared.push(n);

  for (let l = 0; l < LANES; l++) {
    if (next.lanes[l].resolved && !prev.lanes[l].resolved) d.resolvedLane = l;
    for (const side of [0, 1]) {
      const tp = prev.lanes[l].tower[side];
      const tn = next.lanes[l].tower[side];
      const fell = (tn.ancient && !tp.ancient) || (tn.hp <= 0 && tp.hp > 0);
      if (fell || tn.hp < tp.hp) d.towers.push({ lane: l, side, fell, before: tp, after: tn });
    }
  }
  return d;
}

// The strikes the engine resolved, rebuilt from the pre-combat state with the engine's own
// targeting function. Same inputs, same function, same answer.
function combatStrikes(prev, laneIdx) {
  const lane = prev.lanes[laneIdx];
  const out = [];
  for (let side = 0; side < 2; side++) {
    for (let slot = 0; slot < SLOTS_PER_SIDE; slot++) {
      const unit = lane.slots[side][slot];
      if (!unit) continue;
      const target = resolveIntent(prev, laneIdx, side, slot);
      if (!target) continue;
      const dealt = target.kind === 'unit' ? Math.max(0, unit.atk - target.unit.armor) : unit.atk;
      out.push({ uid: unit.uid, target, dealt });
    }
  }
  return out;
}

// Damage a spell dealt to a unit that did not survive it. Survivors do not need this: their
// number is simply the hp they lost. Returns null when there is no number to show, e.g. Toll
// of Ash, which removes rather than damages.
function spellDamage(prev, action, victim) {
  if (action?.type !== 'PLAY') return null;
  const card = CARDS[prev.players[prev.current].hand[action.handIndex]];
  const e = card?.effect;
  if (!e) return null;
  if (e.id === 'dmg_unit' || e.id === 'dmg_row') return Math.max(0, e.amount - victim.unit.armor);
  if (e.id === 'buff_unit' && e.selfDamage) return Math.max(0, e.selfDamage - victim.unit.armor);
  return null;
}

const stepKey = (s) => (s.phase === PHASE.ACTION ? `${s.phase}:${s.activeLane}` : s.phase);

// ---------------------------------------------------------------- pieces

// xFrac lets two numbers share one unit without overlapping (Overgrowth gives +1 atk and +2 hp).
// Starts in the empty middle of the unit, between the name and the stats, and drifts up.
// Linear at the effect level on purpose: an ease-out here front-loads the fade and the number
// is mostly gone in 300ms. Instead it pops, holds fully readable to 55%, then fades.
function floatText(fx, rect, text, cls, xFrac = 0.5) {
  const el = document.createElement('span');
  el.className = `fx-float num ${cls}`;
  el.textContent = text;
  el.style.left = `${rect.left + rect.width * xFrac}px`;
  el.style.top = `${rect.top + rect.height * 0.55}px`;
  fx.appendChild(el);
  const frames = still()
    ? [{ opacity: 1 }, { opacity: 1, offset: 0.55 }, { opacity: 0 }]
    : [
      { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 1, easing: EASE_OUT },
      { transform: 'translate(-50%, calc(-50% - 3px)) scale(1)', opacity: 1, offset: 0.15 },
      { transform: 'translate(-50%, calc(-50% - 12px)) scale(1)', opacity: 1, offset: 0.55 },
      { transform: 'translate(-50%, calc(-50% - 22px)) scale(1)', opacity: 0 },
    ];
  run(el, frames, { duration: T.FLOAT, easing: 'linear', fill: 'forwards' }).then(() => el.remove());
}

function banner(fx, rect, text, cls) {
  const el = document.createElement('div');
  el.className = `fx-banner display ${cls}`;
  el.textContent = text;
  const c = center(rect);
  el.style.left = `${c.x}px`;
  el.style.top = `${c.y}px`;
  fx.appendChild(el);
  const frames = still()
    ? [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }]
    : [
      { opacity: 0, letterSpacing: '0.2em' },
      { opacity: 1, letterSpacing: '0.06em', offset: 0.18 },
      { opacity: 1, letterSpacing: '0.06em', offset: 0.75 },
      { opacity: 0, letterSpacing: '0.06em' },
    ];
  run(el, frames, { duration: T.BANNER, easing: EASE_OUT, fill: 'forwards' }).then(() => el.remove());
}

// A small marker for an enemy action that changes nothing on the board and so would otherwise
// be invisible. Right-aligned to the rect it is given.
function chip(fx, rect, text) {
  const el = document.createElement('span');
  el.className = 'fx-chip';
  el.textContent = text;
  el.style.left = `${rect.right - 6}px`;
  el.style.top = `${center(rect).y}px`;
  fx.appendChild(el);
  const rest = 'translate(-100%, -50%)';
  const frames = still()
    ? [{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }]
    : [
      { opacity: 0, transform: `${rest} translateY(-4px)` },
      { opacity: 1, transform: rest, offset: 0.2 },
      { opacity: 1, transform: rest, offset: 0.8 },
      { opacity: 0, transform: rest },
    ];
  run(el, frames, { duration: T.CHIP, easing: EASE_OUT, fill: 'forwards' }).then(() => el.remove());
}

// Takes a reveal off the table early: a second card in the same lane, or combat starting
// there. Combat is the reason the reveal lives where it does at all, see revealCard.
function dismissReveal(laneIdx) {
  const old = reveals.get(laneIdx);
  if (!old) return;
  reveals.delete(laneIdx);
  const opacity = getComputedStyle(old).opacity; // read before cancel: cancel snaps to base 0
  for (const a of old.getAnimations()) a.cancel();
  run(old, [{ opacity }, { opacity: 0 }], { duration: dur(120), fill: 'forwards' }).then(() => old.remove());
}

// The enemy's card, shown in the lane it was played into. Without this the only trace of an
// enemy play is one line in the field report. Non-blocking after REVEAL_LEAD, so it is still
// fading while you take your own move.
//
// It is a landscape strip laid exactly over the lane's enemy mana and tower band, not a
// portrait card over the battlefield: that band is the one part of the lane nothing else is
// happening in, so the reveal never covers a unit, an arrow, or a number that is about to
// change. (The first version sat over the arrows and was still there when combat began.)
function revealCard(fx, dom, laneIdx, card) {
  dismissReveal(laneIdx);
  const lane = laneEl(dom, laneIdx);
  const strip = lane?.querySelector('.mana--foe')?.getBoundingClientRect();
  const tower = lane?.querySelector('[data-tower="1"]')?.getBoundingClientRect();
  if (!lane || !strip || !tower) return;
  const laneBox = lane.getBoundingClientRect();

  const el = document.createElement('div');
  el.className = 'fx-reveal';
  el.style.setProperty('--faction', `var(--${card.color})`);
  const kind = `${card.color === 'neutral' ? 'Neutral' : COLOR_LABEL[card.color]} ${card.type}`;
  el.innerHTML = `
    <span class="fx-reveal__cost num">${card.cost}</span>
    <span class="fx-reveal__head">
      <span class="fx-reveal__name">${esc(card.name)}</span>
      <span class="fx-reveal__type">${esc(kind)}</span>
    </span>
    <span class="fx-reveal__text">${esc(card.text)}${card.type === 'creep'
    ? ` <b class="fx-reveal__body num"><span class="atk">${card.atk}</span>/${card.hp}</b>` : ''}</span>`;
  // 6px inset: the lane's own 1px border plus the tower's 6px corner notch, so the strip sits
  // inside the architecture rather than on its edge.
  el.style.left = `${laneBox.left + 6}px`;
  el.style.width = `${laneBox.width - 12}px`;
  el.style.top = `${strip.top}px`;
  el.style.height = `${tower.bottom - strip.top}px`;
  fx.appendChild(el);
  reveals.set(laneIdx, el);

  const inFrames = still()
    ? [{ opacity: 0 }, { opacity: 1 }]
    : [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }];
  const outFrames = still()
    ? [{ opacity: 1 }, { opacity: 0 }]
    : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }];

  run(el, inFrames, { duration: dur(T.REVEAL_IN), easing: EASE_OUT, fill: 'forwards' })
    .then(() => wait(T.REVEAL_LEAD + T.REVEAL_HOLD))
    .then(() => {
      if (reveals.get(laneIdx) !== el) return; // dismissed early; dismissReveal owns removal
      return run(el, outFrames, { duration: dur(T.REVEAL_OUT), easing: EASE_IN, fill: 'forwards' })
        .then(() => { reveals.delete(laneIdx); el.remove(); });
    });
}

// Your card leaves the hand for the lane. The original is hidden at once so the hand reads as
// already lighter; the ghost is the card from here until it lands.
function flyCard(fx, dom, handIndex, laneIdx) {
  const card = dom.hand.querySelector(`[data-card="${handIndex}"]`);
  const box = fieldBox(dom, laneIdx);
  if (!card || !box) return Promise.resolve();

  const from = card.getBoundingClientRect();
  // Clone before hiding: cloneNode copies inline style, and a ghost that inherits
  // visibility:hidden flies invisibly (that is exactly what happened the first time).
  const ghost = card.cloneNode(true);
  card.style.visibility = 'hidden';
  if (still()) return Promise.resolve();

  ghost.className = 'card fx-ghost';
  ghost.removeAttribute('disabled');
  ghost.removeAttribute('data-card');
  ghost.style.left = `${from.left}px`;
  ghost.style.top = `${from.top}px`;
  ghost.style.width = `${from.width}px`;
  ghost.style.height = `${from.height}px`;
  fx.appendChild(ghost);

  const to = center(box);
  const f = center(from);
  return run(ghost, [
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${to.x - f.x}px, ${to.y - f.y}px) scale(0.35)`, opacity: 0 },
  ], { duration: T.FLIGHT, easing: EASE_STD, fill: 'forwards' }).then(() => ghost.remove());
}

// A ring in the card's colour, not the unit's, on whatever the card touches.
function pulseUnit(el, color, delay = 0) {
  if (!el) return;
  el.style.setProperty('--fx-color', `var(--${color})`);
  el.style.animationDelay = `${delay}ms`;
  el.classList.add('fx-ring');
}

function pulseTargets(dom, prev, action, card) {
  if (action.target) {
    const t = action.target;
    pulseUnit(unitAt(dom, t.lane, t.side, t.slot), card.color);
    return;
  }
  const e = card.effect;
  if (!e) return;
  const rowSide = e.id === 'dmg_row' ? enemyOf(prev.current) : e.id === 'buff_row' ? prev.current : null;
  if (rowSide === null) return;
  let i = 0;
  for (let slot = 0; slot < SLOTS_PER_SIDE; slot++) {
    const el = unitAt(dom, action.lane, rowSide, slot);
    if (el) pulseUnit(el, card.color, i++ * dur(40));
  }
}

// Every attacker steps toward what it will hit. Direction comes from the real on-screen
// positions, so a diagonal hit steps diagonally and a tower hit steps straight through.
function lunge(dom, laneIdx, strikes) {
  for (const s of strikes) {
    const el = unitEl(dom, s.uid);
    if (!el) continue;
    const from = el.getBoundingClientRect();
    const targetEl = s.target.kind === 'tower'
      ? towerEl(dom, laneIdx, s.target.side)
      : unitAt(dom, laneIdx, s.target.side, s.target.slot);
    const to = targetEl ? targetEl.getBoundingClientRect() : from;
    const a = center(from);
    const b = center(to);
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const x = ((b.x - a.x) / len) * LUNGE_PX;
    const y = ((b.y - a.y) / len) * LUNGE_PX;
    el.style.zIndex = '6'; // over the arrow band (z-index 4) for the moment it crosses into it
    run(el, [
      { transform: 'none' },
      { transform: `translate(${x}px, ${y}px)`, offset: LUNGE_APEX },
      { transform: 'none' },
    ], { duration: T.LUNGE, easing: EASE_STD });
  }
}

// The old DOM is about to be discarded, so writing the new numbers into it is safe: it is a
// transient picture of the moment of impact, not a second source of truth.
function hitUnit(fx, dom, uid, amount, afterHp, maxHp) {
  const el = unitEl(dom, uid);
  if (!el) return;
  if (amount) floatText(fx, el.getBoundingClientRect(), `-${amount}`, 'fx-float--dmg');
  const hp = el.querySelector('.unit__hp');
  if (hp) { hp.textContent = Math.max(0, afterHp); hp.classList.add('is-hurt'); }
  const fill = el.querySelector('.unit__hpfill');
  if (fill) fill.style.width = `${(Math.max(0, afterHp) / maxHp) * 100}%`;
  // Brightness rather than box-shadow, so it composes with a spell ring on the same unit.
  run(el, [{ filter: 'brightness(2.6)' }, { filter: 'brightness(1)' }], { duration: T.HIT, easing: EASE_OUT });
}

function hitTower(fx, dom, t, amount) {
  const el = towerEl(dom, t.lane, t.side);
  if (!el) return;
  if (amount) floatText(fx, el.getBoundingClientRect(), `-${amount}`, 'fx-float--dmg');
  const hp = el.querySelector('.tower__hp');
  if (hp) hp.textContent = t.fell ? 0 : t.after.hp;
  const fill = el.querySelector('.tower__fill');
  if (fill) fill.style.width = `${t.fell ? 0 : Math.max(0, t.after.hp / t.after.max) * 100}%`;
  if (still()) return;
  run(el, [
    { transform: 'none' },
    { transform: 'translateX(-3px)', offset: 0.2 },
    { transform: 'translateX(3px)', offset: 0.4 },
    { transform: 'translateX(-2px)', offset: 0.6 },
    { transform: 'translateX(2px)', offset: 0.8 },
    { transform: 'none' },
  ], { duration: T.SHAKE, easing: 'linear' });
}

// The dead fall back toward their own tower and lose their colour on the way.
function fall(dom, died) {
  return Promise.all(died.map((x) => {
    const el = unitEl(dom, x.unit.uid);
    if (!el) return null;
    el.classList.add('is-dying');
    const hero = x.unit.kind === 'hero';
    const frames = still()
      ? [{ opacity: 1 }, { opacity: 0 }]
      : [
        { opacity: 1, transform: 'none', filter: 'none' },
        { opacity: 0, transform: `translateY(${x.side === ME ? 8 : -8}px) scale(0.94)`, filter: 'grayscale(1) brightness(0.45)' },
      ];
    const duration = still() ? 120 : hero ? T.FALL_HERO : T.FALL;
    return run(el, frames, { duration, easing: EASE_IN, fill: 'forwards' });
  }));
}

// ---------------------------------------------------------------- after the rebuild

// The hand only ever changes two ways: one card leaves (a play) or cards are appended (a
// draw). So the mapping from new index to old index is arithmetic, and survivors slide from
// their old rect while the drawn ones rise in.
function handMotion(dom, prev, next, action, snap) {
  const oldLen = prev.players[ME].hand.length;
  const removed = action?.type === 'PLAY' && prev.current === ME ? action.handIndex : -1;
  const survivors = removed === -1 ? oldLen : oldLen - 1;
  const els = dom.hand.querySelectorAll('[data-card]');

  els.forEach((el, i) => {
    if (i >= survivors) {
      el.style.animationDelay = `${(i - survivors) * dur(T.STAGGER)}ms`;
      el.classList.add('fx-draw');
      return;
    }
    if (still()) return;
    const from = snap.cards[removed !== -1 && i >= removed ? i + 1 : i];
    if (!from) return;
    const now = el.getBoundingClientRect();
    const dx = from.left - now.left;
    const dy = from.top - now.top;
    if (!dx && !dy) return;
    run(el, [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: T.FLIP, easing: EASE_OUT });
  });
}

function statMotion(dom, prev, next) {
  for (const side of [0, 1]) {
    const p = prev.players[side];
    const n = next.players[side];
    const own = side === ME;
    if (p.gold !== n.gold) retrigger(own ? dom.gold : dom.foeGold, 'fx-bump');
    if (p.towersLost !== n.towersLost) retrigger(own ? dom.ownTowers : dom.foeTowers, 'fx-bump');
    if (p.hand.length !== n.hand.length) retrigger(own ? dom.handCount : dom.foeHand, 'fx-bump');
  }
  if (prev.round !== next.round) retrigger(dom.round, 'fx-bump');
}

// Pips that were full and are now empty drain visibly, so the cost of a card is seen leaving.
function manaMotion(dom, prev, next) {
  for (let l = 0; l < LANES; l++) {
    for (const side of [0, 1]) {
      const was = prev.lanes[l].mana[side];
      const now = next.lanes[l].mana[side];
      if (now >= was || prev.lanes[l].manaMax[side] !== next.lanes[l].manaMax[side]) continue;
      const pips = laneEl(dom, l)?.querySelectorAll(side === ME ? '.mana:not(.mana--foe) .pip' : '.mana--foe .pip');
      if (!pips) continue;
      for (let i = now; i < was && i < pips.length; i++) pips[i].classList.add('fx-spent');
    }
  }
}

function after({ prev, next, action, dom, fx, d, snap }) {
  // Arrivals, in board order, so a spawn wave reads as a wave rather than a pop.
  const arrivals = d.appeared.slice().sort((a, b) => a.lane - b.lane || a.side - b.side || a.slot - b.slot);
  arrivals.forEach((u, i) => {
    const el = unitEl(dom, u.unit.uid);
    if (!el) return;
    el.style.setProperty('--fx-from', `${u.side === ME ? 10 : -10}px`);
    el.style.animationDelay = `${i * dur(T.STAGGER)}ms`;
    el.classList.add(u.unit.kind === 'hero' ? 'fx-enter--hero' : 'fx-enter');
  });

  // Slides: a displaced unit travels from where it stood to where it stands.
  if (!still()) {
    for (const m of d.moved) {
      const el = unitEl(dom, m.unit.uid);
      const was = snap.units.get(m.unit.uid);
      if (!el || !was) continue;
      const now = el.getBoundingClientRect();
      run(el, [
        { transform: `translate(${was.left - now.left}px, ${was.top - now.top}px)` },
        { transform: 'none' },
      ], { duration: T.FLIP, easing: EASE_OUT });
    }
  }

  // Gains on survivors. A unit that gained both attack and health shows the two side by side.
  const atkChanged = new Set(d.atk.map((a) => a.unit.uid));
  for (const h of d.healed) {
    const el = unitEl(dom, h.unit.uid);
    if (el) floatText(fx, el.getBoundingClientRect(), `+${h.amount}`, 'fx-float--gain', atkChanged.has(h.unit.uid) ? 0.7 : 0.5);
  }
  for (const a of d.atk) {
    const el = unitEl(dom, a.unit.uid);
    if (!el) continue;
    const both = d.healed.some((h) => h.unit.uid === a.unit.uid);
    floatText(fx, el.getBoundingClientRect(), `${a.amount > 0 ? '+' : ''}${a.amount} atk`,
      a.amount > 0 ? 'fx-float--atk' : 'fx-float--dmg', both ? 0.3 : 0.5);
  }
  for (const s of d.silenced) unitEl(dom, s.unit.uid)?.classList.add('fx-silenced');
  for (const t of d.towers) if (t.fell) towerEl(dom, t.lane, t.side)?.classList.add('fx-ancient');

  handMotion(dom, prev, next, action, snap);
  statMotion(dom, prev, next);
  manaMotion(dom, prev, next);

  // The chrome follows the step, not the render, so it only moves when the step moves.
  if (stepKey(prev) !== stepKey(next)) {
    dom.track.querySelector('.is-now')?.classList.add('fx-step');
    retrigger(dom.nowWhat, 'fx-swap');
    if (next.phase === PHASE.ACTION) laneEl(dom, next.activeLane)?.classList.add('fx-focus');
  }

  // Arrows are rolled on entry, so they are new wherever a unit is new or moved, and
  // everywhere at once when the action phase opens.
  const fresh = new Set([...d.appeared, ...d.moved].map((u) => u.lane));
  if (prev.phase !== PHASE.ACTION && next.phase === PHASE.ACTION) for (let l = 0; l < LANES; l++) fresh.add(l);
  for (const l of fresh) laneEl(dom, l)?.querySelector('.arrows')?.classList.add('fx-fresh');

  if (next.round > prev.round) banner(fx, dom.lanes.getBoundingClientRect(), `Round ${next.round}`, 'fx-banner--round');
}

// ---------------------------------------------------------------- entry

// Resolves once the board shows `next` and the blocking part of the motion is over. The
// caller keeps input closed until then. `render` is called exactly once, at the moment the
// old picture has finished saying what happened to it.
export async function playTransition({ prev, next, action, dom, render }) {
  const g = gen;
  const alive = () => g === gen;
  const fx = dom.fx;

  if (!prev || !fx) { render(); return; }

  const d = diff(prev, next);
  const snap = snapshot(dom);
  const actor = prev.current;

  // The selection is over the moment an action is taken; the old picture should say so.
  for (const el of dom.lanes.querySelectorAll('.is-targetable')) el.classList.remove('is-targetable');

  // 1. The action itself, before its consequences.
  if (action?.type === 'PLAY') {
    const card = CARDS[prev.players[actor].hand[action.handIndex]];
    if (card) {
      if (actor === ME) {
        await flyCard(fx, dom, action.handIndex, action.lane);
      } else {
        revealCard(fx, dom, action.lane, card);
        await wait(dur(T.REVEAL_LEAD));
      }
      if (!alive()) return;
      pulseTargets(dom, prev, action, card);
    }
  } else if (action?.type === 'PASS' && actor !== ME) {
    // On the lane head, which holds no number: the enemy strip below it is where a reveal sits.
    const head = laneEl(dom, prev.activeLane)?.querySelector('.lane__head');
    if (head) chip(fx, head.getBoundingClientRect(), `${prev.players[actor].name} passes`);
  }

  // 2. Combat: every attacker steps forward together, and every hit lands at the apex.
  const dealtTo = new Map();
  if (d.resolvedLane !== -1) {
    dismissReveal(d.resolvedLane);
    const strikes = combatStrikes(prev, d.resolvedLane);
    for (const s of strikes) {
      const key = s.target.kind === 'unit' ? `u${s.target.unit.uid}` : `t${d.resolvedLane}:${s.target.side}`;
      dealtTo.set(key, (dealtTo.get(key) || 0) + s.dealt);
    }
    laneEl(dom, d.resolvedLane)?.classList.add('is-striking');
    if (!still()) {
      lunge(dom, d.resolvedLane, strikes);
      await wait(T.LUNGE * LUNGE_APEX);
      if (!alive()) return;
    }
  }

  // 3. Hits, on the old board, where the victims still stand.
  let hits = 0;
  for (const h of d.hurt) { hitUnit(fx, dom, h.unit.uid, h.amount, h.unit.hp, h.unit.maxHp); hits++; }
  for (const x of d.died) {
    const amount = dealtTo.get(`u${x.unit.uid}`) ?? spellDamage(prev, action, x);
    hitUnit(fx, dom, x.unit.uid, amount, 0, x.unit.maxHp);
    hits++;
  }
  for (const t of d.towers) {
    const amount = t.fell ? (dealtTo.get(`t${t.lane}:${t.side}`) ?? t.before.hp) : t.before.hp - t.after.hp;
    hitTower(fx, dom, t, amount);
    hits++;
  }
  if (hits) {
    await wait(dur(T.HIT));
    if (!alive()) return;
  }

  // 4. The dead leave; only then is the board rebuilt without them.
  if (d.died.length) {
    await fall(dom, d.died);
    if (!alive()) return;
  }

  render();

  // 5. Arrivals, slides, gains, and the chrome catching up. None of it blocks.
  after({ prev, next, action, dom, fx, d, snap });

  if (next.winner !== null) await wait(dur(T.ENDING_HOLD));
}
