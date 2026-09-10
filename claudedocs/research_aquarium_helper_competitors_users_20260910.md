# Research Report: Aquarium Health Helper — Competitors & Users

**Date:** 2026-09-10
**Scope:** Competitive landscape for fish/aquarium diagnostic tools, target-user pain points and search behavior, and the affiliate-quiz business model.
**Depth:** Standard (web search + direct site review, 1-2 hops)

---

## Executive Summary

The "answer questions → get a diagnosis" format is **already well established** in this niche — five+ existing tools do some version of it. However, none of the ones found combine that format with **Amazon-affiliate-driven product recommendations** as the core business model:

- Brand-owned tools (Interpet, NT Labs) diagnose for free but funnel toward their **own branded treatments**, not Amazon.
- AI-photo tools (TankBrain, FishKeeper.ai) are **paywalled SaaS**, not free+affiliate.
- Reference/checklist tools (Fast Aquatics, Fishlore, FishVet) are **static disease databases**, not branching quizzes, and monetize (if at all) through their own store or ads.

That's a real gap. The bigger risk isn't competition — it's **unit economics**: Amazon's Pet Products commission rate is only **3%**, which is low even by Amazon standards, and directly affects whether this is worth building as a business versus a portfolio/hobby project. This is worth confirming before investing significant build time (see Recommendations).

Confidence: **Medium-high** on competitive landscape (multiple corroborating sources found, some sites not directly fetchable e.g. FishKeeper.ai returned a server error so its details are second-hand from search snippets only). **High** on the Amazon commission rate (consistent across 5+ independent sources).

---

## Findings

### 1. Direct / adjacent competitors

