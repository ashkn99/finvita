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
      .replace('{{PRODUCTS_SECTION}}', productsSectionHtml(outcome, products));
    fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
  }
  console.log(`Built ${Object.keys(outcomes).length} result page(s) into public/results/`);

  buildSitemap(outcomes);
}

function buildSitemap(outcomes) {
  const staticPages = ['/', '/diagnose-fish.html', '/diagnose-water.html', '/diagnose-plants.html'];
  const resultPages = Object.keys(outcomes).map((slug) => `/results/${slug}.html`);
  const urls = [...staticPages, ...resultPages]
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml);
  console.log(`Built sitemap.xml with ${staticPages.length + resultPages.length} URL(s).`);
}

main();
