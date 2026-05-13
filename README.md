# Ishu Singh — portfolio site

Static portfolio site at `D:\CLAUDE\portfolio-site\`. Plain HTML / CSS /
JavaScript, no framework. Hosted on GitHub Pages at
https://ishunteam-png.github.io/portfolio-site/ (or anywhere static).

## What's here

```
portfolio-site/
├── index.html                 # main one-pager
├── projects/                  # 5 per-project deep-dive pages
│   ├── haimcore.html
│   ├── relief-guru.html
│   ├── jalaram.html
│   ├── delhi.html             # interactive Leaflet PS map lives here
│   └── kite-beach.html
├── assets/
│   ├── css/main.css           # one stylesheet, dark + light themes
│   ├── js/
│   │   ├── main.js            # theme toggle + scroll
│   │   ├── terminal.js        # animated hero terminal
│   │   ├── counters.js        # animated metric numbers
│   │   ├── filters.js         # project-category filter chips
│   │   ├── cmdk.js            # Cmd-K palette (index page)
│   │   ├── cmdk-project.js    # Cmd-K palette (project pages)
│   │   └── map.js             # Leaflet PS map (delhi.html)
│   ├── img/                   # screenshots + favicon + OG card
│   ├── data/                  # PS GeoJSON for the maps
│   └── pdf/                   # the printable PDF variants
├── content/projects/*.md      # optional: edit MD instead of HTML
├── scripts/
│   ├── build_site.py          # MD -> HTML pipeline (optional)
│   └── generate_og.py         # regenerate the OG card
├── .github/workflows/pages.yml  # GitHub Pages auto-deploy on push to main
└── README.md
```

## Local preview

No build step needed - it's static. Two easy ways to run it:

```powershell
# Python (already on this machine)
cd D:\CLAUDE\portfolio-site
py -m http.server 8000

# then open  http://localhost:8000
```

```powershell
# Or Node, if you have it
npx serve .
```

## How to edit content

You have two options:

### A. Edit the HTML directly

Open `projects/<slug>.html` and change the markup. Same for `index.html`.
This is the path of least resistance for one-off tweaks.

### B. Edit the Markdown source and regenerate

Each project also has a markdown source at
`content/projects/0X-<slug>.md` with a YAML frontmatter for metadata and
plain markdown for the narrative. To regenerate the HTML from it:

```powershell
cd D:\CLAUDE\portfolio-site
py scripts/build_site.py            # rewrites projects/*.html
py scripts/build_site.py --check    # diff-only mode, no writes
```

(Only `01-haimcore.md` is stubbed out as a worked example. The other
four project HTML files are the canonical source for now — convert them
to MD when you want to.)

## Deploying to GitHub Pages

The repo at `github.com/ishunteam-png/portfolio-site` is wired to
deploy via GitHub Actions on every push to `main`. The workflow
(`.github/workflows/pages.yml`) builds with `DEPLOY_TARGET=gh-pages`
so Vite emits asset URLs under `/portfolio-site/`, then publishes
`dist/` to GitHub Pages.

The live URL is https://ishunteam-png.github.io/portfolio-site/.

### One-time setup (already done)

1. In the repo, **Settings &rarr; Pages &rarr; Source: GitHub Actions**.
2. Push to `main`. The `pages.yml` workflow handles the rest.

### Replace the Formspree endpoint

The contact form on `index.html` posts to a placeholder Formspree URL.
Sign up at https://formspree.io (free tier, no card), create a form,
and replace `https://formspree.io/f/your-form-id` in `index.html` with
your real endpoint. The `mailto:` fallback works without an account.

### Plausible analytics

The `<script>` in `index.html`'s `<head>` calls `plausible.io`. Sign up
at https://plausible.io, add your domain, and the script will start
collecting analytics. Until then it's a no-op (no errors in console).

## What's plugged in

| Feature | Where |
|---|---|
| Dark theme (default) + light toggle | `assets/js/main.js`, `assets/css/main.css` |
| Animated terminal hero | `assets/js/terminal.js` |
| Animated counters | `assets/js/counters.js` |
| Project filter chips | `assets/js/filters.js` |
| Cmd-K command palette | `assets/js/cmdk.js`, `cmdk-project.js` |
| Interactive PS map | `projects/delhi.html` + `assets/js/map.js` + `assets/data/delhi_ps.geojson` |
| Animated SVG architecture | `projects/relief-guru.html` (inline SVG with dashed-line animation) |
| Scroll-snap nav (smooth scroll) | `html { scroll-behavior: smooth }` in CSS |
| OG meta + favicon | `index.html` head + `assets/img/favicon.svg` + `assets/img/og.png` |
| Plausible analytics | `index.html` head |
| GitHub Pages deploy | `.github/workflows/pages.yml` |
| PDF downloads | `assets/pdf/` |

## What I deliberately left out (for now)

- **Live dashboard iframes** for the SATALITE EC2 dashboards. The EC2
  public IP changes on every stop/start (no Elastic IP yet). Once an
  Elastic IP is attached, drop an `<iframe>` into `delhi.html` /
  `kite-beach.html`.
- **AI Q&A widget** on the portfolio (Tier 3). Worth doing once you have
  a hosted endpoint; happy to scope it.

## Re-generating PDFs

The PDF generator lives in the SATALITE project (cross-project, not in
this site repo). When you update content there, copy the PDFs across:

```powershell
py D:\CLAUDE\satalite\client_deliverables\_build_cv_portfolio.py
Copy-Item C:\Users\user\Downloads\Ishu_Singh_*.pdf `
          D:\CLAUDE\portfolio-site\assets\pdf\ -Force
```
