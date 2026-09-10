// Toggles the mobile nav dropdown. Desktop shows nav-links inline via CSS
// and hides nav-toggle entirely, so this only matters on narrow screens.
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
})();
