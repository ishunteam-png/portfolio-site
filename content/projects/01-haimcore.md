---
code: "01"
slug: haimcore
tag: AI Product
category: ai
title: Haimcore
subtitle: Next.js AI workspace with Amirani assistant
role: Lead AI software engineer · freelance · 2025 – 2026
elevator: |
  Operational AI-assisted workspace for the Haimcore team. Users dump
  content into drafts, folders, notes, and specialised editors; Amirani —
  the in-product assistant — summarises across it and answers questions
  in context.
metrics:
  - { num: "3",  label: "Major releases" }
  - { num: "47", label: "Languages supported" }
  - { num: "v4", label: "UX overhaul" }
  - { num: "0",  label: "Downtime rollbacks" }
stack:
  - Next.js (pages)
  - Node.js
  - TypeScript
  - Anthropic SDK
  - Prisma + PostgreSQL
  - AWS EC2 + S3 + RDS
  - PowerShell deploy
pull_quote: >
  I've had to fall back to the snapshots once and it was worth the
  discipline.
---

## What I built

I built this as a Next.js application (pages router) with the API routes
doubling as the back-end. The workspace is folders and drafts on the left,
an editor in the middle, an Ask-About panel on the right. Specialised
editors for text, URLs (with an Open-Graph fetch that I had to put a small
SSRF guard around), images (vision-model description), and a "Note Mode"
that attaches notes to a specific folder or file.

Amirani is wired straight to Anthropic's SDK. Two small headaches I had to
work around: the shell environment on the EC2 host had an empty
`ANTHROPIC_API_KEY=` exported that was shadowing my `.env.local`, and a
stale `ANTHROPIC_BASE_URL=` from an older proxy experiment. I wrote a
tiny `resolveAnthropicKey()` in the legacy shim that reads `.env.local`
directly as a fallback and forces the base URL to `api.anthropic.com` —
saved me from ever debugging that one again.

There's a small *insight* route that the image describer and Ask-About
panel both post into. It appends to
`data/memory/summary_default_<date>.md` so the next Amirani call sees
today's AI-generated content as context. Closes the loop without me
having to design a full memory store.

The legacy-shim pattern is worth describing because it has saved me from
a class of bugs. Anything that used to live at
`pages/api/.../foo.js` moves to `lib/legacy/foo.js`, behind a thin v4
wrapper that adds CSRF + session handling. Each shim is exercised by the
smoke test on every deploy.

Auto-save is a 1.5-second idle trigger plus a final sync save on editor
unmount. There's an `onDraftRebind` subscription so when a new draft
swaps from a temporary optimistic ID to its real DB id, every component
holding that reference updates without re-rendering or losing focus.

Multilingual support across 47 languages including aliases. Came up in
the v3 release as a hard requirement from a real client.

Deploy story: tagged pre-deploy snapshots, source-only bundles uploaded
to S3, a Postgres rollback instance kept around for the v4 cut-over as
a safety net, a manual `pre-rollback-backup-<date>` folder before any
destructive change to source.

## The bits that bit me

After the v4 file overlay, the Anthropic SDK install lost `models.mjs`
and a couple of beta resources — the streaming endpoint then returned
an unhelpful 500. Reinstalling `@anthropic-ai/sdk@latest` fixed it, but
I now reinstall the SDK whenever I overlay a release rather than
trusting the file copy.

Two legacy shims (`system-health.js` + a missing
`workspace-synthesize.js`) had stale `../../../lib/X` imports after
their move. The build went red, the cut-over paused. After fixing them
I wrote a smoke check that exercises every shim before declaring a
deploy green.

Recovered a 729 MB Downloads folder from the Recycle Bin during an
incident-response session. Worth saying out loud: I now stash a daily
zip of `haimcore/` outside the working tree, because the Bin is not a
backup.
