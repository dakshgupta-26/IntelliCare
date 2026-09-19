import React from 'react';
import {
  Activity,
  AlertTriangle,
  Bed,
  Users,
  Cpu
} from 'lucide-react';
import { KPICard } from './KPICard';
import { useRouterStore } from '../../../store/useRouterStore';

interface KPIGridProps {
  onICUClick?: () => void;
  onEDClick?: () => void;
  onBedsClick?: () => void;
  onStaffClick?: () => void;
  onEquipmentClick?: () => void;
}

export const KPIGrid: React.FC<KPIGridProps> = ({
  onICUClick,
  onEDClick,
  onBedsClick,
  onStaffClick,
  onEquipmentClick
}) => {
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-3.5">
      {/* 1. ICU Occupancy */}
      <KPICard
        label="ICU Occupancy"
        value="92.4"
        unit="%"
        trend="+4.8% vs 6h"
        trendDirection="up"
        trendType="warning"
        statusText="HIGH PRESSURE"
        statusVariant="rose"
        contextText="29/32 Beds • 3 Remaining"
        icon={Activity}
        iconColor="text-rose-400"
        onClick={onICUClick || (() => navigate('/app/resources'))}
        microVisualization={
          <svg className="w-9 h-9" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-rose-500"
              strokeDasharray="92.4, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        }
      />

      {/* 2. ED Arrivals */}
      <KPICard
        label="ED Arrivals"
        value="124"
        unit="pts/hr"
        trend="+18.4% vs prev"
        trendDirection="up"
        trendType="warning"
        statusText="SURGE"
        statusVariant="amber"
        contextText="Peak 146 pts/hr at 20:00"
        icon={AlertTriangle}
        iconColor="text-amber-400"
        onClick={onEDClick || (() => navigate('/app/forecasting'))}
        microVisualization={
          <svg className="w-14 h-7" viewBox="0 0 60 26">
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              points="0,20 12,18 24,15 36,12 48,6 60,8"
            />
            <circle cx="48" cy="6" r="2.5" fill="#f59e0b" className="animate-ping" />
          </svg>
        }
      />

      {/* 3. Available Beds */}
      <KPICard
        label="Available Beds"
        value="28"
        unit="Beds"
        trend="12 Discharges Pending"
        trendDirection="neutral"
        trendType="positive"
        statusText="STABLE"
        statusVariant="teal"
        contextText="19 Ward • 6 PACU • 3 ICU"
        icon={Bed}
        iconColor="text-teal-400"
        onClick={onBedsClick || (() => navigate('/app/resources'))}
        microVisualization={
          <div className="flex flex-col gap-1 w-12">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-cyan-400" style={{ width: '88%' }} />
              <div className="h-full bg-emerald-400" style={{ width: '12%' }} />
            </div>
            <span className="text-[9px] font-mono text-slate-400 text-right">88.3% Occ</span>
          </div>
        }
      />

      {/* 4. Staff Utilization */}
      <KPICard
        label="Staff Utilization"
        value="91.2"
        unit="%"
        trend="7 Staff Shortfall"
        trendDirection="up"
        trendType="warning"
        statusText="ELEVATED"
        statusVariant="amber"
        contextText="124 Active • 7 Floater Pool"
        icon={Users}
        iconColor="text-cyan-400"
        onClick={onStaffClick || (() => navigate('/app/resources'))}
        microVisualization={
          <div className="flex items-center gap-1 w-12">
            <div className="h-4 w-1.5 rounded-full bg-cyan-400" />
            <div className="h-5 w-1.5 rounded-full bg-cyan-400" />
            <div className="h-6 w-1.5 rounded-full bg-cyan-400" />
            <div className="h-7 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
        }
      />

      {/* 5. Critical Equipment */}
      <KPICard
        label="Equipment In Use"
        value="88.5"
        unit="%"
        trend="2 Maint • 0 Down"
        trendDirection="neutral"
        trendType="positive"
        statusText="WATCH"
        statusVariant="emerald"
        contextText="24/28 Ventilators • 14/16 Monitors"
        icon={Cpu}
        iconColor="text-indigo-400"
        onClick={onEquipmentClick || (() => navigate('/app/resources'))}
        microVisualization={
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] font-mono text-emerald-400 font-bold">24 Vent Active</span>
            <div className="w-11 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400" style={{ width: '85%' }} />
            </div>
          </div>
        }
      />
    </div>
  );
};
