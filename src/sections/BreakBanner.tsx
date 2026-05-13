import { motion } from "framer-motion";
import type { AccentName } from "../lib/motion";
import { accentText } from "../lib/motion";

interface Props {
  code: string;        // "01"
  title: string;       // "Haimcore"
  meta: string;        // small mono description
  accent: AccentName;
}

export function BreakBanner({ code, title, meta, accent }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="wrap pt-16 pb-8 grid grid-cols-[auto_1fr_auto] gap-7 items-baseline relative"
    >
      <span className={`section-code text-[clamp(40px,6.5vw,92px)] ${accentText[accent]}`}>
        §{code}
      </span>
      <h2 className="font-sans font-black tracking-brutal uppercase
                     text-[clamp(28px,5vw,68px)] leading-none">
        {title}
      </h2>
      <span className="font-mono text-[11px] text-ink-dim tracking-wide3 uppercase text-right hidden md:block">
        {meta}
      </span>
      <span
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            `linear-gradient(90deg, transparent, currentColor, transparent)`,
          opacity: 0.4,
          color: "var(--currentAccent, #9CFF4A)",
        }}
      />
    </motion.div>
  );
}
