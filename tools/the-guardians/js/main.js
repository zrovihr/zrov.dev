// Browser entry point. Owns the screens, the input handling, and the pacing of the AI turn.
// It holds no game rules: everything it knows about legality comes from the engine.

import { createGame } from './engine/state.js';
import { reduce, openGame, canPlayCard, PHASE } from './engine/phases.js';
import { makeRng, randomSeed } from './engine/rng.js';
import { chooseAction, draftHeroes } from './ai.js';
import { renderGame, ME } from './ui/render.js';
import { playTransition, cancelAll } from './ui/anim.js';
import { HEROES, HERO_BY_ID } from './data/heroes.js';
import { CARDS } from './data/cards.js';
import { ITEMS } from './data/items.js';
import { HEROES_PER_DECK } from './engine/constants.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const dom = {
  round: $('hud-round'), track: $('track'),
  nowWhat: $('now-what'), nowDetail: $('now-detail'), nowTurn: $('now-turn'),

  // Enemy strip sits above the field, yours below it, so a number is always on the side of the
  // board it describes.
  foeName: $('foe-name'), foeHand: $('hud-foe-hand'), foeDeck: $('hud-foe-deck'),
  foeGold: $('hud-foe-gold'), foeTowers: $('foe-towers'),
  handCount: $('hud-hand'), deck: $('hud-deck'), gold: $('hud-gold'), ownTowers: $('own-towers'),

  lanes: $('lanes'), hand: $('hand'), feed: $('feed'),
  pass: $('btn-pass'), cancel: $('btn-cancel'), inspector: $('inspector'),

  // Motion layer (anim.js): floating numbers, card ghosts, banners. Outside the board so it
  // survives the board being rebuilt.
  fx: $('fx'), game: document.querySelector('.game'),
};

const ui = {
  picks: [],
  pendingCard: null,   // index into hand of a card waiting for a target
  aiTimer: null,
  // True while a transition is playing its blocking part. The board is not the state yet, so
  // input is ignored and the AI waits. See commit().
  busy: false,
};

let state = null;
let aiRng = null;

// How long the AI appears to think, counted from the end of the previous transition rather
// than from its action, so the pause is always a pause on a settled board. Long enough to read
// what changed on a three-lane board, short enough not to feel like waiting.
const AI_DELAY_MS = 420;

// ---------------------------------------------------------------- draft screen

// Built once. Picks toggle attributes in place instead of rebuilding, so the pick mark on a
// hero card animates for that card only rather than replaying on every card at every click.
function buildRoster() {
  $('roster').innerHTML = HEROES.map((h) => {
    const sig = CARDS[h.signature];
    return `
      <button class="hero-card" style="--faction:var(--${h.color})" data-hero="${h.id}"
              aria-pressed="false">
        <span class="hero-card__name">${esc(h.name)}</span>
        <span class="hero-card__faction">${h.color}</span>
        <span class="hero-card__stats">
          <span>attack <b class="num">${h.atk}</b></span>
          <span>health <b class="num">${h.hp}</b></span>
          ${h.armor ? `<span>armor <b class="num">${h.armor}</b></span>` : ''}
        </span>
        <span class="hero-card__sig"><em>${esc(sig.name)}</em> &middot; ${sig.cost} mana. ${esc(sig.text)}</span>
        <span class="hero-card__blurb">${esc(h.blurb)}</span>
      </button>`;
  }).join('');
  updateRoster();
}

function updateRoster() {
  for (const btn of $('roster').querySelectorAll('[data-hero]')) {
    btn.setAttribute('aria-pressed', String(ui.picks.includes(btn.dataset.hero)));
  }

  $('draft-count').textContent = `${ui.picks.length} of ${HEROES_PER_DECK}`;
  $('btn-start').disabled = ui.picks.length !== HEROES_PER_DECK;

  const colors = new Set(ui.picks.map((id) => HERO_BY_ID[id].color));
  $('draft-hint').textContent = ui.picks.length === 0
    ? 'chosen. Two colors beats four: a card needs a hero of its color in that exact lane.'
    : colors.size > 2
      ? `chosen, across ${colors.size} colors. That is a lot of colors to satisfy.`
      : 'chosen.';
}

$('roster').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-hero]');
  if (!btn) return;
  const id = btn.dataset.hero;
  const at = ui.picks.indexOf(id);
  if (at !== -1) ui.picks.splice(at, 1);
  else if (ui.picks.length < HEROES_PER_DECK) ui.picks.push(id);
  updateRoster();
});

$('btn-random').addEventListener('click', () => {
  ui.picks = draftHeroes(makeRng(randomSeed()), HEROES_PER_DECK);
  updateRoster();
});

