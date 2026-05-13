// Shared Framer Motion configs — keeps spring physics consistent across
// the site.

export const springSoft = { type: "spring", stiffness: 200, damping: 22 } as const;
export const springFirm = { type: "spring", stiffness: 280, damping: 18 } as const;
export const springSnap = { type: "spring", stiffness: 400, damping: 32 } as const;

// Stagger reveal — feels like text being printed (hard linear)
export const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.6, 0.2, 1] } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.2, 0.6, 0.2, 1] } },
};

// Accent token → tailwind class helper
export type AccentName = "lime" | "cyan" | "coral" | "mint" | "violet" | "amber";

export const accentText: Record<AccentName, string> = {
  lime:   "text-lime",
  cyan:   "text-cyan",
  coral:  "text-coral",
  mint:   "text-mint",
  violet: "text-violet",
  amber:  "text-amber",
};

export const accentBg: Record<AccentName, string> = {
  lime:   "bg-lime",
  cyan:   "bg-cyan",
  coral:  "bg-coral",
  mint:   "bg-mint",
  violet: "bg-violet",
  amber:  "bg-amber",
};

export const accentBorder: Record<AccentName, string> = {
  lime:   "border-lime",
  cyan:   "border-cyan",
  coral:  "border-coral",
  mint:   "border-mint",
  violet: "border-violet",
  amber:  "border-amber",
};

export const accentGlow: Record<AccentName, string> = {
  lime:   "shadow-[0_0_0_1px_rgba(156,255,74,0.4),0_0_48px_rgba(156,255,74,0.18)]",
  cyan:   "shadow-[0_0_0_1px_rgba(124,230,255,0.4),0_0_48px_rgba(124,230,255,0.18)]",
  coral:  "shadow-[0_0_0_1px_rgba(255,148,102,0.4),0_0_48px_rgba(255,148,102,0.18)]",
  mint:   "shadow-[0_0_0_1px_rgba(91,255,182,0.4),0_0_48px_rgba(91,255,182,0.18)]",
  violet: "shadow-[0_0_0_1px_rgba(195,157,255,0.4),0_0_48px_rgba(195,157,255,0.18)]",
  amber:  "shadow-[0_0_0_1px_rgba(255,209,102,0.4),0_0_48px_rgba(255,209,102,0.18)]",
};

// Per-accent hex (for inline use, e.g. shadow tints)
export const accentHex: Record<AccentName, string> = {
  lime:   "#9CFF4A",
  cyan:   "#7CE6FF",
  coral:  "#FF9466",
  mint:   "#5BFFB6",
  violet: "#C39DFF",
  amber:  "#FFD166",
};
