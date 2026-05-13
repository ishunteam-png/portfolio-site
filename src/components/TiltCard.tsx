import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useCoarsePointer, usePrefersReducedMotion } from "../hooks/useMouse";

interface Props {
  children: ReactNode;
  className?: string;
  max?: number;       // max degrees of tilt
}

export function TiltCard({ children, className = "", max = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const prm = usePrefersReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 250, damping: 20 });
  const springRy = useSpring(ry, { stiffness: 250, damping: 20 });
  const rotX = useTransform(springRx, [-0.5, 0.5], [max, -max]);
  const rotY = useTransform(springRy, [-0.5, 0.5], [-max, max]);

  const onMove = (e: React.MouseEvent) => {
    if (coarse || prm || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    rx.set(py);
    ry.set(px);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
