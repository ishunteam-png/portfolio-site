import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../lib/motion";

/* ─── types ──────────────────────────────────────────────────────────────── */
type GisCat =
  | "InSAR"
  | "ML/GeoAI"
  | "Routing"
  | "Hazard"
  | "Mobility"
  | "Environment";

interface GisProject {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: GisCat;
  catHex: string;
  catQr: string;
  metric: string;
  desc: string;
  stack: string[];
  flagship?: boolean;
}

interface CatMeta {
  label: string;
  value: GisCat | "all";
  hex: string;
  count: number;
}

/* ─── category meta ──────────────────────────────────────────────────────── */
const CATS: CatMeta[] = [
  { label: "All",         value: "all",         hex: "#9CFF4A", count: 17 },
  { label: "InSAR",       value: "InSAR",       hex: "#C39DFF", count: 2  },
  { label: "ML / GeoAI",  value: "ML/GeoAI",    hex: "#FF9466", count: 4  },
  { label: "Routing",     value: "Routing",     hex: "#FFD166", count: 3  },
  { label: "Hazard",      value: "Hazard",      hex: "#FF6B8A", count: 2  },
  { label: "Mobility",    value: "Mobility",    hex: "#5BFFB6", count: 2  },
  { label: "Environment", value: "Environment", hex: "#9CFF4A", count: 4  },
];

/* ─── project data ───────────────────────────────────────────────────────── */
const BASE = "https://ishunteam-png.github.io/gis-portfolio/";

