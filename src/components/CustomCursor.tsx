import { useEffect, useRef, useState } from "react";
import { useCoarsePointer, usePrefersReducedMotion } from "../hooks/useMouse";

/* Custom cursor — vanilla refs + requestAnimationFrame for positioning.
 *
 * The earlier Framer Motion implementation kept misbehaving on real
 * browsers because of style.x/y vs. translateX percentage conflicts
 * and SSR-style initial-state quirks. This version is intentionally
 * boring: two divs, two refs, one rAF loop, direct DOM transforms.
 *
 * Centering uses translate3d(x, y, 0) translate(-50%, -50%) so the
 * element's centre lands on the cursor regardless of its size, and
 * we get GPU compositing for free. Size + opacity changes happen via
 * CSS transitions on react-controlled inline styles. */

export function CustomCursor() {
  const coarse = useCoarsePointer();
  const prm = usePrefersReducedMotion();
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  // Start visible — sit at the centre of the viewport so it's discoverable
  // even before the user wiggles the mouse. We toggle hidden only when the
  // pointer actually leaves the window.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (coarse) return;
    document.body.classList.add("has-custom-cursor");

    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const lerp = prm ? 1 : 0.22;  // 1 = no smoothing when reduced-motion is on

    const place = (el: HTMLDivElement | null, x: number, y: number) => {
      if (!el) return;
      el.style.transform =
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      place(dotRef.current, mx, my);
      setHidden(false);
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const interactive = (el: EventTarget | null) =>
      !!(el as Element | null)?.closest?.(
        "a, button, [role='button'], input, textarea, label, [data-magnetic]"
      );
    const onOver = (e: MouseEvent) => { if (interactive(e.target)) setHover(true); };
    const onOut  = (e: MouseEvent) => { if (interactive(e.target)) setHover(false); };

    // Spring-followed ring (or instant when reduced-motion)
    const tick = () => {
      rx += (mx - rx) * lerp;
      ry += (my - ry) * lerp;
      place(ringRef.current, rx, ry);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coarse, prm]);

  if (coarse) return null;

  // Make the cursor unmistakable: big bright ring + always-visible dot.
  // Dot stays even when hovering interactive things (just shrinks a bit)
  // so the user never loses track of it.
  const dotSize  = hover ? 8  : 12;
  const ringSize = hover ? 80 : 48;

  // Initial transform centres the cursor in the viewport so it is visible
  // before the first mousemove. After the first move the rAF loop and
  // onMove handler take over.
  const initialTransform =
    typeof window !== "undefined"
      ? `translate3d(${window.innerWidth / 2}px, ${window.innerHeight / 2}px, 0) translate(-50%, -50%)`
      : "translate3d(-200px, -200px, 0) translate(-50%, -50%)";

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          transform: initialTransform,
          width:  ringSize,
          height: ringSize,
          border: "2.5px solid #9CFF4A",
          boxShadow:
            "0 0 0 2px rgba(156,255,74,0.18)," +
            " 0 0 36px rgba(156,255,74,0.55)",
          opacity: hidden ? 0 : 1,
          background: hover ? "rgba(156,255,74,0.18)" : "rgba(156,255,74,0.06)",
          transition:
            "width 0.18s cubic-bezier(0.2,0.6,0.2,1)," +
            " height 0.18s cubic-bezier(0.2,0.6,0.2,1)," +
            " opacity 0.15s, background 0.15s",
          willChange: "transform",
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          transform: initialTransform,
          width:  dotSize,
          height: dotSize,
          background: "#9CFF4A",
          boxShadow: "0 0 18px #9CFF4A, 0 0 4px #fff",
          opacity: hidden ? 0 : 1,
          transition: "width 0.12s, height 0.12s, opacity 0.12s",
          willChange: "transform",
        }}
      />
    </>
  );
}
