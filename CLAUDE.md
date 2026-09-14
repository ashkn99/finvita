# Aquarium Health Helper (finvita.online)

A diagnostic-quiz website for aquarium hobbyists: pick Fish/Water/Plants, answer
a few branching questions, get a likely cause plus specific Amazon-affiliate
product recommendations. Monetized purely via Amazon Associates (tag
`finvita0b-20`, ~3% commission on pet products — thin margins, so traffic/SEO
matters more than usual).

- **Live**: https://finvita.online
- **Repo**: https://github.com/ashkn99/finvita (branch `main`)
- **Hosting**: Cloudflare Pages, auto-deploys on every push to `main`
  (build command `node check-tree.js && node build.js`, output dir `public`)

## Current design: "Bold Bento" (live on `main`, 2026-09-14)

`main` and `design-blank-slate` currently point to the same commit —
`design-blank-slate` was used to strip `style.css` back to a functional-only
baseline (mobile nav toggle, focus visibility, SVG sizing) and rebuild a new
visual direction from there, then it was merged straight to `main` and
pushed live once approved. The branch still exists on the remote but has no
unmerged work; treat `main` as the source of truth. If a future session
wants to explore yet another direction, repeat the same pattern: branch,
`git checkout <pre-redesign-commit> -- public/css/style.css` to re-strip,
rebuild, get it approved, then fast-forward merge to `main`.

## Architecture — read this before reaching for a framework

Plain static HTML/CSS/vanilla JS. **Zero npm dependencies, by deliberate
choice** — this was a ladder-of-simplicity decision (a static site with a
tiny build script beats any framework at this scale), reaffirmed across
several sessions. Don't introduce React/Tailwind/a bundler/etc. without
discussing it first.

```
public/                  # the actual deploy root (Cloudflare Pages output dir)
  index.html              # landing page
  diagnose-fish.html      # wizard shells — all 3 share js/wizard.js,
  diagnose-water.html     # differ only by a data-tree="..." attribute
  diagnose-plants.html
  about.html, privacy.html, contact.html, blog.html, disclosure.html, 404.html
  data/
    question-tree-{fish,water,plants}.json   # branching Q&A trees
    outcomes.json         # diagnosis text + which products to show + confidence
    products.json         # Amazon products: name, affiliate URL, note
  results/                # GENERATED — gitignored, rebuilt by build.js
  sitemap.xml             # GENERATED — gitignored, rebuilt by build.js
  css/style.css           # single stylesheet, everything lives here
  js/{wizard,nav,reveal}.js
  img/                    # hero video + poster, category card photos (see Design system)
templates/result-template.html   # template build.js fills per outcome
build.js            # reads data/*.json + template -> writes public/results/*.html + sitemap.xml
check-tree.js        # validates every tree node/outcome/product reference resolves
serve.js              # zero-dep local static server for testing (node serve.js -> :8080)
claudedocs/            # research/design/workflow docs from earlier sessions
```

## Workflow

After editing anything in `data/*.json` or `templates/result-template.html`:

```bash
node check-tree.js && node build.js
```

`check-tree.js` catches dangling tree nodes, missing outcomes, or missing
product references — run it before every commit that touches data.

To preview locally: `node serve.js` then open `http://localhost:8080`
(port is now `$PORT`-overridable — the Claude Code browser preview tool sets
this automatically via `.claude/launch.json`'s `autoPort: true` if 8080 is
already taken by another session). Or use the Claude Code browser preview
tool with the `static-site` launch config directly.

Push to `main` = live in ~1 minute. No staging environment exists.

