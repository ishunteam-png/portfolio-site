"""
Markdown -> project HTML build pipeline (optional).

Each project deep-dive page already exists as hand-written HTML in
projects/<slug>.html. This script is the alternative entry point if
you'd rather edit one markdown file per project and regenerate the HTML.

  python scripts/build_site.py            # rebuilds projects/*.html
  python scripts/build_site.py --check    # diff-only mode (no writes)

Content lives in content/projects/*.md with a YAML frontmatter:

  ---
  code: "01"
  slug: haimcore
  tag: AI Product
  category: ai
  title: Haimcore
  subtitle: Next.js AI workspace with Amirani assistant
  role: Lead AI software engineer ...
  elevator: |
    Multi-line elevator...
  metrics:
    - { num: "3", label: "Major releases" }
    ...
  stack: [Next.js, Node.js, ...]
  pull_quote: >
    Quoted line.
  ---

  ## What I built
  Markdown content here.

  ## The bits that bit me
  More markdown.

A tiny in-process parser handles YAML frontmatter + a minimal Markdown
subset (headings, paragraphs, inline `code`, **bold**, *italic*).
No external deps - this is meant to run on a stock Python.
"""
from pathlib import Path
import html
import re
import sys

ROOT       = Path(__file__).resolve().parent.parent
CONTENT    = ROOT / "content" / "projects"
OUT_DIR    = ROOT / "projects"
TEMPLATE   = """\
<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} - Ishu Singh</title>
  <meta name="description" content="{elevator_short}" />
  <link rel="icon" type="image/svg+xml" href="../assets/img/favicon.svg" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
</head>
<body>
<nav id="nav" class="nav">
  <a href="../index.html" class="brand">
    <span class="brand-dot"></span>
    <span class="brand-name">Ishu Singh</span>
    <span class="brand-meta">/ Project {code} - {title}</span>
  </a>
  <div class="nav-actions">
    <button id="cmdk-trigger" class="cmdk-hint">
      <span class="kbd">&#8984;</span><span class="kbd">K</span>
    </button>
    <button id="theme-toggle" class="theme-toggle">
      <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
      <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  </div>
</nav>
<main class="project-page">
  <div class="container">
    <a href="../index.html#work" class="crumb">&larr; All projects</a>
    <div class="project-head">
      <span class="project-code">{code}</span>
      <span class="project-tag">{tag}</span>
    </div>
    <h1 class="project-title">{title}</h1>
    <p class="project-sub">{subtitle}</p>
    <p class="project-elevator">{elevator}</p>
    <div class="project-numbers">{metrics_html}</div>

    <div class="project-body">
      {body_html}
      <div class="project-stack">{stack_html}</div>
    </div>

  </div>
</main>
<script src="../assets/js/main.js"></script>
<script src="../assets/js/cmdk-project.js"></script>
</body>
</html>
"""


def parse_frontmatter(text):
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    head, body = text[3:end], text[end + 4:].lstrip("\n")
    data = {}
    cur_key = None
    cur_block = None  # for | or > blocks
    cur_list = None   # for "- " lists
    for line in head.splitlines():
        if not line.strip():
            continue
        if cur_block is not None:
            # accumulate folded/literal block
            if line.startswith("  "):
                cur_block.append(line[2:])
                continue
            else:
                data[cur_key] = "\n".join(cur_block).strip()
                cur_block = None
        if cur_list is not None:
            if line.lstrip().startswith("- "):
                item = line.lstrip()[2:]
                if item.startswith("{") and item.endswith("}"):
                    # rudimentary inline-object: { num: "3", label: "x" }
                    obj = {}
                    for piece in item.strip("{}").split(","):
                        if ":" in piece:
                            k, v = piece.split(":", 1)
                            obj[k.strip()] = v.strip().strip('"').strip("'")
                    cur_list.append(obj)
                else:
                    cur_list.append(item.strip().strip('"').strip("'"))
                continue
            else:
                data[cur_key] = cur_list
                cur_list = None

        m = re.match(r"^([a-zA-Z_]+):\s*(.*)$", line)
        if not m:
            continue
        key, val = m.group(1), m.group(2)
        cur_key = key
        if val == "|" or val == ">":
            cur_block = []
        elif val == "":
            cur_list = []
        elif val.startswith("[") and val.endswith("]"):
            data[key] = [
                v.strip().strip('"').strip("'")
                for v in val.strip("[]").split(",")
            ]
        else:
            data[key] = val.strip().strip('"').strip("'")
    # flush
    if cur_block is not None:
        data[cur_key] = "\n".join(cur_block).strip()
    if cur_list is not None:
        data[cur_key] = cur_list
    return data, body


