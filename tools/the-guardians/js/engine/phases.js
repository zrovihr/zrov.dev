// The phase machine. The single entry point to the engine.
// PURE MODULE: no DOM, no globals, no I/O. See PLAN.md section 2.
//
//     reduce(state, action) -> newState
//
// Clones once at this boundary, then mutates the draft. Callers must treat the returned state
// as the only truth and must never write into it themselves.

import {
  LANES, SLOTS_PER_SIDE, MANA_START, MANA_PER_ROUND, DRAW_PER_ROUND,
  CREEPS_ROUND_ONE, CREEPS_PER_ROUND, CREEP_ATK, CREEP_HP,
  HERO_ARRIVALS, PHASE,
} from './constants.js';
import {
  cloneState, rngFor, commitRng, heroUnitFrom, makeCreep, makeUnitFromCard,
  firstEmptySlot, drawCards, log,
} from './state.js';
import { assignIntents, rollIntent, resolveLaneCombat, enemyOf } from './combat.js';
import { runEffect } from './effects.js';
import { CARDS } from '../data/cards.js';
import { ITEMS } from '../data/items.js';

// ---------------------------------------------------------------- queries (no mutation)

export function heroColorsInLane(state, laneIdx, side) {
  const colors = new Set();
  for (const unit of state.lanes[laneIdx].slots[side]) {
    if (unit && unit.kind === 'hero') colors.add(unit.color);
  }
  return colors;
}

export function canPlayCard(state, side, handIndex, laneIdx) {
  const player = state.players[side];
  const cardId = player.hand[handIndex];
  if (!cardId) return false;
  const card = CARDS[cardId];
  const lane = state.lanes[laneIdx];

  if (lane.mana[side] < card.cost) return false;
  // Colored cards need one of your living heroes of that color standing in this lane.
  // Neutral cards ignore the requirement, which is what makes them the glue in a two-color deck.
  if (card.color !== 'neutral' && !heroColorsInLane(state, laneIdx, side).has(card.color)) return false;
  if (card.type === 'creep' && firstEmptySlot(lane, side) === -1) return false;
  if (card.target !== 'none' && legalTargets(state, side, laneIdx, card).length === 0) return false;
  return true;
}

export function legalTargets(state, side, laneIdx, card) {
  const out = [];
  const lane = state.lanes[laneIdx];
  const sides = card.target === 'enemyUnit' ? [enemyOf(side)]
    : card.target === 'allyUnit' ? [side]
      : [0, 1];

  for (const s of sides) {
    lane.slots[s].forEach((unit, slot) => {
      if (unit) out.push({ lane: laneIdx, side: s, slot });
    });
  }
  return out;
}

// Everything the side to move may legally do. The AI and the balance simulator both drive the
// game exclusively through this, so a rule that is not represented here does not exist.
export function legalActions(state) {
  const side = state.current;
  const out = [];
  if (state.winner !== null) return out;

  if (state.phase === PHASE.DEPLOY) {
    const uid = state.players[side].pendingDeploy[0];
    for (let l = 0; l < LANES; l++) {
      if (firstEmptySlot(state.lanes[l], side) !== -1) out.push({ type: 'DEPLOY', heroUid: uid, lane: l });
    }
    // A board with no room anywhere still has to move on rather than deadlock.
    if (out.length === 0) out.push({ type: 'DEPLOY', heroUid: uid, lane: -1 });
    return out;
  }

  if (state.phase === PHASE.ACTION) {
    const laneIdx = state.activeLane;
    state.players[side].hand.forEach((cardId, i) => {
      if (!canPlayCard(state, side, i, laneIdx)) return;
      const card = CARDS[cardId];
      if (card.target === 'none') {
        out.push({ type: 'PLAY', handIndex: i, lane: laneIdx, target: null });
      } else {
        for (const t of legalTargets(state, side, laneIdx, card)) {
          out.push({ type: 'PLAY', handIndex: i, lane: laneIdx, target: t });
        }
      }
    });
    out.push({ type: 'PASS' });
    return out;
  }

  if (state.phase === PHASE.SHOP) {
    const player = state.players[side];
    const owners = player.heroes.filter((h) => h.status !== 'dead');
    for (const item of Object.values(ITEMS)) {
      if (item.cost > player.gold) continue;
      for (const h of owners) out.push({ type: 'BUY', itemId: item.id, heroUid: h.uid });
    }
    out.push({ type: 'END_SHOP' });
    return out;
  }

  return out;
}

