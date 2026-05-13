import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import { accentText, accentHex, type AccentName } from "../lib/motion";

interface Props { accent: AccentName; }

export function PsMap({ accent }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const inited = useRef(false);

  useEffect(() => {
    if (!elRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !inited.current) {
            inited.current = true;
            buildMap();
            io.disconnect();
          }
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(elRef.current);
    return () => io.disconnect();
  }, []);

  function colorForVU(v: number): string {
    if (v <= -8) return "#053061";
    if (v <= -4) return "#2166ac";
    if (v <= -2) return "#4393c3";
    if (v <= -1) return "#92c5de";
    if (v <=  1) return "#f7f7f7";
    if (v <=  2) return "#f4a582";
    if (v <=  4) return "#d6604d";
    return "#67001f";
  }

  function buildMap() {
    if (!elRef.current) return;
    const map = L.map(elRef.current, {
      center: [28.587, 77.045],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    fetch("/data/delhi_ps.geojson")
      .then((r) => r.json())
      .then((gj: any) => {
        const layer = L.geoJSON(gj, {
          pointToLayer: (feat: any, latlng: any) => {
            const p = feat.properties || {};
            const v = p.v_vertical_mm_yr ?? p.V_U ?? 0;
            return L.circleMarker(latlng, {
              radius: 4,
              fillColor: colorForVU(v),
              color: "#050505",
              weight: 0.5,
              fillOpacity: 0.95,
            });
          },
          onEachFeature: (feat: any, lyr: any) => {
            const p = feat.properties || {};
            const fmt = (x: any) =>
              typeof x === "number" ? x.toFixed(2) : x ?? "-";
            lyr.bindPopup(
              `<div style="font-family:Inter,sans-serif;font-size:12px;line-height:1.5">
                <b>Persistent Scatterer</b><br/>
                V_U (vertical): <b>${fmt(p.v_vertical_mm_yr)}</b> mm/yr<br/>
                V_E (east-west): <b>${fmt(p.v_eastwest_local_mm_yr)}</b> mm/yr<br/>
                V_LOS ASC: ${fmt(p.v_los_asc_mm_yr)} mm/yr<br/>
                V_LOS DSC: ${fmt(p.v_los_dsc_mm_yr)} mm/yr<br/>
                Coh ASC: ${fmt(p.tcoh_asc)} · Coh DSC: ${fmt(p.tcoh_dsc)}
              </div>`
            );
          },
        }).addTo(map);
        try { map.fitBounds(layer.getBounds(), { padding: [20, 20] }); } catch {}
        setCount((gj.features || []).length);
      })
      .catch((e) => setErr(e.message));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55 }}
      className="mt-6"
    >
      <span className={`deco-marker ${accentText[accent]}`}>FILE / interactive-ps-map</span>
      <h3 className={`font-mono text-[11px] font-bold uppercase tracking-wide3 mb-3 ${accentText[accent]}`}>
        Interactive PS map · {count?.toLocaleString() ?? "loading"} scatterers
      </h3>
      <p className="text-[13px] text-ink-mute mb-3.5 max-w-[760px] leading-[1.55]">
        All 2,656 detected persistent scatterers, colour-coded by vertical
        velocity. The strict EGMS-PSI gate (spatial coherence ≥&nbsp;0.70 in
        both stacks) keeps 2,555 of these as the final client-facing set;
        the map shows the full detection grid. Click any dot for the full
        attribute popup.
      </p>
      <div
        ref={elRef}
        className="rounded-xl border border-rule overflow-hidden"
        style={{
          height: 520,
          boxShadow: `0 0 0 1px ${accentHex[accent]}44, 0 22px 60px rgba(0,0,0,0.5)`,
        }}
      />
      {err && (
        <p className="mt-3 text-[12px] text-red font-mono">map error: {err}</p>
      )}
    </motion.div>
  );
}
