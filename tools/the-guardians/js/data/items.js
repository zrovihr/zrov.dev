// Shop items. Bought with gold in the shop phase, equipped to a hero, permanent, and they
// survive that hero's death (see PLAN.md, hero death).
//
// Pricing rule, so the shop stays comparable rather than vibes-priced:
//   gold = stat value, where atk counts 2, hp counts 1, armor counts 3
// Armor is priced highest because it reduces every incoming hit rather than a total.
// Deviations are called out in a comment on the item.

export const ITEMS = {
  whetstone: {
    id: 'whetstone', name: 'Whetstone', cost: 4,
    atk: 2, hp: 0, armor: 0,
    text: '+2 attack.',
  },
  scale_coat: {
    id: 'scale_coat', name: 'Scale Coat', cost: 5,
    atk: 0, hp: 5, armor: 0,
    text: '+5 health.',
  },
  iron_collar: {
    id: 'iron_collar', name: 'Iron Collar', cost: 6,
    atk: 0, hp: 0, armor: 2,
    text: '+2 armor. Reduces every incoming hit.',
  },
  warden_seal: {
    id: 'warden_seal', name: 'Warden Seal', cost: 8,
    atk: 2, hp: 4, armor: 0,
    text: '+2 attack, +4 health.',
  },
  gravebrand: {
    id: 'gravebrand', name: 'Gravebrand', cost: 11,
    atk: 4, hp: 3, armor: 0,
    text: '+4 attack, +3 health.',
  },
  bulwark: {
    id: 'bulwark', name: 'Bulwark', cost: 12,
    // 0/6/2 prices at 12 exactly. The most expensive item in the pool on purpose: it is the
    // only way to make a hero survive two full rounds of focused creep damage.
    atk: 0, hp: 6, armor: 2,
    text: '+6 health, +2 armor.',
  },
};

export const ITEM_LIST = Object.values(ITEMS);
