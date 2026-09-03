// Rendering. Reads state, writes DOM, never the other way round.
//
// Every render rebuilds from state. The DOM holds no game information of its own, so there is
// no path by which the screen and the engine can drift apart. See PLAN.md section 2.

import { SLOTS_PER_SIDE, LANES, COLOR_LABEL } from '../engine/constants.js';
import { enemyOf } from '../engine/combat.js';
import { canPlayCard, legalTargets, PHASE } from '../engine/phases.js';
import { laneArrowsHtml, laneThreatSummary } from './arrows.js';
import { CARDS } from '../data/cards.js';
import { HERO_BY_ID } from '../data/heroes.js';

const ME = 0; // the human always holds side 0, rendered at the bottom of every lane
const NUMERALS = ['I', 'II', 'III'];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Mana renders as pips because the player compares three pools at a glance and a shape is read
// faster than a digit. Past PIP_LIMIT it stops being a shape and becomes a counting exercise,
// so it falls back to a number.
//
// PIP_LIMIT = 12 is derived twice and both give the same answer:
//   fit:   a lane's mana row is ~318px at the 3-lane desktop layout; the label takes ~60px and
//          padding ~17px, and each pip is 8px + 3px gap, so ~21 pips fit before they collide.
//   design: mana cap is round + 2, and PLAN.md targets an 8 to 14 round game, so 12 covers the
//          whole intended arc. Anything past it is an outlier game.
// The design bound is tighter, so it wins.
const PIP_LIMIT = 12;

function manaPips(current, max) {
  if (max > PIP_LIMIT) {
    return `<span class="mana__count num">${current}<span class="mana__of">/${max}</span></span>`;
  }
  let out = '';
  for (let i = 0; i < max; i++) out += `<span class="pip${i < current ? ' is-full' : ''}"></span>`;
  return out;
}

function towerHtml(tower, side) {
  const ratio = Math.max(0, tower.hp / tower.max);
  const critical = ratio <= 0.25;
  const cls = ['tower', side === ME ? 'tower--own' : 'tower--foe',
    tower.ancient ? 'is-ancient' : '', critical ? 'is-critical' : ''].filter(Boolean).join(' ');
  return `
    <div class="${cls}" data-tower="${side}">
      <div class="tower__row">
        <span class="tower__label">${tower.ancient ? 'Ancient' : 'Tower'}</span>
        <span class="tower__hp num">${tower.hp}</span>
      </div>
      <div class="tower__bar"><div class="tower__fill" style="width:${ratio * 100}%"></div></div>
    </div>`;
}

function unitHtml(unit, laneIdx, side, slot, targetable) {
  if (!unit) return `<div class="slot is-empty" data-lane="${laneIdx}" data-side="${side}" data-slot="${slot}"></div>`;

  const hurt = unit.hp < unit.maxHp;
  const cls = ['unit', unit.kind === 'hero' ? 'unit--hero' : 'unit--creep',
    unit.silenced ? 'is-silenced' : '', targetable ? 'is-targetable' : ''].filter(Boolean).join(' ');

  return `
    <div class="slot" data-lane="${laneIdx}" data-side="${side}" data-slot="${slot}">
      <div class="${cls}" style="--faction:var(--${unit.color})"
           data-unit="${unit.uid}" data-lane="${laneIdx}" data-side="${side}" data-slot="${slot}"
           tabindex="${targetable ? 0 : -1}" role="${targetable ? 'button' : 'img'}"
           aria-label="${esc(unit.name)}, ${unit.atk} attack, ${unit.hp} of ${unit.maxHp} health">
        <div class="unit__name">${esc(unit.name)}</div>
        ${unit.armor ? `<span class="unit__armor num">${unit.armor}</span>` : ''}
        <div>
          <div class="unit__stats">
            <span class="unit__atk num">${unit.atk}</span>
            <span class="unit__hp num${hurt ? ' is-hurt' : ''}">${unit.hp}</span>
          </div>
          <div class="unit__hpbar"><div class="unit__hpfill" style="width:${(unit.hp / unit.maxHp) * 100}%"></div></div>
        </div>
      </div>
    </div>`;
}

