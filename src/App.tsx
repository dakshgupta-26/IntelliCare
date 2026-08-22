import { useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { useLiveTelemetry } from './hooks/useLiveTelemetry';
import { useRouterStore } from './store/useRouterStore';
import { useThemeStore } from './store/useThemeStore';
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

// Marketing / Architectural Sub-Pages
import { PlatformPage } from './pages/PlatformPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { OptimizationPage as MarketingOptimizationPage } from './pages/OptimizationPage';
import { ScenariosPage as MarketingScenariosPage } from './pages/ScenariosPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { TechnologyPage } from './pages/TechnologyPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

// Authenticated Enterprise Application Shell & Pages
import { AppShell } from './components/app/AppShell';
import { DashboardPage } from './pages/app/DashboardPage';
import { ResourcesPage } from './pages/app/ResourcesPage';
import { ForecastingPage } from './pages/app/ForecastingPage';
import { OptimizationPage as AppOptimizationPage } from './pages/app/OptimizationPage';
import { ScenariosPage as AppScenariosPage } from './pages/app/ScenariosPage';
import { KnowledgePage } from './pages/app/KnowledgePage';
import { KnowledgeAssistantPage } from './pages/app/KnowledgeAssistantPage';
import { RecommendationsPage } from './pages/app/RecommendationsPage';
import { AnalyticsPage } from './pages/app/AnalyticsPage';
import { AlertsPage } from './pages/app/AlertsPage';
import { ActivityPage } from './pages/app/ActivityPage';
import { SettingsPage } from './pages/app/SettingsPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { AdminPage } from './pages/app/AdminPage';

export function App() {
  // Initialize smooth scrolling for editorial marketing pages
  useLenis();

  // Initialize background simulated WebSocket stream for telemetry
  useLiveTelemetry();

  // Initialize Theme Store
  const initTheme = useThemeStore((state) => state.initTheme);
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Router store integration
  const currentPath = useRouterStore((state) => state.currentPath);
  const initRouter = useRouterStore((state) => state.initRouter);

  useEffect(() => {
    const cleanup = initRouter();
    return cleanup;
  }, [initRouter]);

  // Check if current route is within the authenticated application shell
  const isAppRoute = currentPath.startsWith('/app') || currentPath === '/admin';

  if (isAppRoute) {
    let appContent = <DashboardPage />;

    if (currentPath === '/app/resources' || currentPath.startsWith('/app/resources/')) {
      appContent = <ResourcesPage />;
    } else if (currentPath === '/app/forecasting') {
      appContent = <ForecastingPage />;
    } else if (currentPath === '/app/optimization') {
      appContent = <AppOptimizationPage />;
    } else if (currentPath === '/app/scenarios') {
      appContent = <AppScenariosPage />;
    } else if (currentPath === '/app/knowledge') {
      appContent = <KnowledgePage />;
    } else if (currentPath === '/app/knowledge/assistant') {
      appContent = <KnowledgeAssistantPage />;
    } else if (currentPath === '/app/recommendations') {
      appContent = <RecommendationsPage />;
    } else if (currentPath === '/app/analytics') {
      appContent = <AnalyticsPage />;
    } else if (currentPath === '/app/alerts') {
      appContent = <AlertsPage />;
    } else if (currentPath === '/app/activity') {
      appContent = <ActivityPage />;
    } else if (currentPath === '/app/settings') {
      appContent = <SettingsPage />;
    } else if (currentPath === '/app/profile') {
      appContent = <ProfilePage />;
    } else if (currentPath === '/admin') {
      appContent = <AdminPage />;
    } else {
      // Default to /app/dashboard
      appContent = <DashboardPage />;
    }

    return <AppShell>{appContent}</AppShell>;
  }

  // Auth pages
  if (currentPath === '/login' || currentPath === '/signup') {
    return <LoginPage />;
  }

  // Marketing and Deep-Dive Pages
  const renderMarketingView = () => {
    switch (currentPath) {
      case '/platform':
        return <PlatformPage />;
      case '/intelligence':
        return <IntelligencePage />;
      case '/optimization':
        return <MarketingOptimizationPage />;
      case '/scenarios':
        return <MarketingScenariosPage />;
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
        {renderMarketingView()}
      </main>

      {/* Enterprise Footer */}
      <Footer />
    </div>
  );
}

export default App;
