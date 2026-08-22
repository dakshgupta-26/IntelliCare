import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  MapPin,
  Calendar
} from 'lucide-react';
import { ResourceMetric } from '../../types/resources';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabItem } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { useRouterStore } from '../../store/useRouterStore';

interface ResourceDetailPageProps {
  resource: ResourceMetric;
}

export const ResourceDetailPage: React.FC<ResourceDetailPageProps> = ({ resource }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'historical' | 'forecast' | 'audit'>('overview');
  const navigate = useRouterStore((state) => state.navigate);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'historical', label: 'Historical Telemetry' },
    { id: 'forecast', label: 'Demand Forecast' },
    { id: 'audit', label: 'Audit & Compliance' }
  ];

  return (
    <div className="space-y-6">
      {/* Resource Primary Summary Header */}
      <div className="p-5 rounded-2xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
              {resource.category.replace('_', ' ')}
            </span>
            <h3 className="text-xl font-display font-bold text-white mt-0.5">
              {resource.name}
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{resource.location}</span>
            </div>
          </div>

          <Badge
            variant={
              resource.status === 'CRITICAL'
                ? 'rose'
                : resource.status === 'HIGH_UTILIZATION'
                ? 'amber'
                : 'emerald'
            }
            size="md"
            dot
          >
            {resource.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* 4 Quick Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-surface-300/40 border border-slate-700/40">
            <span className="text-[10px] font-mono text-slate-400 block">Total Capacity</span>
            <span className="text-lg font-bold text-white font-mono">{resource.totalCapacity}</span>
            <span className="text-[10px] text-slate-400 ml-1">{resource.unit}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-300/40 border border-slate-700/40">
            <span className="text-[10px] font-mono text-slate-400 block">Occupied / Active</span>
            <span className="text-lg font-bold text-white font-mono">{resource.allocated}</span>
            <span className="text-[10px] text-slate-400 ml-1">{resource.unit}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-300/40 border border-slate-700/40">
            <span className="text-[10px] font-mono text-slate-400 block">Available Buffer</span>
            <span className={`text-lg font-bold font-mono ${resource.available <= 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {resource.available}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-300/40 border border-slate-700/40">
            <span className="text-[10px] font-mono text-slate-400 block">Current Load</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">{resource.utilizationRate}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
        variant="pills"
      />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4 text-xs font-mono">
          {/* Target Ratio & Compliance */}
          {resource.targetRatio && (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Statutory Clinical Mandate</span>
              </div>
              <p className="text-xs text-slate-300">{resource.targetRatio}</p>
            </div>
          )}

          {/* Specifications Table */}
          {resource.specifications && (
            <div className="p-4 rounded-xl bg-surface-200/40 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Technical Specifications & Biomedical Calibration
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {Object.entries(resource.specifications).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg bg-surface-300/30 border border-slate-700/30">
                    <span className="text-slate-400 block">{k}</span>
                    <span className="text-white font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Schedule */}
          {resource.maintenanceSchedule && (
            <div className="p-4 rounded-xl bg-surface-200/40 border border-slate-800 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Preventative Maintenance Schedule</span>
                <span className="text-[11px] text-slate-400">{resource.maintenanceSchedule}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Historical Telemetry */}
      {activeTab === 'historical' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-xs font-bold text-white block mb-2">Past 8-Hour Utilization Trace</span>
            <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
              {resource.historicalUsage.map((pt, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">{pt.value}</span>
                  <div
                    className="w-full bg-cyan-500/30 hover:bg-cyan-400 rounded-t-lg transition-all"
                    style={{ height: `${(pt.value / resource.totalCapacity) * 120}px` }}
                  />
                  <span className="text-[9px] font-mono text-slate-400">{pt.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Demand Forecast */}
      {activeTab === 'forecast' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-200/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Projected Demand in 6 Hours</span>
              <Badge variant="cyan" size="sm">LSTM Inference</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-rose-400 font-mono">
                {resource.projectedDemandNext6h}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {resource.unit} requested (Capacity: {resource.totalCapacity})
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Demand pressure exceeds physical nominal capacity by{' '}
              <span className="text-rose-400 font-bold">
                {resource.projectedDemandNext6h - resource.totalCapacity} units
              </span>
              . Mitigation via solver reallocation is advised.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full"
            icon={<TrendingUp className="w-4 h-4" />}
            onClick={() => navigate('/app/forecasting')}
          >
            Launch Full Forecast Engine
          </Button>
        </div>
      )}

      {/* Tab 4: Audit & Compliance */}
      {activeTab === 'audit' && (
        <div className="space-y-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-surface-200/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Audit Action: Telemetry Sync</span>
              <span>1 min ago</span>
            </div>
            <p className="text-slate-300">Continuous telemetry feed received from Philips MX800 Gateway #ICU-04.</p>
            <span className="text-[10px] text-slate-500 block truncate">
              SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
