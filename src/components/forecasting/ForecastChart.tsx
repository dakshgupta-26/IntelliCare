import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import { FORECAST_SERIES_DATA } from '../../data/demoData';
import { TimeSeriesPoint } from '../../types/telemetry';

export const ForecastChart: React.FC = () => {
  const showLstm = useSimStore((state) => state.showLstm);
  const showXgboost = useSimStore((state) => state.showXgboost);
  const showConfidenceIntervals = useSimStore((state) => state.showConfidenceIntervals);
  const simulateSpike = useSimStore((state) => state.simulateSpike);

  const [hoveredPoint, setHoveredPoint] = useState<TimeSeriesPoint | null>(null);

  // SVG Chart Dimensions
  const width = 850;
  const height = 340;
  const padding = { top: 35, right: 30, bottom: 40, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Max scale calculation
  const maxVal = simulateSpike ? 200 : 170;
  const minVal = 20;

  const getX = (index: number) => padding.left + (index / (FORECAST_SERIES_DATA.length - 1)) * chartWidth;
  const getY = (val: number) => height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Split historical (0 to 8) vs future horizon (8 to end)
  const cutoffIndex = 8; // "16:00 (Now)"

  // Generate SVG path for Historical
  const historicalPoints = FORECAST_SERIES_DATA.slice(0, cutoffIndex + 1);
  const historicalPath = historicalPoints.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.historical || pt.lstmPredicted || 40);
    return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  // Generate SVG path for LSTM Predicted (from cutoffIndex forward)
  const lstmPath = FORECAST_SERIES_DATA.reduce((acc, pt, i) => {
    if (i < cutoffIndex) return '';
    const val = simulateSpike && pt.spikeAnomaly ? pt.spikeAnomaly : pt.lstmPredicted || 40;
    const x = getX(i);
    const y = getY(val);
    return i === cutoffIndex ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  // Generate SVG path for XGBoost Baseline
  const xgboostPath = FORECAST_SERIES_DATA.reduce((acc, pt, i) => {
    if (i < cutoffIndex) return '';
    const val = pt.xgboostBaseline || 40;
    const x = getX(i);
    const y = getY(val);
    return i === cutoffIndex ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  // Generate Confidence Interval Polygon (95% CI)
  const confidencePolygon = (() => {
    const futurePts = FORECAST_SERIES_DATA.slice(cutoffIndex);
    const upperPoints = futurePts.map((pt, i) => {
      const idx = cutoffIndex + i;
      const upperVal = simulateSpike && pt.spikeAnomaly ? pt.spikeAnomaly + 18 : pt.ciUpper || 50;
      return `${getX(idx)},${getY(upperVal)}`;
    });
    const lowerPoints = [...futurePts].reverse().map((pt, i) => {
      const idx = FORECAST_SERIES_DATA.length - 1 - i;
      const lowerVal = simulateSpike && pt.spikeAnomaly ? pt.spikeAnomaly - 14 : pt.ciLower || 30;
      return `${getX(idx)},${getY(lowerVal)}`;
    });
    return `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;
  })();

  const nowX = getX(cutoffIndex);

  return (
    <div className="relative w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl overflow-hidden text-slate-900">
      {/* Chart Header Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 block mb-1">
            MULTI-HORIZON PATIENT ARRIVAL FORECAST &bull; ED INTAKE
          </span>
          <span className="text-xs text-slate-500 font-sans">
            Observed patient admissions vs. Neural forecast horizon (T+14h)
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-slate-800 rounded" />
            <span className="text-slate-700 font-medium">Observed History</span>
          </div>
          {showLstm && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-cyan-600 rounded" />
              <span className="text-cyan-700 font-bold">LSTM Forecast</span>
            </div>
          )}
          {showXgboost && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-600 rounded border-b border-dashed border-indigo-600" />
              <span className="text-indigo-700 font-medium">XGBoost Baseline</span>
            </div>
          )}
          {showConfidenceIntervals && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-cyan-100 rounded border border-cyan-300" />
              <span className="text-slate-600">95% Conformal CI</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[640px] select-none"
        >
          {/* Horizontal Grid lines */}
          {[40, 80, 120, 160].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize={10}
                  fontFamily="JetBrains Mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Now Vertical Cutoff Line */}
          <line
            x1={nowX}
            y1={padding.top}
            x2={nowX}
            y2={height - padding.bottom}
            stroke="#0284c7"
            strokeDasharray="3 3"
            strokeWidth={1.5}
          />
          <text
            x={nowX}
            y={padding.top - 8}
            textAnchor="middle"
            fill="#0284c7"
            fontSize={11}
            fontWeight="bold"
            fontFamily="JetBrains Mono"
          >
            NOW (T=0)
          </text>

          {/* Confidence Interval 95% Shading */}
          {showConfidenceIntervals && (
            <path
              d={confidencePolygon}
              fill="rgba(2, 132, 199, 0.10)"
              stroke="rgba(2, 132, 199, 0.35)"
              strokeDasharray="2 2"
            />
          )}

          {/* Historical Solid Line */}
          <path
            d={historicalPath}
            fill="none"
            stroke="#1e293b"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* XGBoost Baseline Line */}
          {showXgboost && (
            <path
              d={xgboostPath}
              fill="none"
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
          )}

          {/* LSTM Forecast Line */}
          {showLstm && (
            <path
              d={lstmPath}
              fill="none"
              stroke={simulateSpike ? '#e11d48' : '#0284c7'}
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}

          {/* Interactive Data Dots & Hover Hitboxes */}
          {FORECAST_SERIES_DATA.map((pt, i) => {
            const isHistorical = i <= cutoffIndex;
            const val =
              isHistorical
                ? pt.historical || 40
                : simulateSpike && pt.spikeAnomaly
                ? pt.spikeAnomaly
                : pt.lstmPredicted || 40;
            const x = getX(i);
            const y = getY(val);

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Transparent Hitbox */}
                <circle cx={x} cy={y} r={14} fill="transparent" />

                {/* Visible Data Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={hoveredPoint === pt ? 5.5 : 3.5}
                  fill={isHistorical ? '#0f172a' : simulateSpike ? '#e11d48' : '#0284c7'}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="transition-all duration-150"
                />

                {/* X Axis Label */}
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  fill={i === cutoffIndex ? '#0284c7' : '#64748b'}
                  fontSize={9}
                  fontWeight={i === cutoffIndex ? 'bold' : 'normal'}
                  fontFamily="JetBrains Mono"
                >
                  {pt.hour.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div className="absolute top-16 right-8 bg-slate-900 text-white border border-slate-700 p-4 rounded-xl shadow-2xl z-20 text-xs font-mono flex flex-col gap-1.5 min-w-[210px]">
          <div className="font-bold text-white pb-1 border-b border-slate-700 flex items-center justify-between">
            <span>HOUR: {hoveredPoint.hour}</span>
          </div>
          {hoveredPoint.historical !== undefined && (
            <div className="flex justify-between text-slate-300">
              <span>Observed:</span>
              <span className="font-bold text-white">{hoveredPoint.historical} pts/hr</span>
            </div>
          )}
          {hoveredPoint.lstmPredicted !== undefined && (
            <div className="flex justify-between text-cyan-300">
              <span>LSTM Predicted:</span>
              <span className="font-bold text-cyan-400">
                {simulateSpike && hoveredPoint.spikeAnomaly
                  ? hoveredPoint.spikeAnomaly
                  : hoveredPoint.lstmPredicted}{' '}
                pts/hr
              </span>
            </div>
          )}
          {hoveredPoint.xgboostBaseline !== undefined && (
            <div className="flex justify-between text-indigo-300">
              <span>XGBoost Baseline:</span>
              <span className="text-indigo-400">{hoveredPoint.xgboostBaseline} pts/hr</span>
            </div>
          )}
          {hoveredPoint.ciUpper && (
            <div className="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-700">
              <span>95% CI Interval:</span>
              <span>[{hoveredPoint.ciLower} - {hoveredPoint.ciUpper}]</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
