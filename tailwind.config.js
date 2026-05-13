/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Terminal Brutalism × CLI palette
        ink: {
          DEFAULT: "#f0f0eb", // bone white
          mute:    "#8b8b85",
          dim:     "#5b5b57",
        },
        bg: {
          DEFAULT: "#050505", // pure-ish black
          elev:    "#0a0a0a",
          card:    "#0f0f0e",
          tint:    "rgba(156, 255, 74, 0.06)",
        },
        rule: {
          DEFAULT: "rgba(240, 240, 235, 0.08)",
          strong:  "rgba(240, 240, 235, 0.18)",
        },

        // Single dominant terminal accent (lime green)
        // + per-project accents
        lime:   "#9CFF4A",
        cyan:   "#7CE6FF",
        coral:  "#FF9466",
        mint:   "#5BFFB6",
        violet: "#C39DFF",
        amber:  "#FFD166",
        red:    "#FF6B8A",
      },
      fontFamily: {
        // Both Mono — CLI-native — for body too
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        // Inter only for the giant brutalist display name
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brutal: "-0.045em",
        tight2: "-0.02em",
        wide2:  "0.08em",
        wide3:  "0.16em",
      },
      animation: {
        "marquee":   "marquee 38s linear infinite",
        "blink":     "blink 1s steps(1) infinite",
        "scan":      "scan 3.5s linear infinite",
        "drift":     "drift 8s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "50%": { opacity: "0" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        drift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-lime":  "0 0 0 1px rgba(156,255,74,0.4), 0 0 32px rgba(156,255,74,0.18)",
        "glow-cyan":  "0 0 0 1px rgba(124,230,255,0.4), 0 0 32px rgba(124,230,255,0.18)",
        "card":       "0 22px 60px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.04)",
        "crt":        "0 0 22px rgba(156,255,74,0.4)",
      },
    },
  },
  plugins: [],
};
