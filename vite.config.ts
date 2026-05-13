import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

declare const process: { env: Record<string, string | undefined> };

// GH Pages serves at /portfolio-site/; Vercel serves at the apex.
// CI sets DEPLOY_TARGET=gh-pages so we only rewrite asset URLs there.
const base = process.env.DEPLOY_TARGET === "gh-pages" ? "/portfolio-site/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
});
