import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCoarsePointer, usePrefersReducedMotion } from "../hooks/useMouse";

/* Custom cursor.
 *
 * Outer motion.div is positioned at the cursor (x, y) — no centering
 * applied. Inner element is offset by -50% of its own size via a
 * negative-x/y animate target so it visually centers on the cursor.
 * Avoids the xPercent/yPercent TypeScript-Motion mismatch entirely. */

export function CustomCursor() {
  const coarse = useCoarsePointer();
  const prm = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(true);

  // Dot — instant tracking, no spring (so it doesn't lag the user)
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Ring — spring-followed, lags slightly for that pulled-along feel
  const ringX = useSpring(x, { stiffness: 280, damping: 26, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 280, damping: 26, mass: 0.35 });

  useEffect(() => {
    if (coarse) return;
    document.body.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (hidden) setHidden(false);
    };
    const onLeaveWin = () => setHidden(true);
    const onEnterWin = () => setHidden(false);

    const interactive = (el: EventTarget | null) =>
      !!(el as Element | null)?.closest?.(
        "a, button, [role='button'], input, textarea, label, [data-magnetic]"
      );
    const onOver = (e: MouseEvent) => { if (interactive(e.target)) setHover(true); };
    const onOut  = (e: MouseEvent) => { if (interactive(e.target)) setHover(false); };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeaveWin);
    window.addEventListener("mouseenter", onEnterWin);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeaveWin);
      window.removeEventListener("mouseenter", onEnterWin);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coarse]);

  if (coarse || prm) return null;

  const ringSize = hover ? 56 : 32;
  const dotSize  = hover ? 0  : 6;

  return (
    <>
      {/* Ring — outer anchor at cursor pos, inner ring offset by -half-size */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            x: -ringSize / 2,
            y: -ringSize / 2,
            width:  ringSize,
            height: ringSize,
            opacity: hidden ? 0 : 1,
            backgroundColor: hover ? "rgba(156,255,74,0.12)" : "rgba(156,255,74,0)",
          }}
          transition={{
            width:   { duration: 0.18 },
            height:  { duration: 0.18 },
            x:       { duration: 0.18 },
            y:       { duration: 0.18 },
            opacity: { duration: 0.15 },
          }}
          style={{
            border: "1.5px solid #9CFF4A",
            boxShadow: "0 0 24px rgba(156,255,74,0.35)",
          }}
        />
      </motion.div>

      {/* Dot — outer anchor at cursor pos, inner dot offset by -half-size */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x, y }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            x: -dotSize / 2,
            y: -dotSize / 2,
            width:  dotSize,
            height: dotSize,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ duration: 0.12 }}
          style={{
            background: "#9CFF4A",
            boxShadow: "0 0 12px #9CFF4A",
          }}
        />
      </motion.div>
    </>
  );
}
