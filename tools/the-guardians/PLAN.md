# The Guardians :: design + architecture plan

A three-lane tactical card game for zrov.dev, inspired by Valve's Artifact (2018).
Original setting, original heroes. No Valve art, names, or card text ships here.

Status: this document is the contract. Read it before changing the engine.

---

## 1. Why this shape

Artifact's real innovation is that one game is three interlocking board states sharing a
single hand and a single economy. Its real failure was ergonomic: the client showed one lane
at a time, so players lost the cross-lane picture the design was entirely about.

We keep the mechanic and fix the ergonomics. Three lanes render as three vertical columns,
all visible at once on a normal desktop screen. The whole board is legible without scrolling.

## 2. Hard architectural rule (do not violate)

The rules engine is a pure module tree under `js/engine/`. It imports nothing from `js/ui/`,
touches no DOM, reads no globals, performs no I/O.

    reduce(state, action) -> newState

Two consumers import it:

  - `js/main.js`  the browser game, renders state and emits actions
  - `sim/run.js`  a headless Node balance simulator, no browser involved

If a rule ever needs the DOM to resolve, the rule is wrong. This seam is what makes balancing
possible at all, and it is expensive to retrofit, so it is enforced from commit 1.

State is owned by the engine. The renderer never mutates it. The DOM is never a source of
truth: everything visible is derived from `state` by `render(state)`.

## 3. Rules (v1)

Based on the Artifact ruleset, adjusted where noted. Every deviation says why.

### Board
  - 3 lanes, two sides each, one side per player.
  - Each side has 5 unit slots (0..4) and one tower behind them.
  - The unit in slot `i` faces the enemy unit in slot `i`.
  - Towers hold 40 HP. Destroying one replaces it with an Ancient at 80 HP.

### Victory
  - Destroy 2 of 3 enemy towers, or destroy any one Ancient.

### Colors
  Four factions. A card is only playable into a lane where you control a living hero of that
  card's color. Colors are mechanically load-bearing, which is why the interface spends its
  entire color budget on them.

  | Faction | Role                        |
  |---------|-----------------------------|
  | Ember   | direct damage, aggression   |
  | Thorn   | bodies, growth, board width |
  | Tide    | control, movement, card draw|
  | Ash     | removal, attrition, debuffs |

### Round structure
  1. Spawn     creeps fill empty slots; heroes 4 and 5 arrive on rounds 2 and 3
  2. Deploy    the player assigns newly arrived heroes to lanes
  3. Draw      each player draws 2
  4. Action    lane 0, then lane 1, then lane 2 (see below)
  5. Shop      spend gold
  6. Advance   round += 1, mana cap += 1 in every lane

### Action phase, per lane
  - Players alternate: play one card, or pass.
  - Passing does not end your turn. If the opponent then acts, you may act again.
  - Two consecutive passes close the lane and trigger that lane's combat.
  - Whoever passed first takes initiative in the next lane.
  - Each lane holds its own mana pool. Cap starts at 3 and rises by 1 each round.

### Combat
  Simultaneous. Every living unit picks a target, then all damage lands at once.
  Target selection is seeded and reproducible:
    - 50% the unit directly across
    - 25% diagonally left, 25% diagonally right
    - if the chosen slot is empty, the unit hits the enemy tower instead
  A unit that would attack nothing attacks the tower. Units never idle.

### Economy
  - Creep kill pays 1 gold. Hero kill pays 5 gold.
  - Gold buys items during the shop phase. Items are permanent and survive hero death.

### Hero death
  - A dead hero goes to the Fountain, sits out one full round, then redeploys to any lane.
  - Its items stay equipped.

### Deviations from Artifact, and why
  - **5 slots per side, fixed.** Derived: 3 opening creeps plus 2 heroes fills a lane exactly
    at game start, so slot pressure begins on the round-2 creep spawn rather than immediately.
    A fixed count also keeps combat arrows readable, which is the whole visual thesis.
  - **No lane scrolling.** All three lanes stay visible. See section 1.
  - **No secret-shop randomness in v1.** Shop RNG is the hardest thing to balance and the
    least interesting on a first pass. Deterministic item pool first. Randomize later only if
    telemetry says the shop went stale.

## 4. Card effect hook signature

The expensive-to-change decision, so it is fixed now. An effect is a plain function in a
registry keyed by id. It receives the engine context and mutates the draft state it is handed.

    effects[id] = (draft, ctx) => { ... }

    ctx = { self, lane, side, slot, target, rng, log }

