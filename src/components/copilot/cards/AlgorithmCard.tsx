import React, { useState } from 'react';
import { Binary } from 'lucide-react';

interface AlgorithmCardProps {
  title: string;
  subtitle?: string;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  title,
  subtitle
}) => {
  const [activeTab, setActiveTab] = useState<'LSTM' | 'XGBOOST' | 'MILP' | 'RAG' | 'ORTOOLS'>('LSTM');

  const algorithms = {
    LSTM: {
      name: 'Stacked Long Short-Term Memory (LSTM)',
      category: 'Deep Learning / Recurrent Neural Networks',
      formula: 'f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f), \\quad c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t',
      description: 'Captures multi-step diurnal patterns, seasonal hospital trends, and non-linear surges with quantile loss confidence bounds.',
      complexity: 'O(W \\cdot T) parameters',
      latency: '~12ms batch inference'
    },
    XGBOOST: {
      name: 'Gradient Boosted Decision Trees (XGBoost)',
      category: 'Ensemble Learning / Tabular Regressor',
      formula: '\\mathcal{L}^{(t)} = \\sum_{i=1}^n l(y_i, \\hat{y}_i^{(t-1)} + f_t(x_i)) + \\Omega(f_t)',
      description: 'Fast tabular baseline trained on rolling lags (t-1, t-24) to validate neural predictions and compute feature importance.',
      complexity: 'O(K \\cdot d \\cdot n \\log n)',
      latency: '~4ms inference'
    },
    MILP: {
      name: 'Mixed-Integer Linear Programming (MILP)',
      category: 'Constrained Mathematical Optimization',
      formula: '\\min \\; c^T x + d^T y \\quad \\text{s.t.} \\quad A x + B y \\le b, \\; x \\ge 0, \\; y \\in \\mathbb{Z}^p',
      description: 'Guarantees global mathematical optimality for bed allocation and floater nurse schedules with zero statutory violations.',
      complexity: 'NP-Hard (Branch & Cut / Presolve)',
      latency: '84ms global solve'
    },
    RAG: {
      name: 'Hybrid Dense Vector + BM25 RAG',
      category: 'Information Retrieval / Semantic Grounding',
      formula: '\\text{Score}(q, d) = \\alpha \\cdot \\cos(e_q, e_d) + (1 - \\alpha) \\cdot \\text{BM25}(q, d)',
      description: 'Dual-encoder embeddings in PostgreSQL pgvector combined with BM25 sparse keyword ranking over hospital clinical SOPs.',
      complexity: 'O(\\log N) via HNSW index',
      latency: '~18ms hybrid query'
    },
    ORTOOLS: {
      name: 'Google OR-Tools Mathematical Solver Core',
      category: 'Operations Research Industrial Engine',
      formula: '\\text{Presolve} \\to \\text{Dual Simplex} \\to \\text{Gomory Mixed-Integer Cuts}',
      description: 'Industrial-grade open source solver engine deployed as Python microservices with gRPC communication pipes.',
      complexity: 'State-of-the-Art Branch & Bound',
      latency: '<100ms multi-dept allocation'
    }
  };

  const current = algorithms[activeTab];

  return (
    <div className="my-3 rounded-2xl bg-midnight-900/90 border border-purple-500/30 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl text-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-brand-lavender">
            <Binary className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-display tracking-wide">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-3 custom-scrollbar">
        {(['LSTM', 'XGBOOST', 'MILP', 'RAG', 'ORTOOLS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-[0_0_10px_rgba(155,140,255,0.2)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-100 border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Selected Tab Content */}
      <div className="bg-surface-50/90 p-3 rounded-xl border border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white font-display">{current.name}</span>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
            {current.category}
          </span>
        </div>

        {/* Formula Box */}
        <div className="p-2 rounded-lg bg-midnight-950/90 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
          <code>{current.formula}</code>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          {current.description}
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
          <div>Complexity: <span className="text-slate-200">{current.complexity}</span></div>
          <div className="text-right">Execution: <span className="text-emerald-400">{current.latency}</span></div>
        </div>
      </div>
    </div>
  );
};
