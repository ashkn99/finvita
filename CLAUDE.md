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
  about.html, privacy.html, contact.html, disclosure.html, 404.html
  blog.html               # GENERATED — gitignored, rebuilt by build.js
  data/
    question-tree-{fish,water,plants}.json   # branching Q&A trees
    outcomes.json         # diagnosis text + which products to show + confidence
    products.json         # Amazon products: name, affiliate URL, note
    blog-posts.json        # blog metadata: title, description, date, faq per slug
  results/                # GENERATED — gitignored, rebuilt by build.js
  blog/                   # GENERATED — gitignored, rebuilt by build.js
  sitemap.xml             # GENERATED — gitignored, rebuilt by build.js
  css/style.css           # single stylesheet, everything lives here
  js/{wizard,nav,reveal}.js
  img/                    # hero video + poster, category card photos (see Design system)
templates/result-template.html      # template build.js fills per outcome
templates/blog-post-template.html   # template build.js fills per blog post
templates/blog-index-template.html  # template build.js fills for public/blog.html
content/blog/<slug>.html   # hand-written body HTML per post, read by build.js
build.js            # reads data/*.json + templates -> writes public/results/*.html,
                     # public/blog/*.html, public/blog.html, sitemap.xml, and updates
                     # the "From the blog" section in public/index.html in place
                     # (between <!-- BLOG_SECTION_START/END --> markers)
check-tree.js        # validates every tree node/outcome/product reference resolves
serve.js              # zero-dep local static server for testing (node serve.js -> :8080)
claudedocs/            # research/design/workflow docs from earlier sessions
```

## Workflow

After editing anything in `data/*.json`, `templates/*.html`, or `content/blog/*.html`:

```bash
node check-tree.js && node build.js
```

`check-tree.js` catches dangling tree nodes, missing outcomes, or missing
product references — run it before every commit that touches data. It does
not validate `blog-posts.json`/`content/blog/`; a missing fragment file just
throws loudly when `build.js` tries to read it.

**Adding a new blog post**: add an entry to `public/data/blog-posts.json`
(slug key, `title`/`metaDescription`/`publishedDate`/`faq`) and a matching
`content/blog/<slug>.html` fragment (body only — no `<h1>`, nav, or FAQ,
those are generated), following the structure and SEO checklist in
`claudedocs/guide_blog_post_writing_20260914.md`. Then run the build command
above — it regenerates `public/blog/<slug>.html`, `public/blog.html`'s
listing, the homepage's "From the blog" cards (latest 3), and the sitemap.

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
- **Blog posts** (`public/blog/<slug>.html`) use the same nav/`.page-wide`
  shell as landing pages, not the minimal wizard topbar, since they're
  browsing content. Body content reuses `.explain`-derived `.article-body`
  styling and the same `.faq-list` FAQ component as everywhere else. Every
  post carries `BreadcrumbList` + `BlogPosting` + `FAQPage` JSON-LD
  (generated by `build.js`, same helper functions used for result pages).

## Known gaps / deferred (check before assuming these are done)

- `hello@finvita.online` is not a working inbox yet — needs real email
  forwarding set up at the registrar/Cloudflare before Contact page is real
- Product cards (`.pcard`/`.pimg` on result pages — the Amazon product
  recommendations, not the homepage's fish/water/plants doors) still use a
  gradient placeholder tile, not real photos — needs the Amazon Product
  Advertising API or similar, more setup than has happened so far. The
  homepage diagnose-doors gap this note used to describe is done (see
  Design system above).
- Wizard/result page `<title>` tags still contain em-dashes (an em-dash
  cleanup pass covered landing/browsing pages only; wizard/result was
  explicitly out of scope at the time)
- Product ASINs (in `data/products.json`) were sourced via web search at a
  point in time — worth spot-checking they're still live before relying on
  them for real traffic
- Blog launched 2026-09-14 with 10 posts (see
  `claudedocs/guide_blog_post_writing_20260914.md` for the topic list and
  writing standard) — all backdated to the same launch date, so there's no
  real publishing cadence yet. Consider spacing future posts out, or
  updating `publishedDate` on future additions, if a steady cadence matters
  for SEO going forward.
- No Search Console verification file/DNS record is tracked in this repo
  (the user manages it directly in the Cloudflare/Search Console dashboards)
  — if indexing issues come up, check there first, not in the codebase.
- Cloudflare Web Analytics runs in **Automatic** mode (confirmed
  2026-09-14) — there's deliberately no analytics snippet anywhere in this
  codebase; that's expected, not a gap.

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