function laneHtml(state, laneIdx, ui) {
  const lane = state.lanes[laneIdx];
  const foe = enemyOf(ME);
  const isActive = state.phase === PHASE.ACTION && state.activeLane === laneIdx;

  // A slot is clickable only while a targeted card is held and this is the lane it resolves in.
  const targetSet = new Set();
  if (ui.pendingCard !== null && state.phase === PHASE.ACTION && state.activeLane === laneIdx) {
    const card = CARDS[state.players[ME].hand[ui.pendingCard]];
    if (card) for (const t of legalTargets(state, ME, laneIdx, card)) targetSet.add(`${t.side}:${t.slot}`);
  }

  const rowHtml = (side) => {
    let cells = '';
    for (let slot = 0; slot < SLOTS_PER_SIDE; slot++) {
      cells += unitHtml(lane.slots[side][slot], laneIdx, side, slot, targetSet.has(`${side}:${slot}`));
    }
    return `<div class="row row--${side === ME ? 'own' : 'foe'}">${cells}</div>`;
  };

  const deployable = state.phase === PHASE.DEPLOY && state.current === ME
    && lane.slots[ME].some((u) => u === null);

  return `
    <section class="lane${isActive ? ' is-active' : ''}${deployable ? ' is-deployable' : ''}"
             data-lane="${laneIdx}" aria-label="Lane ${NUMERALS[laneIdx]}">
      <header class="lane__head">
        <span class="lane__numeral display">${NUMERALS[laneIdx]}</span>
        <span>${lane.resolved && !isActive ? 'resolved' : isActive ? 'resolving' : 'holding'}</span>
      </header>

      <div class="mana mana--foe">${manaPips(lane.mana[foe], lane.manaMax[foe])}<span class="mana__label">enemy mana</span></div>

      ${towerHtml(lane.tower[foe], foe)}
      <div class="battlefield">
        ${rowHtml(foe)}
        <div class="arrows">${laneArrowsHtml(state, laneIdx, ME)}</div>
        ${rowHtml(ME)}
      </div>
      ${towerHtml(lane.tower[ME], ME)}

      <div class="mana">${manaPips(lane.mana[ME], lane.manaMax[ME])}<span class="mana__label">your mana</span></div>
      ${deployable ? '<button class="lane__deploy btn" data-deploy="' + laneIdx + '">Deploy here</button>' : ''}
    </section>`;
}

function cardHtml(state, cardId, index, ui) {
  const card = CARDS[cardId];
  const laneIdx = state.activeLane;
  const playable = state.phase === PHASE.ACTION && state.current === ME
    && canPlayCard(state, ME, index, laneIdx);

  return `
    <button class="card${ui.pendingCard === index ? ' is-selected' : ''}"
            style="--faction:var(--${card.color})" data-card="${index}"
            ${playable ? '' : 'disabled'}
            aria-label="${esc(card.name)}, ${card.cost} mana">
      <span class="card__cost num">${card.cost}</span>
      <span class="card__name">${esc(card.name)}</span>
      <span class="card__type">${card.color === 'neutral' ? 'Neutral' : COLOR_LABEL[card.color]} ${card.type}</span>
      <span class="card__text">${esc(card.text)}</span>
      ${card.type === 'creep'
    ? `<span class="card__body"><span class="atk num">${card.atk}</span><span class="num">${card.hp}</span></span>`
    : ''}
    </button>`;
}

// The round in order, including the two steps that resolve instantly and would otherwise be
// invisible. Showing them is the point: an Artifact-shaped game is confusing mainly because the
// round has a fixed structure nobody states, and the board alone never states it.
//
// The order here mirrors phases.js exactly: heroes are placed BEFORE creeps spawn, so the
// player gets to choose position while there is still room.
const ROUND_STEPS = [
  { key: 'deploy', label: 'Deploy', auto: false },
  { key: 'spawn', label: 'Spawn', auto: true },
  { key: 'draw', label: 'Draw', auto: true },
  { key: 'lane0', label: 'Lane I', auto: false },
  { key: 'lane1', label: 'Lane II', auto: false },
  { key: 'lane2', label: 'Lane III', auto: false },
  { key: 'shop', label: 'Quartermaster', auto: false },
];

function currentStepIndex(state) {
  if (state.phase === PHASE.DEPLOY) return 0;
  if (state.phase === PHASE.ACTION) return 3 + state.activeLane;
  if (state.phase === PHASE.SHOP) return 6;
  return ROUND_STEPS.length; // finished: everything reads as done
}

