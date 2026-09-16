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
import { RealtimeOperations } from './components/realtime/RealtimeOperations';
import { ForecastingSection } from './components/forecasting/ForecastingSection';
import { OptimizationSection } from './components/optimization/OptimizationSection';
import { HumanInTheLoop } from './components/hitl/HumanInTheLoop';
import { RagSection } from './components/rag/RagSection';
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
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { useAuthStore } from './store/useAuthStore';

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
  const isAuthRoute = [
    '/login',
    '/signup',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password'
  ].includes(currentPath);
  const isMarketingRoute = !isAppRoute && !isAuthRoute;

  // Initialize backend auth session verification
  const initAuth = useAuthStore((state) => state.initAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

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
    // Zero-trust Route Guard: unauthenticated redirects to login, unverified redirects to email verification
    if (isInitialized && !isAuthenticated) {
      mainView = <LoginPage />;
    } else if (isInitialized && currentUser && !currentUser.emailVerified) {
      mainView = <VerifyEmailPage />;
    } else {
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
    }
  } else if (currentPath === '/signup' || currentPath === '/register') {
    mainView = <RegisterPage />;
  } else if (currentPath === '/verify-email') {
    mainView = <VerifyEmailPage />;
  } else if (currentPath === '/forgot-password') {
    mainView = <ForgotPasswordPage />;
  } else if (currentPath === '/reset-password') {
    mainView = <ResetPasswordPage />;
  } else if (currentPath === '/login') {
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
              {/* Stage 01. Hero: Predict what hospitals need. Before they need it. (#050814) */}
              <Hero />

              {/* Stage 02. Problem: Hospital capacity doesn't stand still. (#070B17) */}
              <CoreStory />

              {/* Stage 03. Lifecycle: Observe -> Predict -> Optimize -> Decide (#050814) */}
              <PipelineSection />

              {/* Stage 04. Observe: Live Real-Time Operations Telemetry (#070B17) */}
              <RealtimeOperations />

              {/* Stage 05. Predict: Multi-Horizon Neural Forecasting (#070B17 / #0A1020) */}
              <ForecastingSection />

              {/* Stage 06. Optimize: Mathematical MILP Balancing (#050814) */}
              <OptimizationSection />

              {/* Stage 07. Decide: Clinical Governance & Human Authorization Gate (#070B17) */}
              <HumanInTheLoop />

              {/* Stage 08. Intelligence / RAG: Contextual Operational Knowledge Grounding (#070B17 / #0A1020) */}
              <RagSection />

              {/* Stage 09. Digital Twin: A living topological model of hospital operations (#050814) */}
              <DigitalTwinSection />

              {/* Stage 10. Scenarios: What-If Capacity Stress-Testing Simulator (#070B17) */}
              <WhatIfSimulator />

              {/* Stage 11. Architecture: Distributed End-to-End System Pipeline (#050814) */}
              <ArchitectureFlowSection />

              {/* Stage 12. Technology: The engineering and scientific intelligence stack (#070B17) */}
              <TechStrip />

              {/* Stage 13. Copilot: Natural Language Operational Command Interface (#050814) */}
              <CopilotSection />

              {/* Stage 14. Final CTA: The hospital doesn't need another dashboard. It needs foresight. (#070B17) */}
              <FinalCTA />
            </>
          );
      }
    };

    mainView = (
      <div className="relative min-h-screen bg-[#050814] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-400">
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

