import React, { useState } from 'react';
import { ShieldCheck, Clock, Cpu } from 'lucide-react';
import { Input } from '../../../ui/Input';

interface OperationsSectionProps {
  onMarkDirty: () => void;
}

export const OperationsSection: React.FC<OperationsSectionProps> = ({ onMarkDirty }) => {
  const [maxConsecutiveHours, setMaxConsecutiveHours] = useState('12.5');
  const [overtimeThreshold, setOvertimeThreshold] = useState('40');
  const [handoverOverlapMinutes, setHandoverOverlapMinutes] = useState('30');
  const [ventilatorBufferReserve, setVentilatorBufferReserve] = useState('3');

  const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<string>>, val: string) => {
    setter(val);
    onMarkDirty();
  };

  return (
    <div className="space-y-6">
      {/* Statutory Clinical Nurse-to-Patient Mandates */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Statutory Nurse-to-Patient Ratio Mandates</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Statutory clinical minimums enforced as hard bounds in automated solver formulations.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Regulated Mandatory
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Intensive Care Unit (ICU)</span>
              <span className="text-slate-400 text-[11px]">Standard High-Acuity Patient</span>
            </div>
            <span className="text-cyan-400 font-bold">1 : 2 Patients</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">ICU Invasive Mechanical Ventilation</span>
              <span className="text-slate-400 text-[11px]">Intubated / Active Sedation</span>
            </div>
            <span className="text-rose-400 font-bold">1 : 1 Patient (Strict)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Emergency Department Trauma Resus</span>
              <span className="text-slate-400 text-[11px]">Level 1 & 2 Triage Presentations</span>
            </div>
            <span className="text-amber-400 font-bold">1 : 1 Patient</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Inpatient Medical / Surgical Wards</span>
              <span className="text-slate-400 text-[11px]">Stable Inpatient Acuity</span>
            </div>
            <span className="text-slate-200 font-bold">1 : 4 Day / 1 : 6 Night</span>
          </div>
        </div>
      </div>

      {/* Shift Fatigue & Overtime Limits */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-5">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Shift Fatigue & Clinical Roster Bounds</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Parameters configured into the optimization engine to prevent clinician burnout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Max Consecutive Hours (Hrs)"
            type="number"
            value={maxConsecutiveHours}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setMaxConsecutiveHours, e.target.value)}
            helperText="Maximum single-shift duration before mandatory rest."
          />

          <Input
            label="Weekly Overtime Ceiling (Hrs)"
            type="number"
            value={overtimeThreshold}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setOvertimeThreshold, e.target.value)}
            helperText="Hours after which overtime penalty multiplier applies."
          />

          <Input
            label="Handover Buffer Overlap (Mins)"
            type="number"
            value={handoverOverlapMinutes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setHandoverOverlapMinutes, e.target.value)}
            helperText="Required shift-overlap window for clinical bedside report."
          />
        </div>
      </div>

      {/* Biomedical Equipment Allocation Rules */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Biomedical Equipment Buffer & Reserve Policy</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Minimum standby reserves maintained in Central Supply Depot for mass casualty readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Standby ICU Ventilator Buffer (Units)"
            type="number"
            value={ventilatorBufferReserve}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setVentilatorBufferReserve, e.target.value)}
            helperText="Calibrated Hamilton-G5 units reserved for emergency trauma intake."
          />

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              Infusion Pump Standby Quota
            </label>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-400">12 Channels</span>
              <span className="text-[10px] font-mono text-slate-500 bg-white/[0.06] px-2 py-0.5 rounded">
                Standard Reserve
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Auto-dispatched when inpatient floor occupancy exceeds 88%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
