import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface Action {
  code: string;
  label: string;
  desc: string;
  type: "anchor" | "url" | "fn";
  target: string;
}

const ACTIONS: Action[] = [
  { code: "TOP",  label: "Top of page",         desc: "Back to hero",          type: "anchor", target: "#top" },
  { code: "01",   label: "Haimcore",            desc: "Next.js AI workspace",  type: "anchor", target: "#proj-01" },
  { code: "02",   label: "Relief Guru",         desc: "n8n video pipeline",    type: "anchor", target: "#proj-02" },
  { code: "03",   label: "Jalaram Hospital",    desc: "Live AI HMS",           type: "anchor", target: "#proj-03" },
  { code: "04",   label: "SATALITE Delhi",      desc: "EGMS-L3 InSAR pilot",   type: "anchor", target: "#proj-04" },
  { code: "05",   label: "SATALITE Kite Beach", desc: "Validation pilot",      type: "anchor", target: "#proj-05" },
  { code: "MAP",  label: "Interactive PS map",  desc: "2,656 scatterers",      type: "anchor", target: "#proj-04-map" },
  { code: "ARCH", label: "Relief Guru architecture", desc: "7-workflow diagram", type: "anchor", target: "#arch" },
  { code: "HOW",  label: "How I work",          desc: "Five principles",       type: "anchor", target: "#how" },
  { code: "FORM", label: "Contact form",        desc: "Send a quick note",     type: "anchor", target: "#contact" },
  { code: "MAIL", label: "Send email",          desc: "singhishu2060@gmail.com", type: "url",  target: "mailto:singhishu2060@gmail.com" },
  { code: "CV",   label: "Download CV (PDF)",   desc: "Ishu_Singh_CV.pdf",     type: "url",    target: "/pdf/Ishu_Singh_CV.pdf" },
  { code: "PORT", label: "Portfolio PDF",       desc: "28-page deep dive",     type: "url",    target: "/pdf/Ishu_Singh_Portfolio.pdf" },
  { code: "MINI", label: "Mini-CV (2 pages)",   desc: "Leave-behind",          type: "url",    target: "/pdf/Ishu_Singh_CV_Mini.pdf" },
  { code: "LIVE", label: "Jalaram (live)",      desc: "shreejalaramhospital.live", type: "url", target: "https://shreejalaramhospital.live" },
  { code: "DLH",  label: "Delhi dashboard",     desc: ":8501 (Streamlit)",     type: "url",    target: "http://3.110.160.18:8501" },
  { code: "KTB",  label: "Kite Beach dashboard", desc: ":8502 (Streamlit)",    type: "url",    target: "http://3.110.160.18:8502" },
  { code: "GH",   label: "GitHub",              desc: "github.com/ishunteam-png", type: "url", target: "https://github.com/ishunteam-png" },
  { code: "REPO", label: "Portfolio source",    desc: "ishunteam-png/portfolio-site", type: "url", target: "https://github.com/ishunteam-png/portfolio-site" },
];

interface Props { open: boolean; onClose: () => void; }

export function CmdK({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const [cur, setCur] = useState(0);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return ACTIONS;
    return ACTIONS.filter((a) =>
      a.label.toLowerCase().includes(s) ||
      a.desc.toLowerCase().includes(s)  ||
      a.code.toLowerCase().includes(s)
    );
  }, [q]);

  useEffect(() => setCur(0), [q]);
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open ? onClose() : (window as any).__openCmdK?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function act(a: Action) {
    onClose();
    if (a.type === "anchor") {
      document.querySelector(a.target)?.scrollIntoView({ behavior: "smooth" });
    } else if (a.type === "url") {
      window.location.href = a.target;
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setCur((c) => Math.min(c + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCur((c) => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); filtered[cur] && act(filtered[cur]); }
    else if (e.key === "Escape") { onClose(); }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md
                     grid items-start justify-items-center pt-[12vh]"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="w-[92%] max-w-[600px] bg-bg-elev border border-rule-strong
                       rounded-xl shadow-card overflow-hidden"
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type to jump…"
              className="w-full px-5 py-4 bg-transparent border-b border-rule
                          text-ink text-[15px] font-mono outline-none"
            />
            <ul className="max-h-[50vh] overflow-y-auto">
              {filtered.map((a, i) => (
                <li
                  key={a.code}
                  onMouseEnter={() => setCur(i)}
                  onClick={() => act(a)}
                  className={`px-5 py-3 flex items-center gap-3 cursor-pointer
                              border-b border-rule last:border-b-0 text-[13.5px]
                              ${cur === i ? "bg-bg-tint text-ink" : "text-ink-mute"}`}
                >
                  <span className="font-mono text-[10.5px] text-lime bg-bg-tint
                                    px-2 py-0.5 rounded font-bold">{a.code}</span>
                  <span>{a.label}</span>
                  <span className="ml-auto text-[11.5px] text-ink-dim font-mono">{a.desc}</span>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-5 py-6 text-center text-ink-dim text-[13px] font-mono">
                  no match · esc to close
                </li>
              )}
            </ul>
            <div className="flex gap-4 px-5 py-2.5 border-t border-rule bg-bg/40
                              font-mono text-[10.5px] text-ink-dim">
              <span><kbd className="px-1 py-px bg-bg border border-rule-strong rounded">↑↓</kbd> nav</span>
              <span><kbd className="px-1 py-px bg-bg border border-rule-strong rounded">↵</kbd> select</span>
              <span><kbd className="px-1 py-px bg-bg border border-rule-strong rounded">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
