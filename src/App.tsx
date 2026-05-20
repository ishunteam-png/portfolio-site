import { useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { MetricsStrip } from "./sections/MetricsStrip";
import { Marquee } from "./sections/Marquee";
import { ProjectSection } from "./sections/ProjectSection";
import { GisSection } from "./sections/GisSection";
import { HowIWork } from "./sections/HowIWork";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { SideRail } from "./components/SideRail";
import { CmdK } from "./components/CmdK";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { HintPill } from "./components/HintPill";
import { PROJECTS } from "./data/projects";

export default function App() {
  const [cmdkOpen, setCmdkOpen] = useState(false);

  // Expose for Ctrl+K binding in CmdK component
  if (typeof window !== "undefined") {
    (window as any).__openCmdK = () => setCmdkOpen(true);
  }

  const metas = [
    "AI WORKSPACE · NEXT.JS · ANTHROPIC SDK",
    "N8N V4 · TELEGRAM · HEYGEN · PINECONE",
    "LIVE · GPT-4o · 4 PORTALS",
    "SENTINEL-1 · EGMS-L3 · 2,555 PS · ITRF14",
    "VALIDATION PILOT · SINGLE-TRACK · 152 PS",
  ];

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Nav onCmdKOpen={() => setCmdkOpen(true)} />
      <Hero />
      <MetricsStrip />
      <Marquee />

      {PROJECTS.map((p, i) => (
        <ProjectSection
          key={p.id}
          project={p}
          flipped={i % 2 === 1}
          meta={metas[i]}
        />
      ))}

      <GisSection />

      <HowIWork />
      <Contact />
      <Footer />
      <SideRail />
      <HintPill />
      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
    </>
  );
}
