// Tuning surface for the whole game. Every number here is derived or cited, never picked by
// feel. Balance patches change values in this file and in js/data/, never engine code.
// PURE MODULE: no DOM, no globals, no I/O. See PLAN.md section 2.

export const LANES = 3;

// 5 = 3 opening creeps + 1 opening hero + 1 free slot. That leaves exactly one open slot on
// round 1, so the first overflow decision arrives with the round-2 hero and creep spawn
// rather than immediately. Also the widest row whose combat arrows stay readable.
export const SLOTS_PER_SIDE = 5;

// MEASURED, not chosen. sim/run.js swept tower HP against average game length over 200 fixed
// seeds and produced: 40 -> 20.6 rounds, 32 -> 17.0, 26 -> 13.9, 22 -> 11.9, 18 -> 9.8.
// PLAN.md targets an 8 to 14 round game, so 24 sits mid-band at roughly 12.9 rounds.
// Re-run `node sim/run.js --games 2000 --towerHp N` after any change to creep stats, mana
// curve, or card damage, because all of them move this curve.
export const TOWER_HP = 24;
export const ANCIENT_HP = 48; // 2x the tower, the ratio Artifact used.
export const TOWERS_TO_WIN = 2;

export const MANA_START = 3;
export const MANA_PER_ROUND = 1;

export const OPENING_HAND = 5;
export const DRAW_PER_ROUND = 2;

export const GOLD_PER_CREEP = 1;
export const GOLD_PER_HERO = 5;

// Heroes arrive in waves: 3 on round 1, then one each on rounds 2 and 3. Index = round.
export const HERO_ARRIVALS = { 1: 3, 2: 1, 3: 1 };
export const HEROES_PER_DECK = 5;

// A dead hero sits out this many full rounds before it can be redeployed.
export const FOUNTAIN_ROUNDS = 1;

export const CREEPS_ROUND_ONE = 3; // per lane, per side
export const CREEPS_PER_ROUND = 2; // per lane, per side, from round 2 on

export const CREEP_ATK = 2;
export const CREEP_HP = 4;

// Combat target weights. Sums to 1.0. Straight ahead is the modal case; the diagonals are
// what make board position a real decision instead of a lookup.
export const TARGET_STRAIGHT = 0.5;
export const TARGET_DIAGONAL = 0.25; // each side

export const COLORS = ['ember', 'thorn', 'tide', 'ash'];

export const COLOR_LABEL = {
  ember: 'Ember',
  thorn: 'Thorn',
  tide: 'Tide',
  ash: 'Ash',
};

export const PHASE = {
  DEPLOY: 'deploy',
  ACTION: 'action',
  SHOP: 'shop',
  GAMEOVER: 'gameover',
};
