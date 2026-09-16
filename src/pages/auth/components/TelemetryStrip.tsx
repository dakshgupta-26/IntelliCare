import React from 'react';

interface TelemetryMetric {
  label: string;
  value: string;
  trend?: string;
  status: 'critical' | 'surge' | 'optimal' | 'live';
  detail: string;
}

const METRICS: TelemetryMetric[] = [
  {
    label: 'ICU OCCUPANCY',
    value: '92%',
    trend: '29/32 Beds',
    status: 'critical',
    detail: 'Strain threshold reached in Medical Intensive Care'
  },
  {
    label: 'ED INFLUX',
    value: '+18%',
    trend: 'Next 4h',
    status: 'surge',
    detail: 'LSTM Neural Forecast projects 14 incoming arrivals'
  },
  {
    label: 'STAFF UTILIZATION',
    value: '82%',
    trend: 'Balanced',
    status: 'optimal',
    detail: 'Dynamic shift allocations operating within safety bounds'
  },
  {
    label: 'TELEMETRY BUS',
    value: '250 Hz',
    trend: '12ms',
    status: 'live',
    detail: 'Kafka real-time clinical stream latency'
  }
];

export const TelemetryStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full select-none ${className}`}>
      {METRICS.map((m) => {
        const isCritical = m.status === 'critical';
        const isSurge = m.status === 'surge';

        return (
          <div
            key={m.label}
            title={m.detail}
            className="group relative p-3 rounded-xl bg-[#050B14]/85 border border-white/[0.07] hover:border-cyan-500/30 transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between pb-1">
              <span className="text-[9px] font-mono font-semibold tracking-wider text-slate-400 uppercase truncate">
                {m.label}
              </span>
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                {isCritical ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-400" />
                  </>
                ) : isSurge ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                )}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-mono font-bold tracking-tight ${
                isCritical ? 'text-rose-300' : isSurge ? 'text-amber-300' : 'text-cyan-300'
              }`}>
                {m.value}
              </span>
              {m.trend && (
                <span className="text-[10px] font-mono text-slate-500 truncate">
                  {m.trend}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