def md_to_html(text):
    """Minimal markdown subset: H2, paragraphs, inline `code`, **bold**,
    *italic*. Good enough for project narrative pages."""
    out = []
    paragraph = []
    def flush_para():
        if not paragraph:
            return
        joined = " ".join(paragraph)
        joined = re.sub(
            r"`([^`]+)`",
            lambda m: f"<code>{html.escape(m.group(1))}</code>",
            joined,
        )
        joined = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", joined)
        joined = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", joined)
        out.append(f"<p>{joined}</p>")
        paragraph.clear()

    for line in text.splitlines():
        if line.startswith("## "):
            flush_para()
            label = line[3:].strip().upper()
            out.append(f'<span class="story-label">{label}</span>')
        elif not line.strip():
            flush_para()
        else:
            paragraph.append(line.strip())
    flush_para()
    return "\n      ".join(out)


def render(data, body_md):
    code = data.get("code", "")
    title = data.get("title", "")
    subtitle = data.get("subtitle", "")
    tag = data.get("tag", "")
    role = data.get("role", "")
    elevator = data.get("elevator", "").replace("\n", " ").strip()
    elevator_short = (elevator[:155] + "...") if len(elevator) > 158 else elevator
    metrics = data.get("metrics", [])
    metrics_html = "".join(
        f'<div class="item"><span class="n">{html.escape(m["num"])}</span>'
        f'<span class="l">{html.escape(m["label"])}</span></div>'
        for m in metrics
    )
    stack = data.get("stack", [])
    stack_html = "".join(f"<span>{html.escape(s)}</span>" for s in stack)
    body_html = md_to_html(body_md)
    if data.get("pull_quote"):
        pq = html.escape(data["pull_quote"].strip())
        body_html += f'\n      <div class="pull-quote">&ldquo;{pq}&rdquo;</div>'
    return TEMPLATE.format(
        title=html.escape(title),
        subtitle=html.escape(subtitle),
        code=html.escape(code),
        tag=html.escape(tag),
        elevator=html.escape(elevator),
        elevator_short=html.escape(elevator_short),
        metrics_html=metrics_html,
        stack_html=stack_html,
        body_html=body_html,
    )


def main():
    check = "--check" in sys.argv
    if not CONTENT.exists():
        print(f"No content dir at {CONTENT} - nothing to do.")
        return 0
    sources = sorted(CONTENT.glob("*.md"))
    if not sources:
        print("No markdown content found.")
        return 0
    for src in sources:
        text = src.read_text(encoding="utf-8")
        data, body = parse_frontmatter(text)
        slug = data.get("slug")
        if not slug:
            print(f"  SKIP {src.name} - no slug in frontmatter")
            continue
        html_out = render(data, body)
        dst = OUT_DIR / f"{slug}.html"
        if check:
            existing = dst.read_text(encoding="utf-8") if dst.exists() else ""
            same = existing.strip() == html_out.strip()
            print(f"  {src.name:30s} -> {dst.name:30s} "
                  f"{'unchanged' if same else 'WOULD CHANGE'}")
        else:
            dst.write_text(html_out, encoding="utf-8")
            print(f"  wrote {dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
