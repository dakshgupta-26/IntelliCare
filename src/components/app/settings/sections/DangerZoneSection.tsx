import React, { useState } from 'react';
import { AlertTriangle, Trash2, RotateCcw, ShieldAlert, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useOptimizationStore } from '../../../../store/useOptimizationStore';
import { Modal } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';

interface DangerZoneSectionProps {
  onMarkDirty: () => void;
}

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({ onMarkDirty }) => {
  const revokeAllOtherSessions = useAuthStore((state) => state.revokeAllOtherSessions);
  const setObjectiveWeight = useOptimizationStore((state) => state.setObjectiveWeight);

  const [confirmAction, setConfirmAction] = useState<'REVOKE_SESSIONS' | 'PURGE_CACHE' | 'RESET_WEIGHTS' | null>(null);

  const handleExecuteAction = async () => {
    if (confirmAction === 'REVOKE_SESSIONS') {
      try {
        await revokeAllOtherSessions();
        alert('All remote device sessions have been revoked.');
      } catch (err: any) {
        alert(err.message || 'Failed to revoke remote sessions.');
      }
    } else if (confirmAction === 'PURGE_CACHE') {
      alert('All temporary scenario simulation tensors and local cache have been purged.');
    } else if (confirmAction === 'RESET_WEIGHTS') {
      setObjectiveWeight('MINIMIZE_UNMET_DEMAND', 45);
      setObjectiveWeight('MINIMIZE_WAIT_TIME', 25);
      setObjectiveWeight('BALANCE_UTILIZATION', 15);
      setObjectiveWeight('MINIMIZE_STAFF_OVERTIME', 15);
      setObjectiveWeight('MAXIMIZE_THROUGHPUT', 0);
      onMarkDirty();
      alert('Solver objective weights restored to statutory baseline defaults.');
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/[0.08] border border-rose-500/30 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono space-y-1">
          <span className="font-bold text-rose-300 block">Critical Administrative Boundaries</span>
          <p className="text-slate-300 font-sans leading-relaxed">
            Actions in this area are destructive, immediate, and generate critical audit alerts. Ensure you hold appropriate organizational clearance before executing these commands.
          </p>
        </div>
      </div>

      {/* Danger Zone Actions Card */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-rose-500/20 space-y-4">
        <div className="pb-3 border-b border-rose-500/15">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Destructive Operational Actions</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Emergency session termination, tensor cache invalidation, and solver parameter resets.
          </p>
        </div>

        <div className="space-y-3">
          {/* Action 1: Revoke All Sessions */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-rose-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-xs text-white block">
                Revoke All Active Remote Sessions
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Immediately terminates OAuth access tokens on all remote clinical workstations, tablets, and mobile devices.
              </p>
            </div>
            <button
              onClick={() => setConfirmAction('REVOKE_SESSIONS')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Revoke Remote Devices</span>
            </button>
          </div>

          {/* Action 2: Purge Simulation Cache */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-rose-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-xs text-white block">
                Purge Temporary Scenario Simulation Tensors
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Flushes uncommitted what-if simulation results, demand multiplier tensors, and transient memory tables.
              </p>
            </div>
            <button
              onClick={() => setConfirmAction('PURGE_CACHE')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Cache Tensors</span>
            </button>
          </div>

          {/* Action 3: Reset Solver Defaults */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-xs text-white block">
                Reset MILP Solver Weights to Statutory Default
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Restores objective weighting matrix to Unmet Demand (45%), Wait Time (25%), and Overtime (15%).
              </p>
            </div>
            <button
              onClick={() => setConfirmAction('RESET_WEIGHTS')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Solver Weights</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <Modal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          title="Confirm Destructive Operational Action"
          subtitle="This operation will take immediate effect and cannot be undone."
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleExecuteAction}>
                Execute Action
              </Button>
            </>
          }
        >
          <div className="space-y-3 py-2 text-xs font-mono text-slate-300">
            <p>
              Are you certain you wish to execute this action? An immutable compliance record will be signed into the cryptographic audit log.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
