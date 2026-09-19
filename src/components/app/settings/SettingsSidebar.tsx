import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Building2,
  Layers,
  Users,
  Shield,
  Sliders,
  Bell,
  Activity,
  TrendingUp,
  Cpu,
  Bot,
  Workflow,
  Database,
  FileText,
  Palette,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { SettingsSectionId, SettingsCategory } from './types';

interface SettingsSidebarProps {
  activeSection: SettingsSectionId;
  onSelectSection: (section: SettingsSectionId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeSessionsCount?: number;
  criticalAlertsCount?: number;
  isMobile?: boolean;
}

const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: 'general',
    label: 'GENERAL',
    items: [
      {
        id: 'overview',
        label: 'Console Overview',
        description: 'Operational governance summary and status',
        iconName: 'LayoutDashboard'
      }
    ]
  },
  {
    id: 'account',
    label: 'ACCOUNT & IDENTITY',
    items: [
      {
        id: 'profile',
        label: 'Clinical Profile',
        description: 'Identity, role assignment, and credentials',
        iconName: 'User'
      },
      {
        id: 'appearance',
        label: 'Appearance & UI',
        description: 'Theme, layout density, and motion',
        iconName: 'Palette'
      }
    ]
  },
  {
    id: 'organization',
    label: 'ORGANIZATION & OPS',
    items: [
      {
        id: 'organization',
        label: 'Hospital Facility',
        description: 'Campus locations, shifts, and timezone',
        iconName: 'Building2'
      },
      {
        id: 'departments',
        label: 'Departments & Units',
        description: 'Capacity limits, staffing, and clinical targets',
        iconName: 'Layers'
      },
      {
        id: 'operations',
        label: 'Operational Ratios',
        description: 'Statutory nurse ratios and bed configs',
        iconName: 'Activity'
      }
    ]
  },
  {
    id: 'access',
    label: 'ACCESS & SECURITY',
    items: [
      {
        id: 'users',
        label: 'Users & Roles',
        description: 'RBAC policies, team access, and invitations',
        iconName: 'Users'
      },
      {
        id: 'security',
        label: 'Security & Sessions',
        description: 'Active devices, password, and security ledger',
        iconName: 'Shield',
        badge: 'Live',
        badgeVariant: 'cyan'
      }
    ]
  },
  {
    id: 'intelligence',
    label: 'INTELLIGENCE & AI',
    items: [
      {
        id: 'thresholds',
        label: 'Alerting Thresholds',
        description: 'Multi-stage ICU and surge trigger scales',
        iconName: 'Sliders'
      },
      {
        id: 'forecasting',
        label: 'Forecasting Models',
        description: 'LSTM & XGBoost horizons and parameters',
        iconName: 'TrendingUp'
      },
      {
        id: 'optimization',
        label: 'Resource Optimization',
        description: 'MILP solver objectives and constraints',
        iconName: 'Cpu'
      },
      {
        id: 'ai',
        label: 'AI & Decision Support',
        description: 'Copilot governance, RAG SOPs, and safety',
        iconName: 'Bot'
      }
    ]
  },
  {
    id: 'system',
    label: 'SYSTEM & GOVERNANCE',
    items: [
      {
        id: 'notifications',
        label: 'Notifications & Escalation',
        description: 'Dispatch channels and 3-tier escalation',
        iconName: 'Bell'
      },
      {
        id: 'integrations',
        label: 'Integrations & API',
        description: 'EHR, FHIR connectors, and API keys',
        iconName: 'Workflow'
      },
      {
        id: 'data-privacy',
        label: 'Data & Privacy',
        description: 'Retention periods, telemetry, and export',
        iconName: 'Database'
      },
      {
        id: 'audit',
        label: 'Audit Log Ledger',
        description: 'Cryptographic compliance records',
        iconName: 'FileText'
      },
      {
        id: 'danger-zone',
        label: 'Danger Zone',
        description: 'Destructive controls and credential purge',
        iconName: 'AlertTriangle',
        badgeVariant: 'rose'
      }
    ]
  }
];

const renderIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'LayoutDashboard': return <LayoutDashboard className={className} />;
    case 'User': return <User className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Sliders': return <Sliders className={className} />;
    case 'Bell': return <Bell className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Bot': return <Bot className={className} />;
    case 'Workflow': return <Workflow className={className} />;
    case 'Database': return <Database className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Palette': return <Palette className={className} />;
    case 'AlertTriangle': return <AlertTriangle className={className} />;
    default: return <Activity className={className} />;
  }
};

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  activeSessionsCount,
  isMobile = false
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  // Filter sections if search text entered
  const filteredCategories = SETTINGS_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filterQuery.toLowerCase())
    )
  })).filter((cat) => cat.items.length > 0);

  return (
    <motion.aside
      animate={{ width: isCollapsed && !isMobile ? 70 : 270 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`relative shrink-0 flex flex-col h-full bg-[#040814]/90 border-r border-white/[0.08] backdrop-blur-xl ${
        isMobile ? 'w-full border-r-0' : ''
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-3.5 sm:p-4 border-b border-white/[0.06] flex items-center justify-between gap-2 min-h-[58px]">
        <AnimatePresence initial={false}>
          {(!isCollapsed || isMobile) ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-white tracking-wider uppercase block">
                  Console Nav
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Governance & Ops
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Sliders className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          )}
        </AnimatePresence>

        {!isMobile && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand settings navigation" : "Collapse settings navigation"}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Search Input when expanded */}
      {(!isCollapsed || isMobile) && (
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter settings..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-black/40 border border-white/[0.08] rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
            />
          </div>
        </div>
      )}

      {/* Nav Categories */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="space-y-1">
            {(!isCollapsed || isMobile) && (
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                {category.label}
              </div>
            )}

            <div className="space-y-0.5">
              {category.items.map((item) => {
                const isActive = activeSection === item.id;
                const isDanger = item.id === 'danger-zone';

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer relative group ${
                      isActive
                        ? isDanger
                          ? 'bg-rose-500/10 text-rose-300 font-medium border border-rose-500/30'
                          : 'bg-cyan-500/[0.08] text-white font-medium border border-cyan-500/25 shadow-[0_0_12px_rgba(34,211,238,0.06)]'
                        : isDanger
                        ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.05]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Active bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingsNavIndicator"
                        className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full ${
                          isDanger ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                        }`}
                      />
                    )}

                    <div className="shrink-0 flex items-center justify-center">
                      {renderIcon(
                        item.iconName,
                        `w-4 h-4 transition-colors ${
                          isActive
                            ? isDanger
                              ? 'text-rose-400'
                              : 'text-cyan-400'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`
                      )}
                    </div>

                    {(!isCollapsed || isMobile) && (
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs truncate block">{item.label}</span>

                          {item.id === 'security' && activeSessionsCount && activeSessionsCount > 1 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {activeSessionsCount}
                            </span>
                          )}

                          {item.badge && item.id !== 'security' && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${
                                item.badgeVariant === 'rose'
                                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer System Health Badge */}
      {(!isCollapsed || isMobile) && (
        <div className="p-3 border-t border-white/[0.06] bg-black/20">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Telemetry Active</span>
            </div>
            <span className="text-slate-500">TLS 1.3</span>
          </div>
        </div>
      )}
    </motion.aside>
  );
};
