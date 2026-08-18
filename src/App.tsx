import { useLenis } from './hooks/useLenis';
import { useLiveTelemetry } from './hooks/useLiveTelemetry';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/hero/Hero';
import { CoreStory } from './components/story/CoreStory';
import { PipelineSection } from './components/pipeline/PipelineSection';
import { ForecastingSection } from './components/forecasting/ForecastingSection';
import { OptimizationSection } from './components/optimization/OptimizationSection';
import { RagSection } from './components/rag/RagSection';
import { WhatIfSimulator } from './components/scenarios/WhatIfSimulator';
import { HumanInTheLoop } from './components/hitl/HumanInTheLoop';
import { RealtimeOperations } from './components/realtime/RealtimeOperations';
import { ArchitectureSection } from './components/architecture/ArchitectureSection';
import { TechEcosystem } from './components/technology/TechEcosystem';
import { BentoGrid } from './components/bento/BentoGrid';
import { SecuritySection } from './components/security/SecuritySection';
import { PerformanceSection } from './components/performance/PerformanceSection';
import { FinalCTA } from './components/cta/FinalCTA';

export function App() {
  // Initialize smooth scrolling and GSAP ticker sync
  useLenis();

  // Initialize background simulated WebSocket stream
  useLiveTelemetry();

  return (
    <div className="relative min-h-screen bg-background text-slate-100 flex flex-col selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow flex flex-col">
        {/* 1. Hero Section with 3D WebGL Network */}
        <Hero />

        {/* 2. Core Story / Problem Statement */}
        <CoreStory />

        {/* 3. Product Pipeline: From Data to Decision */}
        <PipelineSection />

        {/* 4. Forecasting Engine & Interactive Time-Series Chart */}
        <ForecastingSection />

        {/* 5. Mathematical Optimization & Interactive Demo */}
        <OptimizationSection />

        {/* 6. Contextual RAG & SOP Grounding Assistant */}
        <RagSection />

        {/* 7. What-If Scenario Sandboxing Engine */}
        <WhatIfSimulator />

        {/* 8. Human-in-the-Loop Clinical Governance */}
        <HumanInTheLoop />

        {/* 9. Real-Time Operations Telemetry */}
        <RealtimeOperations />

        {/* 10. System Architecture & Protocols */}
        <ArchitectureSection />

        {/* 11. Technology Ecosystem */}
        <TechEcosystem />

        {/* 12. Bento Capability Grid */}
        <BentoGrid />

        {/* 13. Security-Conscious Architecture */}
        <SecuritySection />

        {/* 14. Performance by Design */}
        <PerformanceSection />

        {/* 15. Closing CTA */}
        <FinalCTA />
      </main>

      {/* Enterprise Footer */}
      <Footer />
    </div>
  );
}

export default App;