$('btn-start').addEventListener('click', startGame);
$('btn-again').addEventListener('click', () => {
  $('overlay-result').classList.remove('is-open');
  leaveGame();
});
$('btn-quit').addEventListener('click', leaveGame);

function leaveGame() {
  if (ui.aiTimer) clearTimeout(ui.aiTimer);
  ui.aiTimer = null;
  cancelAll(dom);
  setBusy(false);
  state = null;
  $('overlay-shop').classList.remove('is-open');
  showScreen('draft');
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('is-active'));
  $(`screen-${name}`).classList.add('is-active');
}

// ---------------------------------------------------------------- game

function startGame() {
  const seed = randomSeed();
  aiRng = makeRng(seed ^ 0x9e3779b9); // decorrelated from the engine stream, same reproducibility

  cancelAll(dom);
  state = createGame({
    seed,
    players: [
      // Third person on purpose. The field report reads "<name> plays X", so a first-person
      // name produced "You plays X". The HUD says "your gold" separately, so nothing is lost.
      { name: 'The Watch', heroes: ui.picks.slice() },
      { name: 'The Siege', isAi: true, heroes: draftHeroes(makeRng(seed >>> 3), HEROES_PER_DECK) },
    ],
  });
  state = openGame(state);
  ui.pendingCard = null;
  setBusy(false);

  showScreen('game');
  renderGame(state, ui, dom);
  settle();
}

function setBusy(on) {
  ui.busy = on;
  dom.game.classList.toggle('is-busy', on);
}

// Every state change goes through here. The transition owns the moment the board is redrawn:
// it plays the consequences on the old picture first, then renders the new one, and only then
// does the game move on to whatever the new state asks for.
function commit(next, action) {
  const prev = state;
  state = next;
  ui.pendingCard = null;
  setBusy(true);
  playTransition({ prev, next, action, dom, render: () => renderGame(next, ui, dom) })
    // Motion is cosmetic. If it ever throws, the true state must still reach the screen.
    .catch((err) => {
      console.error(err);
      if (state === next) renderGame(next, ui, dom);
    })
    .then(() => {
      setBusy(false);
      // A resign or a new game during the transition replaces state; that game owns settle().
      if (state === next) settle();
    });
}

// What happens once the board shows the current state: the verdict, the shop, or the AI.
function settle() {
  if (!state) return;
  if (state.winner !== null) return finish();

  if (state.phase === PHASE.SHOP && state.current === ME) return openShop();
  $('overlay-shop').classList.remove('is-open');

  if (state.current !== ME) scheduleAi();
}

function scheduleAi() {
  if (ui.aiTimer) clearTimeout(ui.aiTimer);
  ui.aiTimer = setTimeout(() => {
    ui.aiTimer = null;
    if (!state || ui.busy || state.current === ME || state.winner !== null) return;
    const action = chooseAction(state, aiRng);
    if (!action) return;
    const next = reduce(state, action);
    // An unchanged state means the action was rejected, which would spin forever if retried.
    if (next === state) return;
    commit(next, action);
  }, AI_DELAY_MS);
}

function apply(action) {
  if (ui.busy) return;
  const next = reduce(state, action);
  if (next === state) return;
  commit(next, action);
}

// ---------------------------------------------------------------- input

dom.lanes.addEventListener('click', (e) => {
  if (!state || ui.busy || state.current !== ME) return;

  const deployBtn = e.target.closest('[data-deploy]');
  if (deployBtn && state.phase === PHASE.DEPLOY) {
    const uid = state.players[ME].pendingDeploy[0];
    return apply({ type: 'DEPLOY', heroUid: uid, lane: Number(deployBtn.dataset.deploy) });
  }

  const unit = e.target.closest('.unit.is-targetable');
  if (unit && ui.pendingCard !== null) {
    return apply({
      type: 'PLAY',
      handIndex: ui.pendingCard,
      lane: state.activeLane,
      target: {
        lane: Number(unit.dataset.lane),
        side: Number(unit.dataset.side),
        slot: Number(unit.dataset.slot),
      },
    });
  }
});

dom.hand.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-card]');
  if (!btn || !state || ui.busy || state.current !== ME || state.phase !== PHASE.ACTION) return;

  const index = Number(btn.dataset.card);
  if (!canPlayCard(state, ME, index, state.activeLane)) return;

  const card = CARDS[state.players[ME].hand[index]];
  if (card.target === 'none') {
    return apply({ type: 'PLAY', handIndex: index, lane: state.activeLane, target: null });
  }

  ui.pendingCard = ui.pendingCard === index ? null : index;
  renderGame(state, ui, dom);
});

