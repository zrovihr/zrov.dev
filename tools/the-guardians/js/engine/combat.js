// Targeting and damage.
// PURE MODULE: no DOM, no globals, no I/O. See PLAN.md section 2.
//
// Attack direction is rolled when a unit enters play, NOT at the moment of combat, and stored
// on the unit as `intent`. This is deliberate and load-bearing: the arrows are visible during
// the whole action phase, so the player can play around them. Rolling at combat time would
// turn every fight into a coin flip you cannot respond to, which is the opposite of the point.

import {
  SLOTS_PER_SIDE, TARGET_STRAIGHT, TARGET_DIAGONAL,
  GOLD_PER_CREEP, GOLD_PER_HERO, TOWERS_TO_WIN,
} from './constants.js';
import { log } from './state.js';

export const enemyOf = (side) => (side === 0 ? 1 : 0);

// 50% straight, 25% each diagonal. A roll that lands off the end of the row is not re-rolled:
// it becomes a tower hit, which is why edge slots are genuinely more aggressive positions.
export function rollIntent(rng, slot) {
  const r = rng();
  let targetSlot;
  if (r < TARGET_DIAGONAL) targetSlot = slot - 1;
  else if (r < TARGET_DIAGONAL + TARGET_STRAIGHT) targetSlot = slot;
  else targetSlot = slot + 1;

  if (targetSlot < 0 || targetSlot >= SLOTS_PER_SIDE) return { kind: 'tower', slot: null };
  return { kind: 'unit', slot: targetSlot };
}

export function assignIntents(state, rng) {
  for (const lane of state.lanes) {
    for (let side = 0; side < 2; side++) {
      lane.slots[side].forEach((unit, slot) => {
        if (unit) unit.intent = rollIntent(rng, slot);
      });
    }
  }
}

// What a unit will actually hit right now, given the current board. An intent aimed at a slot
// that has emptied resolves to the tower, so killing a blocker redirects damage at your own
// tower. The UI reads this every render, which is what makes the arrows live.
export function resolveIntent(state, laneIdx, side, slot) {
  const lane = state.lanes[laneIdx];
  const unit = lane.slots[side][slot];
  if (!unit || unit.silenced || unit.atk <= 0) return null;

  const foe = enemyOf(side);
  const intent = unit.intent || { kind: 'tower', slot: null };

  if (intent.kind === 'unit') {
    const occupant = lane.slots[foe][intent.slot];
    if (occupant) return { kind: 'unit', side: foe, slot: intent.slot, unit: occupant };
  }
  return { kind: 'tower', side: foe, slot: null };
}

export function damageUnit(unit, amount) {
  // Armor reduces every incoming hit rather than a total, which is why items price it highest.
  const dealt = Math.max(0, amount - unit.armor);
  unit.hp -= dealt;
  return dealt;
}

export function damageTower(state, laneIdx, side, amount) {
  const tower = state.lanes[laneIdx].tower[side];
  tower.hp -= amount;
  if (tower.hp > 0) return;

  if (!tower.ancient) {
    // First fall converts the tower into an Ancient. The lane is not lost yet, but the loser
    // is now one lane away from losing outright.
    tower.ancient = true;
    tower.hp = state.tuning.ancientHp;
    tower.max = state.tuning.ancientHp;
    state.players[side].towersLost += 1;
    log(state, `Lane ${laneIdx + 1}: ${state.players[side].name} loses a tower. An Ancient rises.`);
    if (state.players[side].towersLost >= TOWERS_TO_WIN) {
      state.winner = enemyOf(side);
    }
  } else {
    tower.hp = 0;
    log(state, `Lane ${laneIdx + 1}: the Ancient of ${state.players[side].name} falls.`);
    state.winner = enemyOf(side);
  }
}

export function removeUnit(state, laneIdx, side, slot, credit = true) {
  const lane = state.lanes[laneIdx];
  const unit = lane.slots[side][slot];
  if (!unit) return;

  lane.slots[side][slot] = null;

  if (credit) {
    const killer = enemyOf(side);
    state.players[killer].gold += unit.kind === 'hero' ? GOLD_PER_HERO : GOLD_PER_CREEP;
  }

  if (unit.kind === 'hero') {
    const entry = state.players[side].heroes.find((h) => h.uid === unit.heroUid);
    if (entry) {
      entry.status = 'fountain';
      // Sits out the rest of this round plus one full round, then redeploys anywhere.
      entry.fountainUntil = state.round + 1;
    }
    log(state, `${unit.name} falls in lane ${laneIdx + 1}.`);
  }
  // TODO: onDeath trigger dispatch belongs here. No card in v1 uses it, so the hook is not
  // wired yet rather than wired and untested.
}

// Simultaneous resolution. Every attack is computed against the pre-combat board, collected,
// and only then applied. Sequencing the hits instead would silently make slot order matter,
// which is a rule nobody wrote down.
export function resolveLaneCombat(state, laneIdx) {
  const lane = state.lanes[laneIdx];
  const strikes = [];

  for (let side = 0; side < 2; side++) {
    for (let slot = 0; slot < SLOTS_PER_SIDE; slot++) {
      const unit = lane.slots[side][slot];
      if (!unit) continue;
      const target = resolveIntent(state, laneIdx, side, slot);
      if (!target) continue;
      strikes.push({ from: { side, slot }, target, amount: unit.atk, name: unit.name });
    }
  }

  for (const strike of strikes) {
    if (strike.target.kind === 'tower') {
      damageTower(state, laneIdx, strike.target.side, strike.amount);
    } else {
      const victim = lane.slots[strike.target.side][strike.target.slot];
      if (victim) damageUnit(victim, strike.amount);
    }
  }

  // Deaths are collected after all damage lands, so two units that kill each other both die.
  for (let side = 0; side < 2; side++) {
    for (let slot = 0; slot < SLOTS_PER_SIDE; slot++) {
      const unit = lane.slots[side][slot];
      if (unit && unit.hp <= 0) removeUnit(state, laneIdx, side, slot);
    }
  }

  lane.resolved = true;
  return strikes;
}
