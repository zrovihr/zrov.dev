// Scripted opponent. Drives the game exclusively through legalActions() + reduce(), so it can
// never make a move a human could not, and so the balance simulator and the browser opponent
// are literally the same code.
//
// This is a one-ply greedy heuristic, not a search. Deliberate: a search would clone the state
// once per candidate action, which at roughly 20 candidates per decision and 360 decisions per
// game would make the balance runner about 20x slower. Board evaluation without cloning keeps
// 20k games in minutes. If the AI ever needs to be genuinely strong rather than merely
// competent, that is the moment to add search behind a flag, not before.

import { legalActions, PHASE } from './engine/phases.js';
import { CARDS } from './data/cards.js';
import { ITEMS } from './data/items.js';
import { HERO_BY_ID } from './data/heroes.js';
import { enemyOf } from './engine/combat.js';

// A hero is worth a flat premium over its stats because losing one costs the opponent 5 gold,
// a lane presence, and a full round of tempo, none of which show up in atk/hp.
const HERO_PREMIUM = 10;

// A permanent attack change pays out once per round for as long as the unit lives, so scoring
// it as a one-shot swing is wrong. 2 is a deliberate floor rather than an estimate: a buff has
// to survive this round's combat plus one more to beat an equivalent instant effect. It was
// found by the simulator, which reported 0 plays of Reckless Charge across 200 games because
// the old one-shot scoring rated it below passing. Replace with measured unit lifespan once
// the sim tracks it.
const BUFF_ROUNDS_PAYOFF = 2;

function unitValue(unit) {
  return unit.atk * 2 + unit.hp + (unit.kind === 'hero' ? HERO_PREMIUM : 0);
}

function scoreDeploy(state, side, action) {
  if (action.lane < 0) return -100;
  const lane = state.lanes[action.lane];

  // Defend where it hurts. A lane whose tower is already an Ancient is the last lane you can
  // afford to lose, so it outranks raw damage totals.
  const tower = lane.tower[side];
  let score = (tower.ancient ? 60 : 0) + (tower.max - tower.hp) * 0.6;

  // Prefer the lane the opponent is actually winning, measured by attack on the board.
  const foe = enemyOf(side);
  const pressure = lane.slots[foe].reduce((n, u) => n + (u ? u.atk : 0), 0);
  const held = lane.slots[side].reduce((n, u) => n + (u ? u.atk : 0), 0);
  score += (pressure - held) * 1.5;

  return score;
}

