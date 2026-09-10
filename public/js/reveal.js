// Fades/slides .reveal sections in as they enter the viewport, once each.
// Skipped entirely under prefers-reduced-motion (CSS also handles that as a fallback).
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach((el) => observer.observe(el));
})();
