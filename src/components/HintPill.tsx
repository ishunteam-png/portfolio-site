import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/* A small floating hint pill that fades in 1.5s after page load
 * and tells the user what's interactive. Auto-hides after 6s, or
 * when they actually use the keyboard / press ⌘K. */

export function HintPill() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showT = setTimeout(() => setShow(true), 1200);
    const hideT = setTimeout(() => setShow(false), 9500);

    function dismiss() { setShow(false); }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") dismiss();
    }
    // Only dismiss on a real scroll AFTER the pill is shown — not on
    // initial paint scroll-restoration.
    let scrollArmed = false;
    const armT = setTimeout(() => { scrollArmed = true; }, 1800);
    function onScroll() {
      if (scrollArmed) dismiss();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
      clearTimeout(armT);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18, transition: { duration: 0.25 } }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]
                     px-4 py-2.5 rounded-full
                     bg-bg-card/90 backdrop-blur-md border border-rule-strong
                     font-mono text-[12px] text-ink-mute
                     flex items-center gap-3 shadow-card"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-lime opacity-50 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          <span>cursor is alive · hover anything</span>
          <span className="text-ink-dim">·</span>
          <span>press</span>
          <kbd className="px-1.5 py-px bg-bg border border-rule-strong rounded text-[10.5px] text-ink">⌘K</kbd>
          <span className="text-ink-dim">to jump</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
