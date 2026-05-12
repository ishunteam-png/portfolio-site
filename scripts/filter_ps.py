"""Filter the Delhi PS GeoJSON down to the strict EGMS-PSI set
(temporal coherence >= 0.70 in BOTH stacks)."""
import json
import pathlib

src = pathlib.Path(r"D:\CLAUDE\portfolio-site\assets\data\delhi_ps.geojson")
dst = src.with_name("delhi_ps_egms.geojson")
gj = json.loads(src.read_text(encoding="utf-8"))

kept = [
    f for f in gj["features"]
    if f["properties"].get("tcoh_asc", 0) >= 0.70
    and f["properties"].get("tcoh_dsc", 0) >= 0.70
]

raw_count = len(gj["features"])
kept_count = len(kept)
print(f"Raw  features: {raw_count}")
print(f"Kept features: {kept_count} "
      f"(tcoh_asc >= 0.70 AND tcoh_dsc >= 0.70)")
gj["features"] = kept
dst.write_text(json.dumps(gj), encoding="utf-8")
print(f"Wrote {dst} ({dst.stat().st_size:,} bytes)")
