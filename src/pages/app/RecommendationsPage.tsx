import React, { useState } from 'react';
import {
  CheckCircle2,
  Sliders,
  Clock,
  ShieldCheck,
  Check,
  X,
  Edit3,
  History
} from 'lucide-react';
import { useRecommendationStore } from '../../store/useRecommendationStore';
import { useRouterStore } from '../../store/useRouterStore';
import { RecommendationItem, RecommendationStatus } from '../../types/recommendations';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';

export const RecommendationsPage: React.FC = () => {
  const recommendations = useRecommendationStore((state) => state.recommendations);
  const statusFilter = useRecommendationStore((state) => state.statusFilter);
  const setStatusFilter = useRecommendationStore((state) => state.setStatusFilter);
  const selectedRecommendation = useRecommendationStore((state) => state.selectedRecommendation);
  const isReviewModalOpen = useRecommendationStore((state) => state.isReviewModalOpen);
  const openReviewModal = useRecommendationStore((state) => state.openReviewModal);
  const closeReviewModal = useRecommendationStore((state) => state.closeReviewModal);
  const approveRecommendation = useRecommendationStore((state) => state.approveRecommendation);
  const modifyRecommendation = useRecommendationStore((state) => state.modifyRecommendation);
  const rejectRecommendation = useRecommendationStore((state) => state.rejectRecommendation);
  const navigate = useRouterStore((state) => state.navigate);

  // Review modal local state
  const [reviewMode, setReviewMode] = useState<'approve' | 'modify' | 'reject'>('approve');
  const [customQty, setCustomQty] = useState<number>(4);
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredRecs = recommendations.filter((r) =>
    statusFilter === 'ALL' ? true : r.status === statusFilter
  );

  const tabs = [
    { id: 'ALL', label: 'All Recommendations', count: recommendations.length },
    { id: 'PENDING', label: 'Pending Review', count: recommendations.filter((r) => r.status === 'PENDING').length },
    { id: 'APPROVED', label: 'Approved', count: recommendations.filter((r) => r.status === 'APPROVED').length },
    { id: 'MODIFIED', label: 'Modified', count: recommendations.filter((r) => r.status === 'MODIFIED').length },
    { id: 'REJECTED', label: 'Rejected', count: recommendations.filter((r) => r.status === 'REJECTED').length }
  ];

  const handleOpenReview = (rec: RecommendationItem) => {
    setCustomQty(rec.suggestedResourceDelta.quantity);
    setReviewNotes('');
    setReviewMode('approve');
    openReviewModal(rec);
  };

  const handleConfirmReview = () => {
    if (!selectedRecommendation) return;

    if (reviewMode === 'approve') {
      approveRecommendation(selectedRecommendation.id, reviewNotes);
    } else if (reviewMode === 'modify') {
      modifyRecommendation(selectedRecommendation.id, customQty, reviewNotes);
    } else if (reviewMode === 'reject') {
      rejectRecommendation(selectedRecommendation.id, reviewNotes || 'Operational supervisor declined change.');
    }
  };

  const getStatusBadge = (status: RecommendationStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="amber" size="sm" dot>PENDING REVIEW</Badge>;
      case 'APPROVED':
        return <Badge variant="emerald" size="sm">APPROVED</Badge>;
      case 'MODIFIED':
        return <Badge variant="cyan" size="sm">MODIFIED & APPROVED</Badge>;
      case 'REJECTED':
        return <Badge variant="rose" size="sm">REJECTED</Badge>;
      case 'EXPIRED':
      default:
        return <Badge variant="slate" size="sm">EXPIRED</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Human-in-the-Loop Governance
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              Zero Autonomous Unreviewed Allocations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            AI Operational Recommendations
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Review, calibrate, or decline algorithmic resource shifts with explicit supervisor sign-off and cryptographic audit logging.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<Sliders className="w-3.5 h-3.5" />}
            onClick={() => navigate('/app/scenarios')}
          >
            Simulate in Sandbox
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<History className="w-3.5 h-3.5" />}
            onClick={() => navigate('/app/activity')}
          >
            View Audit Ledger
          </Button>
        </div>
      </div>

      {/* 2. Tabs Filter Bar */}
      <Tabs
        tabs={tabs}
        activeTab={statusFilter}
        onChange={(id) => setStatusFilter(id as any)}
        variant="pills"
      />

      {/* 3. Recommendations Cards List */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium text-slate-300">No recommendations in this status</p>
            <p className="text-xs text-slate-500 mt-1">All algorithmic suggestions have been processed or filtered.</p>
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className={`p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border transition-all space-y-4 ${
                rec.status === 'PENDING'
                  ? 'border-cyan-500/40 shadow-lg'
                  : 'border-slate-700/80 dark:border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                      {rec.departmentName}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Created {rec.createdAt}
                    </span>
                    {rec.relatedSopCode && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          Grounded in {rec.relatedSopCode}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base font-display font-bold text-white leading-snug">
                    {rec.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(rec.status)}
                </div>
              </div>

              {/* Issue & Empirical Evidence */}
              <div className="p-4 rounded-2xl bg-surface-200/40 dark:bg-[#07111f] border border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="font-mono text-slate-400 block text-[10px] uppercase font-bold">
                    Identified Operational Bottleneck
                  </span>
                  <p className="text-slate-200 leading-relaxed mt-0.5">
                    {rec.issueDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="font-mono text-slate-400 block text-[10px] uppercase font-bold">
                    Empirical Evidence & Model Prediction
                  </span>
                  <p className="text-slate-300 leading-relaxed mt-0.5">
                    {rec.empiricalEvidence}
                  </p>
                </div>
              </div>

              {/* Suggested Reallocation Action */}
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Recommended Mitigation Action: </span>
                  {rec.recommendedAction}
                </div>
              </div>

              {/* Projected Operational Impacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                {rec.impacts.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-surface-200/40 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{imp.metricName}</span>
                    <span className="text-emerald-400 font-bold">{imp.change}</span>{' '}
                    <span className="text-slate-400">({imp.before} → {imp.projectedAfter})</span>
                  </div>
                ))}
              </div>

              {/* Review Audit Info (If Reviewed) */}
              {rec.reviewedBy && (
                <div className="p-3 rounded-xl bg-surface-200/30 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Signed off by <strong className="text-white">{rec.reviewedBy}</strong> ({rec.reviewerRole})</span>
                  </div>
                  <span>{rec.reviewedAt}</span>
                </div>
              )}

              {/* Action Buttons for Pending items */}
              {rec.status === 'PENDING' && (
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{rec.expiresAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/app/scenarios')}
                    >
                      Run in What-If Sandbox
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenReview(rec)}
                    >
                      Review & Sign Off →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Human Review Modal */}
      {selectedRecommendation && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={closeReviewModal}
          title={
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Human-in-the-Loop Clinical Supervisor Sign-Off</span>
            </div>
          }
          subtitle={`Recommendation #${selectedRecommendation.id} • ${selectedRecommendation.departmentName}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={closeReviewModal}>
                Cancel
              </Button>
              <Button
                variant={reviewMode === 'reject' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirmReview}
              >
                {reviewMode === 'approve'
                  ? 'Confirm & Sign Off'
                  : reviewMode === 'modify'
                  ? 'Sign Off Modified Plan'
                  : 'Confirm Rejection'}
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs font-mono">
            {/* Recommendation Title */}
            <div className="p-4 rounded-xl bg-surface-200/50 border border-slate-800 space-y-1">
              <span className="font-bold text-white text-sm block">
                {selectedRecommendation.title}
              </span>
              <p className="text-slate-300 font-normal leading-relaxed">
                {selectedRecommendation.recommendedAction}
              </p>
            </div>

            {/* Decision Mode Selector (Approve / Modify / Reject) */}
            <div className="space-y-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">
                Select Operational Sign-Off Action:
              </span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setReviewMode('approve')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    reviewMode === 'approve'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold shadow-sm'
                      : 'bg-surface-200/40 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Check className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  <span>Approve As-Is</span>
                </button>

                <button
                  onClick={() => setReviewMode('modify')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    reviewMode === 'modify'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                      : 'bg-surface-200/40 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                  <span>Modify Parameters</span>
                </button>

                <button
                  onClick={() => setReviewMode('reject')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    reviewMode === 'reject'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold shadow-sm'
                      : 'bg-surface-200/40 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4 mx-auto mb-1 text-rose-400" />
                  <span>Reject Recommendation</span>
                </button>
              </div>
            </div>

            {/* If Modify: Custom Quantity Slider/Input */}
            {reviewMode === 'modify' && (
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-300 font-bold">Adjust Approved Resource Quantity:</span>
                  <span className="text-white font-bold">{customQty} {selectedRecommendation.suggestedResourceDelta.unit}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={customQty}
                  onChange={(e) => setCustomQty(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            )}

            {/* Review Notes / Justification */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold block">
                Supervisor Sign-Off Justification & Notes:
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={
                  reviewMode === 'reject'
                    ? 'Mandatory: Document why this recommendation was declined (e.g. ward census holding stable)...'
                    : 'Optional: Document clinical supervisor instructions for charge nurse...'
                }
                rows={3}
                className="w-full bg-surface-200/60 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
