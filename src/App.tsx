import { useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { useLiveTelemetry } from './hooks/useLiveTelemetry';
import { useRouterStore } from './store/useRouterStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Homepage Story Sections
import { Hero } from './components/hero/Hero';
import { CoreStory } from './components/story/CoreStory';
import { PipelineSection } from './components/pipeline/PipelineSection';
import { ForecastingSection } from './components/forecasting/ForecastingSection';
import { OptimizationSection } from './components/optimization/OptimizationSection';
import { RagSection } from './components/rag/RagSection';
import { WhatIfSimulator } from './components/scenarios/WhatIfSimulator';
import { HumanInTheLoop } from './components/hitl/HumanInTheLoop';
import { ProductPreview } from './components/preview/ProductPreview';
import { TechStrip } from './components/technology/TechStrip';
import { FinalCTA } from './components/cta/FinalCTA';

// Dedicated Sub-Pages
import { PlatformPage } from './pages/PlatformPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { OptimizationPage } from './pages/OptimizationPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { TechnologyPage } from './pages/TechnologyPage';

export function App() {
  // Initialize smooth scrolling and GSAP ticker synchronization
  useLenis();

  // Initialize background simulated WebSocket stream for telemetry
  useLiveTelemetry();

  // Router store integration
  const currentPath = useRouterStore((state) => state.currentPath);
  const initRouter = useRouterStore((state) => state.initRouter);

  useEffect(() => {
    const cleanup = initRouter();
    return cleanup;
  }, [initRouter]);

  // Render sub-pages when on dedicated routes
  const renderCurrentView = () => {
    switch (currentPath) {
      case '/platform':
        return <PlatformPage />;
      case '/intelligence':
        return <IntelligencePage />;
      case '/optimization':
        return <OptimizationPage />;
      case '/scenarios':
        return <ScenariosPage />;
      case '/architecture':
        return <ArchitecturePage />;
      case '/technology':
        return <TechnologyPage />;
      case '/':
      default:
        return (
          <>
            {/* 1. Hero: Modern 3D Hospital Operations Environment */}
            <Hero />

            {/* 2. Problem: Warm Off-White Editorial Storytelling */}
            <CoreStory />

            {/* 3. Product Flow: Soft Blue Horizontal Transformation */}
            <PipelineSection />

            {/* 4. Forecasting: Crisp Light SVG Time-Series Horizon */}
            <ForecastingSection />

            {/* 5. Optimization: Deep Midnight Navy Resource Allocation */}
            <OptimizationSection />

            {/* 6. Contextual RAG: Soft Lavender Document Grounding */}
            <RagSection />

            {/* 7. What-If: Clean Light Gray Capacity Sandbox */}
            <WhatIfSimulator />

            {/* 8. Human in the Loop: Soft Mint Clinical Governance */}
            <HumanInTheLoop />

            {/* 9. Product Preview: 3D Perspective Command Center */}
            <ProductPreview />

            {/* 10. Minimal Technology Strip */}
            <TechStrip />

            {/* 11. Final Cinematic Closing CTA */}
            <FinalCTA />
          </>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-midnight-950 text-slate-100 flex flex-col selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-grow flex flex-col">
        {renderCurrentView()}
      </main>

      {/* Enterprise Footer */}
      <Footer />
    </div>
  );
}

export default App;
