/* cmdk.js - Cmd/Ctrl-K command palette. Plain JS, no deps. */

(function () {
  "use strict";

  const overlay   = document.getElementById("cmdk-overlay");
  const input     = document.getElementById("cmdk-input");
  const resultsEl = document.getElementById("cmdk-results");
  const trigger   = document.getElementById("cmdk-trigger");
  if (!overlay || !input || !resultsEl) return;

  // Static list of jump targets (extend with project pages by data attribute
  // if you ever move to multi-page).
  const ACTIONS = [
    { code: "TOP", label: "Top of page", desc: "Back to hero",
      type: "anchor", target: "#top" },
    { code: "01",  label: "Haimcore",
      desc: "Next.js AI workspace with Amirani",
      type: "page", target: "projects/haimcore.html" },
    { code: "02",  label: "Relief Guru",
      desc: "Telegram-driven AI video pipeline",
      type: "page", target: "projects/relief-guru.html" },
    { code: "03",  label: "Jalaram Hospital",
      desc: "AI hospital management system",
      type: "page", target: "projects/jalaram.html" },
    { code: "04",  label: "SATALITE Delhi",
      desc: "Strict EGMS-L3 InSAR pilot",
      type: "page", target: "projects/delhi.html" },
    { code: "05",  label: "SATALITE Kite Beach",
      desc: "L2-equivalent InSAR pilot",
      type: "page", target: "projects/kite-beach.html" },
    { code: "WORK",  label: "Selected work",
      desc: "Project grid",
      type: "anchor", target: "#work" },
    { code: "STORY", label: "Who I am",
      desc: "Story + how I work",
      type: "anchor", target: "#story" },
    { code: "TECH",  label: "Tech I lean on",
      desc: "Skills grid",
      type: "anchor", target: "#tech" },
    { code: "MAIL",  label: "Send an email",
      desc: "singhishu2060@gmail.com",
      type: "url", target: "mailto:singhishu2060@gmail.com" },
    { code: "CV",    label: "Download CV (PDF)",
      desc: "Ishu_Singh_CV.pdf",
      type: "url", target: "assets/pdf/Ishu_Singh_CV.pdf" },
    { code: "PORT",  label: "Download Portfolio (PDF)",
      desc: "Ishu_Singh_Portfolio.pdf",
      type: "url", target: "assets/pdf/Ishu_Singh_Portfolio.pdf" },
    { code: "MINI",  label: "Download Mini-CV (2 pages)",
      desc: "Ishu_Singh_CV_Mini.pdf",
      type: "url", target: "assets/pdf/Ishu_Singh_CV_Mini.pdf" },
    { code: "GH",    label: "GitHub",
      desc: "github.com/ishunteam-png",
      type: "url", target: "https://github.com/ishunteam-png" },
    { code: "LIVE",  label: "Jalaram Hospital (live)",
      desc: "shreejalaramhospital.live",
      type: "url", target: "https://shreejalaramhospital.live" },
    { code: "THEME", label: "Toggle theme",
      desc: "Dark / light",
      type: "fn",  target: "theme" },
  ];

  let cursor = 0;
  let filtered = ACTIONS.slice();

  function render() {
    resultsEl.innerHTML = "";
    filtered.forEach((a, i) => {
      const li = document.createElement("li");
      if (i === cursor) li.classList.add("active");
      li.innerHTML =
        '<span class="cmdk-code">' + a.code + '</span>' +
        '<span class="cmdk-label">' + a.label + '</span>' +
        '<span class="cmdk-desc">' + a.desc + '</span>';
      li.addEventListener("mouseenter", () => {
        cursor = i;
        render();
      });
      li.addEventListener("click", () => act(a));
      resultsEl.appendChild(li);
    });
  }

  function filter(q) {
    const s = q.toLowerCase().trim();
    if (!s) {
      filtered = ACTIONS.slice();
    } else {
      filtered = ACTIONS.filter(
        (a) =>
          a.label.toLowerCase().includes(s) ||
          a.desc.toLowerCase().includes(s) ||
          a.code.toLowerCase().includes(s)
      );
    }
    cursor = 0;
    render();
  }

  function open() {
    overlay.hidden = false;
    input.value = "";
    filter("");
    setTimeout(() => input.focus(), 30);
  }

  function close() {
    overlay.hidden = true;
  }

  function act(a) {
    close();
    if (a.type === "anchor") {
      const el = document.querySelector(a.target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (a.type === "page" || a.type === "url") {
      window.location.href = a.target;
    } else if (a.type === "fn" && a.target === "theme") {
      const t = document.getElementById("theme-toggle");
      if (t) t.click();
    }
  }

  // Trigger button
  if (trigger) trigger.addEventListener("click", open);

  // Click outside to close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  // Input
  input.addEventListener("input", (e) => filter(e.target.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      cursor = Math.min(cursor + 1, filtered.length - 1);
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      cursor = Math.max(cursor - 1, 0);
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[cursor]) act(filtered[cursor]);
    } else if (e.key === "Escape") {
      close();
    }
  });

  // Global Cmd/Ctrl + K
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (overlay.hidden) open();
      else close();
    } else if (e.key === "/" && document.activeElement === document.body) {
      e.preventDefault();
      open();
    }
  });
})();
