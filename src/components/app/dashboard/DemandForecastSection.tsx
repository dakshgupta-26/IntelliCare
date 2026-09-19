import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useForecastStore } from '../../../store/useForecastStore';
import { useRouterStore } from '../../../store/useRouterStore';
import { ForecastHorizon } from '../../../types/forecasting';
import { Badge } from '../../ui/Badge';

export const DemandForecastSection: React.FC = () => {
  const forecastData = useForecastStore((state) => state.forecastData);
  const selectedHorizon = useForecastStore((state) => state.selectedHorizon);
  const setHorizon = useForecastStore((state) => state.setHorizon);
  const showConfidenceBands = useForecastStore((state) => state.showConfidenceBands);
  const setShowConfidenceBands = useForecastStore((state) => state.setShowConfidenceBands);
  const navigate = useRouterStore((state) => state.navigate);

  const [activeSignal, setActiveSignal] = useState<'arrivals' | 'icu' | 'beds'>('arrivals');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const horizons: ForecastHorizon[] = ['6H', '12H', '24H', '48H'];

  // Points filtered based on horizon
  const getDisplayPoints = () => {
    const all = forecastData.points;
    switch (selectedHorizon) {
      case '6H':
        return all.slice(4, 12); // around 08:00 to 22:00
      case '12H':
        return all.slice(2, 14);
      case '48H':
      case '24H':
      default:
        return all;
    }
  };

  const points = getDisplayPoints();
  const activeHoverPoint = hoveredPointIndex !== null ? points[hoveredPointIndex] : null;

  // Chart coordinates mapping (ViewBox 0 0 800 240)
  const chartWidth = 800;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const maxVal = 180;

  const getX = (index: number) => {
    return paddingX + (index / (points.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
  };

  // Find index of "Now" (16:00)
  const nowIndex = points.findIndex((p) => p.timestamp === '16:00' || p.hourLabel.includes('Now'));
  const validNowIndex = nowIndex >= 0 ? nowIndex : 4;
  const nowX = getX(validNowIndex);

  // Build Actuals Path (up to now)
  const actualPoints = points.slice(0, validNowIndex + 1);
  const actualPath = actualPoints.length > 0
    ? actualPoints.reduce((acc, p, idx) => {
        const x = getX(idx);
        const y = getY(p.actualDemand ?? p.lstmPredicted);
        return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
      }, '')
    : '';

  // Build Projected Path (from now onwards)
  const projectedPoints = points.slice(validNowIndex);
  const projectedPath = projectedPoints.length > 0
    ? projectedPoints.reduce((acc, p, idx) => {
        const globalIdx = validNowIndex + idx;
        const x = getX(globalIdx);
        const y = getY(p.lstmPredicted);
        return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
      }, '')
    : '';

  // Build 95% Confidence Band Polygon
  const ciPolygon = points.reduce((acc, p, idx) => {
    const x = getX(idx);
    const yUpper = getY(p.ciUpper95 ?? p.lstmPredicted + 12);
    return idx === 0 ? `M ${x},${yUpper}` : `${acc} L ${x},${yUpper}`;
  }, '');

  const ciPolygonReverse = [...points].reverse().reduce((acc, p, idx) => {
    const originalIdx = points.length - 1 - idx;
    const x = getX(originalIdx);
    const yLower = getY(p.ciLower95 ?? p.lstmPredicted - 12);
    return `${acc} L ${x},${yLower}`;
  }, '');

  const fullCiBand = `${ciPolygon} ${ciPolygonReverse} Z`;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#07111f] border border-slate-800/90 shadow-lg flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Multi-Horizon Neural Inference
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                LSTM V2.4 &bull; SIMULATED DATA
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
              Demand Forecast & Confidence Envelope
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Signal Switcher */}
            <div className="flex items-center gap-1 bg-[#050c18] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveSignal('arrivals')}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeSignal === 'arrivals'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ED Arrivals
              </button>
              <button
                onClick={() => setActiveSignal('icu')}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeSignal === 'icu'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ICU Demand
              </button>
              <button
                onClick={() => setActiveSignal('beds')}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeSignal === 'beds'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Total Beds
              </button>
            </div>

            {/* Horizon Switcher */}
            <div className="flex items-center gap-1 bg-[#050c18] p-1 rounded-xl border border-slate-800">
              {horizons.map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    selectedHorizon === h
                      ? 'bg-purple-500/25 text-purple-300 font-bold border border-purple-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast Chart Canvas */}
        <div className="relative w-full h-64 sm:h-72 mt-3 select-none">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="forecast-ci-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 50, 100, 150].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-800/80"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] font-mono fill-slate-500"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Confidence Band Area */}
            {showConfidenceBands && (
              <path d={fullCiBand} fill="url(#forecast-ci-gradient)" />
            )}

            {/* NOW (16:00) Horizon Cutoff Line */}
            <line
              x1={nowX}
              y1={paddingY}
              x2={nowX}
              y2={chartHeight - paddingY}
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text
              x={nowX + 6}
              y={paddingY + 12}
              className="text-[9px] font-mono font-bold fill-cyan-400"
            >
              NOW ➔ FORWARD PROJECTION
            </text>

            {/* Actual Demand Polyline (Solid Cyan) */}
            <path
              d={actualPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Projected Demand Polyline (Dashed Bright Cyan) */}
            <path
              d={projectedPath}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Point Touch Targets */}
            {points.map((p, idx) => {
              const x = getX(idx);
              const isPast = idx <= validNowIndex;
              const y = getY(isPast ? (p.actualDemand ?? p.lstmPredicted) : p.lstmPredicted);
              const isHovered = hoveredPointIndex === idx;

              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                >
                  {/* Invisible broad click target */}
                  <rect
                    x={x - 12}
                    y={paddingY}
                    width={24}
                    height={chartHeight - paddingY * 2}
                    fill="transparent"
                  />

                  {/* Vertical Crosshair Line on hover */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={paddingY}
                      x2={x}
                      y2={chartHeight - paddingY}
                      stroke="#94a3b8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                  )}

                  {/* Data Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5 : isPast ? 3.5 : 3}
                    fill={isPast ? '#06b6d4' : '#38bdf8'}
                    stroke="#07111f"
                    strokeWidth="2"
                    className={p.isPeakArrivalWindow ? 'animate-pulse' : ''}
                  />
                </g>
              );
            })}
          </svg>

          {/* Dynamic Hover Tooltip */}
          {activeHoverPoint && hoveredPointIndex !== null && (
            <div
              className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-[#0c182c]/95 border border-cyan-500/40 shadow-xl backdrop-blur-md text-[11px] font-mono text-slate-200 transition-all duration-75"
              style={{
                left: Math.min(
                  window.innerWidth < 640 ? 10 : (getX(hoveredPointIndex) / chartWidth) * 100,
                  75
                ) + '%',
                top: '15px'
              }}
            >
              <div className="font-bold text-white mb-1 flex items-center justify-between gap-3">
                <span>{activeHoverPoint.hourLabel}</span>
                <Badge
                  variant={hoveredPointIndex <= validNowIndex ? 'teal' : 'cyan'}
                  size="sm"
                >
                  {hoveredPointIndex <= validNowIndex ? 'HISTORICAL' : 'PREDICTED'}
                </Badge>
              </div>
              <div className="space-y-0.5">
                {activeHoverPoint.actualDemand !== undefined && hoveredPointIndex <= validNowIndex && (
                  <div className="text-cyan-400">
                    Actual Intake: <strong>{activeHoverPoint.actualDemand} pts/hr</strong>
                  </div>
                )}
                <div className="text-white">
                  Model Projected: <strong>{activeHoverPoint.lstmPredicted} pts/hr</strong>
                </div>
                {showConfidenceBands && activeHoverPoint.ciLower95 && (
                  <div className="text-slate-400 text-[10px]">
                    95% CI: [{activeHoverPoint.ciLower95} – {activeHoverPoint.ciUpper95} pts]
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* X-Axis Timeline Labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-4 mt-1">
          {points.map((p, idx) => {
            const isNow = idx === validNowIndex;
            return (
              <span
                key={idx}
                className={isNow ? 'text-cyan-400 font-bold' : 'text-slate-500'}
              >
                {p.timestamp}
              </span>
            );
          })}
        </div>
      </div>

      {/* Chart Footer: Legend & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-cyan-400 rounded-full" />
            <span className="text-slate-300">Actual Historical</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-sky-400 rounded-full border-dashed" />
            <span className="text-slate-300">LSTM Inference</span>
          </div>

          <button
            onClick={() => setShowConfidenceBands(!showConfidenceBands)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span
              className={`w-2.5 h-2.5 rounded ${
                showConfidenceBands ? 'bg-cyan-500/40 border border-cyan-400' : 'bg-slate-800'
              }`}
            />
            <span>95% Confidence Band</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/app/forecasting')}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
        >
          <span>Deep Forecast Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
