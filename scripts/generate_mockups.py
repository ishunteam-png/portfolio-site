"""
Generate the two project mockup images that we don't have real screenshots
for: Haimcore (Next.js AI workspace) and Jalaram (hospital dashboard).

These are stylized representations matching the site's design language —
not fake screenshots claiming to be the real product UI.
"""
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, FancyArrowPatch
import numpy as np

OUT = Path(r"D:\CLAUDE\portfolio-site\assets\img")

# Site palette (dark theme)
BG    = "#0a0f1a"
ELEV  = "#0f1626"
CARD  = "#111b2e"
TINT  = "#13213a"
INK   = "#e6ecf5"
MUTE  = "#94a3b8"
DIM   = "#64748b"
ACCEN = "#4ea3ff"
WARM  = "#f0884b"
GREEN = "#2dd4bf"
RULE  = "#1e2a40"


# ----------------------------------------------------- Haimcore mockup
def make_haimcore():
    fig, ax = plt.subplots(figsize=(12, 7.2), dpi=160)
    ax.set_facecolor(BG)
    fig.patch.set_facecolor(BG)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 60)
    ax.set_aspect("auto")
    ax.axis("off")

    # Window chrome
    ax.add_patch(Rectangle((2, 1.5), 96, 57, facecolor=ELEV,
                            edgecolor=RULE, linewidth=0.8))
    # Title bar
    ax.add_patch(Rectangle((2, 53), 96, 5.5, facecolor=CARD,
                            edgecolor="none"))
    for cx, cc in [(5, "#ff5f56"), (8, "#ffbd2e"), (11, "#27c93f")]:
        ax.add_patch(plt.Circle((cx, 55.75), 0.75, facecolor=cc,
                                 edgecolor="none"))
    ax.text(50, 55.75, "haimcore  /  workspace",
             ha="center", va="center", fontsize=10, color=DIM)

    # Left sidebar (folders/drafts)
    ax.add_patch(Rectangle((2, 1.5), 22, 51.5, facecolor=CARD,
                            edgecolor=RULE, linewidth=0.6))
    ax.text(4, 49, "WORKSPACE", fontsize=8, color=ACCEN,
             fontweight="bold")
    ax.text(4, 47.3, "folders / drafts / notes", fontsize=8.5,
             color=DIM, style="italic")
    # folder list
    folder_items = [
        ("client-a", True),
        ("  draft-2026-05", False),
        ("  draft-2026-04", False),
        ("client-b", True),
        ("  url-research", False),
        ("  meeting-notes", False),
        ("research", True),
        ("  ai-trends.md", False),
        ("notes", True),
        ("  daily-2026-05-12", False),
    ]
    y = 44
    for label, is_folder in folder_items:
        prefix = "+ " if is_folder else "  "
        color = INK if is_folder else MUTE
        weight = "bold" if is_folder else "normal"
        ax.text(4.5, y, prefix + label, fontsize=8.5, color=color,
                 family="monospace", fontweight=weight)
        y -= 2.2

    # Highlight a selected draft
    ax.add_patch(Rectangle((3.5, 35.8), 19, 1.8, facecolor=TINT,
                            edgecolor=ACCEN, linewidth=0.6))

    # Centre editor pane
    ax.add_patch(Rectangle((24.5, 1.5), 48, 51.5, facecolor=ELEV,
                            edgecolor=RULE, linewidth=0.6))
    # Editor tabs
    ax.add_patch(Rectangle((24.5, 47.5), 48, 5.5, facecolor=CARD,
                            edgecolor="none"))
    ax.text(28, 50.2, "client-a / draft-2026-05.md", fontsize=9,
             color=INK, family="monospace", fontweight="bold")
    ax.add_patch(Rectangle((26.5, 49.2), 26, 0.15, facecolor=ACCEN))

    # Editor text lines
    editor_lines = [
        ("# How we should approach the InSAR pilot", INK, "bold", 11),
        ("", None, None, 0),
        ("The strict EGMS-L3 deliverable means we need", MUTE, "normal", 9),
        ("ASC + DSC coverage at the AOI. A 30-second", MUTE, "normal", 9),
        ("ASF probe before quoting any new site.", MUTE, "normal", 9),
        ("", None, None, 0),
        ("## What I'd commit to", INK, "bold", 9.5),
        ("- 165 Sentinel-1 SLCs, 3-year window", MUTE, "normal", 9),
        ("- SNAP + MintPy + PyAPS3 pipeline", MUTE, "normal", 9),
        ("- ITRF14 frame via Indian-plate PMM tie", MUTE, "normal", 9),
        ("- 2D V_U + V_E decomposition", MUTE, "normal", 9),
        ("", None, None, 0),
        ("[1.5s idle - auto-saved]", DIM, "italic", 8),
    ]
    y = 44.5
    for txt, col, weight, sz in editor_lines:
        if txt:
            ax.text(27, y, txt, fontsize=sz, color=col,
                     family=("monospace" if "code" not in str(weight) else "sans-serif"),
                     style=("italic" if weight == "italic" else "normal"),
                     fontweight=("bold" if weight == "bold" else "normal"))
        y -= 2.0

    # Amirani panel on the right
    ax.add_patch(Rectangle((73, 1.5), 25, 51.5, facecolor=CARD,
                            edgecolor=RULE, linewidth=0.6))
    # Amirani header
    ax.text(75, 50.5, "AMIRANI", fontsize=9, color=WARM,
             fontweight="bold")
    ax.text(75, 48.9, "in-product AI assistant", fontsize=8.5,
             color=DIM, style="italic")

    # Chat bubble: user
    ax.add_patch(FancyBboxPatch((75, 41), 21, 5,
                                  boxstyle="round,pad=0.2,rounding_size=0.6",
                                  facecolor=TINT, edgecolor=RULE,
                                  linewidth=0.5))
    ax.text(75.8, 44.3, "You", fontsize=7.5, color=ACCEN,
             fontweight="bold")
    ax.text(75.8, 42.5, "Summarise across all my", fontsize=8,
             color=INK)
    ax.text(75.8, 41.4, "InSAR drafts this week.", fontsize=8,
             color=INK)

    # Amirani response
    ax.add_patch(FancyBboxPatch((75, 24), 21, 15,
                                  boxstyle="round,pad=0.2,rounding_size=0.6",
                                  facecolor=ELEV, edgecolor=ACCEN,
                                  linewidth=0.6))
    ax.text(75.8, 37.5, "Amirani", fontsize=7.5, color=WARM,
             fontweight="bold")
    bullet_lines = [
        "- 5 drafts touched, all on the",
        "  SATALITE pilot scope.",
        "- Common theme: dual-track",
        "  feasibility check first.",
        "- Open question: ITRF2020 vs",
        "  ITRF14 frame choice.",
        "- Decision needed before",
        "  Kolkata quote.",
    ]
    y = 35.5
    for line in bullet_lines:
        ax.text(75.8, y, line, fontsize=8, color=INK)
        y -= 1.35

    # Input box
    ax.add_patch(Rectangle((75, 4), 21, 4, facecolor=BG,
                            edgecolor=RULE, linewidth=0.5))
    ax.text(75.8, 5.5, "Ask Amirani...", fontsize=8.5, color=DIM,
             style="italic")
    ax.text(94.5, 5.5, "->", fontsize=10, color=ACCEN,
             fontweight="bold")

    # Status bar bottom
    ax.add_patch(Rectangle((2, 0.2), 96, 1.3, facecolor=CARD,
                            edgecolor="none"))
    ax.text(4, 0.85, "v4.1", fontsize=7.5, color=DIM,
             family="monospace")
    ax.text(50, 0.85, "EN  |  47 languages available",
             fontsize=7.5, color=DIM, family="monospace",
             ha="center")
    ax.text(94, 0.85, "auto-saved 0.2s ago", fontsize=7.5,
             color=GREEN, family="monospace", ha="right")

    plt.tight_layout(pad=0.5)
    p = OUT / "haimcore_workspace_mock.png"
    plt.savefig(p, dpi=160, facecolor=BG, edgecolor="none")
    plt.close(fig)
    print(f"wrote {p}  ({p.stat().st_size:,} bytes)")


