# Blog Post Writing Guide (reference for Claude, all future posts)

Use this every time a blog post is written for finvita.online — new post or
edit. Goal: rank for the exact question a hobbyist typed into Google, get
pulled into Google's AI Overview, and convert that visit into a click on the
matching diagnose wizard (the actual monetization path).

Origin: brainstormed 2026-09-14 alongside the [10-post topic list](#seed-topic-list-2026-09-14)
below. Blog has no rendering/listing pipeline yet as of this writing (see
`CLAUDE.md` known gaps) — this guide covers the writing/structure standard;
building the pipeline is separate work.

## 1. Pick the topic like a search query, not an article idea

The title *is* the H1 *is* the search query. Write it as the literal
question a hobbyist types, not a magazine headline.

- Good: "Why Is My Fish Gasping at the Surface?"
- Bad: "Understanding Oxygen Levels in Your Aquarium"

Prefer topics that map to an existing entry in `public/data/outcomes.json` —
that gives you a ready-made internal link into the diagnose wizard and a
matching product recommendation, no new research needed.

## 2. Lead with the direct answer

First 2–3 sentences must answer the H1 plainly. No scene-setting, no "fish
keeping is a rewarding hobby" preamble. This paragraph is what AI Overviews
and featured snippets lift verbatim — if the answer isn't there, you don't
get picked up.

## 3. Structure for extraction, not just readability

- **Subheadings as questions**, People-Also-Ask style ("Is ich contagious?",
  "How long does swim bladder last?"), each followed by its own short
  direct-answer paragraph.
- **One table or numbered list per post minimum** — symptom → likely cause →
  fix is the default shape. Lists/tables get pulled into AI summaries more
  often than prose paragraphs.
- **FAQ block at the end**, 3–4 Q&As, marked up with `FAQPage` JSON-LD
  (`<script type="application/ld+json">` inline in the page — zero
  dependencies, fits the site's no-npm philosophy).
- Keep paragraphs short (2–4 sentences). Walls of text don't get extracted.

## 4. Length

800–1500 words. Long enough to be a real answer with supporting detail
(causes, sub-cases, prevention), short enough that the direct-answer lead
still reads as the point of the page, not buried preamble.

## 5. Internal linking (this is the actual point of the traffic)

Every post ends with a CTA into the matching wizard, e.g.:

> Not sure that's what's going on? [Run the 2-minute fish diagnosis](diagnose-fish.html).

Link to the specific diagnose page (fish/water/plants) whose tree reaches
the matching outcome, not just the homepage. Where natural, mention the
specific product category already in `public/data/products.json` (test kit,
conditioner, treatment) rather than inventing new affiliate products.

## 6. Mechanical/SEO checklist per post

- `<title>` and H1 match the target question, no em-dashes (matches the
  em-dash cleanup already done on landing/browsing pages)
- `<meta name="description">` — one sentence, direct answer, under 160 chars
- `<link rel="canonical">` to the post's own URL
- One H1 only; subheadings are H2 (H3 for sub-cases inside a section)
- `FAQPage` JSON-LD block for the closing FAQ
- At least one internal link to a diagnose wizard page, and to 1–2 related
  posts once enough posts exist to cross-link
- Alt text on any real content image (not the `alt=""` pattern used for the
  homepage's purely-decorative photo doors — a blog post image usually
  carries information, so it needs real alt text)

## 7. Tone

Direct, practical, slightly informal — matches an experienced hobbyist
explaining it to a friend, not a marketing voice and not a vague
"consult a professional" hedge. State the likely cause plainly (the site's
own outcomes.json already does this well — match that register).

---

## Seed topic list (2026-09-14)

Ten starting topics, chosen because they map to existing `outcomes.json`
entries (free internal linking + product tie-in) or fill a gap (plants,
beginner listicle). Priority order for writing: start with #2 or #4
(highest search volume) to validate the format before doing all ten.

| # | Title (= H1) | Maps to outcome(s) |
|---|---|---|
| 1 | Why Is My Fish Gasping at the Surface? | `low-oxygen-poor-water`, `urgent-water-quality` |
| 2 | White Spots on Fish: Is It Ich? Symptoms, Causes, Treatment | `ich` |
| 3 | Cloudy Fish Tank Water: Causes and How Long It Takes to Clear | `cloudy-water-bacterial-bloom` |
| 4 | How to Cycle a New Fish Tank (Fishless Cycling, Step by Step) | `cycling-tank`, `new-tank-syndrome` |
| 5 | Green Aquarium Water: Why It Happens and How to Clear an Algae Bloom | `green-water-algae` |
| 6 | Fish Swimming Sideways or Upside Down? Swim Bladder Disease Explained | `swim-bladder` |
| 7 | Ammonia Spike in an Established Tank: Causes and Emergency Fixes | `established-tank-ammonia-spike` |
| 8 | Fin Rot in Fish: How to Spot It Early and Treat It at Home | `fin-rot` |
| 9 | Why Are Aquarium Plant Leaves Turning Yellow? | `nutrient-deficiency-yellowing` |
| 10 | 10 Beginner Fish Tank Mistakes That Kill Fish | multiple (top-of-funnel listicle, links out to #1–9) |
