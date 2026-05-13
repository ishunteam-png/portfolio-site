import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { useCoarsePointer, usePrefersReducedMotion } from "../hooks/useMouse";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
  download?: boolean;
  strength?: number;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  target,
  rel,
  download,
  strength = 0.22,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const coarse = useCoarsePointer();
  const prm = usePrefersReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (coarse || prm || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const motionProps = {
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
    onMouseMove: onMove,
    onMouseLeave: reset,
    "data-magnetic": "true" as const,
    className,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        download={download}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
