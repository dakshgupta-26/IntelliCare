import React from 'react';
import {
  CommandCenterHeader,
  KPIGrid,
  OperationsOverview,
  AIOperationalBrief,
  DemandForecastSection,
  ResourcePressureSection,
  PatientFlowSection,
  ScenarioSimulatorSection,
  SOPGuidanceSection,
  RecentDecisionsFeed
} from '../../components/app/dashboard';
import { useRouterStore } from '../../store/useRouterStore';

export const DashboardPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const handleRunScenario = () => {
    navigate('/app/scenarios');
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in select-none">
      {/* 1. Context-Aware Command Center Header */}
      <CommandCenterHeader
        onRunScenario={handleRunScenario}
      />

      {/* 2. Compact Live Operational KPI Grid (5-column enterprise density) */}
      <KPIGrid
        onICUClick={() => navigate('/app/resources')}
        onEDClick={() => navigate('/app/forecasting')}
        onBedsClick={() => navigate('/app/resources')}
        onStaffClick={() => navigate('/app/resources')}
        onEquipmentClick={() => navigate('/app/resources')}
      />

      {/* 3. Main Intelligence Area: Two-Column Command Center (60% Operations Overview + 40% AI Brief) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-7 xl:col-span-8">
          <OperationsOverview />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <AIOperationalBrief onRunScenario={handleRunScenario} />
        </div>
      </div>

      {/* 4. Secondary Intelligence: Demand Forecast + Resource Pressure Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-7 xl:col-span-7">
          <DemandForecastSection />
        </div>
        <div className="lg:col-span-5 xl:col-span-5">
          <ResourcePressureSection />
        </div>
      </div>

      {/* 5. Clinical Throughput: Patient Flow & Bottleneck Telemetry */}
      <PatientFlowSection onRunScenario={handleRunScenario} />

      {/* 6. Digital Twin: Operational What-If Scenario Sandbox */}
      <ScenarioSimulatorSection />

      {/* 7. Grounded SOP Guidance & Recent Clinical Decisions Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <SOPGuidanceSection />
        <RecentDecisionsFeed />
      </div>
    </div>
  );
};

export default DashboardPage;
