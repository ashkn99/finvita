# Implementation Workflow: Aquarium Health Helper (v1 — Fish path)

Source documents: [requirements](../ — brainstorm output), [research_aquarium_helper_competitors_users_20260910.md](research_aquarium_helper_competitors_users_20260910.md), [design_aquarium_helper_20260910.md](design_aquarium_helper_20260910.md).

Plan only — no code written here. Execute with `/sc:sc:implement`, one phase at a time.

---

## Phase 0 — Setup decisions (blocking, do first)
| Task | Depends on |
|---|---|
| Pick static framework (Astro / Next.js static export / plain static HTML+JS) — design doc left this open deliberately | — |
| Init repo, base project scaffold for chosen framework | Framework picked |
| Pick hosting (Vercel/Netlify/Cloudflare Pages — any static host works) | Framework picked |
| Get/confirm Amazon Associates account + affiliate tag string | — |

**Checkpoint:** empty scaffold builds and deploys ("hello world") before any feature work starts.

---

## Phase 1 — Static shell
| Task | Depends on |
|---|---|
| Landing page `/` — Fish (active) / Water, Plants (disabled/"coming soon") | Phase 0 |
| `/disclosure` static page (FTC affiliate disclosure text) | Phase 0 |
| Route skeleton for `/diagnose/fish` and `/results/[slug]` (empty shells) | Phase 0 |

**Checkpoint:** all routes reachable and navigable, no data wired yet.

---

## Phase 2 — Data layer + validation
| Task | Depends on |
|---|---|
| Define `question-tree.json`, `outcomes.json`, `products.json` schemas per design doc | Phase 0 |
| Seed data for **illness-visible branch only** (highest search volume per research) — a handful of nodes ending in 2-3 outcomes (e.g. ich, fin rot) | Schemas defined |
| Build-time tree-integrity self-check: every `next` resolves to a node or `outcome:` slug in `outcomes.json`; every `productIds` entry exists in `products.json` | Seed data exists |

**Checkpoint:** self-check script passes on the seed data; intentionally break a link and confirm it fails loudly.

---

## Phase 3 — Wizard component
| Task | Depends on |
|---|---|
| Generic `QuestionWizard` (tree-driven, not fish-specific) | Phase 2 |
| `AnswerButton` component (single-choice / yes-no) | — |
| Back-button / answer-history state | Wizard core |
| Wire `/diagnose/fish` to load `question-tree.json` via `QuestionWizard` | Wizard core |

**Checkpoint:** can walk the illness-visible branch start-to-finish in a browser and land on a `/results/[slug]` URL.

---

## Phase 4 — Result rendering
| Task | Depends on |
|---|---|
| `ProductCard` component (image, name, note, affiliate link `rel="sponsored noopener"`, inline disclosure snippet) | Phase 1 |
| `ResultPage` — renders one or more outcome records (supports ranked multi-cause case) | Phase 2, ProductCard |
| Pre-render one static route per outcome at build time | ResultPage |

**Checkpoint:** `/results/ich` and `/results/fin-rot` are directly linkable, indexable static pages showing correct products + disclosure.

---

## Phase 5 — Remaining fish content (parallelizable with Phase 3/4 once schema is fixed)
| Task | Depends on |
|---|---|
| Behavior-problems branch: nodes + outcomes + product mappings | Phase 2 schema |
| Death/dying-fish branch: nodes + outcomes + product mappings | Phase 2 schema |
| New-tank/stocking branch: nodes + outcomes + product mappings | Phase 2 schema |
| Re-run tree-integrity self-check after each branch added | Each branch |

**Checkpoint:** all four fish categories reachable from `/diagnose/fish` start node; self-check still passes.

---

## Phase 6 — QA pass
| Task | Depends on |
|---|---|
| Mobile-viewport pass (wizard + result cards, single-column, tap targets) | Phases 3-5 |
| Manual click-through of every affiliate link → confirms correct live Amazon product | Phase 4-5 content complete |
| Full golden-path browser test: landing → each of the 4 categories → result page | Phases 1-5 |
| Confirm disclosure text visible on every result page | Phase 4 |

**Checkpoint:** no broken links, no layout breakage on mobile, every path reachable.

---

## Phase 7 — Deploy
| Task | Depends on |
|---|---|
| Deploy to chosen host | Phase 6 passed |
| Smoke-test production URL (same golden path as Phase 6) | Deployed |

---

## Explicitly out of scope for this workflow (per requirements doc)
Water/Plants diagnostic trees, blog/SEO content system, non-Amazon affiliate programs, analytics wiring, CMS/database migration — these are noted as future phases in the design doc's Open Items, not part of this plan.

---

**Next step:** `/sc:sc:implement` starting at Phase 0.
