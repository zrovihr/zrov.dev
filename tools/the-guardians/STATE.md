# The Guardians :: session state

Read this first. Update it at the end of every session. Design contract lives in PLAN.md.

Last updated: 2026-09-02

---

## What works right now (verified in a real browser, not assumed)

Driven end to end in the pinned debug Chrome at 1307x647 DPR 1.47, which is viewport parity
with Zan's own browser.

- Full game runs start to finish. A complete scripted playthrough reached round 14, visited all
  five interactive phases, and ended on a result screen with **zero console errors or warnings**.
- Draft screen: 8 heroes, pick 5, lineup drives deck construction.
- Board: 3 lanes visible at once, towers, 5 slots a side, creep spawns, hero deployment.
- Combat arrows render and are live. Blue for yours, grey for theirs, red dashed for a hit that
  kills, dotted vertical for a hit that reaches the tower.
- Card play including targeted spells, colour gating, per-lane mana, and the pass and initiative
  rules.
- Shop: correct affordability gating, buy plus equip, item stats land on a hero that is already
  standing on the board (verified: Cassiel 2 attack to 4 with Whetstone).
- Result screen, resign, play again.
- **Round track** across the top naming all seven steps of a round, current step lit, with the
  two automatic steps (Spawn, Draw) shown but marked as not yours to act on.
- **Now bar** under it saying in plain words what the live step does, plus the stakes in the
  active lane ("3 damage reaches your tower") and whose move it is.
- **Stats split by side of the field**: the enemy strip sits directly above the lanes, yours
  directly below, so a number is always on the same side as the units it describes. Both carry
  hand, deck, gold and towers standing; towers turns red at 1 remaining.
- Headless balance simulator: `node sim/run.js --games 2000`, roughly 26 games a second.

## Balance, as measured (2000 games)

| Metric | Value | Target | Status |
|---|---|---|---|
| Average round count | 12.3 | 8 to 14 | in band |
| First-player win rate | 50.5% | near 50% | in band |
| Hero win-rate spread | 44.7% to 56.1% | 45% to 55% | **out of band** |

Tower HP 24 was not chosen, it was measured. The sweep is recorded in the comment above
`TOWER_HP` in `js/engine/constants.js`. Re-run that sweep after any change to creep stats, the
mana curve, or card damage, because all of them move the curve.

## NON-BUG (do not re-diagnose)

- **Only one or two cards playable in the opening hand.** Correct. A card needs a hero of its
  colour standing in that exact lane, and a creep needs a free slot. Round 1 lanes are nearly
  full, so most of the hand is legitimately locked.
- **All heroes stacking into lane 1 during an automated test.** That is the test script clicking
  the first deploy button, not the AI. The AI follows enemy deployments on purpose: `scoreDeploy`
  rewards contesting a lane the opponent committed to.
- **A horizontal scrollbar under the hand.** That is the hand's own scroller, by design. The
  document itself does not overflow (scrollWidth equals clientWidth, checked).
- **Both players fielding the same hero.** Legal. Lineups are independent.
- **Spawn and Draw never light up in the round track.** Correct. They resolve inside a single
  reduce() with no player input, so they can never be the current step. They are listed because
  the round order is the thing the track exists to teach, not because they are interactive.

## Known open work, in priority order

1. **Ember is over and Thorn is under.** Torrek 56.1%, Vashka 55.6%, Ysolt 44.7%. Retuning
   Overgrowth to +1/+2 moved Bhog from 44.7% to 47.1% but did not close the gap. Tested and
   ruled out: it is not a game-pace problem, because the same spread held at tower HP 40.
   Working hypothesis is that removal (Cinderburst) simply converts to tower damage better than
   any defensive tool Thorn owns. Next thing to try is giving Thorn a way to push, not more
   health.
2. **`onDeath` trigger is not wired.** The dispatch site is marked with a TODO in
   `combat.js:removeUnit`. No v1 card uses it, so it was left unwired rather than wired and
   untested. Wire it when the first death-trigger card is written.
3. **AI is one-ply greedy, no search.** Competent, not strong. `BUFF_ROUNDS_PAYOFF` in `ai.js`
   is a deliberate floor of 2, not a measurement. Replace it once the simulator tracks real unit
   lifespan.
4. **No telemetry.** PLAN.md section 5 wants real player win rates, which beat simulated ones.
   GitHub Pages is static, so this needs an external endpoint such as a Cloudflare Worker.
5. **Deck-out does nothing.** An empty deck stops drawing rather than losing. Fine at a 12-round
   average against a 40-card deck; revisit only if games start reaching it.

## Layout budget (why the lane is tight)

At Zan's viewport, 1307x647, the chrome now costs about 110px more than it did: topbar 52,
now bar 44, plus the two side strips. A lane gets 315px and the arrow band floors at 52px via
`minmax(52px, 1fr)` on `.battlefield`. It is not clipped, verified. If more chrome is ever added
to the top, take it out of `--slot-h` rather than the arrow band: the arrows are the read.

Gotcha that already bit once: `.btn` sets an explicit `display`, which outranks the `[hidden]`
attribute's UA `display:none`. `[hidden] { display: none !important }` is in the reset for
exactly that reason. Do not remove it, the Cancel button reappears.

## Local preview

The game uses ES modules, so `file://` will not run it. Serve the repo root:

    python -m http.server 8765 --bind 127.0.0.1
    # then open http://127.0.0.1:8765/tools/the-guardians/

`node sim/run.js` needs no server. `package.json` sets `"type": "module"` for it.

## Where things are wired into the site

- `tools/index.html` TOOL-003 slot
- `index.html` homepage tool grid, TOOL-003 tile
- `generate-sitemap.js` static page list, sitemap regenerated
