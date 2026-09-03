// Card effect registry.
// PURE MODULE: no DOM, no globals, no I/O. See PLAN.md section 2 and section 4.
//
// Signature is fixed by PLAN.md and is expensive to change, so do not widen it casually:
//   effects[id] = (draft, ctx) => void
//   ctx = { self, lane, side, slot, target, rng, params, log }
// An effect mutates the draft it is handed and returns nothing. It never reads the DOM, never
// reads a global, and never reaches into the renderer.

import { SLOTS_PER_SIDE } from './constants.js';
import { makeCreep, firstEmptySlot, log, drawCards } from './state.js';
import { damageUnit, removeUnit, rollIntent, enemyOf } from './combat.js';

export const effects = {
  dmg_unit(draft, ctx) {
    const { target, params } = ctx;
    if (!target) return;
    damageUnit(target.unit, params.amount);
    log(draft, `${target.unit.name} takes ${params.amount}.`);
    cleanupIfDead(draft, target);
  },

  dmg_row(draft, ctx) {
    const { lane, side, params } = ctx;
    const foe = enemyOf(side);
    const row = draft.lanes[lane].slots[foe];
    for (let slot = 0; slot < SLOTS_PER_SIDE; slot++) {
      const unit = row[slot];
      if (unit) damageUnit(unit, params.amount);
    }
    for (let slot = SLOTS_PER_SIDE - 1; slot >= 0; slot--) {
      const unit = row[slot];
      if (unit && unit.hp <= 0) removeUnit(draft, lane, foe, slot);
    }
    log(draft, `Every enemy unit in lane ${lane + 1} takes ${params.amount}.`);
  },

  heal(draft, ctx) {
    const { target, params } = ctx;
    if (!target) return;
    target.unit.hp = Math.min(target.unit.maxHp, target.unit.hp + params.amount);
    log(draft, `${target.unit.name} recovers.`);
  },

  buff_unit(draft, ctx) {
    const { target, params } = ctx;
    if (!target) return;
    const unit = target.unit;
    if (params.atk) unit.atk = Math.max(0, unit.atk + params.atk);
    if (params.hp) { unit.maxHp += params.hp; unit.hp += params.hp; }
    // selfDamage is how an aggressive buff pays for itself, e.g. Reckless Charge.
    if (params.selfDamage) {
      damageUnit(unit, params.selfDamage);
      cleanupIfDead(draft, target);
    }
    log(draft, `${unit.name} is changed.`);
  },

  buff_row(draft, ctx) {
    const { lane, side, params } = ctx;
    for (const unit of draft.lanes[lane].slots[side]) {
      if (!unit) continue;
      if (params.atk) unit.atk = Math.max(0, unit.atk + params.atk);
      if (params.hp) { unit.maxHp += params.hp; unit.hp += params.hp; }
    }
    log(draft, `Your units in lane ${lane + 1} grow.`);
  },

  summon(draft, ctx) {
    const { lane, side, params, rng } = ctx;
    const laneObj = draft.lanes[lane];
    for (let i = 0; i < params.count; i++) {
      const slot = firstEmptySlot(laneObj, side);
      if (slot === -1) break; // lane is full; the rest of the summon is lost, by design
      const unit = makeCreep(draft, side, {
        name: params.name, atk: params.atk, hp: params.hp, color: 'thorn', refId: 'summon',
      });
      // A unit entering mid-round still needs an arrow, or it would sit out combat.
      unit.intent = rollIntent(rng, slot);
      laneObj.slots[side][slot] = unit;
    }
  },

  draw(draft, ctx) {
    drawCards(draft, ctx.side, ctx.params.count);
    log(draft, `${draft.players[ctx.side].name} draws ${ctx.params.count}.`);
  },

  silence(draft, ctx) {
    if (!ctx.target) return;
    ctx.target.unit.silenced = true;
    log(draft, `${ctx.target.unit.name} is silenced this round.`);
  },

  kill_wounded(draft, ctx) {
    const { target } = ctx;
    if (!target) return;
    if (target.unit.hp >= target.unit.maxHp) {
      log(draft, `${target.unit.name} is unharmed. The toll goes uncollected.`);
      return;
    }
    log(draft, `${target.unit.name} is collected.`);
    removeUnit(draft, target.lane, target.side, target.slot);
  },

  // Moves a unit to a random other slot in its own row. If the row is full it swaps with the
  // occupant, so the effect never silently does nothing.
  displace(draft, ctx) {
    const { target, rng } = ctx;
    if (!target) return;
    const row = draft.lanes[target.lane].slots[target.side];
    const candidates = [];
    for (let i = 0; i < SLOTS_PER_SIDE; i++) if (i !== target.slot) candidates.push(i);
    const dest = rng.pick(candidates);

    const moved = row[target.slot];
    row[target.slot] = row[dest];
    row[dest] = moved;

    // Position changed, so the arrow has to be re-rolled from the new slot.
    if (row[dest]) row[dest].intent = rollIntent(rng, dest);
    if (row[target.slot]) row[target.slot].intent = rollIntent(rng, target.slot);
    log(draft, `${moved.name} is dragged out of position.`);
  },

  gold(draft, ctx) {
    draft.players[ctx.side].gold += ctx.params.amount;
    log(draft, `${draft.players[ctx.side].name} gains ${ctx.params.amount} gold.`);
  },
};

function cleanupIfDead(draft, target) {
  const current = draft.lanes[target.lane].slots[target.side][target.slot];
  if (current && current.hp <= 0) removeUnit(draft, target.lane, target.side, target.slot);
}

export function runEffect(draft, effect, ctx) {
  const fn = effects[effect.id];
  if (!fn) {
    log(draft, `Unimplemented effect: ${effect.id}`);
    return;
  }
  fn(draft, { ...ctx, params: effect });
}
