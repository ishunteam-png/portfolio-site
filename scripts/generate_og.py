"""
Generate the Open Graph card (assets/img/og.png) for the site.
1200x630 is the recommended OG image size for LinkedIn / Twitter / Slack.
"""
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle
import numpy as np

OUT = Path(r"D:\CLAUDE\portfolio-site\assets\img\og.png")
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630
fig = plt.figure(figsize=(W / 200, H / 200), dpi=200)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_facecolor("#0a0f1a")
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.axis("off")

# Background grid
for x in range(0, W, 80):
    ax.axvline(x, color="white", linewidth=0.3, alpha=0.04, zorder=1)
for y in range(0, H, 80):
    ax.axhline(y, color="white", linewidth=0.3, alpha=0.04, zorder=1)

# Concentric arcs lower-right
for r in range(40, 260, 12):
    ax.add_patch(Circle((W - 100, 100), r, fill=False,
                         color="#1f6feb", linewidth=0.5,
                         alpha=max(0.05, 0.35 - r * 0.0015)))

# Floating squares cluster (top-right)
rng = np.random.default_rng(7)
for _ in range(80):
    x = rng.uniform(640, W - 80)
    y = rng.uniform(380, H - 40)
    s = rng.uniform(3, 12)
    a = rng.uniform(0.06, 0.30)
    ax.add_patch(Rectangle((x, y), s, s, facecolor="#4ea3ff",
                            alpha=a, edgecolor="none"))

# Accent vertical bar
ax.add_patch(Rectangle((60, 80), 5, H - 160, facecolor="#1f6feb"))

# Name
ax.text(95, 460, "Ishu Singh", fontsize=64, color="white",
         fontweight="bold")
ax.text(95, 405, "AI / Automation Engineer  -  InSAR & Geospatial  -  Full-Stack",
         fontsize=22, color="#4ea3ff", fontweight="bold")

# Lead
ax.text(95, 320,
        "I build AI-assisted software and the plumbing around it.",
        fontsize=20, color="#e6ecf5")
ax.text(95, 285,
        "Five projects: Haimcore, Relief Guru, Jalaram Hospital,",
        fontsize=18, color="#94a3b8")
ax.text(95, 257,
        "SATALITE Delhi, SATALITE Kite Beach.",
        fontsize=18, color="#94a3b8")

# Contact pills along the bottom
pill_specs = [
    "Tbilisi, Georgia",
    "singhishu2060@gmail.com",
    "+995 555 114 467",
]
x = 95
for txt in pill_specs:
    w = 18 + len(txt) * 9
    ax.add_patch(Rectangle((x, 100), w, 38, facecolor="#111b2e",
                            edgecolor="#1f6feb", linewidth=1))
    ax.text(x + 12, 113, txt, fontsize=14, color="#e6ecf5")
    x += w + 14

# Watermark mono code on far right
ax.text(W - 95, 540, "01 / 02 / 03 / 04 / 05",
        fontsize=16, color="#1f6feb", ha="right",
        family="monospace", fontweight="bold")

plt.savefig(OUT, dpi=200, facecolor="#0a0f1a")
plt.close(fig)
print(f"Wrote {OUT}  ({OUT.stat().st_size:,} bytes)")
