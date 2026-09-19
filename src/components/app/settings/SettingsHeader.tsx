import React from 'react';
import { Search, CheckCircle2, AlertCircle, Menu } from 'lucide-react';
import { SettingsSectionId } from './types';

interface SettingsHeaderProps {
  activeSection: SettingsSectionId;
  hasUnsavedChanges: boolean;
  onOpenSearch: () => void;
  onOpenMobileNav?: () => void;
}

const SECTION_METADATA: Record<SettingsSectionId, { title: string; subtitle: string; group: string }> = {
  overview: {
    title: 'System & Governance Overview',
    subtitle: 'High-level operational health, service telemetry, and governance summary.',
    group: 'General'
  },
  profile: {
    title: 'User Profile & Clinical Identity',
    subtitle: 'Manage clinician identity, credentials, professional title, and role assignment.',
    group: 'Account'
  },
  appearance: {
    title: 'Appearance, Density & Accessibility',
    subtitle: 'Configure color scheme, interface density, reduced motion, and high-contrast support.',
    group: 'Account'
  },
  organization: {
    title: 'Hospital Facility & Campus Details',
    subtitle: 'Hospital entity configuration, regional location, operational hours, and timezone.',
    group: 'Organization'
  },
  departments: {
    title: 'Department & Clinical Unit Management',
    subtitle: 'Configure departmental bed quotas, clinical unit codes, and staffing ratio thresholds.',
    group: 'Organization'
  },
  operations: {
    title: 'Hospital Operations & Staffing Ratios',
    subtitle: 'Statutory nurse-to-patient mandates, shift schedule boundaries, and bed type policies.',
    group: 'Organization'
  },
  users: {
    title: 'User Management & Role Permissions',
    subtitle: 'Team member authorization, access policies, invitation status, and RBAC matrix.',
    group: 'Access'
  },
  security: {
    title: 'Security & Active Device Sessions',
    subtitle: 'Active device authorization, password change, and cryptographic security events ledger.',
    group: 'Security'
  },
  thresholds: {
    title: 'Operational Alert Trigger Thresholds',
    subtitle: 'Interactive multi-stage trigger boundaries for ICU occupancy, surge deltas, and staffing.',
    group: 'Intelligence'
  },
  forecasting: {
    title: 'Neural Forecasting & Demand Models',
    subtitle: 'LSTM neural network and XGBoost parameters, prediction horizons, and data freshness.',
    group: 'Intelligence'
  },
  optimization: {
    title: 'MILP Solver Objectives & Constraints',
    subtitle: 'Google OR-Tools integer relaxation objective weights, wait-time penalties, and quotas.',
    group: 'Intelligence'
  },
  ai: {
    title: 'AI Decision Support & Copilot Governance',
    subtitle: 'Clinical decision-support parameters, RAG knowledge sources, and human approval gates.',
    group: 'Intelligence'
  },
  notifications: {
    title: 'Notifications & Escalation Policies',
    subtitle: 'Multi-channel dispatch (In-App, Email, Push) and visual 3-tier hospital escalation chains.',
    group: 'System'
  },
  integrations: {
    title: 'EHR, FHIR & Developer API Integrations',
    subtitle: 'Connect hospital EHR/HIS platforms, HL7 FHIR R4 endpoints, webhooks, and API keys.',
    group: 'System'
  },
  'data-privacy': {
    title: 'Data Retention & Privacy Controls',
    subtitle: 'Telemetry retention schedules, PHI de-identification policies, and data export tools.',
    group: 'System'
  },
  audit: {
    title: 'Cryptographic Audit Trail Ledger',
    subtitle: 'Immutable record of operational changes, role modifications, and solver overrides.',
    group: 'System'
  },
  'danger-zone': {
    title: 'Danger Zone & Destructive Actions',
    subtitle: 'Session invalidation, scenario tensor purges, and critical system resets.',
    group: 'System'
  }
};

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  activeSection,
  hasUnsavedChanges,
  onOpenSearch,
  onOpenMobileNav
}) => {
  const meta = SECTION_METADATA[activeSection] || SECTION_METADATA.overview;

  return (
    <header className="px-4 sm:px-6 py-4 border-b border-white/[0.08] bg-[#070D1A]/70 backdrop-blur-md sticky top-0 z-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {/* Breadcrumb & Eyebrow */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/25">
              Configuration & Governance
            </span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs font-mono text-slate-400">{meta.group}</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs font-mono text-slate-200 font-semibold">{meta.title}</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenMobileNav && (
              <button
                type="button"
                onClick={onOpenMobileNav}
                aria-label="Open settings navigation"
                className="lg:hidden p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                {meta.title}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                {meta.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-slate-400 hover:text-slate-200 text-xs font-mono transition-all cursor-pointer shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Quick Jump</span>
            <kbd className="text-[10px] bg-white/[0.08] px-1.5 py-0.5 rounded text-slate-400 border border-white/[0.08]">
              ⌘K
            </kbd>
          </button>

          {/* Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-colors ${
              hasUnsavedChanges
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {hasUnsavedChanges ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Unsaved Changes</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
