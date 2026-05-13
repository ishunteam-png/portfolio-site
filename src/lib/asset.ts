// Prepend Vite's BASE_URL so absolute `/img/...` and `/pdf/...` paths
// resolve correctly when the site is served from a subpath (GitHub Pages
// serves at /portfolio-site/). Vite only rewrites paths inside index.html
// and imported modules — runtime JSX `src`/`href` strings need this helper.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
