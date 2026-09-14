# Finvita Brand Guidelines v1.0

> Last updated: 2026-09-14
> Status: Draft — first formal brand doc, written on `design-blank-slate` while exploring a new visual direction. Formalizes the validated accent hue from "V1 — Gradient Hero"; layout/spacing/type scale are open for the redesign.

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #2D6FCD (oklch(55% 0.16 258)) |
| Secondary Color | #00419B (dark variant, same hue) |
| Primary Font | Sora (display) / Plus Jakarta Sans (body) |
| Voice | Plain-spoken, honest, unhurried |

---

## 1. Color Palette

Single-hue system: everything is a shade of one blue. No second accent color — a diagnostic tool for a worried hobbyist should feel calm and consistent, not busy.

### Primary Colors

| Name | Hex | RGB | OKLCH | Usage |
|------|-----|-----|-------|-------|
| Accent | #2D6FCD | rgb(45,111,205) | oklch(55% 0.16 258) | CTAs, links, active nav, focus rings |
| Accent Dark | #00419B | rgb(0,65,155) | oklch(40% 0.16 258) | Hover/active states on the accent |
| Accent Light | #6EA0E8 | rgb(110,160,232) | oklch(70% 0.12 258) | Illustration fills, subtle highlights |

### Neutral Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Surface | #EAF3FF | rgb(234,243,255) | Tinted section backgrounds, cards |
| Background | #FFFFFF | rgb(255,255,255) | Page background |
| Text Primary | #10161F | rgb(16,22,31) | Headings, body text |
| Text Secondary | #4E5661 | rgb(78,86,97) | Captions, FAQ answers, muted text |
| Border | #D6DFEC | rgb(214,223,236) | Dividers, card borders, input borders |

All neutrals are tinted toward the same blue hue rather than pure gray — shadows follow the same rule (tinted, never flat black), per the existing design system note.

### Semantic Colors (for outcome/result pages)

The wizard needs to signal urgency without introducing new hues that fight the single-accent rule. Use lightness/saturation shifts of blue for low/medium confidence, and reserve red/amber only for the one case that matters: "see a vet/specialist."

| State | Hex | Usage |
|-------|-----|-------|
| High confidence | #2D6FCD (Accent) | Outcome likely correct |
| Lower confidence | #4E5661 (Text Secondary) | "Could also be X" secondary causes |
| Urgent / seek help | #B3261E | Reserved for outcomes that recommend a vet or specialist — the only place a non-blue hue appears |

### Accessibility

