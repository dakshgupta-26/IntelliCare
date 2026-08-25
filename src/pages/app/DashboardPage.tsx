import React, { useState } from 'react';
import {
  Activity,
  Bed,
  Users,
  AlertTriangle,
  TrendingUp,
  Cpu,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRecommendationStore } from '../../store/useRecommendationStore';
import { useAlertStore } from '../../store/useAlertStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const recommendations = useRecommendationStore((state) => state.recommendations);
  const openReviewModal = useRecommendationStore((state) => state.openReviewModal);
  const alerts = useAlertStore((state) => state.alerts);
  const navigate = useRouterStore((state) => state.navigate);

  const [activeChartMetric, setActiveChartMetric] = useState<'all' | 'beds' | 'icu' | 'staff'>('all');
  const pendingRec = recommendations.find((r) => r.status === 'PENDING') || recommendations[0];
  const activeAlerts = alerts.filter((a) => a.status !== 'RESOLVED').slice(0, 3);

  // Utilization timeline simulation for chart
  const timelinePoints = [
    { time: '08:00', beds: 76, icu: 82, staff: 74, emergency: 65 },
    { time: '10:00', beds: 80, icu: 86, staff: 79, emergency: 78 },
    { time: '12:00', beds: 85, icu: 89, staff: 84, emergency: 88 },
    { time: '14:00', beds: 88, icu: 91, staff: 82, emergency: 92 },
    { time: '16:00 (Now)', beds: 89, icu: 94, staff: 88, emergency: 96 },
    { time: '18:00 (T+2h)', beds: 92, icu: 96, staff: 94, emergency: 104, isForecast: true },
    { time: '20:00 (T+4h)', beds: 95, icu: 98, staff: 96, emergency: 110, isForecast: true },
    { time: '22:00 (T+6h)', beds: 90, icu: 92, staff: 89, emergency: 94, isForecast: true }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Command Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-surface-100 dark:bg-[#0c182c] border border-slate-700/80 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Hospital Operations Command
            </span>
            <span className="text-slate-600">•</span>
            <Badge variant="amber" size="sm" dot>
              HIGH ACUITY SURGE EXPECTED
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Good morning, {currentUser ? currentUser.name.split(',')[0] : 'Operations Director'}
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl leading-relaxed">
            IntelliCare is actively evaluating multi-department patient intake, staffing ratios, and ICU bed availability for the next 24 hours.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<Sliders className="w-4 h-4 text-purple-400" />}
            onClick={() => navigate('/app/scenarios')}
          >
            Run Scenario
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Cpu className="w-4 h-4" />}
            onClick={() => navigate('/app/optimization')}
          >
            Optimize Allocation
          </Button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Core 5 Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Overall Bed Occupancy */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">Total Bed Occupancy</span>
              <Bed className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              88.4%
            </div>
            <p className="text-xs text-slate-400 mt-1">212 of 240 Beds Occupied</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className="text-rose-400 font-bold">+5.2% vs baseline</span>
            <span className="text-slate-400">Tightening</span>
          </div>
        </div>

        {/* KPI 2: ICU Utilization */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800/80 hover:border-rose-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">ICU Utilization</span>
              <Activity className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-rose-400 tracking-tight">
              90.6%
            </div>
            <p className="text-xs text-slate-400 mt-1">29 of 32 ICU Beds Active</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className="text-rose-400 font-bold">3 Beds Remaining</span>
            <Badge variant="rose" size="sm">CRITICAL</Badge>
          </div>
        </div>

        {/* KPI 3: Available Beds Buffer */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800/80 hover:border-teal-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">Available Beds</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              28
            </div>
            <p className="text-xs text-slate-400 mt-1">19 Ward • 6 PACU • 3 ICU</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className="text-teal-400 font-bold">12 Discharges Pending</span>
            <span className="text-slate-400">Step-Down Ready</span>
          </div>
        </div>

        {/* KPI 4: Active Staff Utilization */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">Active Staff Ratio</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              91.2%
            </div>
            <p className="text-xs text-slate-400 mt-1">124 on Shift • 6 Floaters</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className="text-amber-400 font-bold">Mandatory Ratios Met</span>
            <span className="text-slate-400">0 Overtime</span>
          </div>
        </div>

        {/* KPI 5: Emergency Intake Load */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono">Emergency Load</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-amber-400 tracking-tight">
              124 <span className="text-xs text-slate-400 font-mono">pts/hr</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Peak 146 pts/hr at 20:00</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <span className="text-rose-400 font-bold">Surge +18.4%</span>
            <Badge variant="amber" size="sm">HIGH</Badge>
          </div>
        </div>
      </div>

      {/* 2.5. Modern AI / ML Feature Intelligence Spotlight Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ML Model Studio Spotlight */}
        <div
          onClick={() => navigate('/app/models')}
          className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-surface-100 to-surface-100 dark:from-cyan-950/30 dark:via-[#0a1628] dark:to-[#0a1628] border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  AI / ML Model Laboratory
                </span>
              </div>
              <Badge variant="cyan" size="sm">
                4 ARCHITECTURES ACTIVE
              </Badge>
            </div>
            <h3 className="text-lg font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
              Random Forest, XGBoost & Multi-Horizon LSTM
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Interactive hyperparameter sandbox, live epoch loss backpropagation, and SHAP Explainable AI feature attribution.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>Validation $R^2$: 96.8% &bull; 14ms Inference</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch Studio →
            </span>
          </div>
        </div>

        {/* Clinical AI Deterioration Engine Spotlight */}
        <div
          onClick={() => navigate('/app/clinical-ai')}
          className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-surface-100 to-surface-100 dark:from-emerald-950/30 dark:via-[#0a1628] dark:to-[#0a1628] border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Activity className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  Clinical Decision Support (CDSS)
                </span>
              </div>
              <Badge variant="emerald" size="sm">
                SOFA &bull; NEWS2
              </Badge>
            </div>
            <h3 className="text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
              Patient Deterioration Risk & Drug Matrix
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Real-time physiological vital simulation, 12-hour LSTM collapse trajectory forecast, and GNN contraindication checker.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-emerald-400">
            <span>Surviving Sepsis Protocols Active</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Evaluate Patients →
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Resource Utilization Visual & Live Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Resource Utilization Trajectory */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-display font-bold text-white tracking-tight">
                  Hospital Resource Utilization & Forward Horizon
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Historical telemetry (08:00–16:00) with LSTM multi-horizon projection (16:00–22:00)
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 bg-surface-200/80 dark:bg-[#07111f] p-1 rounded-xl border border-slate-800 shrink-0">
                {(['all', 'beds', 'icu', 'staff'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveChartMetric(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition-colors cursor-pointer ${
                      activeChartMetric === m
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom SVG Responsive Multi-Series Utilization Chart */}
            <div className="relative h-64 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 220" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((val) => (
                  <g key={val}>
                    <line
                      x1="0"
                      y1={200 - val * 1.8}
                      x2="700"
                      y2={200 - val * 1.8}
                      stroke="currentColor"
                      className="text-slate-800/80"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="0"
                      y={196 - val * 1.8}
                      className="text-[9px] font-mono fill-slate-500"
                    >
                      {val}%
                    </text>
                  </g>
                ))}

                {/* Horizon Cutoff Line (T = 16:00 Now) */}
                <line
                  x1="350"
                  y1="10"
                  x2="350"
                  y2="200"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text x="355" y="24" className="text-[10px] font-mono fill-cyan-400 font-bold">
                  NOW (16:00) ➔ FUTURE INFERENCE
                </text>

                {/* Area under ICU curve */}
                <path
                  d="M 0,52 L 100,45 L 200,39 L 300,36 L 350,30 L 450,27 L 550,23 L 700,34 L 700,200 L 0,200 Z"
                  fill="url(#icu-glow)"
                  opacity="0.25"
                />

                {/* Area under Beds curve */}
                <path
                  d="M 0,63 L 100,56 L 200,47 L 300,41 L 350,39 L 450,34 L 550,29 L 700,38 L 700,200 L 0,200 Z"
                  fill="url(#beds-glow)"
                  opacity="0.2"
                />

                {/* ICU Line (Rose) */}
                <polyline
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  points="0,52 100,45 200,39 300,36 350,30 450,27 550,23 700,34"
                />

                {/* Beds Line (Cyan) */}
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  points="0,63 100,56 200,47 300,41 350,39 450,34 550,29 700,38"
                />

                {/* Staff Ratio Line (Teal) */}
                <polyline
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  points="0,66 100,57 200,48 300,52 350,41 450,30 550,27 700,39"
                />

                {/* Data Points */}
                {[
                  { cx: 350, cy: 30, color: '#f43f5e', label: '94% ICU' },
                  { cx: 550, cy: 23, color: '#f43f5e', label: '98% Peak' },
                  { cx: 350, cy: 39, color: '#06b6d4', label: '89% Beds' }
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.cx} cy={pt.cy} r="4.5" fill={pt.color} className="animate-pulse" />
                    <text
                      x={pt.cx - 15}
                      y={pt.cy - 8}
                      className="text-[9px] font-mono font-bold fill-white"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}

                {/* Gradients */}
                <defs>
                  <linearGradient id="icu-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="beds-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* X-Axis Timeline Labels */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 px-1">
              {timelinePoints.map((p, idx) => (
                <span
                  key={idx}
                  className={p.isForecast ? 'text-cyan-400 font-bold' : 'text-slate-400'}
                >
                  {p.time.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
                <span className="text-slate-300">ICU Bed Occupancy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
                <span className="text-slate-300">General Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-teal-400 rounded-full border-dashed" />
                <span className="text-slate-300">Active Staff Ratio</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/app/forecasting')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Detailed Forecast Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Forecast Horizon Preview Cards */}
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-display font-bold text-white">Demand Horizon</h3>
                <p className="text-xs font-mono text-slate-400">Emergency & ICU Projections</p>
              </div>
              <Badge variant="cyan" size="sm">LSTM V2.4</Badge>
            </div>

            <div className="space-y-3">
              {/* Current */}
              <div className="p-3.5 rounded-xl bg-surface-200/50 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">Current Load (16:00)</span>
                  <div className="text-base font-bold text-white">124 pts/hr • 90.6% ICU</div>
                </div>
                <Badge variant="emerald" size="sm">BASELINE</Badge>
              </div>

              {/* +6h */}
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">Horizon +6h (22:00)</span>
                  <div className="text-base font-bold text-white">146 pts/hr • 94.8% ICU</div>
                  <span className="text-[10px] text-slate-400 font-mono">95% CI: [133 - 159 pts]</span>
                </div>
                <Badge variant="amber" size="sm">SURGE</Badge>
              </div>

              {/* +12h */}
              <div className="p-3.5 rounded-xl bg-surface-200/50 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">Horizon +12h (04:00)</span>
                  <div className="text-base font-bold text-white">45 pts/hr • 82.0% ICU</div>
                  <span className="text-[10px] text-slate-400 font-mono">95% CI: [37 - 53 pts]</span>
                </div>
                <Badge variant="teal" size="sm">RELAXING</Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              icon={<TrendingUp className="w-3.5 h-3.5 text-cyan-400" />}
              onClick={() => navigate('/app/forecasting')}
            >
              Inspect Neural Forecasting
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Prominent AI Recommendation Panel & Active Alert Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendations Panel (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-surface-100 via-surface-100 to-indigo-950/20 dark:from-[#0a1628] dark:to-[#0f1d38] border border-cyan-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-white">
                    Primary Operational Recommendation
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">
                    Human-in-the-Loop Review Required (SOP-ICU-2024.3 & ED-ESC-09)
                  </p>
                </div>
              </div>

              <Badge variant="amber" size="sm">
                HIGH PRIORITY
              </Badge>
            </div>

            {/* Recommendation Content */}
            <div className="p-4 rounded-2xl bg-surface-200/40 dark:bg-[#07111f]/60 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">
                {pendingRec.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pendingRec.issueDescription}
              </p>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Recommended Operational Action: </span>
                  {pendingRec.recommendedAction}
                </div>
              </div>

              {/* Impact metrics chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {pendingRec.impacts.map((imp, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface-300/40 border border-slate-700/50 text-[11px] font-mono">
                    <span className="text-slate-400 block">{imp.metricName}</span>
                    <span className="text-emerald-400 font-bold">{imp.change}</span>{' '}
                    <span className="text-slate-500">({imp.before} → {imp.projectedAfter})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{pendingRec.expiresAt}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/app/scenarios')}
              >
                Simulate Scenario
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openReviewModal(pendingRec)}
              >
                Review & Sign Off
              </Button>
            </div>
          </div>
        </div>

        {/* Active Operational Alerts Preview (1 Col) */}
        <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-display font-bold text-white">Active Triage Alerts</h3>
                <p className="text-xs font-mono text-slate-400">Real-time threshold breaches</p>
              </div>
              <button
                onClick={() => navigate('/app/alerts')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                View All ({alerts.filter((a) => a.status !== 'RESOLVED').length})
              </button>
            </div>

            <div className="space-y-3">
              {activeAlerts.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => navigate(alt.targetUrl || '/app/alerts')}
                  className="p-3.5 rounded-xl bg-surface-200/40 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          alt.severity === 'CRITICAL'
                            ? 'bg-rose-500 animate-ping'
                            : alt.severity === 'WARNING'
                            ? 'bg-amber-400'
                            : 'bg-cyan-400'
                        }`}
                      />
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {alt.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {alt.createdAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {alt.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-cyan-400">{alt.departmentName}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-slate-300">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => navigate('/app/alerts')}
              className="w-full text-center text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              Open Full Alert Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