// ---------------------------------------------------------------- reducer

export function reduce(state, action) {
  if (state.winner !== null) return state;

  const draft = cloneState(state);
  const rng = rngFor(draft);

  switch (action.type) {
    case 'DEPLOY': applyDeploy(draft, action, rng); break;
    case 'PLAY': applyPlay(draft, action, rng); break;
    case 'PASS': applyPass(draft, rng); break;
    case 'BUY': applyBuy(draft, action); break;
    case 'END_SHOP': applyEndShop(draft, rng); break;
    default: break;
  }

  commitRng(draft, rng);
  return draft;
}

function applyDeploy(draft, action, rng) {
  const side = draft.current;
  const player = draft.players[side];
  const idx = player.pendingDeploy.indexOf(action.heroUid);
  if (idx === -1) return;

  const entry = player.heroes.find((h) => h.uid === action.heroUid);
  if (action.lane >= 0) {
    const lane = draft.lanes[action.lane];
    const slot = firstEmptySlot(lane, side);
    if (slot === -1) return; // illegal, ignore rather than corrupt the board
    const unit = heroUnitFrom(draft, side, entry);
    unit.intent = rollIntent(rng, slot);
    lane.slots[side][slot] = unit;
    entry.status = 'field';
    log(draft, `${unit.name} takes position in lane ${action.lane + 1}.`);
  }

  player.pendingDeploy.splice(idx, 1);
  advanceDeploy(draft, rng);
}

function advanceDeploy(draft, rng) {
  if (draft.players[0].pendingDeploy.length > 0) { draft.current = 0; return; }
  if (draft.players[1].pendingDeploy.length > 0) { draft.current = 1; return; }
  startActionPhase(draft, rng);
}

function applyPlay(draft, action, rng) {
  const side = draft.current;
  const player = draft.players[side];
  const cardId = player.hand[action.handIndex];
  if (!cardId) return;
  if (!canPlayCard(draft, side, action.handIndex, action.lane)) return;

  const card = CARDS[cardId];
  const lane = draft.lanes[action.lane];

  lane.mana[side] -= card.cost;
  player.hand.splice(action.handIndex, 1);
  player.discard.push(cardId);
  log(draft, `${player.name} plays ${card.name} in lane ${action.lane + 1}.`);

  if (card.type === 'creep') {
    const slot = firstEmptySlot(lane, side);
    if (slot !== -1) {
      const unit = makeUnitFromCard(draft, side, cardId);
      unit.intent = rollIntent(rng, slot);
      lane.slots[side][slot] = unit;
    }
  } else if (card.effect) {
    let target = null;
    if (action.target) {
      const t = action.target;
      const unit = draft.lanes[t.lane].slots[t.side][t.slot];
      if (unit) target = { unit, lane: t.lane, side: t.side, slot: t.slot };
    }
    runEffect(draft, card.effect, { self: null, lane: action.lane, side, slot: null, target, rng, log });
  }

  draft.passStreak = 0;
  draft.current = enemyOf(side);
}

function applyPass(draft, rng) {
  const side = draft.current;
  // First pass of the exchange claims initiative for the next lane. Passing is therefore a
  // real resource, not just a way to skip: it trades this lane's last word for next lane's first.
  if (draft.passStreak === 0) draft.firstPasser = side;
  draft.passStreak += 1;

  if (draft.passStreak >= 2) {
    closeLane(draft, rng);
    return;
  }
  draft.current = enemyOf(side);
}

function closeLane(draft, rng) {
  const laneIdx = draft.activeLane;
  resolveLaneCombat(draft, laneIdx);
  log(draft, `Lane ${laneIdx + 1} resolves.`);
  if (draft.winner !== null) { draft.phase = PHASE.GAMEOVER; return; }

  draft.initiative = draft.firstPasser ?? draft.initiative;
  draft.passStreak = 0;

  if (laneIdx + 1 < LANES) {
    draft.activeLane = laneIdx + 1;
    draft.current = draft.initiative;
  } else {
    startShop(draft);
  }
}

function startShop(draft) {
  draft.phase = PHASE.SHOP;
  draft.current = 0;
  draft.players[0].shopDone = false;
  draft.players[1].shopDone = false;
}

