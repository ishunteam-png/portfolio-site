/* counters.js - animate the metric numbers when they scroll into view */

(function () {
  "use strict";

  const els = document.querySelectorAll(".m-num[data-target]");
  if (!els.length) return;

  function format(n) {
    if (n >= 1000) return n.toLocaleString();
    return String(n);
  }

  function animate(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1200;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min((t - t0) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - k, 3);
      const value = Math.round(target * eased);
      el.textContent = format(value);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach(animate);
  }
})();
