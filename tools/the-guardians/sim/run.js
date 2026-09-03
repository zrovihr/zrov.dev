// Headless balance runner. No browser, no DOM, same engine the site plays on.
//
//   node sim/run.js --games 20000
//   node sim/run.js --games 2000 --seed 12345
//
// This file exists to make PLAN.md section 5 executable. If it ever stops running, the engine
// has grown a dependency on the renderer and the architecture rule has been broken.

import { createGame, rngFor, commitRng } from '../js/engine/state.js';
import { reduce, openGame, PHASE } from '../js/engine/phases.js';
import { chooseAction, draftHeroes } from '../js/ai.js';
import { makeRng } from '../js/engine/rng.js';
import { HEROES } from '../js/data/heroes.js';
import { CARDS } from '../js/data/cards.js';
import { HEROES_PER_DECK } from '../js/engine/constants.js';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(args[i + 1]);
};

const GAMES = arg('games', 2000);
const BASE_SEED = arg('seed', 1);
const TOWER_HP_OVERRIDE = arg('towerHp', 0);
const TUNING = TOWER_HP_OVERRIDE
  ? { towerHp: TOWER_HP_OVERRIDE, ancientHp: TOWER_HP_OVERRIDE * 2 }
  : {};

// A game that has not ended by here is a stalled rules bug, not a long game. Derived from the
// target band in PLAN.md (8 to 14 rounds): 60 is over four times the top of the band, so a
// legitimate game will never reach it.
const MAX_ROUNDS = 60;

const stats = {
  wins: [0, 0],
  stalls: 0,
  rounds: [],
  heroPicks: Object.fromEntries(HEROES.map((h) => [h.id, { picked: 0, won: 0 }])),
  cardPlays: Object.fromEntries(Object.keys(CARDS).map((id) => [id, 0])),
  towerFalls: 0,
  ancientFalls: 0,
};

function playOne(seed) {
  const rng = makeRng(seed);
  const lineups = [draftHeroes(rng, HEROES_PER_DECK), draftHeroes(rng, HEROES_PER_DECK)];

  let state = createGame({
    seed,
    tuning: TUNING,
    players: [
      { name: 'A', isAi: true, heroes: lineups[0] },
      { name: 'B', isAi: true, heroes: lineups[1] },
    ],
  });
  state = openGame(state);

  let guard = 0;
  // Upper bound on individual actions, not rounds. Generous by design: it only fires on a
  // genuine infinite loop, which is the failure this guard is for.
  const MAX_ACTIONS = MAX_ROUNDS * 400;

  while (state.winner === null && state.round <= MAX_ROUNDS && guard < MAX_ACTIONS) {
    const action = chooseAction(state, rng);
    if (!action) break;
    if (action.type === 'PLAY') {
      const cardId = state.players[state.current].hand[action.handIndex];
      if (cardId) stats.cardPlays[cardId] = (stats.cardPlays[cardId] || 0) + 1;
    }
    const next = reduce(state, action);
    // A reducer that returns an unchanged state means the action was rejected. Without this
    // check the loop would spin forever on one illegal action and look like a hang.
    if (next === state) break;
    state = next;
    guard++;
  }

  return { state, lineups, stalled: state.winner === null };
}

console.log(`Running ${GAMES} games from seed ${BASE_SEED}...`);
const t0 = Date.now();

for (let g = 0; g < GAMES; g++) {
  const { state, lineups, stalled } = playOne(BASE_SEED + g);

  if (stalled) { stats.stalls++; continue; }

  stats.wins[state.winner]++;
  stats.rounds.push(state.round);

  for (let p = 0; p < 2; p++) {
    for (const id of lineups[p]) {
      stats.heroPicks[id].picked++;
      if (state.winner === p) stats.heroPicks[id].won++;
    }
  }

  for (const lane of state.lanes) {
    for (const t of lane.tower) {
      if (t.ancient) stats.towerFalls++;
      if (t.ancient && t.hp <= 0) stats.ancientFalls++;
    }
  }
}

const elapsed = (Date.now() - t0) / 1000;
const played = GAMES - stats.stalls;
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const pct = (n, d) => (d === 0 ? '  n/a' : `${((n / d) * 100).toFixed(1)}%`);

console.log(`\n${played} completed in ${elapsed.toFixed(1)}s  (${(played / elapsed).toFixed(0)} games/s)`);
if (stats.stalls) console.log(`STALLED: ${stats.stalls}  <-- rules bug, these never reached a winner`);

console.log(`\nfirst-player win rate  ${pct(stats.wins[0], played)}   (target: near 50%)`);
console.log(`average round count    ${avg(stats.rounds).toFixed(1)}      (target band: 8 to 14)`);
console.log(`shortest / longest     ${Math.min(...stats.rounds)} / ${Math.max(...stats.rounds)}`);

console.log('\nHERO WIN RATE            picked   win%   (target band: 45% to 55%)');
const heroRows = Object.entries(stats.heroPicks)
  .map(([id, s]) => ({ id, ...s, rate: s.picked ? s.won / s.picked : 0 }))
  .sort((a, b) => b.rate - a.rate);
for (const r of heroRows) {
  const flag = r.picked > 30 && (r.rate < 0.45 || r.rate > 0.55) ? '  <-- out of band' : '';
  console.log(`  ${r.id.padEnd(22)} ${String(r.picked).padStart(6)}  ${pct(r.won, r.picked)}${flag}`);
}

console.log('\nCARD PLAY COUNT');
const cardRows = Object.entries(stats.cardPlays).sort((a, b) => b[1] - a[1]);
for (const [id, n] of cardRows) {
  const perGame = played ? (n / played).toFixed(2) : '0';
  console.log(`  ${id.padEnd(22)} ${String(n).padStart(8)}   ${perGame}/game`);
}