Asset prep for this session's redesign used **ffmpeg** (installed locally
via `winget install Gyan.FFmpeg` — not on PATH until a shell restart, find
it under `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\...\bin\`
if a fresh shell hasn't picked it up yet) for video encoding, and **Pillow**
(`pip install pillow`) for image resize/compress. Neither is a project
dependency — both are local machine tooling for one-off asset processing,
not referenced by any script in this repo.

## Design system

Landing/browsing pages (index, about, privacy, contact, blog, disclosure,
404) share a nav (desktop: inline links; mobile: hamburger dropdown) and use
`.page-wide` for a wider desktop container. Wizard/result pages deliberately
keep a minimal back-button-only topbar — no nav clutter mid-task.

- Fonts: Sora (display) + Plus Jakarta Sans (body), via Google Fonts
- Colors: single blue accent (`--accent: oklch(55% 0.16 258)`) — a **firm,
  repeatedly-reconfirmed brand decision**, oklch tokens throughout, shadows
  tinted to the accent hue rather than generic black/gray
- This is **"Bold Bento"** (landed 2026-09-14, supersedes the old "V1
  Gradient Hero" and "Calm Current" directions): bento-grid asymmetry
  (how-it-works cards, diagnose doors, 404 cards, product cards all use
  varied-span grid layouts), Sora at heavier weights for bigger/bolder
  headline scale than earlier directions
- **Hero** (`index.html` only): a looping 6s background video
  (`img/hero-tank.webm` VP9 + `img/hero-tank.mp4` H.264 fallback, audio
  stripped, `img/hero-poster.jpg` extracted from frame 0 for instant paint)
  behind a "liquid glass" text panel — `.hero-copy::after` combines
  `backdrop-filter: blur()` with `filter: url(#glass-distortion)`, an SVG
  displacement-map filter defined inline near the top of `index.html`. The
  video has no `autoplay` attribute in the markup; `js/reveal.js` calls
  `.play()` only when `prefers-reduced-motion` isn't set, so a
  reduced-motion visitor just sees the poster frame with no extra logic.
- **Diagnose doors** (`My Fish` / `My Water` / `My Plants` on the homepage):
  full-bleed photo cards (`img/card-{fish,water,plants}.jpg`, AI-generated)
  with a bottom scrim (`.door::before`, tinted to the accent hue, dark
  enough for solid white-text contrast) instead of the old SVG icon tiles.
  `alt=""` on each photo is deliberate, not an oversight — the visible
  label text already gives the link its accessible name, so descriptive alt
  text would just be redundant noise for screen reader users.
- FAQ uses native `<details>/<summary>` (zero JS); scroll-reveal uses
  IntersectionObserver; both respect `prefers-reduced-motion`

## Known gaps / deferred (check before assuming these are done)

- `hello@finvita.online` is not a working inbox yet — needs real email
  forwarding set up at the registrar/Cloudflare before Contact page is real
- Blog has no content or generation pipeline yet — `blog.html` and the
  homepage's "From the blog" section are honest empty states, not fake posts
- Product cards (`.pcard`/`.pimg` on result pages — the Amazon product
  recommendations, not the homepage's fish/water/plants doors) still use a
  gradient placeholder tile, not real photos — needs the Amazon Product
  Advertising API or similar, more setup than has happened so far. The
  homepage diagnose-doors gap this note used to describe is done (see
  Design system above).
- No `og:image` anywhere on the site — no branded image asset exists yet.
  `img/hero-poster.jpg` (1280px, ~16:9) would be a reasonable candidate if
  asked to add one — same asset already ships for the video poster
- Wizard/result page `<title>` tags still contain em-dashes (an em-dash
  cleanup pass covered landing/browsing pages only; wizard/result was
  explicitly out of scope at the time)
- Product ASINs (in `data/products.json`) were sourced via web search at a
  point in time — worth spot-checking they're still live before relying on
  them for real traffic

## Editorial redesign exists in git history (not on `main`)

A full visual redesign (new asymmetric hero with real abstract photography,
differentiated "how it works" vs. category-card layouts, a verdict-led
results page hierarchy, wizard progress indicator + transitions, em-dash
cleanup) was built, verified in-browser, committed, and briefly deployed as
commit `7764858`. It was reverted (`74f10a7`) shortly after because the live
site went unreachable right after deploy — but that outage was later traced
entirely to a stale DNS cache on the maintainer's own ISP, unrelated to the
deploy or the code (confirmed via direct 1.1.1.1 lookup, phone on cellular
data, and a VPN all loading the site fine while the deploy was live). **The
redesign itself was not broken.** It also fixes the em-dash gap noted above,
if reapplied.

Note: `main` has since moved past the commit this was branched from (Bold
Bento landed 2026-09-14), so `git show 7764858` is still worth reading for
ideas/reference, but a direct cherry-pick will likely conflict — treat it as
prior art to draw from rather than something to apply cleanly.

## Deeper history

`claudedocs/` has the original requirements brainstorm, competitive research,
architecture design doc, and phased workflow plan from when this project
started — read those for the reasoning behind decisions above, not just the
what.
