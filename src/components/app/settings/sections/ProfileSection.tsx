import React, { useState } from 'react';
import { Camera, ShieldCheck, Mail, Building, Phone, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Input } from '../../../ui/Input';
import { Button } from '../../../ui/Button';

interface ProfileSectionProps {
  onMarkDirty: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ onMarkDirty }) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  const [name, setName] = useState(currentUser?.name || 'Dr. Sarah Chen, MD');
  const [title, setTitle] = useState(currentUser?.title || 'Chief Medical Operations Officer');
  const [phone, setPhone] = useState('+1 (555) 249-8821');
  const [department, setDepartment] = useState(currentUser?.departmentName || 'Executive Operations');
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatarUrl ||
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256'
  );

  const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<any>>, val: any) => {
    setter(val);
    onMarkDirty();
  };

  const handleAvatarReset = () => {
    setAvatarUrl('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256');
    onMarkDirty();
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo & Identity Header Card */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] shadow-sm">
        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4">
          Clinician Avatar & Identity Verification
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
            />
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-cyan-500 text-black shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-lg font-display font-bold text-white">{name}</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED PRACTITIONER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Role: <span className="text-cyan-400 font-semibold">{currentUser?.role || 'HOSPITAL_ADMIN'}</span> • ID: <span className="text-slate-300 font-bold">{currentUser?.id || 'usr-admin-01'}</span>
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Accepted formats: PNG, JPG, WebP. Max upload size 5MB.
            </p>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  alert('To upload a new credential photograph, select a file from your workstation storage.');
                  onMarkDirty();
                }}
              >
                Change Photo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAvatarReset}
              >
                Reset Default
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Identity Form */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-display font-bold text-white">Clinical Identity Information</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized metadata used in electronic order approvals, clinical handovers, and system dispatch.
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            Status: {currentUser?.status || 'ACTIVE'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Clinician Display Name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setName, e.target.value)}
            helperText="Appears on clinical approvals, sign-offs, and solver recommendations."
          />

          <Input
            label="Professional Clinical Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setTitle, e.target.value)}
            helperText="e.g. Chief Medical Operations Officer, Trauma Director, Charge Nurse."
          />

          <Input
            label="Hospital Email Address (Fixed SSO)"
            value={currentUser?.email || 'sarah.chen@intellicare.health'}
            disabled
            icon={<Mail className="w-4 h-4 text-slate-500" />}
            helperText="Managed by hospital Enterprise Identity Provider (SSO)."
          />

          <Input
            label="Emergency On-Call Contact Phone"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setPhone, e.target.value)}
            icon={<Phone className="w-4 h-4 text-slate-500" />}
            helperText="Used for high-priority Level 3 overflow alerts and pager dispatches."
          />

          <Input
            label="Clinical Department Assignment"
            value={department}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(setDepartment, e.target.value)}
            icon={<Building className="w-4 h-4 text-slate-500" />}
            helperText="Primary clinical unit or operational command node."
          />

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
              Assigned Security Role
            </label>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white">
                {currentUser?.role || 'HOSPITAL_ADMIN'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-white/[0.06] px-2 py-0.5 rounded">
                Admin Managed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Role permissions are governed under hospital RBAC policies.
            </p>
          </div>
        </div>
      </div>

      {/* Account Security Summary Note */}
      <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 flex items-start gap-3 text-xs font-mono">
        <UserCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-slate-300">
          <span className="font-bold text-white block mb-0.5">Clinical Authorization Audit Active</span>
          All modifications to clinical titles or contact vectors are timestamped and signed into the cryptographic audit trail for compliance verification.
        </div>
      </div>
    </div>
  );
};