| Site | Format | Monetization | Gap vs. your idea |
|---|---|---|---|
| [Interpet Fish Doctor](https://interpet.co.uk/support/the-fish-doctor/diagnose-whats-wrong/) | Branching yes/no + multiple-choice questionnaire ("My Fish" vs "My Aquarium" → narrows by symptom location/appearance) → named diagnosis page (e.g. "white-spot", "finrot") | Pushes Interpet's own branded treatment products | Closest structural match to your idea, but it's a brand's lead-gen tool, not a neutral affiliate recommender |
| [NT Labs Diagnosis Guide](https://www.nt-labs.com/diagnose/) | Select fish type → select observed symptoms → matched conditions | Pushes NT Labs' own products | Same pattern as Interpet — single-brand bias |
| [Fast Aquatics Tools](https://fastaquatics.com/tools/) | Symptom checklist → ranked disease matches with treatment; also a separate 3-5 question "problem diagnoser" and a water-parameter checker | Site's own equipment/livestock store | Good UX precedent for "ranked possible causes," but tied to their own storefront |
| [TankBrain Disease Identifier](https://tankbrain.io/disease-identifier) | Photo upload OR text symptom description, AI asks follow-up questions before diagnosing | **Paywalled** — requires Pro subscription (14-day free trial) | Shows people will pay for AI diagnosis, but that's a SaaS model, not affiliate/content |
| [FishKeeper.ai](https://www.fishkeeper.ai/) | AI photo+symptom diagnosis, claims "95+ diseases," "98% accuracy" (marketing claim, not independently verified) | Unclear from search snippets (site didn't load directly — treat details as low-confidence) | Same AI-app category as TankBrain |
| [FishVet](https://fishvetapp.com/) | Database-driven: 201 symptoms × 97 diseases, ranked by probability | Unclear/reference-only | More clinical/vet-oriented framing |
| Fishlore, Aquarium Science, FishDoc | Static disease-symptom-treatment **articles**, not interactive quizzes | Ads / their own affiliate links scattered in text | High-authority existing SEO content you'd be competing against for the same keywords |

**Takeaway:** Nobody found is doing "free branching diagnostic quiz, brand-neutral, monetized purely via Amazon affiliate links" as their explicit model. Existing players are either brand-biased (push their own products) or paywalled AI apps (no affiliate angle). This validates the concept isn't a copy of an existing site, but it also means you're not the first to think "quiz format works here" — the UX pattern itself is proven, just not the monetization angle.

### 2. User pain points / what people actually search for

Symptom-to-cause mapping that repeatedly surfaced across sources (useful directly as decision-tree content):

- **Gasping at surface / rapid gill movement** → low oxygen or poor water quality
- **Rubbing against objects (flashing)** → parasites
- **Red streaking, torn/frayed fins** → ammonia poisoning or fin rot
- **Clamped fins** → incorrect pH
- **Swollen/puffy gills** → poor water quality
- **Not eating, hiding, lethargy** → stress, illness, or new-tank adjustment
- **Bloating / "pinecone" raised scales** → dropsy (often fatal, high-anxiety search)
- **Swimming sideways/upside down, loss of balance** → swim bladder disorder
- **Color loss** → stress

Common named searches: "why is my betta not eating," "why is my betta's fins torn," "is my fish dying," "new tank syndrome." These map closely to the four categories you already chose (illness, behavior, death/dying, new-tank) — the category choice matches real search intent well.

### 3. Business model validation (quiz → affiliate product)

The "diagnostic quiz → personalized product recommendation" pattern is well-proven **outside** this niche — e.g. EMUAID and Moon Juice run branching-logic quizzes tied to symptoms/needs that route into product recommendations and email flows, and industry benchmarks cited show quiz landing pages consistently converting better than static product pages, with quiz-driven bundles raising average order value. This is indirect evidence (from skincare/wellness, not aquariums) but it supports the core mechanic you're proposing.

### 4. Amazon Associates economics (important constraint)

Multiple independent sources (Lasso, AzonPress, AffiliateX, EarnifyHub) agree: **Amazon's Pet Products commission rate is 3%**, near the bottom of Amazon's category range (which spans roughly 0%–20%). This is a meaningful constraint:
- A $15 medication bottle nets ~$0.45.
- Traffic and average order value both need to be high to make this worthwhile purely on Amazon.
- Several of the "aquarium affiliate programs" articles found explicitly recommend supplementing Amazon with specialty affiliate programs (The Shrimp Farm 10%, Fish.com 6%, Marine Depot 5%) for exactly this reason — even though your requirements scoped monetization to Amazon-only for v1.

---

## Recommendations (for your decision, not applied)

1. **Re-check the Amazon-only monetization decision** with the 3% rate in hand. You don't have to add other programs now, but go in knowing the affiliate revenue per visitor will be small — this is a traffic-volume game, which raises the importance of the SEO/blog layer you deferred, sooner than "later."
2. **Differentiate on neutrality + no paywall.** Your clearest gap vs. competitors is: free (unlike TankBrain/FishKeeper.ai) and brand-neutral (unlike Interpet/NT Labs). Worth stating explicitly as the site's positioning once you get to copywriting.
3. **Steal the category structure, not the content.** Interpet's "My Fish vs My Aquarium" top-level split and Fast Aquatics' "ranked possible causes" output are validated UX patterns worth studying directly (both linked above) when you get to `/sc:sc:design`.
4. **The symptom list above is a usable seed** for your fish-illness decision tree branches — it's corroborated across multiple independent sources, not just one site's opinion.

---

## Sources

- [Diagnosis Guide by NT Labs](https://www.nt-labs.com/diagnose/)
- [Fish Disease Identifier — TankBrain](https://tankbrain.io/disease-identifier)
- [Aquarium interactive tools — Fast Aquatics](https://fastaquatics.com/tools/)
- [Diagnosing Fish Illness by Symptoms — DBC Aquatics](https://dbcaquatics.com/diagnose-sick-fish-symptoms-guide/)
- [AI Fish Disease Diagnosis App — FishKeeper.ai](https://www.fishkeeper.ai/)
- [FishVet - fish disease diagnostics](https://fishvetapp.com/)
- [Interpet - Diagnose what's wrong](https://interpet.co.uk/support/the-fish-doctor/diagnose-whats-wrong/)
- [Freshwater Fish Disease Symptoms and Treatment — Fishlore](https://www.fishlore.com/Disease.htm)
- [Aquarium Science — Diseases](https://aquariumscience.org/index.php/10-diseases/)
- [List of aquarium diseases — Wikipedia](https://en.wikipedia.org/wiki/List_of_aquarium_diseases)
- [9 Best Aquarium Affiliate Programs — Brand and Partners](https://brandandpartners.com/aquarium-affiliate-programs/)
- [10 Awesome Aquarium Affiliate Programs — Run the Affiliate Market](https://runtheaffiliatemarket.com/aquarium-affiliate-programs/)
- [Amazon Affiliate Commission Rate: 2026 Blogger Guide — Lasso](https://getlasso.co/amazon-affiliate-commission-rate/)
- [Amazon Affiliate Commission Rates By Category 2026 — AzonPress](https://azonpress.com/amazon-affiliate-commission-rates/)
- [Amazon Associates Commission Rates 2026 — EarnifyHub](https://earnifyhub.com/blog/affiliate/amazon-associates-commission-rates-all-categories)
- [10 Signs Your Betta Fish Is Sick — LoveToKnow Pets](https://www.lovetoknowpets.com/aquariums/betta-fish-illness)
- [Is Your Betta Fish Dying? — Tropicflow](https://tropicflow.com/blogs/guide-knowledge/betta-fish-behavior-before-death)
- [50+ Product Recommendation Quiz Examples — Digioh](https://www.digioh.com/product-recommendation-quiz-examples)
- [Your Quiz Results - Affiliate Marketing Model — Project Life Mastery](https://projectlifemastery.com/quiz-results-affiliate-marketing/)

---

**Next step:** This report is informational only — no design or implementation decisions have been made. Use `/sc:sc:design` to fold the "My Fish vs My Aquarium" pattern and symptom seed list into an actual question-tree structure, or revisit the monetization requirement first if the 3% commission rate changes your thinking.
