// Hero roster. Pure data, no logic. This file is the primary balance surface for heroes:
// a balance patch here is a readable numeric diff.
//
// Every hero brings one copy of its signature card into the deck for each copy of the hero,
// which is what ties deck contents to hero choice instead of leaving them independent.
//
// Stat budget, so future heroes stay comparable rather than eyeballed:
//   value = atk * 2 + hp + armor * 3, targeted at 17 for a starting hero.
// Deviations below 17 are paid back by a stronger signature card, and the comment says so.

export const HEROES = [
  {
    id: 'vashka',
    name: 'Vashka, Emberwright',
    color: 'ember',
    atk: 4, hp: 9, armor: 0,          // 4*2+9 = 17
    signature: 'cinderburst',
    blurb: 'She stopped counting what the fire took. It answers faster that way.',
  },
  {
    id: 'torrek',
    name: 'Torrek Ashjaw',
    color: 'ember',
    atk: 5, hp: 7, armor: 0,          // 5*2+7 = 17
    signature: 'reckless_charge',
    blurb: 'Two hands, one direction. He has never needed a third option.',
  },
  {
    id: 'ysolt',
    name: 'Grovewarden Ysolt',
    color: 'thorn',
    atk: 2, hp: 13, armor: 0,         // 2*2+13 = 17
    signature: 'bramble_wall',
    blurb: 'The wall was here before the gate. It will be here after.',
  },
  {
    id: 'bhog',
    name: 'Bhog the Rootfed',
    color: 'thorn',
    atk: 3, hp: 11, armor: 0,         // 3*2+11 = 17
    signature: 'overgrowth',
    blurb: 'Fed on what fell. Grateful, in its way.',
  },
  {
    id: 'nerith',
    name: 'Nerith of the Drowned Choir',
    color: 'tide',
    atk: 3, hp: 8, armor: 1,          // 3*2+8+3 = 17
    signature: 'undertow',
    blurb: 'She sings the tide a name and the tide comes looking.',
  },
  {
    id: 'cassiel',
    name: 'Cassiel Stormcaller',
    color: 'tide',
    atk: 2, hp: 10, armor: 0,         // 2*2+10 = 14, under budget.
    signature: 'second_sight',        // Paid back by the strongest draw effect in the set.
    blurb: 'Reads the weather three moves out and is rarely wrong twice.',
  },
  {
    id: 'auditor',
    name: 'The Pale Auditor',
    color: 'ash',
    atk: 3, hp: 8, armor: 1,          // 3*2+8+3 = 17
    signature: 'writ_of_silence',
    blurb: 'It does not kill. It records, and the record is binding.',
  },
  {
    id: 'morvath',
    name: 'Morvath, Gravekeeper',
    color: 'ash',
    atk: 4, hp: 8, armor: 0,          // 4*2+8 = 16, one under.
    signature: 'toll_of_ash',         // Paid back by unconditional removal on wounded units.
    blurb: 'He keeps the ledger of the field and collects on it personally.',
  },
];

export const HERO_BY_ID = Object.fromEntries(HEROES.map((h) => [h.id, h]));
