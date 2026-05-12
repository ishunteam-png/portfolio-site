/* map.js - interactive Leaflet map of the Delhi persistent scatterers,
 * inlined into the home page (project 04 deepdive). Loads when the map
 * container scrolls into view (saves ~2 MB of GeoJSON if the user never
 * reaches that section). */

(function () {
  "use strict";

  const mapEl = document.getElementById("ps-map-inline");
  if (!mapEl) return;
  if (typeof L === "undefined") {
    console.warn("Leaflet not loaded yet, retrying...");
    window.addEventListener("load", () => init());
  } else {
    init();
  }

  function init() {
    let inited = false;
    const start = () => {
      if (inited) return;
      inited = true;
      buildMap();
    };

    // Lazy load: only build the map when the container scrolls in
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              start();
              io.disconnect();
              break;
            }
          }
        },
        { rootMargin: "300px 0px" }
      );
      io.observe(mapEl);
    } else {
      start();
    }
  }

  function buildMap() {
    const map = L.map("ps-map-inline", {
      center: [28.587, 77.045],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Dark-friendly basemap
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">' +
          "OpenStreetMap</a> contributors &copy; " +
          '<a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    function colorForVU(v) {
      if (v <= -8)  return "#053061";
      if (v <= -4)  return "#2166ac";
      if (v <= -2)  return "#4393c3";
      if (v <= -1)  return "#92c5de";
      if (v <=  1)  return "#f7f7f7";
      if (v <=  2)  return "#f4a582";
      if (v <=  4)  return "#d6604d";
      return "#67001f";
    }
    const readVU = (p) =>
      p.v_vertical_mm_yr ?? p.V_U ?? p.v_u ?? p.velocity_mm_yr ?? 0;
    const readVE = (p) =>
      p.v_eastwest_local_mm_yr ?? p.V_E_local ??
      p.v_eastwest_observed_mm_yr ?? 0;

    function popupFor(feature) {
      const p = feature.properties || {};
      const fmt = (v) =>
        typeof v === "number" ? v.toFixed(2) : v != null ? String(v) : "-";
      return (
        '<div style="font-family:Inter,sans-serif;font-size:12px;line-height:1.5">' +
          '<b>Persistent Scatterer</b><br/>' +
          "V_U (vertical): <b>" + fmt(readVU(p)) + "</b> mm/yr<br/>" +
          "V_E (east-west): <b>" + fmt(readVE(p)) + "</b> mm/yr<br/>" +
          "V_LOS ASC: " + fmt(p.v_los_asc_mm_yr) + " mm/yr<br/>" +
          "V_LOS DSC: " + fmt(p.v_los_dsc_mm_yr) + " mm/yr<br/>" +
          "Temporal coh ASC: " + fmt(p.tcoh_asc) + "<br/>" +
          "Temporal coh DSC: " + fmt(p.tcoh_dsc) +
        "</div>"
      );
    }

    const info = L.control({ position: "topright" });
    info.onAdd = function () {
      const div = L.DomUtil.create("div", "legend-badge");
      div.innerHTML =
        "<b>Loading PS&hellip;</b><br/>" +
        "<small>Delhi (Najafgarh Road)</small>";
      return div;
    };
    info.addTo(map);

    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend-badge");
      div.innerHTML =
        "<b>V_U (mm/yr)</b><br/>" +
        '<div style="display:flex;align-items:center;gap:6px;margin-top:4px">' +
          '<span style="display:inline-block;width:14px;height:8px;background:#053061"></span>' +
          '<span style="font-size:11px">&le; -8 (subsidence)</span></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span style="display:inline-block;width:14px;height:8px;background:#92c5de"></span>' +
          '<span style="font-size:11px">-2 to -1</span></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span style="display:inline-block;width:14px;height:8px;background:#f7f7f7"></span>' +
          '<span style="font-size:11px">-1 to +1 (stable)</span></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span style="display:inline-block;width:14px;height:8px;background:#d6604d"></span>' +
          '<span style="font-size:11px">+2 to +4</span></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span style="display:inline-block;width:14px;height:8px;background:#67001f"></span>' +
          '<span style="font-size:11px">&ge; +4 (uplift)</span></div>';
      return div;
    };
    legend.addTo(map);

    fetch("assets/data/delhi_ps.geojson")
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((gj) => {
        const layer = L.geoJSON(gj, {
          pointToLayer: (feat, latlng) =>
            L.circleMarker(latlng, {
              radius: 4,
              fillColor: colorForVU(readVU(feat.properties)),
              color: "#0a0f1a",
              weight: 0.5,
              fillOpacity: 0.95,
            }),
          onEachFeature: (feat, lyr) => {
            lyr.bindPopup(popupFor(feat));
          },
        }).addTo(map);
        try {
          map.fitBounds(layer.getBounds(), { padding: [20, 20] });
        } catch (_) {}
        const count = (gj.features || []).length;
        info.getContainer().innerHTML =
          "<b>" + count.toLocaleString() + " Persistent Scatterers</b><br/>" +
          "<small>Delhi (Najafgarh Road) - click a dot</small>";
      })
      .catch((err) => {
        console.error("Failed to load PS GeoJSON:", err);
        info.getContainer().innerHTML =
          "<b>PS data unavailable</b><br/>" +
          "<small>" + err.message + "</small>";
      });
  }
})();
