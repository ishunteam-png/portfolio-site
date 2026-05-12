/* filters.js - project category filtering chips */

(function () {
  "use strict";

  const chips = document.querySelectorAll(".filter-bar .chip");
  const cards = document.querySelectorAll(".project-grid .card");
  if (!chips.length || !cards.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      cards.forEach((card) => {
        const cat = card.dataset.category;
        const show = filter === "all" || cat === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
})();
