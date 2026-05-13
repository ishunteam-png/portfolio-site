import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Metric { num: number | string; label: string; }

const METRICS: Metric[] = [
  { num: 5,    label: "Projects shipped" },
  { num: 2,    label: "Live in production" },
  { num: 2656, label: "Persistent Scatterers" },
  { num: 7,    label: "n8n workflows orchestrated" },
  { num: 4,    label: "Hospital portals (live)" },
];

function Counter({ value }: { value: number | string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [shown, setShown] = useState<string | number>(typeof value === "number" ? 0 : value);

  useEffect(() => {
    if (!inView || typeof value !== "number") return;
    const dur = 1100;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(value * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {typeof shown === "number" ? shown.toLocaleString() : shown}
    </span>
  );
}

export function MetricsStrip() {
  return (
    <section id="metrics" className="pt-12 pb-8">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-5 bg-bg-elev border border-rule rounded-xl overflow-hidden"
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: 0.08 * i }}
              className="px-5 py-7 border-r border-rule last:border-r-0
                         hover:bg-bg-tint transition-colors relative group"
            >
              <span className="block font-mono font-bold text-3xl text-lime tracking-tight2 mb-2">
                <Counter value={m.num} />
              </span>
              <span className="block font-mono text-[11px] text-ink-mute uppercase tracking-wide2 font-bold">
                {m.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
