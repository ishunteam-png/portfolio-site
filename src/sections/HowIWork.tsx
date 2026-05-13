import { motion } from "framer-motion";
import { fadeUp, stagger } from "../lib/motion";

const PRINCIPLES = [
  {
    head: "Bias to shipping.",
    body: "I'd rather get a v0 in front of the user this week and learn what's actually wrong than spend a month polishing the v3 of someone's spec.",
  },
  {
    head: "Defensive at the seams, light in the middle.",
    body: "Where my code meets a third-party API or an LLM, I hard-fail with the actual thing that broke. Inside the code I trust myself.",
  },
  {
    head: "Audit logs over comments.",
    body: "Useful comments are about why. But what I really care about is being able to reconstruct what happened — SystemLog on hospital, run trackers on Relief Guru, audit folders per release on Haimcore.",
  },
  {
    head: "Hedging is honest.",
    body: "If a parameter I've picked won't generalise outside the AOI / customer / case I had in front of me, I say so in the report. Better than the client finding out the hard way.",
  },
  {
    head: "Make the un-fun parts repeatable.",
    body: "Deploy scripts, smoke tests, rollback paths, idempotency guards. Everything that bit me once gets a guard rail.",
  },
];

export function HowIWork() {
  return (
    <section id="how" className="py-24 border-t border-rule">
      <div className="wrap grid lg:grid-cols-[0.4fr_1.4fr] gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block font-mono text-[11.5px] font-bold tracking-wide3
                            text-lime bg-bg-tint px-2.5 py-1 rounded mb-3">
            PRINCIPLES
          </span>
          <h2 className="font-sans font-black tracking-brutal text-[clamp(26px,3vw,40px)]
                          leading-[1.1] mb-4">
            The five rules I've earned the hard way.
          </h2>
          <p className="text-[15px] text-ink-mute max-w-[360px]">
            Patterns I keep coming back to after every project. The kind of
            thing that's obvious in hindsight but expensive in real time.
          </p>
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 [counter-reset:principle]"
        >
          {PRINCIPLES.map((p) => (
            <motion.li
              key={p.head}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="grid grid-cols-[60px_1fr] gap-5 px-6 py-5
                         bg-bg-elev border border-rule rounded-xl
                         hover:border-lime transition-colors group"
              style={{ counterIncrement: "principle" } as React.CSSProperties}
            >
              <span className="font-mono font-bold text-[18px] text-lime tracking-tight2
                                before:content-['/'_counter(principle,decimal-leading-zero)]" />
              <div>
                <b className="block text-ink text-[15.5px] mb-1.5">{p.head}</b>
                <span className="block text-[14px] text-ink-mute leading-[1.6]">
                  {p.body}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
