/* main.js - theme toggle, nav scroll behaviour, initial setup */

(function () {
  "use strict";

  /* -------- theme: persist in localStorage, default to dark -------- */
  const root = document.documentElement;
  const KEY  = "ishu-theme";
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  }

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem(KEY, next);
    });
  }

  /* -------- accent border on the nav when scrolled past hero -------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 80) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