dom.pass.addEventListener('click', () => {
  if (!state || state.current !== ME || state.phase !== PHASE.ACTION) return;
  apply({ type: 'PASS' });
});

dom.cancel.addEventListener('click', () => {
  if (!state || ui.busy) return;
  ui.pendingCard = null;
  renderGame(state, ui, dom);
});

// Inspector follows the pointer. Read-only, so it never re-renders the board.
document.addEventListener('mouseover', (e) => {
  const unitEl = e.target.closest('[data-unit]');
  if (unitEl) {
    const u = state?.lanes[Number(unitEl.dataset.lane)].slots[Number(unitEl.dataset.side)][Number(unitEl.dataset.slot)];
    if (u) return showInspector({
      name: u.name, color: u.color,
      kind: u.kind === 'hero' ? 'Guardian' : 'Unit',
      stats: `<span>attack <b class="num">${u.atk}</b></span><span>health <b class="num">${u.hp}/${u.maxHp}</b></span>${u.armor ? `<span>armor <b class="num">${u.armor}</b></span>` : ''}`,
      line: u.kind === 'hero' ? (HERO_BY_ID[u.refId]?.blurb || '') : 'A body in the way, which is most of the job.',
    });
  }

  const cardEl = e.target.closest('[data-card]');
  if (cardEl && state) {
    const card = CARDS[state.players[ME].hand[Number(cardEl.dataset.card)]];
    if (card) return showInspector({
      name: card.name, color: card.color, kind: `${card.cost} mana ${card.type}`,
      stats: card.type === 'creep' ? `<span>attack <b class="num">${card.atk}</b></span><span>health <b class="num">${card.hp}</b></span>` : '',
      line: card.text + (card.color === 'neutral' ? ' Playable in any lane.' : ` Needs a ${card.color} guardian in the lane.`),
    });
  }
});

function showInspector({ name, color, kind, stats, line }) {
  dom.inspector.innerHTML = `
    <div style="--faction:var(--${color})">
      <div class="inspector__name">${esc(name)}</div>
      <div class="inspector__faction">${esc(kind)}</div>
      ${stats ? `<div class="inspector__stats">${stats}</div>` : ''}
      <p class="inspector__line">${esc(line)}</p>
    </div>`;
}

// ---------------------------------------------------------------- shop

let equipItem = null;

function openShop() {
  const me = state.players[ME];
  $('shop-gold').textContent = me.gold;
  $('overlay-shop').classList.add('is-open');

  $('shop-grid').innerHTML = Object.values(ITEMS).map((it) => `
    <button class="shop-item" data-item="${it.id}" ${it.cost > me.gold ? 'disabled' : ''}>
      <span class="shop-item__cost num">${it.cost}g</span>
      <span class="shop-item__name">${esc(it.name)}</span>
      <span class="shop-item__text">${esc(it.text)}</span>
    </button>`).join('');

  renderEquip();
}

function renderEquip() {
  if (!equipItem) { $('shop-equip').innerHTML = ''; return; }
  const me = state.players[ME];
  $('shop-equip').innerHTML = `
    <p class="sheet__sub">Give ${esc(ITEMS[equipItem].name)} to which guardian?</p>
    <div class="equip-list">
      ${me.heroes.map((h) => `<button class="equip" data-equip="${h.uid}">${esc(HERO_BY_ID[h.heroId].name.split(',')[0])}${h.status === 'field' ? ' (in a lane)' : ''}</button>`).join('')}
    </div>`;
}

$('shop-grid').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-item]');
  if (!btn) return;
  equipItem = btn.dataset.item;
  renderEquip();
});

$('shop-equip').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-equip]');
  if (!btn || !equipItem) return;
  const itemId = equipItem;
  equipItem = null;
  // settle() reopens the shop with the new gold once the purchase has landed on the board.
  apply({ type: 'BUY', itemId, heroUid: Number(btn.dataset.equip) });
});

$('btn-shop-done').addEventListener('click', () => {
  equipItem = null;
  $('overlay-shop').classList.remove('is-open');
  apply({ type: 'END_SHOP' });
});

// ---------------------------------------------------------------- result

function finish() {
  const won = state.winner === ME;
  const verdict = $('result-verdict');
  verdict.textContent = won ? 'Gates held' : 'Gates broken';
  verdict.className = `result__verdict display ${won ? 'is-win' : 'is-loss'}`;

  const lost = state.players[ME].towersLost;
  $('result-detail').textContent = won
    ? `${state.round} rounds. You gave up ${lost} tower${lost === 1 ? '' : 's'} doing it.`
    : `${state.round} rounds. Two towers went down and the line went with them.`;

  $('overlay-result').classList.add('is-open');
}

buildRoster();
