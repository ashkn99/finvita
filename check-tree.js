// Validates data/question-tree.json against data/outcomes.json and data/products.json.
// Run with: node check-tree.js
const fs = require('fs');
const path = require('path');

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', name), 'utf8'));
}

function main() {
  const tree = loadJson('question-tree.json');
  const outcomes = loadJson('outcomes.json');
  const products = loadJson('products.json');
  const errors = [];

  if (!tree.nodes[tree.start]) {
    errors.push(`start node "${tree.start}" does not exist in nodes`);
  }

  const reachable = new Set();
  const visit = (nodeId) => {
    if (reachable.has(nodeId)) return;
    reachable.add(nodeId);
    const node = tree.nodes[nodeId];
    if (!node) {
      errors.push(`node "${nodeId}" is referenced but not defined`);
      return;
    }
    for (const option of node.options) {
      if (option.next.startsWith('outcome:')) {
        const slug = option.next.slice('outcome:'.length);
        if (!outcomes[slug]) {
          errors.push(`node "${nodeId}" -> outcome "${slug}" not found in outcomes.json`);
        }
      } else {
        visit(option.next);
      }
    }
  };
  visit(tree.start);

  for (const nodeId of Object.keys(tree.nodes)) {
    if (!reachable.has(nodeId)) {
      errors.push(`node "${nodeId}" is defined but unreachable from start`);
    }
  }

  for (const [slug, outcome] of Object.entries(outcomes)) {
    for (const productId of outcome.productIds) {
      if (!products[productId]) {
        errors.push(`outcome "${slug}" references product "${productId}" not found in products.json`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`Tree validation FAILED (${errors.length} issue(s)):`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log(`Tree validation passed: ${reachable.size} node(s), ${Object.keys(outcomes).length} outcome(s), ${Object.keys(products).length} product(s).`);
}

main();
