import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SCRIPT: Array<{ cmd: string; out: string[] }> = [
  {
    cmd: "whoami",
    out: ["ishu @ tbilisi : ai / automation engineer, geospatial, full-stack"],
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
      "comfortable with AI-assisted products,",
      "automation, full-stack TS / Python,",
      "and geospatial pipelines.",
    ],
  },
  {
    cmd: "echo 'lets build something'",
    out: ["lets build something"],
  },
];

export function Terminal() {
  const [lines, setLines] = useState<
    Array<{ type: "prompt" | "out"; text: string }>
  >([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function play() {
      const next: typeof lines = [];
      for (const step of SCRIPT) {
        // Type the prompt + command
        await new Promise((r) => setTimeout(r, 200));
        for (let i = 0; i <= step.cmd.length; i++) {
          if (cancelled) return;
          next.length && next.pop();
          next.push({ type: "prompt", text: step.cmd.slice(0, i) });
          setLines([...next]);
          await new Promise((r) => setTimeout(r, 28));
        }
        for (const o of step.out) {
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, 80));
          next.push({ type: "out", text: o });
          setLines([...next]);
        }
        await new Promise((r) => setTimeout(r, 280));
      }
      if (!cancelled) setDone(true);
    }
    play();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-bg-elev border border-rule-strong rounded-xl shadow-card overflow-hidden font-mono"
    >
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-bg/60 border-b border-rule">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[11px] text-ink-dim">
          ~/about-me  --  ishu@tbilisi
        </span>
      </div>
      <div className="px-5 py-5 text-[13px] leading-relaxed text-ink-mute min-h-[280px] whitespace-pre-wrap">
        {lines.map((l, i) =>
          l.type === "prompt" ? (
            <div key={i}>
              <span className="text-lime font-bold">→ </span>
              <span className="text-ink">{l.text}</span>
            </div>
          ) : (
            <div key={i}>
              <span className="text-coral">  - </span>
              <span className="text-ink">{l.text}</span>
            </div>
          )
        )}
        {done && (
          <div>
            <span className="text-lime font-bold">→ </span>
            <span className="inline-block w-2 h-[1em] bg-lime align-text-bottom animate-blink" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