- Accent (#2D6FCD) on white: 4.7:1 — passes AA for normal text, use for links/CTA text
- Text Primary on white: 16.1:1 (AAA)
- Text Secondary on white: 6.8:1 (AA)
- Don't put Text Secondary on Surface tint below 14px — recheck contrast if the tint darkens

---

## 2. Typography

Existing pairing (Google Fonts, already wired up):

```css
--font-heading: 'Sora', system-ui, sans-serif;
--font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
```

No monospace usage anywhere on the site — this is not a technical product, don't introduce one.

### Type Scale

| Element | Font | Weight | Size (Desktop / Mobile) | Line Height |
|---------|------|--------|--------------------------|-------------|
| H1 (hero) | Sora | 700 | 44px / 30px | 1.15 |
| H2 (section) | Sora | 600 | 30px / 24px | 1.25 |
| H3 | Sora | 600 | 22px / 20px | 1.3 |
| Body | Plus Jakarta Sans | 400 | 17px / 16px | 1.6 |
| Small / caption | Plus Jakarta Sans | 400 | 14px / 14px | 1.5 |
| Kicker / eyebrow | Plus Jakarta Sans | 600, uppercase, 0.06em tracking | 13px | 1.4 |

Body copy runs long on result pages (diagnosis explanations) — keep `max-width: 65ch` on `.explain` / result body text.

---

## 3. Logo Usage

**Current state: there is no logo mark yet.** The nav (`.logo`) is a plain lowercase wordmark, "finvita", in Sora. The favicon is a 🐟 emoji in an SVG wrapper (`public/favicon.svg`) — a placeholder, not a designed icon.

### Variants (target state — not yet built)

| Variant | Use Case |
|---------|----------|
| Wordmark only (current) | Nav, footer, anywhere text suffices |
| Icon mark | Favicon, app icon, social avatar — needs actual design, not an emoji |
| Lockup (icon + wordmark) | Marketing/social, once an icon exists |

### Rules that already apply to the wordmark

- Always lowercase: "finvita", never "Finvita" or "FINVITA" in the logo treatment (body copy can capitalize normally)
- Sora, no italics, no drop shadow, no gradient fill
- Color: Text Primary on light backgrounds, white on Accent-filled surfaces

### Don't (once an icon exists)

- Don't rotate, skew, or add effects
- Don't recreate it as an emoji — the current favicon is a known placeholder, not a style to extend

---

## 4. Voice & Tone

Derived from what's already live on the site (about.html, index.html FAQ, disclosure.html) — this section documents the voice that already exists, so future copy stays consistent with it.

### Brand Personality

| Trait | Description |
|-------|-------------|
| **Plain-spoken** | Says "we may earn a commission" instead of legal euphemism; "not sure how accurate" instead of overclaiming |
| **Unhurried** | No countdown timers, no "act now" — a worried hobbyist needs a calm answer, not urgency |
| **Honestly small** | Openly a one-person, growing project — doesn't pretend to be a bigger company or a licensed service |
| **Specific over vague** | "Cloudy water, a sick fish, algae that won't quit" beats "aquarium problems" |

### Voice Chart

| Trait | We Are | We Are Not |
|-------|--------|------------|
| Plain-spoken | Direct, contraction-friendly ("won't quit") | Corporate, legalese |
| Unhurried | Patient, explains the "why" | Pushy, salesy, urgent |
| Honestly small | Transparent about being one person and about affiliate commissions | Falsely authoritative, hiding the business model |
| Specific | Names the actual symptom or product | Vague ("issues," "solutions") |

### Tone by Context

| Context | Tone | Example (already live) |
|---------|------|-------------------------|
| Hero / marketing | Empathetic, a little wry | "Something's off, and the forums all disagree." |
| Diagnosis result | Confident but hedged | Confidence framed as "most likely," never "definitely" |
| FAQ / disclosure | Flat, honest | "Yes. We're an Amazon Associate and earn a commission on qualifying purchases." |
| Disclaimers | Calm, not alarmist | "not a substitute for advice from a veterinarian or aquatic specialist" |

### Prohibited Terms

| Avoid | Reason |
|-------|--------|
| "Cure," "guaranteed," "will fix" | Overclaims on a health-adjacent product; use "likely cause," "may help" |
| "Best," "#1," "top-rated" (about products) | Unverifiable superlative; name what the product is *for* instead |
| "Revolutionary," "game-changing," "seamless" | Generic AI-copy filler, doesn't match the plain-spoken voice |
| "Veterinary," "clinical," "diagnosis" used as a medical claim | This is a hobbyist tool, not a vet service — every page already disclaims this, keep doing it |

---

## 5. Imagery Guidelines

Two known, deliberate gaps (not oversights) that any redesign work should respect:

- **Hero visual**: currently a gradient + icon placeholder. Intent is AI-generated illustration, not stock photography — don't fill this with stock photos of fish tanks.
- **Product cards**: gradient placeholder tiles, not real photos. Real product images need the Amazon Product Advertising API (or similar) — deferred, more setup than v1 needed.

### Illustration style (once built)

- Flat or lightly-shaded, single-hue (Accent + Accent Light), matching the "no second color" rule
- Subject matter: fish, water, plants — literally the three diagnosis categories — not generic tech-abstract shapes
- No photorealism; this is a warm, approachable tool, not a clinical one

### Icons

- Outlined, `stroke-width: 2`, `stroke-linecap/linejoin: round` — matches the inline SVGs already used in the door tiles and FAQ chevrons
- 24–48px viewboxes, `currentColor` stroke so they inherit Text Primary / Accent contextually
- No filled icon style mixed in — pick one (outlined) and stay there

---

## Messaging Reference

Not a new positioning — this documents the value proposition already implied by the live copy, so it doesn't drift during the redesign.

**Mission:** We help freshwater aquarium hobbyists find the likely cause of a tank problem, by asking a few branching questions instead of forcing them through conflicting forum advice, so they can act with more confidence and less guesswork.

**Positioning:** Finvita is the fast diagnostic step before you fall down a forum rabbit hole — for freshwater hobbyists who want a specific, plain-language starting point, because it asks the same triage questions an experienced keeper would, then points straight at the products people actually use.

**Primary message:** Answer a few questions about your fish, water, or plants — get a likely cause and the specific products that fix it.

**Supporting messages:**

| Message | Audience Need | Proof Point |
|---------|---------------|-------------|
| "3 questions to a likely cause, on average" | Wants speed, not a research project | Stated directly on the homepage footline |
| Transparent about affiliate commissions | Doesn't want to be sold to covertly | Disclosure page + FAQ answer it plainly |
| "Not sure? Every path has a 'something else' option" | Fears being funneled to the wrong answer | Built into the wizard tree, not just copy |
| Freshwater-only, on purpose | Wants depth over breadth | FAQ explains the scoping choice honestly |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-09-14 | Initial brand guidelines — formalized existing accent color, fonts, and live voice; documented imagery/logo gaps as deliberate, not missing |
