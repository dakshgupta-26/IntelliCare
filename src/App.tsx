import { useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { useLiveTelemetry } from './hooks/useLiveTelemetry';
import { useRouterStore } from './store/useRouterStore';
import { useThemeStore } from './store/useThemeStore';
import { useCopilotStore } from './store/useCopilotStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// IntelliCare AI Copilot
import { 
  CopilotFloatingButton, 
  CopilotWindow, 
  CopilotTourSpotlight 
} from './components/copilot';

import { Hero } from './components/hero/Hero';
import { CoreStory } from './components/story/CoreStory';
import { PipelineSection } from './components/pipeline/PipelineSection';
import { IntelligenceStack } from './components/pipeline/IntelligenceStack';
import { DigitalTwinSection } from './components/preview/DigitalTwinSection';
import { WhatIfSimulator } from './components/scenarios/WhatIfSimulator';
import { ArchitectureFlowSection } from './components/architecture/ArchitectureFlowSection';
import { TechStrip } from './components/technology/TechStrip';
import { CopilotSection } from './components/copilot/CopilotSection';
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
import { MLStudioPage } from './pages/app/MLStudioPage';
import { ClinicalAIPage } from './pages/app/ClinicalAIPage';
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
  // Router store integration
  const currentPath = useRouterStore((state) => state.currentPath);
  const initRouter = useRouterStore((state) => state.initRouter);

  useEffect(() => {
    const cleanup = initRouter();
    return cleanup;
  }, [initRouter]);

  // Check route categories
  const isAppRoute = currentPath.startsWith('/app') || currentPath === '/admin';
  const isAuthRoute = currentPath === '/login' || currentPath === '/signup';
  const isMarketingRoute = !isAppRoute && !isAuthRoute;

  // Initialize smooth scrolling for editorial marketing pages only (native scrolling for dashboard)
  useLenis(isMarketingRoute);

  // Initialize background simulated WebSocket stream for telemetry
  useLiveTelemetry();

  // Initialize Theme Store
  const initTheme = useThemeStore((state) => state.initTheme);
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Synchronize Copilot context with active route
  const setContextScope = useCopilotStore((state) => state.setContextScope);
  useEffect(() => {
    const pageTitleMap: Record<string, string> = {
      '/': 'Platform Overview',
      '/platform': 'Platform Core',
      '/intelligence': 'Predictive Intelligence',
      '/optimization': 'Resource Optimization',
      '/scenarios': 'What-If Scenarios',
      '/architecture': 'System Architecture',
      '/technology': 'Technology Ecosystem',
      '/app/dashboard': 'Command Dashboard',
      '/app/resources': 'Resource Telemetry',
      '/app/models': 'ML Model Studio',
      '/app/clinical-ai': 'Clinical Deterioration & Risk AI',
      '/app/forecasting': 'Demand Forecasting',
      '/app/optimization': 'MILP Allocation',
      '/app/scenarios': 'Capacity Simulation',
      '/app/knowledge': 'SOP Knowledge Base',
      '/app/knowledge/assistant': 'RAG Assistant',
      '/app/recommendations': 'Clinical Directives',
      '/app/analytics': 'Analytics & KPIs',
      '/app/alerts': 'Operational Alerts',
      '/app/activity': 'Audit Trail',
      '/app/settings': 'System Settings',
      '/app/profile': 'User Profile',
      '/admin': 'Admin Console'
    };

    const title = pageTitleMap[currentPath] || 'Operations';
    setContextScope({ page: currentPath, pageTitle: title });
  }, [currentPath, setContextScope]);

  let mainView: React.ReactNode = null;

  if (isAppRoute) {
    let appContent = <DashboardPage />;

    if (currentPath === '/app/resources' || currentPath.startsWith('/app/resources/')) {
      appContent = <ResourcesPage />;
    } else if (currentPath === '/app/models') {
      appContent = <MLStudioPage />;
    } else if (currentPath === '/app/clinical-ai') {
      appContent = <ClinicalAIPage />;
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

    mainView = <AppShell>{appContent}</AppShell>;
  } else if (currentPath === '/login' || currentPath === '/signup') {
    mainView = <LoginPage />;
  } else {
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
              {/* 1. Hero: Predict what hospitals need. Before they need it. */}
              <Hero />

              {/* 2. Problem: Hospital capacity doesn't stand still. */}
              <CoreStory />

              {/* 3. Lifecycle: Observe -> Predict -> Optimize -> Decide */}
              <PipelineSection />

              {/* 4. Intelligence: Forecast + Context + Optimization */}
              <IntelligenceStack />

              {/* 5. Digital Twin: A living model of hospital operations */}
              <DigitalTwinSection />

              {/* 6. Scenarios: What happens when demand spikes? */}
              <WhatIfSimulator />

              {/* 7. Architecture: How IntelliCare works underneath */}
              <ArchitectureFlowSection />

              {/* 8. Technology: The engineering and intelligence stack */}
              <TechStrip />

              {/* 9. Copilot: Ask IntelliCare */}
              <CopilotSection />

              {/* 10. Final CTA: The hospital doesn't need another dashboard. It needs foresight. */}
              <FinalCTA />
            </>
          );
      }
    };

    mainView = (
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

  return (
    <>
      {mainView}

      {/* Global IntelliCare AI Copilot Components */}
      <CopilotFloatingButton />
      <CopilotWindow />
      <CopilotTourSpotlight />
    </>
  );
}

export default App;

