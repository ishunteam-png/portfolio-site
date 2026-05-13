import { useEffect, useRef, useState, type ReactNode } from "react";

/* Scramble-text-on-hover.
 *
 * Wrap any short text node — on hover (or `trigger` change) the
 * characters scramble through a glyph set for ~0.25s before settling
 * back to the original. Non-alphanumeric chars stay fixed.
 *
 * Pure vanilla (no framer-motion needed). Respects reduced motion. */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#§/→";

interface Props {
  children: string | ReactNode;
  className?: string;
  durationMs?: number;   // how long the scramble lasts
  charDelayMs?: number;  // stagger per char as they "settle"
}

export function ScrambleText({
  children,
  className = "",
  durationMs = 320,
  charDelayMs = 18,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = typeof children === "string" ? children : String(children);
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function scramble() {
    if (reduce.current) return;
    cancelAnimationFrame(rafRef.current);
    const startTime = performance.now();
    const settledMask = new Array(target.length).fill(false);

    function tick(now: number) {
      const elapsed = now - startTime;
      const chars = target.split("").map((c, i) => {
        if (!/[A-Za-z0-9]/.test(c)) return c;     // keep punctuation/spaces
        if (settledMask[i]) return c;
        const settleAt = i * charDelayMs;
        if (elapsed >= settleAt + 50 * Math.random()) {
          settledMask[i] = true;
          return c;
        }
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });
      setDisplay(chars.join(""));
      if (elapsed < durationMs + target.length * charDelayMs) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={scramble}
      onFocus={scramble}
    >
      {display}
    </span>
  );
}