function scorePlay(state, side, action) {
  const cardId = state.players[side].hand[action.handIndex];
  const card = CARDS[cardId];
  const lane = state.lanes[action.lane];
  let score = 0;

  if (card.type === 'creep') {
    // Bodies are worth more in a lane you are losing on board.
    score = card.atk * 2 + card.hp;
  } else if (card.effect) {
    const e = card.effect;
    const target = action.target
      ? state.lanes[action.target.lane].slots[action.target.side][action.target.slot]
      : null;

    switch (e.id) {
      case 'dmg_unit': {
        if (!target) break;
        const dealt = Math.max(0, e.amount - target.armor);
        // Overkill is waste; an exact or near-exact kill is the best use of removal.
        score = dealt >= target.hp ? unitValue(target) + 10 : dealt * 2;
        if (action.target.side === side) score = -50; // never burn your own board
        break;
      }
      case 'kill_wounded': {
        if (!target) break;
        score = target.hp < target.maxHp ? unitValue(target) + 15 : -50;
        if (action.target.side === side) score = -50;
        break;
      }
      case 'dmg_row': {
        const foe = enemyOf(side);
        score = lane.slots[foe].reduce((n, u) => {
          if (!u) return n;
          const dealt = Math.max(0, e.amount - u.armor);
          return n + (dealt >= u.hp ? unitValue(u) : dealt * 2);
        }, 0);
        break;
      }
      case 'buff_unit': {
        if (!target) break;
        if (action.target.side !== side) {
          // Only Gnaw lands here: a debuff aimed at the enemy. Denying attack is worth the same
          // per-round payout as gaining it, capped by what the target actually has.
          score = e.atk < 0
            ? Math.min(target.atk, -e.atk) * 2 * BUFF_ROUNDS_PAYOFF
            : -50;
        } else {
          score = e.atk * 2 * BUFF_ROUNDS_PAYOFF + e.hp - (e.selfDamage || 0) * 1.5;
          if (e.selfDamage && target.hp <= e.selfDamage) score = -50; // do not kill your own unit
        }
        break;
      }
      case 'buff_row': {
        const own = lane.slots[side].filter(Boolean).length;
        score = own * (e.atk * 2 * BUFF_ROUNDS_PAYOFF + e.hp) * 0.6;
        break;
      }
      case 'heal': {
        if (!target || action.target.side !== side) { score = -50; break; }
        score = Math.min(e.amount, target.maxHp - target.hp) * 1.2;
        break;
      }
      case 'summon': score = e.count * (e.atk * 2 + e.hp) * 0.8; break;
      case 'draw': score = e.count * 6; break;
      case 'silence': {
        if (!target || action.target.side === side) { score = -50; break; }
        score = target.atk * 2.5;
        break;
      }
      case 'displace': score = target ? 6 : 0; break;
      case 'gold': score = e.amount * 1.5; break;
      default: score = 1;
    }
  }

  // Cost efficiency. Spending 5 mana for a 4-point swing is worse than 2 mana for the same
  // swing, because the leftover mana buys another card this lane.
  return score - card.cost * 1.2;
}

function scoreBuy(state, side, action) {
  const item = ITEMS[action.itemId];
  const entry = state.players[side].heroes.find((h) => h.uid === action.heroUid);
  if (!entry) return -100;
  // Stack items onto a hero that is actually on the field; an item on a benched hero does
  // nothing this round.
  const onField = entry.status === 'field' ? 8 : 0;
  return item.atk * 2 + item.hp + item.armor * 3 - item.cost * 0.8 + onField;
}

// The threshold a play must clear to beat passing. Passing is not free: it hands the opponent
// the last word in this lane but takes initiative in the next, so a marginal play is genuinely
// worse than a pass. Set at 2, meaning a play must be worth more than one point of stats.
const PASS_THRESHOLD = 2;

export function chooseAction(state, rng) {
  const actions = legalActions(state);
  if (actions.length === 0) return null;
  const side = state.current;

  let best = null;
  let bestScore = -Infinity;

  for (const action of actions) {
    let score;
    if (action.type === 'PASS') score = PASS_THRESHOLD;
    else if (action.type === 'END_SHOP') score = 0;
    else if (action.type === 'DEPLOY') score = scoreDeploy(state, side, action);
    else if (action.type === 'PLAY') score = scorePlay(state, side, action);
    else if (action.type === 'BUY') score = scoreBuy(state, side, action);
    else score = 0;

    // Tiny seeded jitter breaks ties without changing ranking, so two identical boards do not
    // always produce the identical game and the simulator sees real variety.
    score += rng() * 0.5;

    if (score > bestScore) { bestScore = score; best = action; }
  }

  return best;
}

// Picks a hero lineup. Biased toward two colors rather than four, because a four-color deck
// can rarely play its own cards: a card needs a hero of its color standing in that exact lane.
export function draftHeroes(rng, count) {
  const all = Object.values(HERO_BY_ID);
  const colors = rng.shuffle(['ember', 'thorn', 'tide', 'ash']).slice(0, 2);
  const preferred = rng.shuffle(all.filter((h) => colors.includes(h.color)));
  const rest = rng.shuffle(all.filter((h) => !colors.includes(h.color)));
  return [...preferred, ...rest].slice(0, count).map((h) => h.id);
}

export { PHASE };