# ----------------------------------------------------- Jalaram mockup
def make_jalaram():
    fig, ax = plt.subplots(figsize=(12, 7.2), dpi=160)
    ax.set_facecolor(BG)
    fig.patch.set_facecolor(BG)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 60)
    ax.axis("off")

    # Window chrome
    ax.add_patch(Rectangle((2, 1.5), 96, 57, facecolor=ELEV,
                            edgecolor=RULE, linewidth=0.8))
    ax.add_patch(Rectangle((2, 53), 96, 5.5, facecolor=CARD,
                            edgecolor="none"))
    for cx, cc in [(5, "#ff5f56"), (8, "#ffbd2e"), (11, "#27c93f")]:
        ax.add_patch(plt.Circle((cx, 55.75), 0.75, facecolor=cc,
                                 edgecolor="none"))
    ax.text(50, 55.75, "shreejalaramhospital.live  -  Doctor dashboard",
             ha="center", va="center", fontsize=10, color=DIM)

    # Top stats strip
    stats = [
        ("18", "appointments today", ACCEN),
        ("4", "overdue follow-ups", WARM),
        ("3", "irregular-cycle alerts", WARM),
        ("12", "completed", GREEN),
        ("2", "missed", "#f87171"),
    ]
    x = 6
    for num, lbl, col in stats:
        ax.add_patch(FancyBboxPatch((x, 44), 16, 6.5,
                                      boxstyle="round,pad=0.1,rounding_size=0.4",
                                      facecolor=CARD, edgecolor=RULE,
                                      linewidth=0.5))
        ax.text(x + 8, 48.5, num, fontsize=18, color=col,
                 fontweight="bold", ha="center", family="monospace")
        ax.text(x + 8, 45.5, lbl, fontsize=7.5, color=MUTE,
                 ha="center", family="monospace",
                 fontweight="bold")
        x += 17.6

    # Left pane: today's roster
    ax.add_patch(Rectangle((4, 4), 44, 38.5, facecolor=CARD,
                            edgecolor=RULE, linewidth=0.6))
    ax.text(6, 40, "TODAY'S ROSTER", fontsize=8.5, color=ACCEN,
             fontweight="bold")
    ax.text(6, 38.3, "IST  |  Dr. Bhavna Patel",
             fontsize=8, color=DIM, style="italic")

    roster = [
        ("09:00", "PAT-0142", "Soni M.", "ANC visit", GREEN, "completed"),
        ("09:30", "PAT-0987", "Riya S.",   "Cycle follow-up", GREEN, "completed"),
        ("10:00", "PAT-0204", "Anita K.",  "Consultation", ACCEN, "in progress"),
        ("10:30", "PAT-0445", "Meera J.",  "Pregnancy 28w", DIM,  "scheduled"),
        ("11:00", "PAT-0612", "Kavya R.",  "Ultrasound review", DIM, "scheduled"),
        ("11:30", "PAT-0833", "Priya N.",  "Annual check", DIM, "scheduled"),
        ("12:00", "PAT-0701", "Neha S.",   "Post-op", DIM, "scheduled"),
        ("--", "PAT-0220", "Pooja D.", "Missed - rescheduled", "#f87171", "missed"),
    ]
    y = 35.5
    for tm, pid, name, reason, col, status in roster:
        ax.text(6, y, tm, fontsize=8.5, color=col,
                 family="monospace", fontweight="bold")
        ax.text(12, y, pid, fontsize=8, color=DIM,
                 family="monospace")
        ax.text(20, y, name, fontsize=8.5, color=INK)
        ax.text(32, y, reason, fontsize=8, color=MUTE)
        # status dot
        ax.add_patch(plt.Circle((46.5, y + 0.4), 0.35,
                                 facecolor=col, edgecolor="none"))
        y -= 1.95

    # Right pane: AI insights
    ax.add_patch(Rectangle((50, 22), 46, 20.5, facecolor=CARD,
                            edgecolor=RULE, linewidth=0.6))
    ax.text(52, 40, "AI INSIGHTS  /  GPT-4o", fontsize=8.5,
             color=WARM, fontweight="bold")
    ax.text(52, 38.3, "anonymised roster - 3 priorities for today",
             fontsize=8, color=DIM, style="italic")

    ai_bullets = [
        "1. Cycle alerts for 3 patients exceed",
        "   the 21/35-day band. Consider a brief",
        "   re-eval before next month's roster.",
        "",
        "2. PAT-0445 (28w) flagged HIGH_RISK in",
        "   last consultation. Verify BP + EDD",
        "   before today's review.",
        "",
        "3. 4 follow-ups are now > 7 days overdue.",
        "   Recommend staff trigger call attempts.",
    ]
    y = 36.5
    for line in ai_bullets:
        col = INK if line and not line.startswith(" ") else MUTE
        ax.text(52, y, line, fontsize=8, color=col)
        y -= 1.4

    # Bottom right: clinical copilot
    ax.add_patch(Rectangle((50, 4), 46, 16.5, facecolor=CARD,
                            edgecolor=RULE, linewidth=0.6))
    ax.text(52, 18, "JALARAM SUPER-AI  /  COPILOT",
             fontsize=8.5, color=GREEN, fontweight="bold")
    ax.text(52, 16.4, "tool-calling clinical chat", fontsize=8,
             color=DIM, style="italic")

    # Chat history snippet
    ax.text(52, 14, "Dr. Bhavna:  Pull PAT-0204's last 3 visits",
             fontsize=8.5, color=ACCEN, family="monospace")
    ax.text(52, 12.4, "Copilot:  [search_patients]  [get_patient_context]",
             fontsize=8.5, color=WARM, family="monospace")
    ax.text(52, 10.8, "  Found PAT-0204 (Anita Khanna).",
             fontsize=8.5, color=INK)
    ax.text(52, 9.4, "  Last 3 visits: 14-Apr (cycle), 28-Mar",
             fontsize=8.5, color=INK)
    ax.text(52, 8.0, "  (annual), 12-Feb (consultation). All",
             fontsize=8.5, color=INK)
    ax.text(52, 6.6, "  vitals normal except mild anaemia in",
             fontsize=8.5, color=INK)
    ax.text(52, 5.2, "  Apr labs. Iron supplement prescribed.",
             fontsize=8.5, color=INK)

    # Status bar
    ax.add_patch(Rectangle((2, 0.2), 96, 1.3, facecolor=CARD,
                            edgecolor="none"))
    ax.text(4, 0.85, "Prisma 6 + Postgres", fontsize=7.5,
             color=DIM, family="monospace")
    ax.text(50, 0.85, "EC2  |  Nginx  |  PM2  |  JWT cookies",
             fontsize=7.5, color=DIM, family="monospace",
             ha="center")
    ax.text(94, 0.85, "live in production", fontsize=7.5,
             color=GREEN, family="monospace", ha="right")

    plt.tight_layout(pad=0.5)
    p = OUT / "jalaram_dashboard_mock.png"
    plt.savefig(p, dpi=160, facecolor=BG, edgecolor="none")
    plt.close(fig)
    print(f"wrote {p}  ({p.stat().st_size:,} bytes)")


if __name__ == "__main__":
    make_haimcore()
    make_jalaram()