Each card declares the triggers it listens to. Triggers in v1:

    onPlay         card resolves out of hand
    onDeath        unit reaches 0 HP
    onRoundStart   start of a round
    onCombatStart  before targets are picked
    onDamaged      after taking damage

Adding a trigger means adding one dispatch site in `phases.js`. Adding a card means adding
data plus, optionally, one function. No card ever reaches into the renderer.

## 5. Balance workflow

  1. `node sim/run.js --games 20000` plays AI against AI and prints per-hero win rate,
     per-card play rate, average round count, and lane-loss distribution.
  2. Anything outside the target band gets a number change in `js/data/`, never a code change.
  3. Card numbers live in data files only, so a balance patch is a data diff, reviewable as one.

Target bands (opening hypothesis, to be corrected by real data rather than by feel):
  - per-hero win rate between 45% and 55%
  - average game length between 8 and 14 rounds
  - no single card appearing in more than 60% of winning decks

Later: log real games from the site to an external endpoint. GitHub Pages is static, so this
needs a Cloudflare Worker or equivalent. Real player win rates beat simulated ones and should
replace them as the primary signal the moment volume exists.

## 6. Visual direction

The substrate stays zrov.dev: void black, scanline overlay, JetBrains Mono for anything
numeric. The game diverges in two deliberate ways.

  - **The site's phosphor green is retired inside the game.** Green means Thorn here and
    nothing else. Interface chrome is bone and iron. Color is information, so no color is
    allowed to carry two meanings.
  - **Display face is Grenze Gotisch**, condensed blackletter, used only for hero and card
    names. Siege weight, and distinct from the usual fantasy serif.

One bold element, everything else quiet: **the combat arrows**. Live SVG arrows run from every
unit to the thing it will hit, updating as the board changes, turning hostile when the hit is
lethal. That is the signature of the genre and the one thing allowed to move on its own.

### Motion (added 2026-09-02, per Zan: "add game animations")

The engine applies a whole combat, or a whole spell, inside one `reduce()`, so without motion
the board simply snaps from before to after and the player never sees what happened. Motion
exists to show what changed, and only that. The contract, enforced by `js/ui/anim.js`:

  - **Diff-gated, never state-gated.** The renderer rebuilds the board from scratch on every
    action, so a keyframe attached to a plain component class (`.unit { animation }`) would
    replay on every rebuild. Every animation is derived from the difference between the state
    before an action and the state after it. Motion classes are all `fx-*` and transient.
  - **Honest to the rules.** Combat is simultaneous, so every attacker lunges at once and every
    hit lands at once; sequencing them would show a rule that does not exist. Strikes are
    reconstructed with the engine's own `resolveIntent()` on the pre-combat state, never guessed.
  - **One loud moment: a lane resolving.** Lunge, hits with floating damage, health bars
    draining, the dead falling back toward their own tower, then the rebuild. Everything else
    is under 300ms: a card leaving the hand, the enemy's card revealed as a strip over the
    lane's enemy band, arrivals rising from their own side, a displaced unit sliding, spent
    mana pips draining, a tower turning Ancient, the round banner.
  - **Enemy actions become visible.** The enemy's card is shown in the lane it was played
    into, and an enemy pass is marked on the lane head. Before this the only trace of either
    was a line in the field report.
  - **No new colour.** Damage is danger red, gains are bone, an attack change uses the attack
    colour the unit already shows, a spell ring uses the card's faction.
  - **Input is closed while the old picture is still speaking.** The blocking part of a
    transition (about 660ms at most, a hero dying in combat) holds input and the AI. Nothing
    after the rebuild blocks. Reduced motion removes every translate, lunge and shake; numbers
    still appear, in place, because they carry information the rebuilt board no longer shows.
  - **Cosmetic layer only.** `anim.js` never writes game state and never reads the DOM as
    truth. Delete it and the game is correct, just abrupt.

## 7. File map

    index.html          shell + screens
    css/game.css        all styling
    js/engine/          PURE. no DOM, no globals, no I/O
      constants.js      board dimensions, costs, tuning constants
      rng.js            seeded mulberry32, reproducible simulations
      state.js          createGame, deep clone
      combat.js         target selection + simultaneous damage
      phases.js         reduce(state, action), the phase machine
      effects.js        card effect registry
    js/data/            pure data, the balance surface
      heroes.js   spells.js   items.js
    js/ui/
      render.js   arrows.js   anim.js (motion: diff prev/next, play what changed)
    js/ai.js            scripted opponent, also drives the simulator
    js/main.js          browser entry
    sim/run.js          headless balance runner (node)
