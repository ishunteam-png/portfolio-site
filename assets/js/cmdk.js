/* cmdk.js - Cmd/Ctrl-K command palette.
 *
 * Everything on the portfolio is on one page now, so the palette
 * jumps to in-page anchors. No more stale entries to sub-pages.
 */
(function () {
  "use strict";

  const overlay   = document.getElementById("cmdk-overlay");
  const input     = document.getElementById("cmdk-input");
  const resultsEl = document.getElementById("cmdk-results");
  const trigger   = document.getElementById("cmdk-trigger");
  if (!overlay || !input || !resultsEl) return;

  const ACTIONS = [
    { code: "TOP",  label: "Top of page",
      desc: "Back to hero",
      type: "anchor", target: "#top" },

    { code: "01",   label: "Haimcore",
      desc: "Next.js AI workspace with Amirani",
      type: "anchor", target: "#proj-01" },
    { code: "02",   label: "Relief Guru",
      desc: "Telegram-driven n8n video pipeline",
      type: "anchor", target: "#proj-02" },
    { code: "03",   label: "Jalaram Hospital",
      desc: "Live AI hospital management system",
      type: "anchor", target: "#proj-03" },
    { code: "04",   label: "SATALITE Delhi",
      desc: "Strict EGMS-L3 InSAR pilot + map",
      type: "anchor", target: "#proj-04" },
    { code: "05",   label: "SATALITE Kite Beach",
      desc: "L2-equivalent Sentinel-1 pilot",
      type: "anchor", target: "#proj-05" },

    { code: "MAP",  label: "Interactive PS map",
      desc: "2,656 Persistent Scatterers, Delhi",
      type: "anchor", target: "#ps-map-inline" },
    { code: "ARCH", label: "Relief Guru architecture",
      desc: "7-workflow n8n diagram",
      type: "anchor", target: "#arch" },

    { code: "HOW",  label: "How I work",
      desc: "Five principles",
      type: "anchor", target: "#how" },
    { code: "FORM", label: "Open contact form",
      desc: "Send a quick note",
      type: "anchor", target: "#contact" },
    { code: "MAIL", label: "Send an email",
      desc: "singhishu2060@gmail.com",
      type: "url",    target: "mailto:singhishu2060@gmail.com" },

    { code: "CV",   label: "Download CV (PDF)",
      desc: "Ishu_Singh_CV.pdf",
      type: "url",    target: "assets/pdf/Ishu_Singh_CV.pdf" },
    { code: "PORT", label: "Download Portfolio (PDF)",
      desc: "Ishu_Singh_Portfolio.pdf, 28 pages",
      type: "url",    target: "assets/pdf/Ishu_Singh_Portfolio.pdf" },
    { code: "MINI", label: "Download Mini-CV (2 pages)",
      desc: "Ishu_Singh_CV_Mini.pdf",
      type: "url",    target: "assets/pdf/Ishu_Singh_CV_Mini.pdf" },

    { code: "GH",   label: "GitHub",
      desc: "github.com/ishunteam-png",
      type: "url",    target: "https://github.com/ishunteam-png" },
    { code: "LIVE", label: "Jalaram Hospital (live)",
      desc: "shreejalaramhospital.live",
      type: "url",    target: "https://shreejalaramhospital.live" },
    { code: "REPO", label: "This portfolio source",
      desc: "github.com/ishunteam-png/portfolio-site",
      type: "url",    target: "https://github.com/ishunteam-png/portfolio-site" },

    { code: "THEME", label: "Toggle theme",
      desc: "Dark / light",
      type: "fn",     target: "theme" },
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
      li.addEventListener("mouseenter", () => { cursor = i; render(); });
      li.addEventListener("click", () => act(a));
      resultsEl.appendChild(li);
    });
  }

  function filter(q) {
    const s = q.toLowerCase().trim();
    filtered = !s
      ? ACTIONS.slice()
      : ACTIONS.filter((a) =>
          a.label.toLowerCase().includes(s) ||
          a.desc.toLowerCase().includes(s) ||
          a.code.toLowerCase().includes(s));
    cursor = 0;
    render();
  }

  function open()  {
    overlay.hidden = false;
    input.value = "";
    filter("");
    setTimeout(() => input.focus(), 30);
  }
  function close() { overlay.hidden = true; }

  function act(a) {
    close();
    if (a.type === "anchor") {
      const el = document.querySelector(a.target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (a.type === "url") {
      window.location.href = a.target;
    } else if (a.type === "fn" && a.target === "theme") {
      const t = document.getElementById("theme-toggle");
      if (t) t.click();
    }
  }

  if (trigger) trigger.addEventListener("click", open);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
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
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (overlay.hidden) open(); else close();
    } else if (e.key === "/" && document.activeElement === document.body) {
      e.preventDefault();
      open();
    }
  });
})();
