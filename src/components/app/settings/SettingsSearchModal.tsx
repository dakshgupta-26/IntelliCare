import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowRight
} from 'lucide-react';
import { SettingsSectionId } from './types';

interface SearchItem {
  id: SettingsSectionId;
  title: string;
  category: string;
  description: string;
  keywords: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'overview',
    title: 'Console Overview',
    category: 'General',
    description: 'High-level operational health and governance metrics.',
    keywords: ['summary', 'health', 'telemetry', 'status', 'overview']
  },
  {
    id: 'profile',
    title: 'Clinical Profile & Identity',
    category: 'Account',
    description: 'Manage clinician name, title, role, and avatar.',
    keywords: ['avatar', 'name', 'email', 'title', 'role', 'profile', 'identity']
  },
  {
    id: 'appearance',
    title: 'Appearance & UI Density',
    category: 'Account',
    description: 'Customize theme, comfortable/compact density, and motion.',
    keywords: ['theme', 'dark', 'light', 'density', 'motion', 'compact', 'accessibility']
  },
  {
    id: 'organization',
    title: 'Hospital Facility & Campus',
    category: 'Organization',
    description: 'Hospital name, organization ID, campus locations, operational hours.',
    keywords: ['hospital', 'campus', 'facility', 'hours', 'timezone', 'location']
  },
  {
    id: 'departments',
    title: 'Departments & Clinical Units',
    category: 'Organization',
    description: 'Emergency, ICU, Ward, Operating Theatre capacities and staffing.',
    keywords: ['emergency', 'icu', 'ward', 'theatre', 'department', 'beds', 'capacity']
  },
  {
    id: 'operations',
    title: 'Operational Ratios & Shifts',
    category: 'Organization',
    description: 'Statutory nurse-to-patient ratios and shift schedules.',
    keywords: ['ratios', 'nurse', 'statutory', 'shift', 'handover', 'mandate']
  },
  {
    id: 'users',
    title: 'Users & RBAC Permissions',
    category: 'Access',
    description: 'Manage clinical staff accounts, roles, and invitation status.',
    keywords: ['users', 'roles', 'permissions', 'invite', 'rbac', 'members']
  },
  {
    id: 'security',
    title: 'Security & Active Sessions',
    category: 'Security',
    description: 'Device sessions, revoke tokens, password updates, and audit ledger.',
    keywords: ['sessions', 'devices', 'password', 'revoke', 'mfa', 'security', 'audit']
  },
  {
    id: 'thresholds',
    title: 'Alerting Thresholds',
    category: 'Intelligence',
    description: 'Configure ICU bed occupancy, emergency surge, and equipment triggers.',
    keywords: ['alert', 'threshold', 'icu', 'surge', 'warning', 'critical', 'scale']
  },
  {
    id: 'forecasting',
    title: 'Neural Forecasting (LSTM & XGBoost)',
    category: 'Intelligence',
    description: 'Forecast horizons (12H-72H), neural models, and confidence bands.',
    keywords: ['forecast', 'lstm', 'xgboost', 'horizon', 'prediction', 'ml']
  },
  {
    id: 'optimization',
    title: 'Resource Optimization (OR-Tools MILP)',
    category: 'Intelligence',
    description: 'Objective weights for unmet demand, wait times, and overtime.',
    keywords: ['optimization', 'milp', 'weights', 'or-tools', 'solver', 'constraints']
  },
  {
    id: 'ai',
    title: 'AI Decision Support & Copilot',
    category: 'Intelligence',
    description: 'Clinical decision-support boundaries, RAG SOP documents, and human sign-off.',
    keywords: ['ai', 'copilot', 'rag', 'sop', 'governance', 'decision', 'safety']
  },
  {
    id: 'notifications',
    title: 'Notifications & Escalation Policies',
    category: 'System',
    description: 'Email, in-app dispatch, and 3-tier hospital escalation matrix.',
    keywords: ['notifications', 'escalation', 'email', 'push', 'tier', 'channels']
  },
  {
    id: 'integrations',
    title: 'EHR, FHIR & API Keys',
    category: 'System',
    description: 'FHIR R4 endpoints, EHR integration, webhooks, and developer keys.',
    keywords: ['ehr', 'fhir', 'api', 'keys', 'webhooks', 'epic', 'cerner']
  },
  {
    id: 'data-privacy',
    title: 'Data Retention & Privacy',
    category: 'System',
    description: 'Telemetry retention schedules, PHI de-identification, and data export.',
    keywords: ['retention', 'privacy', 'phi', 'export', 'data', 'telemetry']
  },
  {
    id: 'audit',
    title: 'Cryptographic Audit Log',
    category: 'System',
    description: 'Immutable system events, solver executions, and administrative actions.',
    keywords: ['audit', 'logs', 'ledger', 'compliance', 'immutable', 'events']
  },
  {
    id: 'danger-zone',
    title: 'Danger Zone',
    category: 'System',
    description: 'Destructive session invalidation, tensor purges, and factory reset.',
    keywords: ['danger', 'delete', 'reset', 'purge', 'revoke all']
  }
];

interface SettingsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: SettingsSectionId) => void;
}

export const SettingsSearchModal: React.FC<SettingsSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSection
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Toggle or open handled by parent
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = SEARCH_ITEMS.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleSelect = (id: SettingsSectionId) => {
    onSelectSection(id);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-xl bg-[#091424] border border-cyan-500/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.12)] overflow-hidden z-10"
          >
            {/* Search Input */}
            <div className="p-3.5 border-b border-white/[0.08] flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search settings, thresholds, API keys, departments..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-500">
                  No matching settings found for "{query}"
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-cyan-500/10 border border-cyan-500/30 text-white'
                          : 'hover:bg-white/[0.04] text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-white">{item.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                          {item.description}
                        </p>
                      </div>

                      <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                      }`} />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer tips */}
            <div className="p-2.5 border-t border-white/[0.06] bg-black/30 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Use <kbd className="px-1 py-0.5 rounded bg-white/[0.08] text-slate-400">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-white/[0.08] text-slate-400">↓</kbd> to navigate</span>
              <span><kbd className="px-1 py-0.5 rounded bg-white/[0.08] text-slate-400">↵</kbd> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
