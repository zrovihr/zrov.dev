Web DesignRules

# Design rules — read before writing any UI 
(From Claude Design)

## 1. Commit to a system BEFORE you write code.
State out loud, in one paragraph:
- Color tone (warm/cool/neutral), 1 accent max, near-black/near-white anchors
- Two type families (display + mono OR display + body), specific names
- Chrome vocabulary (cards? rules? ASCII? grids? what's the visual language?)
Once locked, do not deviate. Variety comes from **weight, scale, rhythm** — not new colors or fonts.

## 2. Refuse the AI-slop defaults.
Forbidden unless explicitly asked:
- Inter, Roboto, system-ui, generic sans
- Gradient hero backgrounds
- Rounded-corner cards with a left-border accent stripe
- Emoji as iconography
- Hand-drawn SVG illustrations of people/objects
- Three+ accent colors "for visual interest"
- Generic "Get started" / "Learn more" filler copy

If your design has any of these, you defaulted. Start over with a point of view.

## 3. Steal genre vocabulary, don't invent it.
Every aesthetic has a real lineage. Cultist-hacker = terminal + dossier + occult type. Editorial = grid + serif + rules + tabular figures. Brutalist = mono + raw borders + asymmetry. Identify the lineage first, then remix tropes that already exist. Generic = no lineage chosen.

## 4. Detail density is the whole game.
Atmosphere is cumulative. A masthead has 3 stats. A status bar has 6 fields. Cards carry classification tags, ref IDs, timestamps, source attribution. Modals show fake terminal output. Every surface earns its keep — but every detail must serve the chosen system, not be slapped on.

## 5. Content over chrome.
No filler sections, no placeholder paragraphs, no dummy "Features / About / Testimonials" added to fill space. If a section feels empty, that's a layout problem — solve it with composition, not invented content. One thousand no's for every yes.

## 6. CSS is more powerful than you remember.
Most "designed" looks come from: CSS grid, `gap`, `letter-spacing`, dashed/dotted borders, tabular-nums, monospace mixed with serif, well-chosen line-heights, subtle insets/vignettes. You almost never need a library or an image.

## 7. Type is a hierarchy, not a font.
- Display font: large, sparse, used 1–3 times per screen
- Body/mono: 80% of all text
- Use `text-wrap: pretty`, real letter-spacing on small caps, tabular figures on numbers
- Smallest text on a 1920×1080 slide: 24px. On a webpage: 13px. On mobile: 14px.

## 8. Color is restraint.
- 1 accent. Always. Use it for ~3% of the pixel area.
- Whites and blacks should be tinted toward the accent (saturation < 0.02)
- If you need "another color," you actually need another weight or another shade of the same hue.

## 9. Ask before adding.
Don't unilaterally add sections, pages, or features the user didn't request. Ask. They know their audience better than you do.

## 10. Show your reasoning before building.
Open every design task with: "Here's the system I'll commit to: [palette / type / chrome]. Reasoning: [...]." If you can't articulate it in three sentences, you don't have a system yet.
