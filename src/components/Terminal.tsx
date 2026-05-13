import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Line =
  | { kind: "prompt"; cmd: string }
  | { kind: "ok";     label: string;  text: string;  hl?: string }
  | { kind: "blank" }
  | { kind: "tail";   text: string };

const SCRIPT: Line[] = [
  { kind: "prompt", cmd: "boot --portfolio" },
  { kind: "blank" },
  { kind: "ok", label: "ai products",   text: "haimcore · relief-guru",     hl: "shipped" },
  { kind: "ok", label: "healthcare",    text: "jalaram",                    hl: "LIVE" },
  { kind: "ok", label: "geospatial",    text: "satalite × 2",               hl: "delivered" },
  { kind: "ok", label: "totals",        text: "5 projects · 2,555 PS · 7 workflows" },
  { kind: "ok", label: "status",        text: "open for hire · remote · global",   hl: "available" },
  { kind: "blank" },
  { kind: "tail", text: "press ⌘K anywhere to navigate" },
];

// Highlight color per status hl token
const hlColor = (s?: string) => {
  if (!s) return "";
  if (s === "LIVE")       return "text-mint";
  if (s === "available")  return "text-mint";
  if (s === "shipped")    return "text-coral";
  if (s === "delivered")  return "text-violet";
  return "text-lime";
};

export function Terminal() {
  const [shown, setShown] = useState<Line[]>([]);
  const [typed, setTyped] = useState(""); // partial-typing for the prompt
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const out: Line[] = [];

    async function sleep(ms: number) {
      await new Promise((r) => setTimeout(r, ms));
    }

    async function run() {
      for (const step of SCRIPT) {
        if (cancelled) return;
        if (step.kind === "prompt") {
          out.push(step);
          // type the command char-by-char (no popping of prior lines)
          for (let i = 1; i <= step.cmd.length; i++) {
            if (cancelled) return;
            setTyped(step.cmd.slice(0, i));
            setShown([...out]);
            await sleep(28);
          }
          await sleep(380);
        } else {
          out.push(step);
          setShown([...out]);
          await sleep(step.kind === "blank" ? 80 : 110);
        }
      }
      if (!cancelled) setDone(true);
    }
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="bg-bg-elev border border-rule-strong rounded-xl shadow-card overflow-hidden font-mono"
    >
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-bg/60 border-b border-rule">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[11px] text-ink-dim">~ ishu@tbilisi : ~/portfolio</span>
      </div>

      <div className="px-5 py-5 text-[13px] leading-[1.65] text-ink-mute min-h-[300px]">
        {shown.map((line, i) => {
          const isLast = i === shown.length - 1;

          if (line.kind === "prompt") {
            return (
              <div key={i}>
                <span className="text-lime font-bold">→ </span>
                <span className="text-ink">{isLast && !done ? typed : line.cmd}</span>
                {isLast && !done && <BlinkCaret />}
              </div>
            );
          }
          if (line.kind === "blank") {
            return <div key={i} className="h-2" />;
          }
          if (line.kind === "ok") {
            return (
              <div key={i} className="flex flex-wrap gap-x-3 items-baseline">
                <span className="text-mint">[ OK ]</span>
                <span className="text-ink-dim w-[100px] shrink-0">{line.label}</span>
                <span className="text-ink">{line.text}</span>
                {line.hl && (
                  <span
                    className={`uppercase tracking-wide3 font-bold ${hlColor(line.hl)}`}
                  >
                    · {line.hl}
                  </span>
                )}
              </div>
            );
          }
          // tail
          return (
            <div key={i} className="mt-2 text-ink-dim text-[12px] italic">
              {line.text}
            </div>
          );
        })}
        {done && (
          <div>
            <span className="text-lime font-bold">→ </span>
            <BlinkCaret />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BlinkCaret() {
  return (
    <span className="inline-block w-2 h-[1em] bg-lime align-text-bottom animate-blink ml-0.5" />
  );
}
