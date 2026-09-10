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

To preview locally: `node serve.js` then open `http://localhost:8080`.
(Or use the Claude Code browser preview tool with the `static-site` launch
config in `.claude/launch.json`.)

Push to `main` = live in ~1 minute. No staging environment exists.

## Design system

Landing/browsing pages (index, about, privacy, contact, blog, disclosure,
404) share a nav (desktop: inline links; mobile: hamburger dropdown) and use
`.page-wide` for a wider desktop container. Wizard/result pages deliberately
keep a minimal back-button-only topbar — no nav clutter mid-task.

- Fonts: Sora (display) + Plus Jakarta Sans (body), via Google Fonts
- Colors: single blue accent (`--accent: oklch(55% 0.16 258)`), oklch tokens
  throughout, shadows always tinted to the same hue (never generic black)
- This is "V1 — Gradient Hero," picked by the user from 4 explored directions
  — don't redesign the core palette/gradient without discussion
- FAQ uses native `<details>/<summary>` (zero JS); scroll-reveal uses
  IntersectionObserver; both respect `prefers-reduced-motion`

## Known gaps / deferred (check before assuming these are done)

- `hello@finvita.online` is not a working inbox yet — needs real email
  forwarding set up at the registrar/Cloudflare before Contact page is real
- Blog has no content or generation pipeline yet — `blog.html` and the
  homepage's "From the blog" section are honest empty states, not fake posts
- Product cards use a gradient placeholder tile, not real photos — product
  images were explicitly deferred (needs Amazon Product Advertising API or
  similar, more setup than a v1 needed)
- Hero visual is a gradient + icon placeholder — user has stated intent to
  add AI-generated illustrations there; don't fill it with stock photos
- No `og:image` anywhere on the site — no branded image asset exists yet
- Wizard/result page `<title>` tags still contain em-dashes (an em-dash
  cleanup pass covered landing/browsing pages only; wizard/result was
  explicitly out of scope at the time)
- Product ASINs (in `data/products.json`) were sourced via web search at a
  point in time — worth spot-checking they're still live before relying on
  them for real traffic

## Deeper history

`claudedocs/` has the original requirements brainstorm, competitive research,
architecture design doc, and phased workflow plan from when this project
started — read those for the reasoning behind decisions above, not just the
what.
