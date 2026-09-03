// Game state construction and cloning.
// PURE MODULE: no DOM, no globals, no I/O. See PLAN.md section 2.
//
// Cloning policy: reduce() clones the state exactly once at its boundary, then every internal
// helper mutates that draft freely. Cloning per internal step instead would multiply the cost
// by roughly the number of units on the board and make the balance simulator too slow to use,
// which is the one thing this architecture exists to protect.

import {
  LANES, SLOTS_PER_SIDE, TOWER_HP, ANCIENT_HP, MANA_START, OPENING_HAND,
  HERO_ARRIVALS, PHASE,
} from './constants.js';
import { makeRng } from './rng.js';
import { HERO_BY_ID } from '../data/heroes.js';
import { CARDS, COMMONS_BY_COLOR, DECK_SIZE, SIGNATURE_COPIES } from '../data/cards.js';
import { ITEMS } from '../data/items.js';

export function cloneState(state) {
  return structuredClone(state);
}

// Rebuilds the generator from the serialized counter so a resumed or cloned state produces the
// identical sequence. Callers must write rng.getState() back into state.rngState when done.
export function rngFor(state) {
  const rng = makeRng(state.seed);
  rng.setState(state.rngState);
  return rng;
}

export function commitRng(state, rng) {
  state.rngState = rng.getState();
}

// Deck = SIGNATURE_COPIES of each picked hero's signature card, then commons drawn only from
// the colors the picked heroes actually cover, padded with neutrals. Tying the pool to the
// hero picks is what makes hero selection a deckbuilding decision rather than a skin choice.
export function buildDeck(heroIds, rng) {
  const deck = [];
  const colors = new Set();

  for (const id of heroIds) {
    const hero = HERO_BY_ID[id];
    colors.add(hero.color);
    for (let i = 0; i < SIGNATURE_COPIES; i++) deck.push(hero.signature);
  }

  const pool = [];
  for (const color of colors) pool.push(...(COMMONS_BY_COLOR[color] || []));
  pool.push(...COMMONS_BY_COLOR.neutral);

  // Round-robin over the pool rather than random fill, so two decks with the same heroes are
  // identical. Deck variance should come from the shuffle, not from construction.
  let i = 0;
  while (deck.length < DECK_SIZE) {
    deck.push(pool[i % pool.length]);
    i++;
  }

  return rng.shuffle(deck);
}

function makeHeroEntry(state, heroId) {
  return {
    uid: state.uidSeq++,
    heroId,
    status: 'reserve',      // reserve | field | fountain
    fountainUntil: 0,
    items: [],
  };
}

export function heroUnitFrom(state, player, heroEntry) {
  const hero = HERO_BY_ID[heroEntry.heroId];
  const bonus = heroEntry.items.reduce(
    (acc, itemId) => {
      const it = ITEMS[itemId];
      if (it) { acc.atk += it.atk; acc.hp += it.hp; acc.armor += it.armor; }
      return acc;
    },
    { atk: 0, hp: 0, armor: 0 },
  );

  const maxHp = hero.hp + bonus.hp;
  return {
    uid: state.uidSeq++,
    heroUid: heroEntry.uid,
    kind: 'hero',
    refId: hero.id,
    name: hero.name,
    color: hero.color,
    atk: hero.atk + bonus.atk,
    baseAtk: hero.atk + bonus.atk,
    hp: maxHp,
    maxHp,
    armor: hero.armor + bonus.armor,
    silenced: false,
    owner: player,
  };
}

export function makeCreep(state, player, { name, atk, hp, color = 'neutral', refId = 'creep' }) {
  return {
    uid: state.uidSeq++,
    heroUid: null,
    kind: 'creep',
    refId,
    name,
    color,
    atk,
    baseAtk: atk,
    hp,
    maxHp: hp,
    armor: 0,
    silenced: false,
    owner: player,
  };
}

export function makeUnitFromCard(state, player, cardId) {
  const card = CARDS[cardId];
  return makeCreep(state, player, {
    name: card.name, atk: card.atk, hp: card.hp, color: card.color, refId: card.id,
  });
}

// `tuning` lets the balance runner sweep a constant without editing engine source. Game code
// reads state.tuning, never the constant directly, so a swept value and a shipped value take
// exactly the same code path. Defaults come from constants.js.
export function createGame({ seed, players, tuning = {} }) {
  const state = {
    tuning: { towerHp: TOWER_HP, ancientHp: ANCIENT_HP, ...tuning },
    seed: seed >>> 0,
    rngState: seed >>> 0,
    round: 1,
    phase: PHASE.DEPLOY,
    activeLane: 0,
    current: 0,
    initiative: 0,
    passStreak: 0,
    winner: null,
    uidSeq: 1,
    log: [],
    players: [],
    lanes: [],
  };

  const rng = rngFor(state);

  for (let p = 0; p < 2; p++) {
    const cfg = players[p];
    const entry = {
      name: cfg.name,
      isAi: !!cfg.isAi,
      gold: 0,
      hand: [],
      deck: [],
      discard: [],
      heroes: [],
      pendingDeploy: [],
      shopOffer: [],
      shopDone: false,
      towersLost: 0,
    };
    for (const heroId of cfg.heroes) entry.heroes.push(makeHeroEntry(state, heroId));
    entry.deck = buildDeck(cfg.heroes, rng);
    entry.hand = entry.deck.splice(0, OPENING_HAND);
    state.players.push(entry);
  }

  for (let l = 0; l < LANES; l++) {
    state.lanes.push({
      mana: [MANA_START, MANA_START],
      manaMax: [MANA_START, MANA_START],
      tower: [
        { hp: state.tuning.towerHp, max: state.tuning.towerHp, ancient: false },
        { hp: state.tuning.towerHp, max: state.tuning.towerHp, ancient: false },
      ],
      slots: [
        new Array(SLOTS_PER_SIDE).fill(null),
        new Array(SLOTS_PER_SIDE).fill(null),
      ],
      resolved: false,
    });
  }

  // Round 1: the first HERO_ARRIVALS[1] heroes queue for deployment.
  for (let p = 0; p < 2; p++) {
    const arriving = state.players[p].heroes.slice(0, HERO_ARRIVALS[1]);
    for (const h of arriving) state.players[p].pendingDeploy.push(h.uid);
  }

  commitRng(state, rng);
  return state;
}

export function firstEmptySlot(lane, side) {
  return lane.slots[side].findIndex((u) => u === null);
}

export function livingUnits(lane, side) {
  return lane.slots[side].filter(Boolean);
}

export function findUnit(state, uid) {
  for (let l = 0; l < state.lanes.length; l++) {
    for (let s = 0; s < 2; s++) {
      const idx = state.lanes[l].slots[s].findIndex((u) => u && u.uid === uid);
      if (idx !== -1) return { unit: state.lanes[l].slots[s][idx], lane: l, side: s, slot: idx };
    }
  }
  return null;
}

export function log(state, text) {
  state.log.push({ round: state.round, text });
  // The log is rendered as a scrolling feed and also read by the simulator. Capping it keeps
  // structuredClone cheap in long games, which is the hot path for the balance runner.
  if (state.log.length > 200) state.log.shift();
}

// Draws from the top of the deck. An empty deck simply stops producing cards rather than
// milling the player out: deck-out as a loss condition is a whole balance axis of its own and
// v1 does not need it. If games start ending on empty decks, revisit this with sim data.
export function drawCards(state, playerIdx, count) {
  const player = state.players[playerIdx];
  for (let i = 0; i < count; i++) {
    if (player.deck.length === 0) break;
    player.hand.push(player.deck.shift());
  }
}
