// Generates results/<slug>.html and sitemap.xml from data/outcomes.json.
// Run with: node build.js  (run check-tree.js first — this does not re-validate)
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://finvita.online';

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', name), 'utf8'));
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, str.lastIndexOf(' ', maxLen)) + '…';
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function productCardHtml(product) {
  return `
      <li class="pcard">
        <div class="pimg"></div>
        <div>
          <div class="pname">${escapeHtml(product.name)}</div>
          <div class="pnote">${escapeHtml(product.note)}</div>
        </div>
        <a class="pbtn" href="${escapeHtml(product.amazonAffiliateUrl)}" rel="sponsored noopener" target="_blank" aria-label="View ${escapeHtml(product.name)} on Amazon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
        </a>
      </li>`;
}

function productsSectionHtml(outcome, products) {
  if (!outcome.productIds || outcome.productIds.length === 0) return '';
  const cards = outcome.productIds.map((id) => productCardHtml(products[id])).join('\n');
  return `
    <ul class="product-list">${cards}
    </ul>
    <p class="disclosure">As an Amazon Associate, we earn from qualifying purchases made through the links above. See our <a href="../disclosure.html">disclosure</a> for details.</p>`;
}

function tagSectionHtml(outcome) {
  if (outcome.confidence === 'likely') return '<div class="tag">Likely cause</div>';
  if (outcome.confidence === 'possible') return '<div class="tag">Possible cause</div>';
  return '';
}

function causesSectionHtml(outcome) {
  if (!outcome.causes || outcome.causes.length === 0) return '';
  const items = outcome.causes.map((c) => `<li>${escapeHtml(c)}</li>`).join('\n      ');
  return `
    <h2>Why this happens</h2>
    <ul class="explain">
      ${items}
    </ul>`;
}

function stepsSectionHtml(outcome) {
  if (!outcome.steps || outcome.steps.length === 0) return '';
  const items = outcome.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('\n      ');
  return `
    <h2>What to do next</h2>
    <ol class="explain">
      ${items}
    </ol>`;
}

function faqSectionHtml(outcome) {
  if (!outcome.faq || outcome.faq.length === 0) return '';
  const items = outcome.faq.map((f) => `
      <details class="faq-item">
        <summary>${escapeHtml(f.q)}
          <svg class="faq-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
        </summary>
        <div class="faq-a">${escapeHtml(f.a)}</div>
      </details>`).join('');
  return `
    <h2>Frequently asked questions</h2>
    <div class="faq-list">${items}
    </div>`;
}

function jsonLdScript(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function jsonldSectionHtml(outcome, canonicalUrl) {
  const scripts = [];
  scripts.push(jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: outcome.title, item: canonicalUrl },
    ],
  }));
  if (outcome.faq && outcome.faq.length > 0) {
    scripts.push(jsonLdScript({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: outcome.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }));
  }
  return scripts.join('\n  ');
}

function main() {
  const outcomes = loadJson('outcomes.json');
  const products = loadJson('products.json');
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'result-template.html'), 'utf8');
  const outDir = path.join(__dirname, 'public', 'results');
  fs.mkdirSync(outDir, { recursive: true });

  for (const [slug, outcome] of Object.entries(outcomes)) {
    const canonicalUrl = `${SITE_URL}/results/${slug}.html`;
    const html = template
      .replace(/{{TITLE}}/g, escapeHtml(outcome.title))
      .replace(/{{EXPLANATION}}/g, escapeHtml(outcome.explanation))
      .replace(/{{META_DESCRIPTION}}/g, escapeHtml(truncate(outcome.explanation, 155)))
      .replace(/{{CANONICAL_URL}}/g, canonicalUrl)
      .replace('{{TAG_SECTION}}', tagSectionHtml(outcome))
      .replace('{{CAUSES_SECTION}}', causesSectionHtml(outcome))
      .replace('{{STEPS_SECTION}}', stepsSectionHtml(outcome))
      .replace('{{PRODUCTS_SECTION}}', productsSectionHtml(outcome, products))
      .replace('{{FAQ_SECTION}}', faqSectionHtml(outcome))
      .replace('{{JSONLD_SECTION}}', jsonldSectionHtml(outcome, canonicalUrl));
    fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
  }
  console.log(`Built ${Object.keys(outcomes).length} result page(s) into public/results/`);

  buildSitemap(outcomes);
}

function buildSitemap(outcomes) {
  const staticPages = [
    '/', '/diagnose-fish.html', '/diagnose-water.html', '/diagnose-plants.html',
    '/about.html', '/privacy.html', '/contact.html', '/blog.html',
  ];
  const resultPages = Object.keys(outcomes).map((slug) => `/results/${slug}.html`);
  const urls = [...staticPages, ...resultPages]
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml);
  console.log(`Built sitemap.xml with ${staticPages.length + resultPages.length} URL(s).`);
}

main();
