import { motion } from "framer-motion";
import { TiltCard } from "../components/TiltCard";
import { MagneticButton } from "../components/MagneticButton";
import { BreakBanner } from "./BreakBanner";
import {
  accentBorder, accentText, accentBg, accentHex,
  fadeUp, stagger,
} from "../lib/motion";
import type { Project } from "../data/projects";
import { ArchSvg } from "./ArchSvg";
import { PsMap } from "./PsMap";

interface Props {
  project: Project;
  flipped?: boolean;
  meta?: string;     // small banner meta line
}

const statusStyles: Record<Project["status"], string> = {
  live:       "text-mint bg-[rgba(91,255,182,0.10)] border-[rgba(91,255,182,0.4)]",
  shipped:    "text-coral bg-[rgba(255,148,102,0.10)] border-[rgba(255,148,102,0.4)]",
  delivered:  "text-violet bg-[rgba(195,157,255,0.10)] border-[rgba(195,157,255,0.4)]",
  validated:  "text-ink-mute bg-bg-card border-rule-strong",
};

export function ProjectSection({ project: p, flipped = false, meta = "" }: Props) {
  const ac = accentHex[p.accent];

  return (
    <section
      id={p.id}
      data-accent={p.accent}
      className="relative py-20 md:py-28"
      style={{ "--currentAccent": ac } as React.CSSProperties}
    >
      <BreakBanner code={p.code} title={p.title} meta={meta} accent={p.accent} />

      {/* Per-project gradient mesh */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: flipped
            ? `radial-gradient(ellipse 50% 70% at 10% 50%, ${ac}14, transparent 70%)`
            : `radial-gradient(ellipse 50% 70% at 90% 50%, ${ac}14, transparent 70%)`,
          opacity: 0.7,
        }}
      />

      <div className={`wrap grid lg:grid-cols-2 gap-14 ${flipped ? "lg:[&>aside]:order-2" : ""}`}>
        {/* Meta column */}
        <aside className="space-y-7">
          {/* Code + tag/status */}
          <motion.div variants={stagger} initial="hidden" whileInView="show"
                       viewport={{ once: true, margin: "-80px" }}>
            <motion.div variants={fadeUp} className="flex items-baseline gap-4 mb-4">
              <span className={`section-code text-[64px] ${accentText[p.accent]}`}>
                {p.code}
              </span>
              <span className="font-mono text-[13px] text-ink-dim">
                / 05 &nbsp; {p.tag}
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`pill ${accentText[p.accent]} ${accentBorder[p.accent]} bg-bg-card/40`}>
                {p.tag.toUpperCase()}
              </span>
              <span className={`pill ${statusStyles[p.status]}`}>
                {p.status === "live" && (
                  <span className="relative w-1.5 h-1.5 rounded-full bg-mint">
                    <span className="absolute inset-[-3px] rounded-full bg-mint opacity-50 animate-ping" />
                  </span>
                )}
                {p.statusLabel}
              </span>
            </motion.div>

            <motion.h2 variants={fadeUp}
              className="font-sans font-black tracking-brutal text-[clamp(34px,4.5vw,56px)]
                         leading-[1.05] mb-2">
              {p.title}
            </motion.h2>
            <motion.p variants={fadeUp}
              className={`font-mono text-[17px] font-bold mb-1 ${accentText[p.accent]}`}>
              {p.subtitle}
            </motion.p>
            <motion.p variants={fadeUp}
              className="font-mono text-[12.5px] text-ink-dim tracking-wide2 mb-5">
              {p.period} · {p.role}
            </motion.p>
            <motion.p variants={fadeUp}
              className="text-[15.5px] leading-[1.65] text-ink-mute max-w-[540px]">
              {p.elevator}
            </motion.p>
          </motion.div>

          {/* Highlights */}
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-3"
          >
            {p.highlights.map((h, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="grid grid-cols-[24px_1fr] gap-3 text-[14.5px] leading-[1.6] text-ink"
              >
                <span className={`${accentText[p.accent]} font-mono font-bold pt-[1px]`}>→</span>
                <span dangerouslySetInnerHTML={{ __html: h }}
                      className="[&_code]:ink-code [&_b]:text-ink" />
              </motion.li>
            ))}
          </motion.ul>

          {/* Stack manifest */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="relative pl-5 py-5 pr-5 bg-bg-card border border-rule rounded-xl"
          >
            <span className="absolute left-0 top-5 bottom-5 w-[2px]"
                  style={{ background: ac, borderRadius: 2 }} />
            <h3 className={`font-mono text-[11px] font-bold uppercase tracking-wide3
                            ${accentText[p.accent]} mb-3.5`}>
              Stack — what each piece does
            </h3>
            <dl className="space-y-2.5">
              {p.stack.map((row) => (
                <div key={row.name}
                     className="grid grid-cols-[minmax(140px,0.4fr)_1fr] gap-3.5 items-start">
                  <dt className="font-mono text-[12px] font-bold text-ink">{row.name}</dt>
                  <dd className="text-[12.5px] leading-[1.55] text-ink-mute">{row.note}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="flex flex-wrap gap-2.5"
          >
            {p.liveUrl && (
              <MagneticButton
                href={p.liveUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                           font-mono font-bold text-[13px]"
                strength={0.18}
              >
                <span
                  className={`${accentBg[p.accent]} text-bg px-4 py-2.5 rounded-lg
                              inline-flex items-center gap-2 transition-shadow`}
                  style={{ boxShadow: `0 0 0 0 ${ac}00` }}
                >
                  {p.liveLabel ?? "Live ↗"}
                </span>
              </MagneticButton>
            )}
            {p.hasMap && (
              <MagneticButton
                href={`#${p.id}-map`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                           border border-rule-strong font-mono text-[13px]
                           hover:border-lime hover:text-lime transition-colors"
                strength={0.18}
              >
                Interactive PS map ↓
              </MagneticButton>
            )}
            <MagneticButton
              href="/pdf/Ishu_Singh_Portfolio.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                         border border-rule-strong font-mono text-[13px]
                         hover:border-lime hover:text-lime transition-colors"
              strength={0.18}
            >
              Methodology PDF
            </MagneticButton>
          </motion.div>
        </aside>

        {/* Visual column */}
        <div className="space-y-4">
          <TiltCard className="relative bg-bg-card border border-rule rounded-xl overflow-hidden"
                    max={6}>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `0 0 0 1px ${ac}55, 0 0 80px ${ac}33, 0 28px 60px rgba(0,0,0,0.5)`,
                borderRadius: "inherit",
              }}
            />
            <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded
                              bg-bg/80 backdrop-blur-sm border border-rule-strong
                              font-mono text-[10.5px] ${accentText[p.accent]}`}>
              {p.heroImage.split("/").pop()}
            </span>
            {p.status === "live" && (
              <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded
                               bg-[rgba(91,255,182,0.2)] border border-[rgba(91,255,182,0.5)]
                               font-mono text-[10.5px] text-mint font-bold inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                LIVE
              </span>
            )}
            <img
              src={p.heroImage}
              alt={`${p.title} hero visual`}
              className="w-full block"
              loading="lazy"
            />
          </TiltCard>

          {/* Mini-metrics */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-3 gap-2.5"
          >
            {p.metrics.map((m) => (
              <motion.div key={m.label} variants={fadeUp}
                className="px-3.5 py-4 bg-bg-card border border-rule rounded-lg text-center
                           relative overflow-hidden hover:border-rule-strong transition-colors
                           backdrop-blur-sm">
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                       background: `radial-gradient(circle at 30% 0%, ${ac}22, transparent 60%)`,
                     }} />
                <span className="block font-mono font-bold text-[20px] tracking-tight2 mb-1"
                      style={{
                        background: `linear-gradient(135deg, #f0f0eb 0%, ${ac} 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}>
                  {m.num}
                </span>
                <span className="block font-mono text-[10px] text-ink-mute uppercase tracking-wide2 font-bold">
                  {m.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Supplemental images */}
          {p.supplementalImages && p.supplementalImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5">
              {p.supplementalImages.map((src) => (
                <motion.img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className="w-full bg-bg-card border border-rule rounded-lg
                             hover:border-rule-strong"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deep dive — two columns of long-form prose */}
      <div className="wrap mt-16 pt-14 border-t border-rule grid lg:grid-cols-2 gap-14">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <span className={`deco-marker ${accentText[p.accent]}`}>
            FILE / what-i-built.md
          </span>
          <h3 className={`font-mono text-[11px] font-bold uppercase tracking-wide3 mb-4
                          ${accentText[p.accent]}`}>
            What I built
          </h3>
          <div className="space-y-3.5 text-[14.5px] leading-[1.65] text-ink-mute
                          [&_b]:text-ink [&_code]:ink-code">
            {p.built.map((para, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
            ))}
            {p.pullQuote && (
              <div
                className="relative my-5 px-7 py-6 rounded-xl border"
                style={{
                  background: `linear-gradient(135deg, ${ac}10, transparent)`,
                  borderColor: `${ac}40`,
                }}
              >
                <span
                  className="absolute -top-3 left-3 font-sans font-black text-[68px] leading-none"
                  style={{ color: ac, opacity: 0.4 }}
                >“</span>
                <p className="italic text-ink text-[15.5px] leading-[1.55] pl-7"
                   dangerouslySetInnerHTML={{ __html: p.pullQuote }} />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <span className="deco-marker text-coral">FILE / bits-that-bit-me.md</span>
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-wide3 mb-4 text-coral">
            The bits that bit me
          </h3>
          <div className="space-y-3.5 text-[14.5px] leading-[1.65] text-ink-mute
                          [&_b]:text-ink [&_code]:ink-code">
            {p.bites.map((para, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
            ))}
          </div>
        </motion.div>

        {p.hasArch && (
          <div className="lg:col-span-2">
            <ArchSvg accent={p.accent} />
          </div>
        )}

        {p.hasMap && (
          <div className="lg:col-span-2" id={`${p.id}-map`}>
            <PsMap accent={p.accent} />
          </div>
        )}
      </div>
    </section>
  );
}
