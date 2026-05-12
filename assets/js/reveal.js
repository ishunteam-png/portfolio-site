/* reveal.js - simple IntersectionObserver-driven scroll reveals.
 *
 * Any element with class "reveal" starts hidden (transform + opacity)
 * and gets class "in" added when it scrolls past the threshold. Pure
 * additive: if JS is disabled or IO unsupported, everything is visible
 * by default (the CSS sets opacity:0 only if the .reveal class is
 * applied AND .in is missing).
 */
(function () {
  "use strict";

  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  // No IO support? Just show everything.
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }

  // Respect reduced-motion preference
  const prm = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prm.matches) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  els.forEach((el) => io.observe(el));
})();
