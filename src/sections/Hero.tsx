import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Terminal } from "../components/Terminal";
import { MagneticButton } from "../components/MagneticButton";
import { useCoarsePointer } from "../hooks/useMouse";
import { withBase } from "../lib/asset";

export function Hero() {
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const coarse = useCoarsePointer();

  // Mouse-tracked gradient mask position
  const bg = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(ellipse 55% 40% at ${x}% ${y}%, rgba(156,255,74,0.18), transparent 65%),` +
      `radial-gradient(ellipse 45% 35% at 85% 60%, rgba(195,157,255,0.12), transparent 70%),` +
      `radial-gradient(ellipse 35% 25% at 15% 25%, rgba(124,230,255,0.10), transparent 75%)`
  );

  useEffect(() => {
    if (coarse) return;
    const onMove = (e: MouseEvent) => {
      const h = document.querySelector(".hero-root") as HTMLElement | null;
      if (!h) return;
      const r = h.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width)  * 100);
      my.set(((e.clientY - r.top)  / r.height) * 100);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [coarse, mx, my]);

  return (
    <header id="top" className="hero-root relative overflow-hidden">
      {/* Mouse-tracked gradient mesh */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: bg }}
      />
      {/* Crosshatch grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-[0.32]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,240,235,0.06) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(240,240,235,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 25% 30%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 25% 30%, black 0%, transparent 70%)",
        }}
      />

      <div className="wrap grid md:grid-cols-[1.05fr_0.95fr] gap-14 items-center
                       pt-24 pb-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full
                       bg-[rgba(91,255,182,0.10)] border border-[rgba(91,255,182,0.35)]
                       text-mint text-[11.5px] font-mono font-bold tracking-wide2 mb-6"
          >
            <span className="relative w-2 h-2 rounded-full bg-mint">
              <span className="absolute inset-[-3px] rounded-full bg-mint opacity-50 animate-ping" />
            </span>
            <span>OPEN FOR REMOTE FREELANCE</span>
            <span className="text-ink-mute">· TBILISI, GE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-sans font-black tracking-brutal leading-[0.92]
                       text-[clamp(48px,7.8vw,104px)] mb-3"
            style={{
              background: "linear-gradient(135deg, #f0f0eb 0%, #9CFF4A 30%, #C39DFF 60%, #f0f0eb 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              animation: "drift 9s ease-in-out infinite",
            }}
          >
            Ishu Singh
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-mono text-[15px] text-ink-mute mb-6 flex flex-wrap gap-2"
          >
            <span className="text-lime font-bold">AI / Automation Engineer</span>
            <span className="text-ink-dim">·</span>
            <span>InSAR &amp; Geospatial</span>
            <span className="text-ink-dim">·</span>
            <span>Full-Stack</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[16px] leading-relaxed text-ink-mute mb-7 max-w-[520px]"
          >
            I build AI-assisted software and the plumbing around it —
            production web apps, Telegram-driven workflow automations,
            healthcare platforms, and Sentinel-1 InSAR pipelines. Recently
            picked up SAR processing from scratch and delivered a strict
            EGMS-L3 equivalent road-subsidence pilot on a 3-year stack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-2.5"
          >
            <MagneticButton
              href="#proj-01"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg
                         bg-lime text-bg font-mono font-bold text-[13.5px]
                         hover:shadow-glow-lime transition-shadow"
            >
              See the work →
            </MagneticButton>
            <MagneticButton
              href={withBase("/pdf/Ishu_Singh_CV.pdf")}
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg
                         border border-rule-strong text-ink font-mono text-[13.5px]
                         hover:border-lime hover:text-lime transition-colors"
            >
              Download CV
            </MagneticButton>
            <MagneticButton
              href={withBase("/pdf/Ishu_Singh_Portfolio.pdf")}
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg
                         border border-rule-strong text-ink font-mono text-[13.5px]
                         hover:border-lime hover:text-lime transition-colors"
            >
              Portfolio PDF
            </MagneticButton>
          </motion.div>
        </div>

        <Terminal />
      </div>
    </header>
  );
}
