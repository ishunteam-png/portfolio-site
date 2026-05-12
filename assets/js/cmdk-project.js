/* cmdk-project.js - same as cmdk.js but with relative paths fixed up
   for use on project deep-dive pages (which live in /projects/). */

(function () {
  "use strict";

  const overlay   = document.getElementById("cmdk-overlay");
  const input     = document.getElementById("cmdk-input");
  const resultsEl = document.getElementById("cmdk-results");
  const trigger   = document.getElementById("cmdk-trigger");
  if (!overlay || !input || !resultsEl) return;

  const ACTIONS = [
    { code: "HOME", label: "Home", desc: "Back to portfolio",
      type: "url", target: "../index.html" },
    { code: "01",  label: "Haimcore", desc: "AI workspace",
      type: "url", target: "haimcore.html" },
    { code: "02",  label: "Relief Guru", desc: "n8n video pipeline",
      type: "url", target: "relief-guru.html" },
    { code: "03",  label: "Jalaram Hospital", desc: "Live HMS",
      type: "url", target: "jalaram.html" },
    { code: "04",  label: "SATALITE Delhi", desc: "Strict EGMS-L3 pilot",
      type: "url", target: "delhi.html" },
    { code: "05",  label: "SATALITE Kite Beach", desc: "L2-equivalent pilot",
      type: "url", target: "kite-beach.html" },
    { code: "MAIL", label: "Send an email",
      desc: "singhishu2060@gmail.com",
      type: "url", target: "mailto:singhishu2060@gmail.com" },
    { code: "CV", label: "Download CV (PDF)",
      desc: "Ishu_Singh_CV.pdf",
      type: "url", target: "../assets/pdf/Ishu_Singh_CV.pdf" },
    { code: "PORT", label: "Download Portfolio (PDF)",
      desc: "Ishu_Singh_Portfolio.pdf",
      type: "url", target: "../assets/pdf/Ishu_Singh_Portfolio.pdf" },
    { code: "GH", label: "GitHub",
      desc: "github.com/ishunteam-png",
      type: "url", target: "https://github.com/ishunteam-png" },
    { code: "LIVE",  label: "Jalaram Hospital (live)",
      desc: "shreejalaramhospital.live",
      type: "url", target: "https://shreejalaramhospital.live" },
    { code: "THEME", label: "Toggle theme", desc: "Dark / light",
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
      li.addEventListener("mouseenter", () => { cursor = i; render(); });
      li.addEventListener("click", () => act(a));
      resultsEl.appendChild(li);
    });
  }
  function filter(q) {
    const s = q.toLowerCase().trim();
    filtered = !s ? ACTIONS.slice()
      : ACTIONS.filter((a) =>
          a.label.toLowerCase().includes(s) ||
          a.desc.toLowerCase().includes(s) ||
          a.code.toLowerCase().includes(s));
    cursor = 0;
    render();
  }
  function open()  { overlay.hidden = false; input.value = ""; filter(""); setTimeout(() => input.focus(), 30); }
  function close() { overlay.hidden = true; }
  function act(a) {
    close();
    if (a.type === "url")  window.location.href = a.target;
    else if (a.type === "fn" && a.target === "theme") {
      const t = document.getElementById("theme-toggle");
      if (t) t.click();
    }
  }

  if (trigger) trigger.addEventListener("click", open);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  input.addEventListener("input", (e) => filter(e.target.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); cursor = Math.min(cursor + 1, filtered.length - 1); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); cursor = Math.max(cursor - 1, 0); render(); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[cursor]) act(filtered[cursor]); }
    else if (e.key === "Escape") { close(); }
  });
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (overlay.hidden) open(); else close();
    }
  });
})();