function trackHtml(state) {
  const at = currentStepIndex(state);
  return ROUND_STEPS.map((step, i) => {
    const cls = ['track__step',
      step.auto ? 'track__step--auto' : '',
      i === at ? 'is-now' : i < at ? 'is-done' : ''].filter(Boolean).join(' ');
    return `<li class="${cls}"${i === at ? ' aria-current="step"' : ''}>${step.label}</li>`;
  }).join('');
}

// What is happening, in plain words, for whichever step is live. Each string says what the game
// is doing to the board, not what the code is doing.
function nowText(state) {
  if (state.winner !== null) {
    return { what: 'Finished', detail: 'The board is settled.', turn: '' };
  }

  if (state.phase === PHASE.DEPLOY) {
    const mine = state.players[ME].pendingDeploy.length;
    const entry = state.players[ME].heroes.find((h) => h.uid === state.players[ME].pendingDeploy[0]);
    const hero = entry ? HERO_BY_ID[entry.heroId] : null;
    return {
      what: 'Deploy',
      detail: state.current === ME && hero
        ? `${hero.name} is ready. Pick the lane to hold. Creeps fill the empty slots after everyone is placed.`
        : 'Guardians who arrived this round take their lanes. Nothing attacks yet.',
      turn: state.current === ME
        ? `Your move${mine > 1 ? `, ${mine} to place` : ''}`
        : `${state.players[enemyOf(ME)].name} is placing`,
    };
  }

  if (state.phase === PHASE.ACTION) {
    const threat = laneThreatSummary(state, state.activeLane, ME);
    const stakes = threat.towerDamage > 0
      ? `As it stands, ${threat.towerDamage} damage reaches your tower.`
      : threat.kills > 0
        ? `As it stands, ${threat.kills} of your units die here.`
        : 'As it stands, nothing of yours dies here.';
    return {
      what: `Lane ${NUMERALS[state.activeLane]}`,
      detail: `Play cards into this lane or pass. Two passes in a row and every unit here attacks at once. ${stakes}`,
      turn: state.current === ME ? 'Your move' : `${state.players[enemyOf(ME)].name} is choosing`,
    };
  }

  return {
    what: 'Quartermaster',
    detail: 'Spend gold on items. An item stays on its guardian permanently, even through death.',
    turn: state.current === ME ? 'Your move' : `${state.players[enemyOf(ME)].name} is buying`,
  };
}

function sideStats(state, side, dom) {
  const p = state.players[side];
  const standing = 3 - p.towersLost;
  const isFoe = side !== ME;
  (isFoe ? dom.foeHand : dom.handCount).textContent = p.hand.length;
  (isFoe ? dom.foeDeck : dom.deck).textContent = p.deck.length;
  (isFoe ? dom.foeGold : dom.gold).textContent = p.gold;

  const el = isFoe ? dom.foeTowers : dom.ownTowers;
  el.textContent = `towers ${standing}`;
  // One tower from losing is the single most important fact on the screen, so it is the only
  // stat allowed to change colour.
  el.classList.toggle('stat--critical', standing <= 1);
}

export function renderGame(state, ui, dom) {
  dom.round.textContent = state.round;
  dom.foeName.textContent = state.players[enemyOf(ME)].name;

  sideStats(state, ME, dom);
  sideStats(state, enemyOf(ME), dom);

  dom.track.innerHTML = trackHtml(state);

  const now = nowText(state);
  dom.nowWhat.textContent = now.what;
  dom.nowDetail.textContent = now.detail;
  dom.nowTurn.textContent = now.turn;
  dom.nowTurn.classList.toggle('is-yours', now.turn.startsWith('Your'));

  let lanes = '';
  for (let l = 0; l < LANES; l++) lanes += laneHtml(state, l, ui);
  dom.lanes.innerHTML = lanes;

  dom.hand.innerHTML = state.players[ME].hand.map((id, i) => cardHtml(state, id, i, ui)).join('');

  dom.pass.disabled = !(state.phase === PHASE.ACTION && state.current === ME);
  dom.cancel.hidden = ui.pendingCard === null;

  dom.feed.innerHTML = state.log.slice(-40).reverse()
    .map((e) => `<div class="feed__entry"><span class="feed__round num">${e.round}</span>${esc(e.text)}</div>`)
    .join('');
}

export { ME, NUMERALS };
