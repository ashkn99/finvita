// Validates every data/question-tree-*.json against data/outcomes.json and data/products.json.
// Run with: node check-tree.js
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'public', 'data');

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8'));
}

function validateTree(fileName, tree, outcomes, errors) {
  if (!tree.nodes[tree.start]) {
    errors.push(`${fileName}: start node "${tree.start}" does not exist in nodes`);
  }

  const reachable = new Set();
  const visit = (nodeId) => {
    if (reachable.has(nodeId)) return;
    reachable.add(nodeId);
    const node = tree.nodes[nodeId];
    if (!node) {
      errors.push(`${fileName}: node "${nodeId}" is referenced but not defined`);
      return;
    }
    for (const option of node.options) {
      if (option.next.startsWith('outcome:')) {
        const slug = option.next.slice('outcome:'.length);
        if (!outcomes[slug]) {
          errors.push(`${fileName}: node "${nodeId}" -> outcome "${slug}" not found in outcomes.json`);
        }
      } else {
        visit(option.next);
      }
    }
  };
  visit(tree.start);

  for (const nodeId of Object.keys(tree.nodes)) {
    if (!reachable.has(nodeId)) {
      errors.push(`${fileName}: node "${nodeId}" is defined but unreachable from start`);
    }
  }
  return reachable.size;
}

function main() {
  const outcomes = loadJson('outcomes.json');
  const products = loadJson('products.json');
  const errors = [];

  const treeFiles = fs.readdirSync(DATA_DIR).filter((f) => f.startsWith('question-tree-') && f.endsWith('.json'));
  let totalNodes = 0;
  for (const fileName of treeFiles) {
    const tree = loadJson(fileName);
    totalNodes += validateTree(fileName, tree, outcomes, errors);
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
  console.log(`Tree validation passed: ${treeFiles.length} tree(s), ${totalNodes} node(s), ${Object.keys(outcomes).length} outcome(s), ${Object.keys(products).length} product(s).`);
}

main();
