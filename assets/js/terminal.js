/* terminal.js - animated terminal in the hero. Types out a few
   pretend commands. Plain JS, no deps. */

(function () {
  "use strict";

  const el = document.getElementById("terminal-body");
  if (!el) return;

  // Each step: command, optional output lines, optional delay before next.
  const SCRIPT = [
    {
      cmd: "whoami",
      out: [
        "ishu @ tbilisi : ai / automation engineer, geospatial, full-stack",
      ],
    },
    {
      cmd: "ls -la ~/work --recent",
      out: [
        "haimcore        next.js  +  anthropic sdk  +  postgres",
        "relief-guru     n8n (v4) -  7 workflows  -  telegram driven",
        "jalaram         hms  +  gpt-4o copilot  -  LIVE in prod",
        "satalite-delhi  sentinel-1 insar  -  2,555 PS  -  ITRF14",
        "satalite-kbeach sentinel-1 insar  -  152 PS  -  validation pilot",
      ],
    },
    {
      cmd: "cat status.txt",
      out: [
        "open for remote / freelance globally.",
        "comfortable with AI-assisted products, automation,",
        "full-stack TS / Python, and geospatial pipelines.",
      ],
    },
    {
      cmd: "echo 'lets build something'",
      out: ["lets build something"],
    },
  ];

  // Add a cursor at the end after everything plays.
  function span(cls, text) {
    return `<span class="${cls}">${text}</span>`;
  }

  function appendHTML(html) {
    el.insertAdjacentHTML("beforeend", html);
  }

  function setLastLine(html) {
    // Replace the last line if it ended with a cursor.
    const lines = el.innerHTML.split("\n");
    lines[lines.length - 1] = html;
    el.innerHTML = lines.join("\n");
  }

  function typeChars(text, cls, delayPerChar) {
    return new Promise((resolve) => {
      let i = 0;
      const tick = () => {
        if (i >= text.length) {
          resolve();
          return;
        }
        appendHTML(`<span class="${cls}">${text[i]}</span>`);
        i++;
        setTimeout(tick, delayPerChar);
      };
      tick();
    });
  }

  function newline() {
    appendHTML("\n");
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function playOnce() {
    el.innerHTML = "";
    for (const step of SCRIPT) {
      // prompt
      appendHTML(span("term-prompt", "&rarr; "));
      // typed command
      await typeChars(step.cmd, "term-out", 32);
      newline();
      await delay(160);
      for (const line of step.out || []) {
        appendHTML(span("term-arrow", "  - "));
        appendHTML(span("term-out", line));
        newline();
        await delay(120);
      }
      await delay(400);
    }
    // Final blinking cursor
    appendHTML(span("term-prompt", "&rarr; "));
    appendHTML('<span class="cursor"></span>');
  }

  // Start when the terminal scrolls into view (don't auto-play if user
  // hasn't seen the hero yet — but in practice the hero IS the top).
  let started = false;
  function start() {
    if (started) return;
    started = true;
    playOnce();
  }
  // small delay to make sure styles are applied first
  setTimeout(start, 300);
})();
