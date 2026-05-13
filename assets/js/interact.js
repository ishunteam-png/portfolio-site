/* interact.js — advanced interactions: custom cursor, magnetic CTAs,
 * 3D tilt on project images, mouse-tracking gradient, scroll progress.
 *
 * Pure vanilla JS, no frameworks. Respects prefers-reduced-motion +
 * coarse pointers (mobile) — degrades gracefully. */

(function () {
  "use strict";

  const prm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  /* -------------------------------------------- scroll progress bar */
  const progressBar = document.createElement("div");
  progressBar.id = "scroll-progress";
  document.body.appendChild(progressBar);

  function updateProgress() {
    const sh = document.documentElement.scrollHeight - window.innerHeight;
    const pct = sh > 0 ? (window.scrollY / sh) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* -------------------------------------------- custom cursor */
  if (!coarse) {
    const dot = document.createElement("div");
    dot.id = "cursor-dot";
    const ring = document.createElement("div");
    ring.id = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    function animateRing() {
      // Spring follow
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    if (!prm) animateRing();

    window.addEventListener("mouseleave", () =>
      document.body.classList.add("cursor-hidden"));
    window.addEventListener("mouseenter", () =>
      document.body.classList.remove("cursor-hidden"));

    // Grow ring over interactive elements
    const isInteractive = (el) =>
      !!el.closest("a, button, [role='button'], input, textarea, label, .card-link, [data-magnetic]");

    let lastInteractive = false;
    document.addEventListener("mouseover", (e) => {
      const over = isInteractive(e.target);
      if (over !== lastInteractive) {
        document.body.classList.toggle("cursor-over-interactive", over);
        lastInteractive = over;
      }
    });
  }

  /* -------------------------------------------- magnetic CTAs */
  if (!prm && !coarse) {
    document.querySelectorAll(".btn, .project-cta a, .cmdk-hint").forEach((el) => {
      el.dataset.magnetic = "true";
      let frame = null;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) * 0.18;
        const dy = (e.clientY - cy) * 0.32;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });
      el.addEventListener("mouseleave", () => {
        if (frame) cancelAnimationFrame(frame);
        el.style.transition = "transform 0.4s cubic-bezier(0.2, 0.6, 0.2, 1)";
        el.style.transform = "translate(0, 0)";
        setTimeout(() => { el.style.transition = ""; }, 420);
      });
      el.addEventListener("mouseenter", () => {
        el.style.transition = "";
      });
    });
  }

  /* -------------------------------------------- 3D tilt on project images */
  if (!prm && !coarse) {
    document.querySelectorAll(".project-image-frame").forEach((frame) => {
      frame.style.transformStyle = "preserve-3d";
      frame.style.perspective = "1000px";
      let rafId = null;

      frame.addEventListener("mousemove", (e) => {
        const r = frame.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width  - 0.5;
        const py = (e.clientY - r.top)  / r.height - 0.5;
        const rotY = px *  10;   // degrees
        const rotX = py * -10;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          frame.style.transform =
            `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
        });
      });
      frame.addEventListener("mouseleave", () => {
        if (rafId) cancelAnimationFrame(rafId);
        frame.style.transition = "transform 0.5s cubic-bezier(0.2, 0.6, 0.2, 1)";
        frame.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        setTimeout(() => { frame.style.transition = ""; }, 520);
      });
      frame.addEventListener("mouseenter", () => {
        frame.style.transition = "";
      });
    });
  }

  /* -------------------------------------------- hero mouse-tracking gradient */
  const hero = document.querySelector(".hero");
  if (hero && !prm && !coarse) {
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width)  * 100;
      const y = ((e.clientY - r.top)  / r.height) * 100;
      hero.style.setProperty("--mouse-x", x + "%");
      hero.style.setProperty("--mouse-y", y + "%");
    });
  }

  /* -------------------------------------------- magnetic project codes */
  // Big project numbers gain a subtle hover-shift
  if (!prm && !coarse) {
    document.querySelectorAll(".project-code-big, .break-num").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        el.style.transition = "transform 0.3s cubic-bezier(0.2, 0.6, 0.2, 1), letter-spacing 0.3s";
        el.style.transform = "translateY(-4px)";
        el.style.letterSpacing = "-0.06em";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translateY(0)";
        el.style.letterSpacing = "";
      });
    });
  }
})();
