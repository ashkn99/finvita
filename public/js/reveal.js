// Fades/slides .reveal sections in as they enter the viewport, once each.
// Skipped entirely under prefers-reduced-motion (CSS also handles that as a fallback).
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // No autoplay attribute in the markup — the hero video only plays once
  // we know motion is fine, so a reduced-motion visitor just sees the
  // poster frame with zero extra logic needed on that path.
  const heroVideo = document.querySelector('.hero-bg');
  if (heroVideo) heroVideo.play().catch(() => {});

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
