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
  const img = product.imageUrl
    ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy">`
    : '';
  return `
      <li class="pcard">
        <div class="pimg">${img}</div>
        <div class="pcard-body">
          <div class="pname">${escapeHtml(product.name)}</div>
          <div class="pnote">${escapeHtml(product.note)}</div>
          <a class="pbtn" href="${escapeHtml(product.amazonAffiliateUrl)}" rel="sponsored noopener" target="_blank">
            Shop on Amazon
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>
          </a>
        </div>
      </li>`;
}

function productsSectionHtml(outcome, products, heading) {
  if (!outcome.productIds || outcome.productIds.length === 0) return '';
  const cards = outcome.productIds.map((id) => productCardHtml(products[id])).join('\n');
  return `
    ${heading ? `<h2>${escapeHtml(heading)}</h2>` : ''}
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

function faqSectionHtml(faq) {
  if (!faq || faq.length === 0) return '';
  const items = faq.map((f) => `
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

function jsonldSectionHtml({ title, faq, canonicalUrl, type }) {
  const scripts = [];
  scripts.push(jsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: title, item: canonicalUrl },
    ],
  }));
  if (type) {
    scripts.push(jsonLdScript({
      '@context': 'https://schema.org',
      '@type': type,
      headline: title,
      url: canonicalUrl,
    }));
  }
  if (faq && faq.length > 0) {
    scripts.push(jsonLdScript({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
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
    const canonicalUrl = `${SITE_URL}/results/${slug}`;
    const html = template
      .replace(/{{TITLE}}/g, escapeHtml(outcome.title))
      .replace(/{{EXPLANATION}}/g, escapeHtml(outcome.explanation))
      .replace(/{{META_DESCRIPTION}}/g, escapeHtml(truncate(outcome.explanation, 155)))
      .replace(/{{CANONICAL_URL}}/g, canonicalUrl)
      .replace('{{TAG_SECTION}}', tagSectionHtml(outcome))
      .replace('{{CAUSES_SECTION}}', causesSectionHtml(outcome))
      .replace('{{STEPS_SECTION}}', stepsSectionHtml(outcome))
      .replace('{{PRODUCTS_SECTION}}', productsSectionHtml(outcome, products))
      .replace('{{FAQ_SECTION}}', faqSectionHtml(outcome.faq))
      .replace('{{JSONLD_SECTION}}', jsonldSectionHtml({ title: outcome.title, faq: outcome.faq, canonicalUrl }));
    fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
  }
  console.log(`Built ${Object.keys(outcomes).length} result page(s) into public/results/`);

  const blogPosts = buildBlogPosts();
  buildBlogIndex(blogPosts);
  updateHomepageBlogSection(blogPosts);
  buildSitemap(outcomes, blogPosts);
}

function formatDate(iso) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function buildBlogPosts() {
  const posts = loadJson('blog-posts.json');
  const products = loadJson('products.json');
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'blog-post-template.html'), 'utf8');
  const outDir = path.join(__dirname, 'public', 'blog');
  fs.mkdirSync(outDir, { recursive: true });

  const entries = Object.entries(posts).sort((a, b) => b[1].publishedDate.localeCompare(a[1].publishedDate));
  for (const [slug, post] of entries) {
    const canonicalUrl = `${SITE_URL}/blog/${slug}`;
    const bodyHtml = fs.readFileSync(path.join(__dirname, 'content', 'blog', `${slug}.html`), 'utf8');
    const html = template
      .replace(/{{TITLE}}/g, escapeHtml(post.title))
      .replace(/{{META_DESCRIPTION}}/g, escapeHtml(post.metaDescription))
      .replace(/{{CANONICAL_URL}}/g, canonicalUrl)
      .replace('{{PUBLISHED_DATE_DISPLAY}}', formatDate(post.publishedDate))
      .replace('{{BODY_HTML}}', bodyHtml)
      .replace('{{PRODUCTS_SECTION}}', productsSectionHtml(post, products, 'What to use'))
      .replace('{{FAQ_SECTION}}', faqSectionHtml(post.faq))
      .replace('{{JSONLD_SECTION}}', jsonldSectionHtml({ title: post.title, faq: post.faq, canonicalUrl, type: 'BlogPosting' }));
    fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
  }
  console.log(`Built ${entries.length} blog post(s) into public/blog/`);
  return entries.map(([slug, post]) => ({ slug, ...post }));
}

const TAG_LABELS = {
  'fish-health': 'Fish Health',
  'water-quality': 'Water Quality',
  'plant-care': 'Plant Care',
  'beginner-guide': 'Beginner Guide',
};

function tagsHtml(tags) {
  if (!tags || tags.length === 0) return '';
  const chips = tags.map((t) => `<span class="tag-chip tag-${t}">${escapeHtml(TAG_LABELS[t] || t)}</span>`).join('');
  return `<div class="blog-tags">${chips}</div>`;
}

function blogCardHtml(post) {
  return `
      <a class="blog-card" href="blog/${post.slug}.html">
        ${tagsHtml(post.tags)}
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.metaDescription)}</p>
      </a>`;
}

function buildBlogIndex(blogPosts) {
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'blog-index-template.html'), 'utf8');
  const cards = blogPosts.map(blogCardHtml).join('\n');
  const html = template.replace('{{POST_LIST}}', cards);
  fs.writeFileSync(path.join(__dirname, 'public', 'blog.html'), html);
  console.log(`Built public/blog.html with ${blogPosts.length} post(s).`);
}

function updateHomepageBlogSection(blogPosts) {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const cards = blogPosts.slice(0, 3).map(blogCardHtml).join('\n');
  const replacement = `<!-- BLOG_SECTION_START -->\n      <div class="blog-list">${cards}\n      </div>\n      <!-- BLOG_SECTION_END -->`;
  html = html.replace(/<!-- BLOG_SECTION_START -->[\s\S]*?<!-- BLOG_SECTION_END -->/, replacement);
  fs.writeFileSync(indexPath, html);
}

function buildSitemap(outcomes, blogPosts) {
  const staticPages = [
    '/', '/diagnose-fish', '/diagnose-water', '/diagnose-plants',
    '/about', '/privacy', '/contact', '/blog',
  ];
  const resultPages = Object.keys(outcomes).map((slug) => `/results/${slug}`);
  const blogPages = blogPosts.map((post) => `/blog/${post.slug}`);
  const urls = [...staticPages, ...resultPages, ...blogPages]
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml);
  console.log(`Built sitemap.xml with ${staticPages.length + resultPages.length + blogPages.length} URL(s).`);
}

main();
