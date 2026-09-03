// Card pool. Pure data. Balance patches happen here, not in engine code.
//
// Shape:
//   id, name, color ('neutral' plays in any lane), type ('spell' | 'creep'),
//   cost   mana, paid from the lane it is played into
//   target 'none' | 'enemyUnit' | 'allyUnit' | 'anyUnit'
//   effect { id, ...params }  resolved by js/engine/effects.js
//   atk/hp for creeps
//
// Mana curve check, so the pool stays playable rather than accidentally top-heavy:
// commons sit at cost 2 to 3, signatures at 2 to 4. Nothing costs more than 5, because a
// lane's mana starts at 3 and only climbs by 1 a round.

export const CARDS = {
  // ---- signature cards, one per hero, drawn into the deck with that hero ----
  cinderburst: {
    id: 'cinderburst', name: 'Cinderburst', color: 'ember', type: 'spell',
    cost: 3, target: 'anyUnit', effect: { id: 'dmg_unit', amount: 3 },
    text: 'Deal 3 damage to a unit.',
  },
  reckless_charge: {
    id: 'reckless_charge', name: 'Reckless Charge', color: 'ember', type: 'spell',
    cost: 3, target: 'allyUnit', effect: { id: 'buff_unit', atk: 3, hp: 0, selfDamage: 2 },
    text: 'A friendly unit gets +3 attack and takes 2 damage.',
  },
  bramble_wall: {
    id: 'bramble_wall', name: 'Bramble Wall', color: 'thorn', type: 'spell',
    cost: 4, target: 'none', effect: { id: 'summon', count: 2, atk: 2, hp: 4, name: 'Bramble' },
    text: 'Summon two 2/4 Brambles into this lane.',
  },
  overgrowth: {
    id: 'overgrowth', name: 'Overgrowth', color: 'thorn', type: 'spell',
    // Was +0/+3. The simulator put Thorn heroes at roughly 44.6% over 2000 games while Ember
    // sat near 56%, and the same gap held at tower HP 40, so it is not a pace problem: Thorn
    // had no way to convert a wide board into tower damage. +1 attack across the row is that
    // conversion. Health alone makes a better blocker, not a winner.
    cost: 3, target: 'none', effect: { id: 'buff_row', atk: 1, hp: 2 },
    text: 'Your units in this lane get +1 attack and +2 health.',
  },
  undertow: {
    id: 'undertow', name: 'Undertow', color: 'tide', type: 'spell',
    cost: 2, target: 'enemyUnit', effect: { id: 'displace' },
    text: 'Move an enemy unit to another slot in this lane.',
  },
  second_sight: {
    id: 'second_sight', name: 'Second Sight', color: 'tide', type: 'spell',
    cost: 3, target: 'none', effect: { id: 'draw', count: 2 },
    text: 'Draw two cards.',
  },
  writ_of_silence: {
    id: 'writ_of_silence', name: 'Writ of Silence', color: 'ash', type: 'spell',
    cost: 3, target: 'enemyUnit', effect: { id: 'silence' },
    text: 'An enemy unit deals no damage this round.',
  },
  toll_of_ash: {
    id: 'toll_of_ash', name: 'Toll of Ash', color: 'ash', type: 'spell',
    cost: 4, target: 'anyUnit', effect: { id: 'kill_wounded' },
    text: 'Destroy a unit that has already lost health.',
  },

  // ---- ember commons ----
  emberlash: {
    id: 'emberlash', name: 'Emberlash', color: 'ember', type: 'spell',
    cost: 2, target: 'anyUnit', effect: { id: 'dmg_unit', amount: 2 },
    text: 'Deal 2 damage to a unit.',
  },
  pyre_rite: {
    id: 'pyre_rite', name: 'Pyre Rite', color: 'ember', type: 'spell',
    cost: 5, target: 'none', effect: { id: 'dmg_row', amount: 2 },
    text: 'Deal 2 damage to every enemy unit in this lane.',
  },
  cinder_hound: {
    id: 'cinder_hound', name: 'Cinder Hound', color: 'ember', type: 'creep',
    cost: 3, target: 'none', atk: 4, hp: 3,
    text: 'A fast body that trades and dies.',
  },

  // ---- thorn commons ----
  thicket_kin: {
    id: 'thicket_kin', name: 'Thicket Kin', color: 'thorn', type: 'creep',
    cost: 3, target: 'none', atk: 3, hp: 5,
    text: 'Holds a slot longer than it has any right to.',
  },
  sap_ward: {
    id: 'sap_ward', name: 'Sap Ward', color: 'thorn', type: 'spell',
    cost: 2, target: 'allyUnit', effect: { id: 'buff_unit', atk: 0, hp: 4 },
    text: 'A friendly unit gets +4 health.',
  },

  // ---- tide commons ----
  tidecaller: {
    id: 'tidecaller', name: 'Tidecaller', color: 'tide', type: 'creep',
    cost: 3, target: 'none', atk: 2, hp: 6,
    text: 'Patient. Wet. Unbothered.',
  },
  ebb: {
    id: 'ebb', name: 'Ebb', color: 'tide', type: 'spell',
    cost: 2, target: 'allyUnit', effect: { id: 'heal', amount: 5 },
    text: 'Restore 5 health to a friendly unit.',
  },

  // ---- ash commons ----
  gnaw: {
    id: 'gnaw', name: 'Gnaw', color: 'ash', type: 'spell',
    cost: 2, target: 'enemyUnit', effect: { id: 'buff_unit', atk: -2, hp: 0 },
    text: 'An enemy unit gets -2 attack.',
  },
  ossuary_hound: {
    id: 'ossuary_hound', name: 'Ossuary Hound', color: 'ash', type: 'creep',
    cost: 3, target: 'none', atk: 4, hp: 4,
    text: 'Was buried here. Did not stay.',
  },

  // ---- neutral, playable in any lane regardless of hero colors ----
  gate_militia: {
    id: 'gate_militia', name: 'Gate Militia', color: 'neutral', type: 'creep',
    cost: 2, target: 'none', atk: 2, hp: 4,
    text: 'Paid in bread. Fights like it.',
  },
  levy: {
    id: 'levy', name: 'Levy', color: 'neutral', type: 'spell',
    cost: 2, target: 'none', effect: { id: 'gold', amount: 3 },
    text: 'Gain 3 gold.',
  },
};

// Commons available to each color when a deck is assembled. Signature cards are added
// separately, keyed off the heroes the player actually picked.
export const COMMONS_BY_COLOR = {
  ember: ['emberlash', 'pyre_rite', 'cinder_hound'],
  thorn: ['thicket_kin', 'sap_ward'],
  tide: ['tidecaller', 'ebb'],
  ash: ['gnaw', 'ossuary_hound'],
  neutral: ['gate_militia', 'levy'],
};

export const DECK_SIZE = 40;
export const SIGNATURE_COPIES = 2;