const GIS_PROJECTS: GisProject[] = [
  {
    id: "01", slug: "01-insar-road-subsidence",
    title: "InSAR Road Subsidence", location: "Delhi, India",
    category: "InSAR", catHex: "#C39DFF", catQr: "C39DFF",
    metric: "2,555 PS · V_U −10.3 to +4.7 mm/yr",
    desc: "EGMS-L3 Sentinel-1 InSAR pilot with true 2D vertical + east-west decomposition. Velocity-threshold filter, temporal-coherence gate, live histogram.",
    stack: ["Sentinel-1", "MintPy", "SNAP", "PyAPS3"],
  },
  {
    id: "02", slug: "02-real-estate-intel",
    title: "Café Location Intelligence", location: "Tbilisi, Georgia",
    category: "Routing", catHex: "#FFD166", catQr: "FFD166",
    metric: "8,415 cells · 62,849-node graph · ρ = 0.39",
    desc: "Multi-signal suitability mapping over 504 km². 5 demand signals including walkability from a 62,849-node OSM pedestrian graph; validated at Spearman ρ = 0.39.",
    stack: ["OSMnx", "GeoPandas", "scipy", "Leaflet"],
  },
  {
    id: "03", slug: "03-route-optimization",
    title: "Advanced VRP — Time Windows", location: "Benchmark dataset",
    category: "Routing", catHex: "#FFD166", catQr: "FFD166",
    metric: "60 stops · 5 vehicles · OR-Tools −20.3% vs greedy",
    desc: "Greedy vs Clarke-Wright vs OR-Tools GLS on 60 stops / 5 vehicles. OR-Tools wins by −20.3% on drive time. Toggle algorithms live on the same map.",
    stack: ["OSMnx", "NetworkX", "OR-Tools", "Leaflet"],
  },
  {
    id: "04", slug: "04-flood-risk",
    title: "Jakarta Compound Flood Risk", location: "Jakarta, Indonesia",
    category: "Hazard", catHex: "#FF6B8A", catQr: "FF6B8A",
    metric: "1,360 schools · 138 hospitals · 4-factor index",
    desc: "HAND + slope + drainage density + imperviousness risk index. 1,360 schools and 138 hospitals intersected. Infrastructure-type chips and risk-threshold filter.",
    stack: ["rasterio", "scipy.ndimage", "OSMnx", "GeoPandas"],
  },
  {
    id: "05", slug: "05-web-gis-dashboard",
    title: "Web GIS Dashboard — Delhi PS", location: "Delhi, India",
    flagship: true,
    category: "InSAR", catHex: "#C39DFF", catQr: "C39DFF",
    metric: "~480 lines vanilla JS · 6 presets · URL-hash state",
    desc: "Flagship single-file Leaflet build. 6 colour presets, split-panel view, live velocity histogram, URL-hash state for shareable views. No framework, no build step.",
    stack: ["Leaflet", "Chroma.js", "Vanilla JS", "GeoJSON"],
  },
  {
    id: "06", slug: "06-geoai-road-damage",
    title: "GeoAI Road Damage × InSAR", location: "Delhi, India",
    category: "ML/GeoAI", catHex: "#FF9466", catQr: "FF9466",
    metric: "YOLOv8m-seg · all 4 detections on subsiding PS",
    desc: "YOLOv8m-seg correlated with subsiding persistent scatterers. Operationalises the InSAR → surface damage causal chain with visual join-line dashboard.",
    stack: ["ultralytics", "PyTorch", "OpenCV", "Leaflet"],
  },
  {
    id: "07", slug: "07-lulc-classification",
    title: "Sentinel-2 LULC — Bengaluru", location: "Bengaluru, India",
    category: "ML/GeoAI", catHex: "#FF9466", catQr: "FF9466",
    metric: "OA 90.9% · κ 0.89 · built-up +22.6% (2020→2024)",
    desc: "Random Forest on 6 bands + 7 spectral indices. Built-up grew +22.6%; bare soil dropped 24% — the field-to-construction lifecycle across 4 years.",
    stack: ["Sentinel-2", "pystac-client", "scikit-learn", "rasterio"],
  },
  {
    id: "08", slug: "08-15min-city",
    title: "15-Minute City", location: "Paris, France",
    category: "Routing", catHex: "#FFD166", catQr: "FFD166",
    metric: "87.7% cells ≥5/6 categories · 47,812-node graph",
    desc: "Carlos Moreno's 6-category framework over Paris. 47,812-node OSM walk graph; per-cell Dijkstra at 1,250 m. 8 Métro isochrones at 5/10/15-min.",
    stack: ["OSMnx", "NetworkX", "Shapely", "alphashape"],
  },
  {
    id: "09", slug: "09-ndvi-change",
    title: "NDVI Deforestation — Rondônia", location: "Rondônia, Brazil",
    category: "Environment", catHex: "#9CFF4A", catQr: "9CFF4A",
    metric: "2,698 km² cleared 2015–2024 · 2019 fire spike visible",
    desc: "Per-pixel breakpoint detection over the BR-364 fishbone corridor. 2019 fire spike and 2024 Lula policy drop visible directly in the loss curve.",
    stack: ["Earth Engine", "Landsat 8/9", "Sentinel-2", "LandTrendr"],
  },
  {
    id: "10", slug: "10-h3-mobility",
    title: "H3 Mobility — NYC Yellow Taxi", location: "New York City, USA",
    category: "Mobility", catHex: "#5BFFB6", catQr: "5BFFB6",
    metric: "57,000 daily trips · H3 res-9 · 5 metrics × 5 windows",
    desc: "TLC pickups/dropoffs indexed to H3 res-9 hexagons. AM commute-in / PM airport-dropoff asymmetry surfaces across 5 metrics × 5 time windows.",
    stack: ["h3-py", "DuckDB", "pandas", "pyarrow"],
  },
  {
    id: "11", slug: "11-wildfire-spread",
    title: "Wildfire Spread — Park Fire CA", location: "California, USA",
    category: "Hazard", catHex: "#FF6B8A", catQr: "FF6B8A",
    metric: "961/1,024 cells burned by h120 · peak 28 m/h",
    desc: "Rothermel cellular automaton on a 32×32 LANDFIRE fuel grid with HRRR NE Diablo wind forcing. Hourly slider, wind-vector overlay, fuel-model toggles.",
    stack: ["Rothermel CA", "LANDFIRE", "HRRR wind", "VIIRS"],
  },
  {
    id: "12", slug: "12-solar-lisbon",
    title: "Rooftop Solar Potential", location: "Lisbon, Portugal",
    category: "Environment", catHex: "#9CFF4A", catQr: "9CFF4A",
    metric: "12.5 GWh/yr · 450 rooftops · ≡ 4,178 households",
    desc: "OSM polygons × Copernicus 25 m DEM × pvlib irradiance × skyline-shading raycast over 450 rooftops in 5 neighbourhoods. Ranked by kWh/m².",
    stack: ["OSMnx", "py3dep", "pvlib", "PVGIS"],
  },
  {
    id: "13", slug: "13-no2-delhi",
    title: "Sentinel-5P NO₂ Plume", location: "Delhi, India",
    category: "Environment", catHex: "#9CFF4A", catQr: "9CFF4A",
    metric: "100% WHO exceedance Jan · 10% Jun · 12-month slider",
    desc: "TROPOMI L3 monthly composites; 728 cells, 11 CPCB hotspots, Gaussian plume. Winter inversion vs monsoon scrubbing sharply visible in 12-month slider.",
    stack: ["Sentinel-5P", "TROPOMI", "xarray", "CPCB"],
  },
  {
    id: "14", slug: "14-ais-singapore",
    title: "AIS Vessel Tracking", location: "Singapore Strait",
    category: "Mobility", catHex: "#5BFFB6", catQr: "5BFFB6",
    metric: "978 vessels · 200 anchored · +18% Red Sea backlog",
    desc: "H3 res-8 density grid + DBSCAN anchorage clusters. 2024 Red Sea diversion drove a +18% congestion backlog Jan–Apr visible in the monthly bars.",
    stack: ["AIS", "H3 res-8", "DBSCAN", "MarineTraffic"],
  },
  {
    id: "15", slug: "15-crop-classification",
    title: "S1+S2 Crop Classification", location: "Story County, Iowa, USA",
    category: "ML/GeoAI", catHex: "#FF9466", catQr: "FF9466",
    metric: "S2-only 86.3% → S1+S2 fusion 92.7% (+6.4% uplift)",
    desc: "Sentinel-1 SAR (VV/VH) + Sentinel-2 NDVI composites over 672 fields, 7 CDL classes. Toggle between truth, S1-only, S2-only, and fused predictions.",
    stack: ["Sentinel-1", "Sentinel-2", "scikit-learn", "USDA CDL"],
  },
  {
    id: "16", slug: "16-uhi-tokyo",
    title: "Urban Heat Island", location: "Tokyo, Japan",
    category: "Environment", catHex: "#9CFF4A", catQr: "9CFF4A",
    metric: "UHI 5.6°C · peak 37.4°C · ρ = −0.82 with NDVI",
    desc: "Landsat-9 thermal LST × Sentinel-2 NDVI over the August 2024 heat-wave peak. More trees = cooler block, quantified at city scale via Spearman correlation.",
    stack: ["Landsat 9", "Sentinel-2", "pystac-client", "scipy.stats"],
  },
  {
    id: "17", slug: "17-coastal-erosion-florida",
    title: "Coastal Erosion — Florida", location: "Florida Atlantic, USA",
    category: "ML/GeoAI", catHex: "#FF9466", catQr: "FF9466",
    metric: "Daytona −27.4 m · Miami Beach +24.0 m · 2015–2024",
    desc: "Annual NDWI shoreline migration across 15 stations, 2015–2024. Daytona Beach −27.4 m; Miami Beach +24.0 m from renourishment. Hurricane Irma 2017 visible.",
    stack: ["Sentinel-2 NDWI", "scikit-image", "Shapely", "FDEP transects"],
  },
];

