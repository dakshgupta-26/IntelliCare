import React, { useState } from 'react';
import { Layers, Edit3, Bed } from 'lucide-react';
import { useHospitalStore } from '../../../../store/useHospitalStore';
import { DepartmentSummary } from '../../../../types/resources';
import { Modal } from '../../../ui/Modal';
import { Input } from '../../../ui/Input';
import { Button } from '../../../ui/Button';

interface DepartmentsSectionProps {
  onMarkDirty: () => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ onMarkDirty }) => {
  const departments = useHospitalStore((state) => state.departments);
  const updateDepartment = useHospitalStore((state) => state.updateDepartment);

  const [editingDept, setEditingDept] = useState<DepartmentSummary | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editStaff, setEditStaff] = useState<number>(0);

  const handleOpenEdit = (dept: DepartmentSummary) => {
    setEditingDept(dept);
    setEditCapacity(dept.totalBeds);
    setEditStaff(dept.activeStaff);
  };

  const handleSaveEdit = () => {
    if (!editingDept) return;
    updateDepartment(editingDept.id, {
      totalBeds: Number(editCapacity),
      activeStaff: Number(editStaff)
    });
    setEditingDept(null);
    onMarkDirty();
  };

  return (
    <div className="space-y-6">
      {/* Overview stats bar */}
      <div className="p-4 rounded-2xl bg-[#070D1A] border border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Active Clinical Units</span>
          <span className="text-white font-bold text-sm">{departments.length} Units</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Total Licensed Beds</span>
          <span className="text-cyan-400 font-bold text-sm">
            {departments.reduce((acc, d) => acc + d.totalBeds, 0)} Beds
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Total Roster Staff</span>
          <span className="text-indigo-400 font-bold text-sm">
            {departments.reduce((acc, d) => acc + d.activeStaff, 0)} Staff
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Acuity Surveillance</span>
          <span className="text-emerald-400 font-bold text-sm">Continuous</span>
        </div>
      </div>

      {/* Department Cards / Table */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Configured Hospital Departments & Units</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live capacity limits, staffing quotas, and clinical director oversight for each unit.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {departments.map((dept) => {
            const occupancyPct = Math.round((dept.occupiedBeds / dept.totalBeds) * 100);
            const isHighOccupancy = occupancyPct >= 90;

            return (
              <div
                key={dept.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#050814] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                    <Bed className="w-5 h-5 text-cyan-400" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-display font-bold text-sm text-white">
                        {dept.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.08] text-slate-300">
                        {dept.code}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                          dept.status === 'CRITICAL'
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                            : dept.status === 'WARNING'
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {dept.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono">
                      Lead: <span className="text-slate-200">{dept.leadPhysician}</span>
                    </p>
                  </div>
                </div>

                {/* Right side operational metrics */}
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap md:flex-nowrap">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Bed Occupancy</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-mono font-bold ${isHighOccupancy ? 'text-rose-400' : 'text-slate-200'}`}>
                        {dept.occupiedBeds} / {dept.totalBeds}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        ({occupancyPct}%)
                      </span>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Active Staff</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {dept.activeStaff} Clinicians
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors cursor-pointer shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Department Modal */}
      {editingDept && (
        <Modal
          isOpen={true}
          onClose={() => setEditingDept(null)}
          title={`Configure Department: ${editingDept.name}`}
          subtitle={`Department Code: ${editingDept.code} • Lead: ${editingDept.leadPhysician}`}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setEditingDept(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                Apply Parameters
              </Button>
            </>
          }
        >
          <div className="space-y-4 py-2">
            <Input
              label="Licensed Bed Capacity"
              type="number"
              value={editCapacity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditCapacity(parseInt(e.target.value) || 0)}
              helperText="Maximum operational bed complement licensed for this clinical area."
            />

            <Input
              label="Active Staffing Allocation Target"
              type="number"
              value={editStaff}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditStaff(parseInt(e.target.value) || 0)}
              helperText="Baseline registered nurse and physician headcount target for full shift coverage."
            />

            <div className="p-3.5 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/20 text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-bold block mb-1">MILP Constraint Note</span>
              Modifying departmental capacity dynamically updates the constraint matrix formulated by the OR-Tools optimization solver.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
