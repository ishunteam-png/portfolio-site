import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { ScrambleText } from "./ScrambleText";

interface Props {
  onCmdKOpen: () => void;
}

export function Nav({ onCmdKOpen }: Props) {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.nav
      className="sticky top-0 z-50 flex items-center justify-between px-[4%] py-3.5
                 bg-bg/85 backdrop-blur-xl"
      style={{
        borderBottom: "1px solid",
      }}
    >
      <motion.div
        className="absolute left-0 right-0 bottom-0 h-px bg-rule pointer-events-none"
        style={{ opacity: borderOpacity }}
      />

      <a href="#top" className="inline-flex items-center gap-2.5 text-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-lime"
              style={{ boxShadow: "0 0 0 4px rgba(156,255,74,0.18)" }} />
        <span className="font-mono font-bold tracking-tight2">ishu@tbilisi</span>
        <span className="font-mono text-[11.5px] text-ink-dim">~/portfolio</span>
      </a>

      <div className="hidden md:flex gap-6 font-mono text-[13px] text-ink-mute">
        {["01", "02", "03", "04", "05"].map((c) => (
          <a
            key={c}
            href={`#proj-${c}`}
            className="hover:text-lime transition-colors relative group"
          >
            <ScrambleText>{"§" + c}</ScrambleText>
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-lime
                             scale-x-0 group-hover:scale-x-100 origin-left
                             transition-transform" />
          </a>
        ))}
        <a href="#how" className="hover:text-lime transition-colors">
          <ScrambleText>how</ScrambleText>
        </a>
        <a href="#contact" className="hover:text-lime transition-colors">
          <ScrambleText>contact</ScrambleText>
        </a>
      </div>

      <div className="flex items-center gap-2">
        <MagneticButton
          onClick={onCmdKOpen}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded
                     bg-bg-card border border-rule-strong text-ink-mute
                     text-[11.5px] font-mono hover:border-lime hover:text-ink
                     transition-colors"
          strength={0.18}
        >
          <span className="px-1.5 py-px bg-bg border border-rule-strong rounded text-[10px]">⌘</span>
          <span className="px-1.5 py-px bg-bg border border-rule-strong rounded text-[10px]">K</span>
        </MagneticButton>
      </div>
    </motion.nav>
  );
}
