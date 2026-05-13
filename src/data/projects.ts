// All five project case studies. Single source of truth — components
// render from this. Edit here, the site reflects it.

export type StackRow = { name: string; note: string };

export type Metric = { num: string; label: string };

export type ProjectStatus =
  | "live"
  | "shipped"
  | "delivered"
  | "validated";

export interface Project {
  code: string;            // "01"
  id: string;              // "proj-01"
  slug: string;
  accent:
    | "lime"
    | "cyan"
    | "coral"
    | "mint"
    | "violet"
    | "amber";
  tag: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  elevator: string;
  status: ProjectStatus;
  statusLabel: string;
  heroImage: string;
  supplementalImages?: string[];
  highlights: string[];
  stack: StackRow[];
  metrics: Metric[];
  built: string[];      // deep-dive paragraphs (HTML allowed)
  bites: string[];      // war stories (HTML allowed)
  liveUrl?: string;
  liveLabel?: string;
  hasMap?: boolean;     // project 04: inline Leaflet
  hasArch?: boolean;    // project 02: inline SVG architecture
  pullQuote?: string;
}

export const PROJECTS: Project[] = [
  // -----------------------------------------------------------------
  {
    code: "01",
    id: "proj-01",
    slug: "haimcore",
    accent: "cyan",
    tag: "AI Workspace",
    title: "Haimcore",
    subtitle: "Next.js AI workspace with Amirani assistant",
    period: "2025 – 2026",
    role: "Lead AI software engineer · freelance",
    status: "shipped",
    statusLabel: "3 releases shipped",
    heroImage: "/img/haimcore_workspace_mock.png",
    elevator:
      "Operational AI-assisted workspace where users dump content into drafts, folders and notes — Amirani, the in-product assistant, summarises across it and answers questions in context. I owned the product across three releases and the deploy / rollback pipeline that keeps prod survivable.",
    highlights: [
      "<b>Three production releases shipped</b> — v3 multilingual, v3.1 stability, v4 UX overhaul — with a tagged pre-deploy snapshot &amp; rollback path. Zero downtime rollbacks.",
      "<b>Amirani wired direct to Anthropic&rsquo;s SDK</b> with a lazy <code>resolveAnthropicKey()</code> that reads <code>.env.local</code> when the shell shadows it, plus a forced base URL.",
      "<b>Legacy-shim pattern</b> — old <code>pages/api/.../foo.js</code> routes moved to <code>lib/legacy/foo.js</code> behind v4 CSRF + session wrappers; smoke-tested on every deploy.",
      "<b>Multilingual across 47 languages</b> with aliases &amp; fuzzy lookup in the AI Actions menu — non-English keyboards still find the right option.",
    ],
    stack: [
      { name: "Anthropic SDK",       note: "drives Amirani's reasoning calls; lazy-keyed resolver dodges shadowed env vars" },
      { name: "Next.js (pages)",     note: "workspace UI + thin API surface; folders / drafts / notes / specialised editors" },
      { name: "Prisma + Postgres",   note: "workspace store, memory summaries, audit log" },
      { name: "AWS EC2 + S3",        note: "hosting + tagged-snapshot deploy bundles" },
      { name: "PowerShell",          note: "auto-deploy scripts with rollback safety net" },
    ],
    metrics: [
      { num: "3",  label: "major releases" },
      { num: "47", label: "languages" },
      { num: "0",  label: "downtime rollbacks" },
    ],
    pullQuote: "I&rsquo;ve had to fall back to the snapshots once and it was worth the discipline.",
    built: [
      "I built this as a Next.js application (pages router) with the API routes doubling as the back-end. The workspace is folders and drafts on the left, an editor in the middle, an Ask-About panel on the right. Specialised editors for text, URLs (with an Open-Graph fetch I had to put a small SSRF guard around), images (vision-model description), and a &ldquo;Note Mode&rdquo; that attaches notes to a specific folder or file.",
      "Amirani is wired straight to Anthropic&rsquo;s SDK. Two small headaches I worked around: the shell environment on the EC2 host had an empty <code>ANTHROPIC_API_KEY=</code> exported that was shadowing my <code>.env.local</code>, and a stale <code>ANTHROPIC_BASE_URL=</code> from an older proxy experiment. I wrote a tiny <code>resolveAnthropicKey()</code> in the legacy shim that reads <code>.env.local</code> directly as a fallback and forces the base URL to <code>api.anthropic.com</code> — saved me from ever debugging that one again.",
      "A small <i>insight</i> route that the image describer and Ask-About panel both post into. It appends to <code>data/memory/summary_default_&lt;date&gt;.md</code> so the next Amirani call sees today&rsquo;s AI-generated content as context. Closes the loop without me having to design a full memory store.",
      "Auto-save is a 1.5&thinsp;second idle trigger plus a final sync save on editor unmount. There&rsquo;s an <code>onDraftRebind</code> subscription so when a new draft swaps from a temporary optimistic ID to its real DB id, every component holding that reference updates without re-rendering or losing focus.",
      "Deploy story: tagged pre-deploy snapshots, source-only bundles uploaded to S3, a Postgres rollback instance kept around for the v4 cut-over as a safety net, a manual <code>pre-rollback-backup-&lt;date&gt;</code> folder before any destructive change to source. I keep the rollback instance alive for at least 7 days after a cut-over — long enough that any &ldquo;wait, where did that record go?&rdquo; from a real user lands while I still have the data.",
    ],
    bites: [
      "After the v4 file overlay, the Anthropic SDK install lost <code>models.mjs</code> and a couple of beta resources — the streaming endpoint returned an unhelpful 500. Reinstalling <code>@anthropic-ai/sdk@latest</code> fixed it, but I now reinstall the SDK whenever I overlay a release rather than trusting the file copy.",
      "Two legacy shims (<code>system-health.js</code> + a missing <code>workspace-synthesize.js</code>) had stale <code>../../../lib/X</code> imports after their move. The build went red, the cut-over paused. After fixing them I wrote a smoke check that exercises every shim before declaring a deploy green.",
      "Recovered a 729&nbsp;MB Downloads folder from the Recycle Bin during an incident-response session. Worth saying out loud: I now stash a daily zip of <code>haimcore/</code> outside the working tree, because the Bin is not a backup.",
    ],
  },

  // -----------------------------------------------------------------
  {
    code: "02",
    id: "proj-02",
    slug: "relief-guru",
    accent: "coral",
    tag: "Workflow Automation",
    title: "Relief Guru",
    subtitle: "Telegram-driven AI avatar video pipeline",
    period: "2025 – 2026",
    role: "AI automation engineer · freelance",
    status: "shipped",
    statusLabel: "v4 in production",
    heroImage: "/img/relief_guru_arch.png",
    hasArch: true,
    elevator:
      "A pharmacy-content business needed to publish AI avatar videos across YouTube, LinkedIn and Instagram, controlled from Telegram so non-developers can run it. I built that pipeline as seven coordinated n8n workflows — V1 was one giant graph and impossible to debug.",
    highlights: [
      "<b>Seven single-purpose workflows</b> — <code>WF1A</code> intake router, <code>WF1B</code> script generator, <code>WF2A</code> HeyGen video, approval bridge, <code>WF2B</code> posting core, <code>WF3</code> tracker, layout callback. Every failure traceable to a single workflow ID.",
      "<b>Defensive HeyGen payload parser</b> probes every reasonable JSON path for the script + avatar/voice IDs and hard-fails locally with the keys it saw — way better than HeyGen&rsquo;s opaque &ldquo;Bad request&rdquo; 90 seconds later.",
      "<b>Idempotency guard</b> via n8n static workflow data: <code>run_id&nbsp;&rarr;&nbsp;timestamp</code> for 30 minutes, prevents Telegram retries from spawning duplicate HeyGen renders.",
      "<b>Sticky Telegram message UX</b> — the workflow edits one message in place across the lifecycle of a task rather than spamming the chat. Looks like a progress bar.",
    ],
    stack: [
      { name: "n8n (V4)",            note: "seven coordinated workflows, single-purpose webhooks per step" },
      { name: "Telegram Bot API",    note: "operator UI; slash commands; sticky-message progress" },
      { name: "OpenAI embeddings",   note: "text-embedding-3-small on every brief for template retrieval" },
      { name: "Pinecone (vector)",   note: "template store + tracker memory" },
      { name: "HeyGen v2 API",       note: "avatar video generation with 40×30s poll loop" },
      { name: "Google / LinkedIn",   note: "native posting to YouTube / Drive / LinkedIn / Instagram" },
    ],
    metrics: [
      { num: "7",       label: "n8n workflows" },
      { num: "3",       label: "social channels" },
      { num: "40×30s",  label: "HeyGen poll cap" },
    ],
    pullQuote: "V1 was one giant n8n workflow. Splitting it into seven single-purpose webhooks made every failure traceable to a single workflow ID.",
    built: [
      "<b>Why seven workflows.</b> V1 was one giant n8n workflow with branching logic and &ldquo;sub-functions&rdquo; called by HTTP. It worked until the day it didn&rsquo;t, and when it broke I couldn&rsquo;t tell whether the failure was at intake, at script generation, at HeyGen, or at posting. V4 splits it into single-purpose webhooks.",
      "<b>WF1A — Intake Router.</b> Telegram webhook into n8n. Admin whitelist by chat&nbsp;ID. Slash-command parser: <code>/start, /help, /avatars, /voices, /templates, /new, /refresh_avatars, /refresh_voices, /status, /last, /company</code>. Routes the request into the right downstream workflow with a stable <code>run_id</code>.",
      "<b>WF1B — Template + Script Generator.</b> Take the brief, embed it with OpenAI <code>text-embedding-3-small</code>, query Pinecone against the <i>templates</i> namespace. Top-10 normally, top-100 if the operator gave a template hint, optional <code>content_purpose</code> filter. GPT writes the script against the closest template.",
      "<b>WF2A — HeyGen Video Generation.</b> The hairy one. Studio app posts a payload that, depending on which trigger fired, has the script under <code>body.script</code>, <code>body.video_inputs[0].voice.input_text</code>, <code>body.text</code>, or somewhere else. I wrote a <i>Parse Studio Payload</i> node that probes every reasonable path and, as a last-ditch, walks the whole payload looking for a string field with a name like script / text / input_text longer than 20 characters.",
      "<b>Idempotency guard.</b> n8n&rsquo;s static workflow data stores <code>run_id &rarr; timestamp</code> for in-flight runs. A duplicate <code>run_id</code> within 30 minutes throws. Cleared lazily on every entry. Prevents Telegram retries from spawning a second HeyGen render.",
      "<b>Sticky messages.</b> Rather than spamming the chat with &ldquo;recording&hellip; rendering&hellip; uploading&hellip; posted&rdquo;, the workflow edits a single Telegram message in place. Same <code>message_id</code> for the lifecycle of the task.",
      "<b>WF3 — Tracker Engine.</b> Every step in every run logs a row with <code>task_id, trace_id, log_type, workflow_id, step, status, state, embed_text</code>. The <code>embed_text</code> goes back into Pinecone so the next run can retrieve &ldquo;what did we say about this topic last time&rdquo;.",
    ],
    bites: [
      "HeyGen used to fail silently because <code>input_text</code> was empty — the script was nested deeper in the payload than the parser knew about. After two of these I rewrote the parser to be paranoid. Last revision: <code>v2026-05-03 rev2</code>.",
      "Telegram&rsquo;s <i>Edit Sticky</i> HTTP node returns its own <code>{ok, result, &hellip;}</code> object, which becomes <code>$json</code> for the next code node. Lost ~30 minutes before realising &ldquo;script missing&rdquo; was actually the upstream context being shadowed.",
      "Operationally, the seven-workflow split is more code but less rework. The whole point is that the next time <i>posting to LinkedIn</i> breaks at 11&thinsp;pm, the operator sees &ldquo;WF2B failed&rdquo; in Telegram instead of a 60-node n8n trace.",
    ],
  },

  // -----------------------------------------------------------------
  {
    code: "03",
    id: "proj-03",
    slug: "jalaram",
    accent: "mint",
    tag: "AI Hospital System",
    title: "Jalaram Hospital",
    subtitle: "AI hospital management system, four portals, GPT-4o Copilot",
    period: "2025 – 2026",
    role: "Full-stack engineer · freelance · in production",
    status: "live",
    statusLabel: "Live: shreejalaramhospital.live",
    heroImage: "/img/jalaram_dashboard_mock.png",
    liveUrl: "https://shreejalaramhospital.live",
    liveLabel: "Visit live site",
    elevator:
      "AI-assisted hospital management system for a women's health clinic in India. Four portals (Patient, Doctor, Staff, Admin) over a single backend, a tool-calling clinical Copilot, daily GPT-4o roster insights, and a data model shaped around Gynaecology and Obstetrics.",
    highlights: [
      "<b>JALARAM SUPER-AI Copilot</b> — GPT-4o with tool calling against the Postgres schema. Tools: <code>search_patients</code> and <code>get_patient_context</code>. Per-doctor chat sessions, auto-titled by the model.",
      "<b>Daily AI Insights</b> — backend anonymises the roster (counts only, IDs not names), hands the bundle to GPT-4o for exactly three actionable bullets in a strict HIPAA-flavoured tone.",
      "<b>Gynae / Obstetrics-shaped schema</b> — GPAL counts, pregnancy module with trimester + risk, menstrual cycle tracker with ovulation / fertile-window prediction, operation records with anaesthesia &amp; complications.",
      "<b>Four portals, one backend</b> — Patient view, Doctor dashboard (consultation form + Copilot), Staff Ops Center (live counts + call attempts), Admin (users, audit log, metrics).",
    ],
    stack: [
      { name: "OpenAI GPT-4o",       note: "Copilot + daily insights; tool calling against Prisma; lazy-init client" },
      { name: "Express 5 + TS",      note: "REST API; JWT cookies; bcrypt + helmet hardening" },
      { name: "Prisma 6 + Postgres", note: "12 models: Patient, Consultation, Cycle, Operation, CopilotSession, SystemLog…" },
      { name: "React + Vite + TS",   note: "4 portal SPAs sharing one auth + components base" },
      { name: "AWS S3 (ap-south-1)", note: "medical document uploads via multer-s3 with signed URLs" },
      { name: "Docker + Nginx + PM2", note: "production deploy on EC2; TLS at Nginx; Prisma migrations baked into start" },
    ],
    metrics: [
      { num: "4",      label: "User portals" },
      { num: "12",     label: "Prisma models" },
      { num: "GPT-4o", label: "AI core" },
    ],
    pullQuote: "The system prompt locks the assistant&rsquo;s identity and says authorisation is handled at the login layer — the JWT has already done the role check.",
    built: [
      "<b>Four portals, one backend.</b> <i>PatientPortal</i> — appointments, medical records, prescriptions, lab reports, menstrual-cycle tracker. <i>DoctorDashboard</i> — today&rsquo;s roster, full consultation form (vitals, GPAL counts, pregnancy module, pelvic exam notes, advice), prescription builder + per-doctor templates, AI insights, Copilot chat. <i>StaffDashboard / Ops Center</i> — live counts of scheduled / completed / missed appointments, pending and overdue follow-ups, reports filed today, call attempts logged. <i>AdminDashboard</i> — users, audit log, system-wide metrics.",
      "<b>JALARAM SUPER-AI Copilot.</b> GPT-4o with tool calling against the Postgres schema. Two tools: <code>search_patients</code> (by name or by <code>PAT-1-2026</code>-format hospital ID) and <code>get_patient_context</code>. The system prompt locks the assistant&rsquo;s identity and says authorisation is handled at the login layer — the model is told not to refuse for &ldquo;privacy&rdquo; reasons inside the app, because the JWT has already done the role check. Each doctor&rsquo;s chats live in <code>CopilotSession</code> with auto-titled threads.",
      "<b>Doctor AI Insights.</b> Every morning the doctor opens the dashboard and the backend runs a roster anonymisation pass: counts of today&rsquo;s appointments by status, follow-up queue size, overdue follow-ups, irregular-cycle alerts (cycle length below 21 days or above 35). All PII stripped — only patient IDs make it into the prompt. GPT-4o is asked for exactly three actionable bullets in a strict, HIPAA-flavoured clinical tone.",
      "<b>Gynae / Obstetrics-shaped data model.</b> Custom Prisma schema: <code>PatientProfile</code> with hospital ID format <code>PAT-&lt;seq&gt;-&lt;year&gt;</code>, GPAL counts (gravida, para, abortions, living children), <code>isPregnant</code>, EDD and pregnancy notes; <code>MenstrualCycleLog</code> with start/end dates, flow intensity, symptoms, cycle length, ovulation / fertile-window dates; <code>ClinicalConsultation</code> with vitals, LMP, chief complaint, obstetrics history, contraceptive method, trimester + risk; <code>OperationRecord</code> with surgeon, anaesthesia type and complications. There&rsquo;s also a <code>SystemLog</code> table that every controller writes to via a <code>recordLog()</code> helper.",
      "<b>Production hardening.</b> Express 5 + TypeScript + Prisma 6 + Postgres. JWT in HTTP-only cookies, bcrypt password hashing, helmet for security headers, a CORS whitelist that includes <code>shreejalaramhospital.live</code>. 20&nbsp;MB JSON body limit so report uploads with embedded base64 thumbnails still parse. Two date helpers because dashboards compute &ldquo;today&rdquo; in IST: <code>getTodayBounds()</code> and <code>getTomorrowBounds()</code> round-trip through the +5h&nbsp;30 offset rather than trusting <code>Date</code> defaults.",
      "<b>Deploy.</b> Docker + docker-compose + Nginx (TLS) + PM2 on EC2, with Prisma migrations baked into the start script. <code>deploy_to_live.ps1</code> on the local side, <code>setup_ec2.sh + start_pm2.sh</code> on the box.",
    ],
    bites: [
      "Role logic in the controllers is the easy thing to get wrong. When a STAFF or ADMIN creates a medical record or prescription on behalf of a doctor, the supervising <code>doctorId</code> has to come from the request body, not the caller&rsquo;s JWT. DOCTOR-role creates pull from JWT. Saved me a class of &ldquo;prescription signed by reception&rdquo; bugs.",
      "The OpenAI calls were originally constructed at module load. If <code>process.env.OPENAI_API_KEY</code> wasn&rsquo;t set yet (e.g. PM2 starting before <code>.env</code> was fully sourced), the client was permanently broken until restart. Moved both OpenAI and S3 clients to lazy getters — <code>getOpenAI() / getS3Client()</code>.",
      "Cycle-irregularity alerts are noisy by default — 21/35-day thresholds are textbook but pull in too many patients on a real roster. The dashboard currently flags them but I&rsquo;ve been tempted to add a per-doctor configurable band; haven&rsquo;t shipped that yet because the doctors actually want to see the long tail.",
    ],
  },

  // -----------------------------------------------------------------
  {
    code: "04",
    id: "proj-04",
    slug: "delhi",
    accent: "violet",
    tag: "Sentinel-1 Remote Sensing",
    title: "SATALITE Delhi",
    subtitle: "Strict EGMS-L3 road-subsidence pilot — Najafgarh Road, SW Delhi",
    period: "April – May 2026",
    role: "InSAR / remote-sensing engineer · freelance",
    status: "delivered",
    statusLabel: "Strict EGMS-L3 delivered",
    heroImage: "/img/delhi_velocity_dual_panel.png",
    supplementalImages: ["/img/delhi_decomp_scatter.png", "/img/delhi_timeseries.png"],
    hasMap: true,
    liveUrl: "http://3.110.160.18:8501",
    liveLabel: "Live dashboard",
    elevator:
      "Strict EGMS-L3 equivalent road-subsidence map — vertical and east-west deformation per pixel, ITRF14 absolute frame, ERA5 atmospheric correction, two-track decomposition. End to end on a local Linux workstation with open-source tools.",
    highlights: [
      "<b>2,656 detected PS</b> — 2,555 retained after the strict EGMS-PSI gate (spatial coherence &ge;&nbsp;0.70 in both stacks). V_U &minus;10.3 to +4.7&thinsp;mm/yr; V_E &minus;7.8 to +8.4&thinsp;mm/yr; residual RMS ~2&thinsp;mm.",
      "<b>165 SLC bursts &rarr; 476 SBAS interferograms</b> pair-by-pair in SNAP (ESD coregistration, 35×6 multilook to ~80&thinsp;m, Goldstein, externalised SNAPHU because SNAP&rsquo;s internal wrapper stalled silently).",
      "<b>ITRF14 frame tie via Indian-plate Euler pole</b> (Altamimi&nbsp;2017), MIDAS-validated against LCK4 / HYDE / IISC GNSS.",
      "<b>True 2D V_U + V_E decomposition</b> per-pixel by Cramer&rsquo;s rule. Per-pixel determinant ~0.95 across the AOI.",
    ],
    stack: [
      { name: "Sentinel-1 SAR",       note: "165 SLCs, ASC path 27 (88 acquisitions) + DSC path 136 (77)" },
      { name: "SNAP / ESA STEP",      note: "per-pair interferogram chain; XML graph driven by gpt" },
      { name: "SNAPHU",               note: "phase unwrapping, externalised because SNAP's built-in wrapper stalled" },
      { name: "MintPy SBAS",          note: "time-series inversion, separate mintpy_asc/ & mintpy_dsc/" },
      { name: "PyAPS3 / ERA5",        note: "tropospheric correction; ~300 GRIB files from CDS" },
      { name: "Altamimi 2017 PMM",    note: "Indian-plate Euler pole for ITRF14 frame tie" },
      { name: "Streamlit + Plotly",   note: "8-tab interactive dashboard for the client" },
    ],
    metrics: [
      { num: "2,555",  label: "PS retained" },
      { num: "476",    label: "SBAS pairs" },
      { num: "~2 mm",  label: "residual RMS" },
    ],
    pullQuote: "Acceptable for this AOI; would not generalise.",
    built: [
      "<b>The site choice itself was the first piece of work.</b> I went into this expecting to pilot at Visakhapatnam — coastal subsidence is the obvious story for an Indian road. A 30-second ASF catalog check killed that: no ascending Sentinel-1 coverage at all. Without ASC + DSC you can&rsquo;t do strict EGMS-L3 decomposition. Mumbai and Bangalore had the same gap. That left Delhi and Kolkata as the two dual-track-covered Indian metros.",
      "<b>Data: 165 Sentinel-1 SLCs across 3 years.</b> ASC relative orbit 27, IW2, 88 acquisitions. DSC relative orbit 136, IW1, 77 acquisitions. ~12-day cadence (S1A only — S1B failed end-2021 and S1C didn&rsquo;t come online for the Delhi pass until mid-2025). ASC sits west of the AOI looking east, DSC sits east looking west — antiparallel horizontal LOS vectors with similar incidence angles, ~33°. That&rsquo;s what makes the 2×2 V_U+V_E decomposition well-conditioned.",
      "<b>Workstation and software.</b> 12-core / 32&nbsp;GB / 2&nbsp;TB SSD on Ubuntu 22.04. SNAP for the per-pair InSAR work — bumped the JVM heap from the default 8&nbsp;GB to 20&nbsp;GB in <code>~/snap/etc/snap.properties</code> because the default crashes on coregistration of large bursts. Python 3.10 conda env with MintPy + SNAPHU + asf_search + sentineleof + rasterio + geopandas + pyproj + h5py from conda-forge; PyAPS3 from GitHub. I never touch h5py manually after the one time I mixed pip and conda installs and segfaulted MintPy at <code>load_data</code>.",
      "<b>SBAS network.</b> Each acquisition pairs with the three nearest forward neighbours, max temporal baseline 60 days. Past 60 days Delhi&rsquo;s monsoon decorrelation is too severe in my experience to be worth processing. 258 ASC + 218 DSC = 476 pairs. Saved as two <code>(reference, secondary, temporal_baseline_days, …)</code> CSVs — nothing fancier — because the network is the kind of artefact I want to be able to diff if something looks off three weeks later.",
      "<b>ERA5 atmospheric correction.</b> Tropospheric water vapour adds ~1–2&thinsp;cm peak-to-peak LOS noise over Delhi across a year. I batched CDS requests overnight — 01:00 UTC for descending (~06:00 local pre-dawn), 13:00 UTC for ascending (~18:00 local). About 300 GRIB files.",
      "<b>ITRF14 tie via the Indian-plate Euler pole.</b> MintPy gives relative velocities (reference pixel = 0). EGMS L3 wants absolute ITRF14. With no co-located GNSS at the AOI I used Altamimi et al. (2017)&rsquo;s plate-motion model. Pole at φ&nbsp;=&nbsp;50.295°N, λ&nbsp;=&nbsp;&minus;8.155°E, Ω&nbsp;=&nbsp;0.554°/Myr; at my AOI that&rsquo;s V_E&nbsp;≈&nbsp;+40 and V_N&nbsp;≈&nbsp;+39&thinsp;mm/yr.",
      "<b>Decomposition.</b> Solved the 2×2 (V_E, V_U) system per-pixel by Cramer&rsquo;s rule; the per-pixel determinant rides at ~0.95 across the AOI.",
    ],
    bites: [
      "<b>Multilook calibration.</b> First batch was 30×5 looks. A few pairs in I noticed the result over the road corridor was smeared — small-target PS getting averaged into their neighbours. Reran a subset at 35×6 (~80×84&thinsp;m), visibly cleaner, locked it in.",
      "<b>SNAP JVM OOM.</b> The pattern was always the same: a large burst pair, four <code>gpt</code> processes running in parallel, OS killing the JVM. After the second time I capped <code>parallel</code> at three concurrent pairs and the crashes stopped.",
      "<b>ESD threshold on a few pairs.</b> Default ESD coherence threshold is 0.3. A handful of pairs failed there; I dropped to 0.2 for those specific pairs and they coregistered fine. Acceptable for this AOI; would not generalise.",
      "<b>ERA5 zero-byte GRIBs.</b> Three GRIB files came back zero bytes from the CDS endpoint and <code>tropo_pyaps3</code> segfaulted three days later. Now I <code>eccodes</code>-check every GRIB after download.",
      "<b>2024 SAFE-layout shift.</b> ASF&rsquo;s cloud-native rollout in 2024 changed the inner directory layout of the newer SLCs slightly. SNAP&rsquo;s default Read node initially refused to recognise a handful of the newer scenes. A small file-pattern tweak in the SNAP graph fixed it — lost ~an hour figuring out it wasn&rsquo;t a corrupt download.",
    ],
  },

  // -----------------------------------------------------------------
  {
    code: "05",
    id: "proj-05",
    slug: "kite-beach",
    accent: "amber",
    tag: "Sentinel-1 Validation Pilot",
    title: "SATALITE Kite Beach",
    subtitle: "L2-equivalent Sentinel-1 InSAR pilot — Visakhapatnam",
    period: "April – May 2026",
    role: "InSAR engineer · freelance",
    status: "validated",
    statusLabel: "L2-equivalent (single-track)",
    heroImage: "/img/kite_beach_velocity.png",
    supplementalImages: ["/img/kite_beach_cumulative.png"],
    liveUrl: "http://3.110.160.18:8502",
    liveLabel: "Live dashboard",
    elevator:
      "First InSAR pilot for the SATALITE brief. Sentinel-1 road-subsidence monitoring at Kite Beach Road, Visakhapatnam. Descending-only by necessity — the site sits in a known Sentinel-1 ascending gap. The pilot that validated the pipeline before the strict-L3 Delhi run.",
    highlights: [
      "<b>The catalog check is the real story.</b> Exhaustive ASF API probe across every product type returned <b>zero</b> ascending granules for a 3-yr window at this AOI.",
      "<b>86 SLC bursts &rarr; 244 SBAS pairs &rarr; 152 PS</b> at temporal coherence &ge;&nbsp;0.85. LOS velocity &minus;11.7 to +8.5&thinsp;mm/yr, RMSE ~5&thinsp;mm (within the EGMS noise floor).",
      "<b>Pipeline scaffold reused for Delhi.</b> The numbered script chain (<code>01_*</code> through <code>20_*</code>) from this pilot got upgraded and reused for the strict-L3 Delhi run.",
      "<b>Most-subsiding PS at 17.7174&nbsp;N, 83.3222&nbsp;E</b> — west of the road, built-up area. Flagged for client follow-up.",
    ],
    stack: [
      { name: "Sentinel-1 SAR",      note: "86 SLCs, descending track 19, IW1, VV polarisation" },
      { name: "ASF HyP3",            note: "SBAS pair generation, 250 submitted, 244 retained" },
      { name: "MintPy SBAS",         note: "time-series inversion with coherence-based network modification" },
      { name: "Streamlit + Plotly",  note: "client-facing dashboard with velocity map + time series" },
      { name: "Python + GeoPandas",  note: "numbered pipeline scripts (01_* through 20_*)" },
    ],
    metrics: [
      { num: "152",   label: "Persistent Scatterers" },
      { num: "244",   label: "SBAS pairs" },
      { num: "~5 mm", label: "RMSE" },
    ],
    pullQuote: "Stated up front — saves the client the time of asking.",
    built: [
      "<b>Single-track by site geometry, not by choice.</b> An exhaustive ASF API probe across every product type and both S1A and S1B for 2014–2026 returned <b>zero</b> ascending granules over a 3-year window at this AOI. The honest framing in the client doc: this is L2-equivalent (LOS-only) under EGMS terms, not strict L3 (V_U + V_E). Stated up front — saves the client the time of asking.",
      "<b>Stack and method.</b> 86 Sentinel-1 SLC bursts, descending relative orbit 19, IW1, VV polarisation, May 2023 – April 2026. SBAS network with the same EGMS-style rule as Delhi (3 nearest forward neighbours, max 60-day temporal baseline). 250 pairs submitted to ASF HyP3 originally; 244 retained after coherence filtering at the load step.",
      "<b>MintPy SBAS time-series inversion.</b> Same workflow scaffolding I&rsquo;d later upgrade for Delhi — <code>smallbaselineApp.py</code> with config tuned to the AOI, reference pixel on a stable rooftop, coherence-based network modification with <code>keepMinSpanTree</code>. 152 persistent scatterers at temporal coherence &ge;&nbsp;0.85.",
      "<b>Pilot deliverables — deliberately scoped.</b> Velocity map, cumulative subsidence map, time-series chart at the most-subsiding PS, GeoJSON of the 152 PS, time-series CSV, summary JSON, plus a Streamlit dashboard. Numbered Python scripts in <code>scripts/</code> covering the full pipeline end to end — this script chain is what got reused and upgraded for the Delhi strict-L3 run.",
    ],
    bites: [
      "<b>The ASF gap is the real story.</b> I burned time on the catalog check up front and it was the right call — running the full pipeline blind would have produced single-track output with no way to flag for the client that the strict L3 deliverable was geometrically impossible at this site. The catalog check became a one-time <code>20_check_track_coverage.py</code> script I now run before quoting any new InSAR site.",
      "<b>Burst SLC display.</b> A side artifact — the <code>sentinel1_burst_2026-04-19.tiff</code> demo file is raw SLC complex data (CInt16, complex64, no map projection). It will not display as a normal radar image in QGIS without amplitude extraction + georeferencing.",
    ],
  },
];