function applyBuy(draft, action) {
  const side = draft.current;
  const player = draft.players[side];
  const item = ITEMS[action.itemId];
  const entry = player.heroes.find((h) => h.uid === action.heroUid);
  if (!item || !entry || player.gold < item.cost) return;

  player.gold -= item.cost;
  entry.items.push(item.id);
  log(draft, `${player.name} equips ${item.name}.`);

  // A hero already standing on the board gets the stats immediately. Waiting until it died and
  // redeployed would make the purchase look like it did nothing, which reads as a bug.
  const live = findHeroUnit(draft, entry.uid);
  if (live) {
    live.atk += item.atk;
    live.maxHp += item.hp;
    live.hp += item.hp;
    live.armor += item.armor;
  }
}

function findHeroUnit(draft, heroUid) {
  for (let l = 0; l < LANES; l++) {
    for (let s = 0; s < 2; s++) {
      for (let i = 0; i < SLOTS_PER_SIDE; i++) {
        const u = draft.lanes[l].slots[s][i];
        if (u && u.heroUid === heroUid) return u;
      }
    }
  }
  return null;
}

function applyEndShop(draft, rng) {
  draft.players[draft.current].shopDone = true;
  if (!draft.players[0].shopDone) { draft.current = 0; return; }
  if (!draft.players[1].shopDone) { draft.current = 1; return; }
  beginRound(draft, rng);
}

// ---------------------------------------------------------------- round lifecycle

export function beginRound(draft, rng) {
  draft.round += 1;

  const cap = MANA_START + (draft.round - 1) * MANA_PER_ROUND;
  for (const lane of draft.lanes) {
    lane.manaMax = [cap, cap];
    lane.mana = [cap, cap];
    lane.resolved = false;
    for (let s = 0; s < 2; s++) {
      for (const unit of lane.slots[s]) if (unit) unit.silenced = false;
    }
  }

  for (let p = 0; p < 2; p++) {
    const player = draft.players[p];

    // Fountain release: a hero whose sit-out round has elapsed returns to the deploy queue.
    for (const h of player.heroes) {
      if (h.status === 'fountain' && draft.round > h.fountainUntil) {
        h.status = 'reserve';
        player.pendingDeploy.push(h.uid);
      }
    }

    // Scheduled arrivals: hero 4 on round 2, hero 5 on round 3.
    const arriving = HERO_ARRIVALS[draft.round] || 0;
    if (arriving > 0) {
      const bench = player.heroes.filter(
        (h) => h.status === 'reserve' && !player.pendingDeploy.includes(h.uid),
      );
      for (let i = 0; i < arriving && i < bench.length; i++) player.pendingDeploy.push(bench[i].uid);
    }
  }

  draft.phase = PHASE.DEPLOY;
  advanceDeploy(draft, rng);
}

// Runs once heroes are placed: creeps fill in behind them, cards are drawn, and only then are
// attack intents rolled, so every unit on the board gets an arrow at the same moment.
function startActionPhase(draft, rng) {
  const perLane = draft.round === 1 ? CREEPS_ROUND_ONE : CREEPS_PER_ROUND;
  for (let l = 0; l < LANES; l++) {
    for (let s = 0; s < 2; s++) {
      for (let i = 0; i < perLane; i++) {
        const slot = firstEmptySlot(draft.lanes[l], s);
        if (slot === -1) break;
        draft.lanes[l].slots[s][slot] = makeCreep(draft, s, {
          name: 'Levy Creep', atk: CREEP_ATK, hp: CREEP_HP,
        });
      }
    }
  }

  if (draft.round > 1) {
    drawCards(draft, 0, DRAW_PER_ROUND);
    drawCards(draft, 1, DRAW_PER_ROUND);
  }

  assignIntents(draft, rng);

  draft.phase = PHASE.ACTION;
  draft.activeLane = 0;
  draft.passStreak = 0;
  draft.firstPasser = null;
  draft.current = draft.initiative;
  log(draft, `Round ${draft.round} begins.`);
}

// Called once by the caller after createGame to run the opening deploy prompt.
export function openGame(state) {
  const draft = cloneState(state);
  const rng = rngFor(draft);
  advanceDeploy(draft, rng);
  commitRng(draft, rng);
  return draft;
}

export { PHASE };