/* ─── GisSection ─────────────────────────────────────────────────────────── */
export function GisSection() {
  const [active, setActive] = useState<string>("all");

  const visible =
    active === "all"
      ? GIS_PROJECTS
      : GIS_PROJECTS.filter((p) => p.category === active);

  return (
    <section className="relative py-20 md:py-28 border-t border-rule">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(156,255,74,0.05), transparent 65%)",
        }}
      />

      <div className="wrap">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          {/* eyebrow */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[11px] font-bold text-lime tracking-wide3 uppercase">
              GIS / Geospatial Portfolio
            </span>
            <div className="flex-1 h-px bg-rule-strong" />
            <span className="font-mono text-[11px] text-ink-dim tracking-wide2">
              17 LIVE DASHBOARDS
            </span>
          </div>

          {/* title */}
          <h2 className="font-sans font-black tracking-brutal text-[clamp(36px,5vw,60px)] leading-[1.05] mb-4">
            Geospatial{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #9CFF4A 0%, #7CE6FF 40%, #C39DFF 80%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Research Portfolio
            </span>
          </h2>

          <p className="font-mono text-[13.5px] text-ink-mute max-w-[620px] leading-[1.7] mb-8">
            17 end-to-end projects — InSAR remote sensing, GeoAI, multi-modal
            routing, compound hazard modelling, mobility analytics, LULC
            classification, and more. Each ships with a live interactive Leaflet
            dashboard on GitHub Pages. Scan any QR to open that dashboard directly.
          </p>

          {/* stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[580px]">
            {[
              { n: "17",        l: "Live Dashboards" },
              { n: "2,655",     l: "InSAR PS"         },
              { n: "92.7%",     l: "SAR Fusion OA"    },
              { n: "2,698 km²", l: "Deforestation"    },
            ].map((s) => (
              <div
                key={s.l}
                className="px-4 py-3 bg-bg-card border border-rule rounded-lg text-center"
              >
                <div className="font-mono font-bold text-[17px] text-lime tracking-tight2 leading-none">
                  {s.n}
                </div>
                <div className="font-mono text-[9px] text-ink-dim uppercase tracking-wide2 mt-1.5">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Filter bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATS.map((cat) => {
            const isActive = active === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActive(cat.value)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                           font-mono text-[11px] font-bold tracking-wide2 uppercase
                           border transition-all duration-150"
                style={
                  isActive
                    ? {
                        background: cat.hex,
                        color: "#050505",
                        borderColor: cat.hex,
                      }
                    : {
                        background: "transparent",
                        color: "#8b8b85",
                        borderColor: "rgba(240,240,235,0.18)",
                      }
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: cat.hex }}
                />
                {cat.label}
                <span className="text-[9px] opacity-60">{cat.count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          key={active}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
        >
          {visible.map((p) => (
            <GisCard key={p.id} project={p} />
          ))}
        </motion.div>

        {/* ── Bottom CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          <a
            href="https://ishunteam-png.github.io/gis-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                       bg-lime text-bg font-mono font-bold text-[13px]
                       hover:bg-[#b4ff6a] transition-colors"
          >
            Open Full GIS Portfolio ↗
          </a>
          <a
            href="https://github.com/ishunteam-png/gis-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                       border border-rule-strong text-ink-dim font-mono text-[13px]
                       hover:border-lime hover:text-lime transition-colors"
          >
            GitHub Source ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── GisCard ────────────────────────────────────────────────────────────── */
function GisCard({ project: p }: { project: GisProject }) {
  const dashUrl = `${BASE}${p.slug}/`;
  const qrSrc =
    `https://api.qrserver.com/v1/create-qr-code/` +
    `?size=80x80&data=${encodeURIComponent(dashUrl)}` +
    `&color=${p.catQr}&bgcolor=0f0f0e&qzone=1`;

  return (
    <motion.article
      variants={fadeUp}
      className="relative flex flex-col bg-bg-card border border-rule rounded-xl
                 overflow-hidden hover:border-rule-strong transition-colors duration-200"
    >
      {/* Left accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: p.catHex, opacity: 0.65 }}
      />

      <div className="pl-5 pr-5 pt-5 pb-5 flex flex-col flex-1">
        {/* Top row: big number + badges */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-mono text-[9px] font-bold text-ink-dim tracking-wide3 uppercase leading-none">
              Project
            </div>
            <div
              className="font-mono font-bold text-[48px] leading-[0.85] tracking-brutal select-none"
              style={{ color: p.catHex, opacity: 0.15 }}
            >
              {p.id}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 mt-0.5">
            {p.flagship && (
              <span
                className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm
                           bg-lime/10 text-lime border border-lime/30 uppercase tracking-wide2"
              >
                Flagship
              </span>
            )}
            <span
              className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide2"
              style={{
                color: p.catHex,
                background: `${p.catHex}18`,
                border: `1px solid ${p.catHex}35`,
              }}
            >
              {p.category}
            </span>
            <span
              className="inline-flex items-center gap-1 font-mono text-[9px] font-bold
                         px-2 py-0.5 rounded-sm uppercase tracking-wide2
                         text-mint bg-mint/10 border border-mint/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* Title + location */}
        <h3 className="font-sans font-bold text-[16px] tracking-tight2 leading-[1.25] text-ink mb-1">
          {p.title}
        </h3>
        <p className="font-mono text-[10.5px] text-ink-dim mb-3 tracking-wide2">
          ◈ {p.location}
        </p>

        {/* Description */}
        <p className="font-mono text-[11.5px] leading-[1.65] text-ink-mute flex-1 mb-4">
          {p.desc}
        </p>

        {/* Key metric */}
        <div
          className="rounded-lg px-3 py-2 mb-4 font-mono text-[10.5px] font-bold tracking-wide2"
          style={{
            background: `${p.catHex}0d`,
            border: `1px solid ${p.catHex}28`,
            color: p.catHex,
          }}
        >
          ◉ {p.metric}
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {p.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[10px] px-2 py-0.5 rounded border
                         bg-bg text-ink-dim border-rule-strong"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bottom: buttons + QR code */}
        <div className="flex items-end gap-3">
          <div className="flex gap-2 flex-1">
            <a
              href={dashUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1
                         px-3 py-2 rounded-lg font-mono font-bold text-[12px]
                         text-bg hover:brightness-110 transition-all duration-150"
              style={{ background: p.catHex }}
            >
              Open ↗
            </a>
            <a
              href={`https://github.com/ishunteam-png/gis-portfolio/tree/main/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Source on GitHub"
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg
                         font-mono text-[11px] border border-rule-strong text-ink-dim
                         hover:border-lime hover:text-lime transition-colors duration-150"
            >
              {"</>"}
            </a>
          </div>

          {/* QR panel */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className="w-[76px] h-[76px] rounded-lg overflow-hidden border border-rule-strong
                         bg-bg-card flex items-center justify-center"
            >
              <img
                src={qrSrc}
                alt={`QR code — ${p.title}`}
                width={70}
                height={70}
                loading="lazy"
              />
            </div>
            <span className="font-mono text-[8px] text-ink-dim uppercase tracking-wide2">
              Scan
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
