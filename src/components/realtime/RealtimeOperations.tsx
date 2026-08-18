import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { Badge } from '../ui/Badge';
import { Activity, Radio, TrendingUp, Bed, Users, Play, Pause } from 'lucide-react';

export const RealtimeOperations: React.FC = () => {
  const departments = useSimStore((state) => state.departments);
  const telemetryLogs = useSimStore((state) => state.telemetryLogs);
  const isStreaming = useSimStore((state) => state.isRealtimeStreaming);
  const toggleStreaming = useSimStore((state) => state.toggleRealtimeStream);

  // Compute aggregate statistics
  const totalBedsOccupied = departments.reduce((acc, d) => acc + d.bedsOccupied, 0);
  const totalBedCapacity = departments.reduce((acc, d) => acc + d.bedCapacity, 0);
  const totalBedsAvailable = totalBedCapacity - totalBedsOccupied;
  const averageUtilization = Math.round((totalBedsOccupied / totalBedCapacity) * 100);

  const icuDept = departments.find((d) => d.id === 'dept-icu');
  const edDept = departments.find((d) => d.id === 'dept-er');

  return (
    <section id="realtime" className="relative py-28 bg-navy-950 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="cyan" size="md" className="mb-4">
              WEBSOCKET EVENT STREAM
            </Badge>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Live Operations Intelligence
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              Continuous bidirectional event stream delivering sub-second updates across critical care telemetry, bed turnover events, and predictive escalation alerts.
            </p>
          </div>

          {/* Live Streaming Toggle & Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleStreaming}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-slate-800 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-100 border border-slate-800 text-xs font-mono text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isStreaming ? 'LIVE WSS FEED' : 'STREAM PAUSED'}</span>
            </div>
          </div>
        </div>

        {/* Live Operational Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Tile 1: ICU Occupancy */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                ICU Occupancy
              </span>
              <Activity className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-rose-300">
                {icuDept ? icuDept.utilization : 92}%
              </span>
              <span className="text-xs font-mono text-slate-400">
                {icuDept?.bedsOccupied}/{icuDept?.bedCapacity}
              </span>
            </div>
            <span className="text-[11px] font-mono text-rose-400/80 mt-2 block">
              High Acuity Proximity Alert
            </span>
          </div>

          {/* Tile 2: Emergency Surge */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Emergency Intake
              </span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-cyan-300">
                {edDept?.surgeDelta ? `+${edDept.surgeDelta}%` : '+14.2%'}
              </span>
              <span className="text-xs font-mono text-cyan-400">T+2h</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400/80 mt-2 block">
              Above Seasonal Baseline
            </span>
          </div>

          {/* Tile 3: Available Beds */}
          <div className="glass-panel p-5 rounded-2xl border border-teal-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Beds Available
              </span>
              <Bed className="w-4 h-4 text-teal-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white">
                {totalBedsAvailable}
              </span>
              <span className="text-xs font-mono text-slate-400">
                of {totalBedCapacity} Total
              </span>
            </div>
            <span className="text-[11px] font-mono text-teal-400/80 mt-2 block">
              {averageUtilization}% Campus Occupancy
            </span>
          </div>

          {/* Tile 4: Staff Utilization */}
          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Staff Utilization
              </span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-indigo-300">
                81.4%
              </span>
              <span className="text-xs font-mono text-emerald-400">Balanced</span>
            </div>
            <span className="text-[11px] font-mono text-indigo-400/80 mt-2 block">
              Mandatory Ratios Satisfied
            </span>
          </div>
        </div>

        {/* Live WebSocket Event Feed Ticker */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Live Operations Telemetry Stream (ws://intelli-stream/v1)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Illustrative Real-Time Interface
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-2">
            {telemetryLogs.map((log) => {
              const severityStyles = {
                info: 'bg-surface-100 border-slate-800 text-slate-300',
                warning: 'bg-amber-950/20 border-amber-500/30 text-amber-200',
                critical: 'bg-rose-950/20 border-rose-500/30 text-rose-200',
                success: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200',
              };

              const badgeColors = {
                info: 'cyan',
                warning: 'amber',
                critical: 'rose',
                success: 'emerald',
              } as const;

              return (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono transition-all duration-300 ${severityStyles[log.severity]}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                    <Badge variant={badgeColors[log.severity]} size="sm">
                      {log.type}
                    </Badge>
                    <span className="text-white font-bold">{log.title}</span>
                  </div>

                  <span className="text-slate-400 text-[11px] sm:max-w-md truncate">
                    {log.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
