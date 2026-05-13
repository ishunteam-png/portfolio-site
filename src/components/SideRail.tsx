import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top",     label: "Top" },
  { id: "proj-01", label: "01 / Haimcore" },
  { id: "proj-02", label: "02 / Relief Guru" },
  { id: "proj-03", label: "03 / Jalaram" },
  { id: "proj-04", label: "04 / Delhi" },
  { id: "proj-05", label: "05 / Kite Beach" },
  { id: "how",     label: "How I work" },
  { id: "contact", label: "Contact" },
];

export function SideRail() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <aside className="fixed right-5 top-1/2 -translate-y-1/2 z-40
                       hidden xl:flex flex-col gap-4
                       py-4 px-2 rounded-full bg-bg-card/70 backdrop-blur-md border border-rule">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className="relative w-2.5 h-2.5 rounded-full transition-all duration-200
                     group hover:scale-125"
          style={{
            background: active === id ? "#9CFF4A" : "rgba(240,240,235,0.18)",
            boxShadow: active === id
              ? "0 0 0 4px rgba(156,255,74,0.25)"
              : "none",
          }}
        >
          <span className="absolute right-6 top-1/2 -translate-y-1/2
                            px-2.5 py-1 rounded bg-bg-card border border-rule-strong
                            font-mono text-[10.5px] text-ink whitespace-nowrap
                            opacity-0 group-hover:opacity-100 transition-opacity
                            pointer-events-none">
            {label}
          </span>
        </a>
      ))}
    </aside>
  );
}
