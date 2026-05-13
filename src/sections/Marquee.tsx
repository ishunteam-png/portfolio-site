const FACTS = [
  ["2,555", "persistent scatterers, ITRF14 frame"],
  ["4",     "portals, one Postgres schema, GPT-4o copilot"],
  ["7",     "n8n workflows, every step traceable"],
  ["165",   "Sentinel-1 SLCs → 476 SBAS pairs"],
  ["47",    "languages with keyboard-aware aliases"],
  ["3",     "production releases, zero downtime rollbacks"],
  ["§",     "shreejalaramhospital.live — live in production"],
];

export function Marquee() {
  // Duplicate the list so the loop appears seamless
  const full = [...FACTS, ...FACTS];
  return (
    <div
      className="overflow-hidden py-3 border-y border-rule
                 bg-bg-card/50"
      aria-hidden
    >
      <div className="inline-block whitespace-nowrap animate-marquee font-mono text-[13px] text-ink-dim">
        {full.map(([num, text], i) => (
          <span key={i} className="px-7">
            <span className="text-lime font-bold mr-2">{num}</span>
            <span>{text}</span>
            <span className="text-ink-dim/40 ml-7">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
