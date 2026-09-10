// Generic tree-driven wizard: walks data/question-tree.json from `start`,
// tracking answer history so the back button works. Not fish-specific —
// pointing this at a different tree file drives the same UI for Water/Plants later.
(async function () {
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const backButton = document.getElementById('back-button');

  let tree;
  try {
    const res = await fetch('data/question-tree.json');
    tree = await res.json();
  } catch (err) {
    questionText.textContent = 'Could not load the question data.';
    return;
  }

  const history = [];
  let currentNodeId = tree.start;

  function renderNode(nodeId) {
    const node = tree.nodes[nodeId];
    questionText.textContent = node.text;
    optionsContainer.innerHTML = '';
    node.options.forEach((option) => {
      const button = document.createElement('button');
      button.className = 'option-button';
      button.textContent = option.label;
      button.addEventListener('click', () => handleAnswer(option.next));
      optionsContainer.appendChild(button);
    });
    backButton.disabled = history.length === 0;
  }

  function handleAnswer(next) {
    if (next.startsWith('outcome:')) {
      const slug = next.slice('outcome:'.length);
      window.location.href = `results/${slug}.html`;
      return;
    }
    history.push(currentNodeId);
    currentNodeId = next;
    renderNode(currentNodeId);
  }

  backButton.addEventListener('click', () => {
    const previous = history.pop();
    if (previous) {
      currentNodeId = previous;
      renderNode(currentNodeId);
    }
  });

  renderNode(currentNodeId);
})();
