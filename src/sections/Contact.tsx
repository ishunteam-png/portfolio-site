import { motion } from "framer-motion";
import { MagneticButton } from "../components/MagneticButton";

const ROWS: Array<[string, React.ReactNode]> = [
  ["Email",     <a href="mailto:singhishu2060@gmail.com">singhishu2060@gmail.com</a>],
  ["Phone",     "+995 555 114 467"],
  ["Based in",  "Tbilisi, Georgia"],
  ["GitHub",    <a href="https://github.com/ishunteam-png" target="_blank" rel="noopener">github.com/ishunteam-png</a>],
  ["Live demo", <a href="https://shreejalaramhospital.live" target="_blank" rel="noopener">shreejalaramhospital.live</a>],
  ["Languages", "EN (Fluent) · HI (Native) · GU (Native) · KA (Conversational)"],
];

export function Contact() {
  return (
    <section id="contact" className="py-24 border-t border-rule">
      <div className="wrap grid lg:grid-cols-[1.1fr_0.9fr] gap-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-block font-mono text-[11.5px] font-bold tracking-wide3
                            text-lime bg-bg-tint px-2.5 py-1 rounded mb-3">
            CONTACT
          </span>
          <h2 className="font-sans font-black tracking-brutal text-[clamp(32px,4vw,52px)]
                          leading-[1.05] mb-4">
            Open for remote &amp; freelance, globally.
          </h2>
          <p className="text-[16px] text-ink-mute leading-[1.65] mb-7 max-w-[480px]">
            Most comfortable on AI-assisted product work, automation
            pipelines, full-stack TypeScript / Python, and geospatial
            processing — ideally where some part of the problem hasn't
            been solved cleanly before and the engineering judgement
            matters as much as the code.
          </p>

          <ul className="space-y-3">
            {ROWS.map(([lbl, val]) => (
              <li key={lbl} className="grid grid-cols-[100px_1fr] gap-3.5 py-3.5
                                        border-b border-rule last:border-b-0 text-[14.5px]">
                <span className="font-mono text-[11px] uppercase tracking-wide2
                                  text-ink-dim pt-0.5 font-bold">
                  {lbl}
                </span>
                <span className="[&_a]:text-lime [&_a]:border-b [&_a]:border-dashed
                                  [&_a:hover]:text-mint [&_a]:transition-colors">
                  {val}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
          action="https://formspree.io/f/your-form-id"
          method="POST"
          className="bg-bg-elev border border-rule rounded-xl p-8"
        >
          <h3 className="text-[19px] font-bold tracking-tight2 mb-1">
            Send a quick note
          </h3>
          <p className="text-[12.5px] text-ink-dim mb-5">
            Goes straight to my inbox. Replace the Formspree endpoint when
            you sign up; the mailto link is the no-account fallback.
          </p>
          {(["name", "email", "message"] as const).map((field) => (
            <label key={field} className="block mb-3.5">
              <span className="block font-mono text-[11px] text-ink-mute uppercase tracking-wide2 mb-1.5 font-bold">
                {field === "name" ? "Your name" :
                 field === "email" ? "Email" : "What's on your mind?"}
              </span>
              {field === "message" ? (
                <textarea
                  name={field}
                  rows={5}
                  required
                  className="w-full px-3 py-2.5 bg-bg border border-rule-strong
                             rounded-lg text-ink text-[14px] font-mono outline-none
                             focus:border-lime focus:shadow-[0_0_0_3px_rgba(156,255,74,0.18)]
                             transition-shadow"
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  required
                  className="w-full px-3 py-2.5 bg-bg border border-rule-strong
                             rounded-lg text-ink text-[14px] font-mono outline-none
                             focus:border-lime focus:shadow-[0_0_0_3px_rgba(156,255,74,0.18)]
                             transition-shadow"
                />
              )}
            </label>
          ))}
          <MagneticButton
            onClick={() => {}}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg
                       bg-lime text-bg font-mono font-bold text-[13.5px]
                       hover:shadow-glow-lime transition-shadow"
          >
            Send →
          </MagneticButton>
        </motion.form>
      </div>
    </section>
  );
}
