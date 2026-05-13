import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCoarsePointer, usePrefersReducedMotion } from "../hooks/useMouse";

export function CustomCursor() {
  const coarse = useCoarsePointer();
  const prm = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ringX = useSpring(x, { stiffness: 320, damping: 28 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28 });

  useEffect(() => {
    if (coarse) return;
    document.body.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const isInteractive = (el: EventTarget | null) =>
      !!(el as Element | null)?.closest?.(
        "a, button, [role='button'], input, textarea, label, [data-magnetic]"
      );
    const onOver  = (e: MouseEvent) => isInteractive(e.target) && setHover(true);
    const onOut   = (e: MouseEvent) => isInteractive(e.target) && setHover(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
    };
  }, [coarse, x, y]);

  if (coarse || prm) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x, y,
          translateX: "-50%", translateY: "-50%",
        }}
        animate={{
          opacity: hidden ? 0 : 1,
          width:   hover ? 0 : 6,
          height:  hover ? 0 : 6,
          background: "#9CFF4A",
          boxShadow: "0 0 12px #9CFF4A",
          borderRadius: "50%",
        }}
        transition={{ width: { duration: 0.15 }, height: { duration: 0.15 } }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full border"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
        }}
        animate={{
          opacity: hidden ? 0 : (hover ? 1 : 0.7),
          width:  hover ? 54 : 36,
          height: hover ? 54 : 36,
          borderColor:    "#9CFF4A",
          backgroundColor: hover ? "rgba(156,255,74,0.10)" : "rgba(156,255,74,0)",
        }}
        transition={{ width: { duration: 0.2 }, height: { duration: 0.2 } }}
      />
    </>
  );
}
