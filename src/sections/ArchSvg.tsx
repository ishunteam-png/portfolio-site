import { motion } from "framer-motion";
import { accentText, accentHex, type AccentName } from "../lib/motion";

interface Props { accent: AccentName; }

export function ArchSvg({ accent }: Props) {
  const ac = accentHex[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mt-6 p-7 bg-bg-card border border-rule rounded-xl"
      id="arch"
    >
      <span className={`deco-marker ${accentText[accent]}`}>FILE / architecture.svg</span>
      <h3 className={`font-mono text-[11px] font-bold uppercase tracking-wide3 mb-4 ${accentText[accent]}`}>
        Architecture · Live data flow
      </h3>
      <svg viewBox="0 0 1100 540" preserveAspectRatio="xMidYMid meet"
           className="w-full h-auto max-h-[560px]"
           style={{ "--accent": ac } as React.CSSProperties}>
        <style>{`
          .node-bg      { fill: #050505; stroke: var(--accent); stroke-width: 1.4; }
          .node-bg-warm { fill: #050505; stroke: #FF9466; stroke-width: 1.4; }
          .node-bg-mute { fill: #050505; stroke: #5b5b57; stroke-width: 1; }
          .node-title   { fill: #f0f0eb; font-size: 13px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
          .node-sub     { fill: #8b8b85; font-size: 10.5px; font-family: 'JetBrains Mono', monospace; }
          .flow         { stroke: var(--accent); stroke-width: 1.6; fill: none; stroke-dasharray: 6 4; animation: dash 1.4s linear infinite; }
          .flow-warm    { stroke: #FF9466; stroke-width: 1.6; fill: none; stroke-dasharray: 6 4; animation: dash 1.4s linear infinite; }
          .arrow-head      { fill: var(--accent); }
          .arrow-head-warm { fill: #FF9466; }
          .title    { fill: #f0f0eb; font-size: 17px; font-weight: 700; font-family: 'Inter', sans-serif; }
          .subtitle { fill: #8b8b85; font-size: 11.5px; font-style: italic; font-family: 'Inter', sans-serif; }
          @keyframes dash { to { stroke-dashoffset: -20; } }
        `}</style>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-head" />
          </marker>
          <marker id="arrow-warm" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-head-warm" />
          </marker>
        </defs>

        <text x="550" y="26" textAnchor="middle" className="title">
          Relief Guru V4 - 7-workflow n8n architecture
        </text>
        <text x="550" y="46" textAnchor="middle" className="subtitle">
          Telegram intake → script → avatar video → approval → publish → track
        </text>

        {/* TOP ROW */}
        <rect className="node-bg-warm" x="20" y="70" width="160" height="60" rx="8" />
        <text x="100" y="98" className="node-title" textAnchor="middle">Telegram bot</text>
        <text x="100" y="115" className="node-sub" textAnchor="middle">operator chat</text>

        <rect className="node-bg" x="220" y="70" width="170" height="60" rx="8" />
        <text x="305" y="93" className="node-title" textAnchor="middle">WF1A  Intake Router</text>
        <text x="305" y="110" className="node-sub" textAnchor="middle">slash commands</text>
        <text x="305" y="124" className="node-sub" textAnchor="middle">admin whitelist</text>

        <rect className="node-bg" x="430" y="70" width="180" height="60" rx="8" />
        <text x="520" y="93" className="node-title" textAnchor="middle">WF1B  Script Generator</text>
        <text x="520" y="110" className="node-sub" textAnchor="middle">OpenAI embed</text>
        <text x="520" y="124" className="node-sub" textAnchor="middle">Pinecone → GPT</text>

        <rect className="node-bg" x="650" y="70" width="180" height="60" rx="8" />
        <text x="740" y="93" className="node-title" textAnchor="middle">WF2A  HeyGen Video</text>
        <text x="740" y="110" className="node-sub" textAnchor="middle">defensive parser</text>
        <text x="740" y="124" className="node-sub" textAnchor="middle">poll loop</text>

        <rect className="node-bg-mute" x="870" y="70" width="120" height="60" rx="8" />
        <text x="930" y="98" className="node-title" textAnchor="middle">HeyGen</text>
        <text x="930" y="115" className="node-sub" textAnchor="middle">v2 API</text>

        <path className="flow" d="M 180 100 L 220 100" markerEnd="url(#arrow)" />
        <path className="flow" d="M 390 100 L 430 100" markerEnd="url(#arrow)" />
        <path className="flow" d="M 610 100 L 650 100" markerEnd="url(#arrow)" />
        <path className="flow" d="M 830 100 L 870 100" markerEnd="url(#arrow)" />

        {/* External services */}
        <rect className="node-bg-mute" x="430" y="200" width="180" height="50" rx="8" />
        <text x="520" y="223" className="node-title" textAnchor="middle">Pinecone (vector)</text>
        <text x="520" y="240" className="node-sub" textAnchor="middle">templates + tracker memory</text>

        <rect className="node-bg-mute" x="650" y="200" width="180" height="50" rx="8" />
        <text x="740" y="223" className="node-title" textAnchor="middle">OpenAI</text>
        <text x="740" y="240" className="node-sub" textAnchor="middle">embeddings + chat</text>

        <path className="flow" d="M 520 130 L 520 200" markerEnd="url(#arrow)" />
        <path className="flow" d="M 580 130 L 720 200" markerEnd="url(#arrow)" />

        {/* Sticky-message return */}
        <path className="flow-warm" d="M 740 70 Q 380 30 100 70" markerEnd="url(#arrow-warm)" />
        <text x="420" y="36" className="node-sub" fill="#FF9466" fontStyle="italic">
          sticky-message progress
        </text>

        {/* BOTTOM ROW */}
        <rect className="node-bg-warm" x="20" y="320" width="160" height="60" rx="8" />
        <text x="100" y="348" className="node-title" textAnchor="middle">Operator</text>
        <text x="100" y="365" className="node-sub" textAnchor="middle">approves in Telegram</text>

        <rect className="node-bg" x="220" y="320" width="170" height="60" rx="8" />
        <text x="305" y="343" className="node-title" textAnchor="middle">WF2A↔WF2B</text>
        <text x="305" y="360" className="node-sub" textAnchor="middle">approval bridge</text>

        <rect className="node-bg" x="430" y="320" width="180" height="60" rx="8" />
        <text x="520" y="343" className="node-title" textAnchor="middle">WF2B  Posting Core</text>
        <text x="520" y="360" className="node-sub" textAnchor="middle">native multi-platform</text>

        <rect className="node-bg-mute" x="650" y="320" width="105" height="60" rx="8" />
        <text x="702" y="348" className="node-title" textAnchor="middle">YouTube</text>
        <text x="702" y="365" className="node-sub" textAnchor="middle">via Google API</text>

        <rect className="node-bg-mute" x="765" y="320" width="105" height="60" rx="8" />
        <text x="817" y="348" className="node-title" textAnchor="middle">LinkedIn</text>
        <text x="817" y="365" className="node-sub" textAnchor="middle">via LI API</text>

        <rect className="node-bg-mute" x="880" y="320" width="105" height="60" rx="8" />
        <text x="932" y="348" className="node-title" textAnchor="middle">Instagram</text>
        <text x="932" y="365" className="node-sub" textAnchor="middle">via Meta API</text>

        <path className="flow" d="M 100 130 L 100 320" markerEnd="url(#arrow)" />
        <path className="flow" d="M 180 350 L 220 350" markerEnd="url(#arrow)" />
        <path className="flow" d="M 390 350 L 430 350" markerEnd="url(#arrow)" />
        <path className="flow" d="M 610 350 L 650 350" markerEnd="url(#arrow)" />
        <path className="flow" d="M 610 360 L 765 360" markerEnd="url(#arrow)" />
        <path className="flow" d="M 610 370 L 880 370" markerEnd="url(#arrow)" />
        <path className="flow" d="M 740 130 Q 600 200 520 320" markerEnd="url(#arrow)" />

        {/* Tracker */}
        <rect className="node-bg-warm" x="220" y="450" width="540" height="60" rx="8" />
        <text x="490" y="478" className="node-title" textAnchor="middle">WF3  Tracker Engine</text>
        <text x="490" y="495" className="node-sub" textAnchor="middle">every step → Pinecone for retrieval</text>

        <path className="flow-warm" d="M 305 380 L 305 450" markerEnd="url(#arrow-warm)" />
        <path className="flow-warm" d="M 520 380 L 520 450" markerEnd="url(#arrow-warm)" />
        <path className="flow-warm" d="M 720 380 L 680 450" markerEnd="url(#arrow-warm)" />

        <rect className="node-bg-mute" x="800" y="450" width="190" height="60" rx="8" />
        <text x="895" y="478" className="node-title" textAnchor="middle">Layout Callback</text>
        <text x="895" y="495" className="node-sub" textAnchor="middle">UI state handler</text>
      </svg>
    </motion.div>
  );
}
