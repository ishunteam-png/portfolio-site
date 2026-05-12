/* reels.js
 * Card hover screenshot reels. Each card with data-reel="img1.png,img2.png"
 * cycles through its thumbnails on hover. Single-image cards just display
 * the static thumbnail.
 *
 * Side rail position indicator. Each rail dot maps to a section by
 * data-section. As sections scroll into view, the matching dot lights up.
 */
(function () {
  "use strict";

  /* ------------------------------------------- screenshot reels */
  document.querySelectorAll(".card[data-reel]").forEach((card) => {
    const thumb = card.querySelector(".card-thumb");
    if (!thumb) return;
    const images = card.dataset.reel
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!images.length) return;

    // Preload so the transitions are instant
    images.forEach((src) => {
      const i = new Image();
      i.src = src;
    });

    thumb.style.backgroundImage = `url('${images[0]}')`;
    if (images.length < 2) return;

    let idx = 0;
    let timer = null;
    card.addEventListener("mouseenter", () => {
      if (timer) return;
      timer = setInterval(() => {
        idx = (idx + 1) % images.length;
        thumb.style.backgroundImage = `url('${images[idx]}')`;
      }, 900);
    });
    card.addEventListener("mouseleave", () => {
      if (timer) clearInterval(timer);
      timer = null;
      idx = 0;
      thumb.style.backgroundImage = `url('${images[0]}')`;
    });
  });

  /* ------------------------------------------- side rail indicator */
  const rail = document.getElementById("side-rail");
  if (!rail) return;
  const dots = Array.from(rail.querySelectorAll(".rail-dot"));
  const map = {};
  dots.forEach((d) => {
    const id = d.dataset.section;
    const target = document.getElementById(id);
    if (target) map[id] = { dot: d, target };
  });
  if (!Object.keys(map).length) return;

  // Mark first dot active by default
  dots[0].classList.add("active");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        if (!map[id]) return;
        dots.forEach((d) => d.classList.remove("active"));
        map[id].dot.classList.add("active");
      });
    },
    {
      // Trigger when the section's top crosses 30% from the viewport top
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    }
  );
  Object.values(map).forEach((m) => io.observe(m.target));
})();
