import React, { useState } from 'react';
import { Building2, MapPin, Clock, Globe } from 'lucide-react';
import { Input } from '../../../ui/Input';

interface OrganizationSectionProps {
  onMarkDirty: () => void;
}

export const OrganizationSection: React.FC<OrganizationSectionProps> = ({ onMarkDirty }) => {
  const [orgName, setOrgName] = useState('IntelliCare Metropolitan Medical Center');
  const [campusAddress, setCampusAddress] = useState('1200 Healthcare Way, Metropolis Medical District');
  const [facilityType, setFacilityType] = useState('Level 1 Trauma & Tertiary Academic Medical Center');
  const [timezone, setTimezone] = useState('America/New_York (EST/EDT, UTC-5)');
  const [operationalRegion, setOperationalRegion] = useState('State Health Authority — Metro Sector IV');
  const [shiftHours, setShiftHours] = useState('07:00 / 15:00 / 23:00 (Tri-Shift 8-Hour Rotation)');

  const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<string>>, val: string) => {
    setter(val);
    onMarkDirty();
  };

  return (
    <div className="space-y-6">
      {/* Hospital Organization Details */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>Hospital Facility Metadata</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Primary entity identifier, trauma designation, and statutory administrative parameters.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Facility Registered</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Hospital Facility Name"
            value={orgName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setOrgName, e.target.value)}
            helperText="Official healthcare entity registered with regional health authority."
          />

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              Master Organization ID
            </label>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-400">org-metro-01</span>
              <span className="text-[10px] font-mono text-slate-500 bg-white/[0.06] px-2 py-0.5 rounded">
                Immutable
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Unique cryptographic ID used in FHIR and HL7 data exchange.
            </p>
          </div>

          <Input
            label="Facility Classification & Trauma Level"
            value={facilityType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setFacilityType, e.target.value)}
            helperText="Defines statutory capacity thresholds and surgical priority protocols."
          />

          <Input
            label="Operational Healthcare Region"
            value={operationalRegion}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setOperationalRegion, e.target.value)}
            helperText="Regional dispatch zone for mutual aid and overflow triage."
          />

          <Input
            label="Primary Medical Campus Address"
            value={campusAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setCampusAddress, e.target.value)}
            icon={<MapPin className="w-4 h-4 text-slate-500" />}
            helperText="Physical receiving address for emergency EMS and patient routing."
          />

          <Input
            label="Operating Timezone"
            value={timezone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setTimezone, e.target.value)}
            icon={<Globe className="w-4 h-4 text-slate-500" />}
            helperText="All forecast horizons and shift intervals align with this timezone."
          />
        </div>
      </div>

      {/* Shift Cadence & Operational Schedules */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Shift Handover & Operational Windows</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Defines the boundary intervals where arrival forecasts recalculate staffing gaps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Standard Shift Handover Cadence"
            value={shiftHours}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setShiftHours, e.target.value)}
            helperText="Standard shift intervals for nursing rosters and clinical handovers."
          />

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              ICU Mandated Nurse Ratio
            </label>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-400">
                1:2 Standard / 1:1 Ventilated
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-white/[0.06] px-2 py-0.5 rounded">
                Statutory Lock
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Enforced as a hard bound in MILP solver simplex formulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
