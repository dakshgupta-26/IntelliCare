import React, { useState } from 'react';
import {
  Activity,
  LayoutDashboard,
  Boxes,
  TrendingUp,
  Cpu,
  Sliders,
  BookOpen,
  CheckCircle2,
  BarChart3,
  AlertTriangle,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useRecommendationStore } from '../../store/useRecommendationStore';
import { useAlertStore } from '../../store/useAlertStore';
import { useLayoutStore } from '../../store/useLayoutStore';

interface AppSidebarProps {
  isMobile?: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isMobile = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentPath = useRouterStore((state) => state.currentPath);
  const navigate = useRouterStore((state) => state.navigate);
  const currentUser = useAuthStore((state) => state.currentUser);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const setRoleSwitchingOpen = useAuthStore((state) => state.setRoleSwitchingOpen);
  const pendingRecsCount = useRecommendationStore((state) => state.getPendingCount());
  const criticalAlertsCount = useAlertStore((state) => state.getCriticalCount());
  const setMobileSidebarOpen = useLayoutStore((state) => state.setMobileSidebarOpen);

  const handleNavigate = (path: string) => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
    navigate(path);
  };

  const navItems = [
    {
      id: 'dash',
      label: 'Dashboard',
      path: '/app/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'resources',
      label: 'Resources',
      path: '/app/resources',
      icon: <Boxes className="w-4 h-4" />
    },
    {
      id: 'models',
      label: 'ML Model Studio',
      path: '/app/models',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'clinical-ai',
      label: 'Clinical AI & Risk',
      path: '/app/clinical-ai',
      icon: <Activity className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'forecasting',
      label: 'Forecasting',
      path: '/app/forecasting',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'optimization',
      label: 'Optimization',
      path: '/app/optimization',
      icon: <Cpu className="w-4 h-4" />
    },
    {
      id: 'scenarios',
      label: 'Scenarios',
      path: '/app/scenarios',
      icon: <Sliders className="w-4 h-4" />
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      path: '/app/knowledge',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      path: '/app/recommendations',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: pendingRecsCount > 0 ? pendingRecsCount : undefined,
      badgeColor: 'amber'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/app/analytics',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'alerts',
      label: 'Alert Center',
      path: '/app/alerts',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
      badgeColor: 'rose'
    },
    {
      id: 'activity',
      label: 'Activity Audit',
      path: '/app/activity',
      icon: <History className="w-4 h-4" />
    }
  ];

  const sidebarWidthClass = isMobile ? 'w-72 max-w-[85vw]' : isCollapsed ? 'w-20' : 'w-64';

  return (
    <aside
      className={`relative h-full bg-navy-950/98 dark:bg-[#060f1c] border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${sidebarWidthClass}`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => handleNavigate('/app/dashboard')}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer overflow-hidden text-left"
          title="IntelliCare AI Decision Support"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(22,199,243,0.3)] group-hover:shadow-[0_0_20px_rgba(22,199,243,0.5)] transition-all shrink-0">
            <div className="w-full h-full bg-navy-950 rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-brand-cyan" />
            </div>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col text-left">
              <span className="font-display font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                IntelliCare
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                DECISION OS
              </span>
            </div>
          )}
        </button>

        {/* Mobile Close Button */}
        {isMobile ? (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200 transition-colors cursor-pointer"
            aria-label="Close mobile sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          /* Desktop Collapse toggle button */
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200 transition-colors hidden lg:flex items-center justify-center cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {(!isCollapsed || isMobile) && (
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Operational Modules
          </div>
        )}

        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/app/dashboard' && currentPath.startsWith(item.path));
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer group ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200/50'
              } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
              title={isCollapsed && !isMobile ? item.label : undefined}
            >
              <div
                className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-brand-cyan' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {item.icon}
              </div>

              {(!isCollapsed || isMobile) && (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        item.badgeColor === 'rose'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* Administration link (if authorized) */}
        {hasPermission('MANAGE_ORGANIZATION') && (
          <button
            onClick={() => handleNavigate('/admin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer group ${
              currentPath === '/admin'
                ? 'bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30'
                : 'text-slate-400 hover:text-rose-300 hover:bg-surface-200/50'
            } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            title={isCollapsed && !isMobile ? 'Admin Console' : undefined}
          >
            <Shield className="w-4 h-4 text-rose-400 shrink-0" />
            {(!isCollapsed || isMobile) && <span className="truncate">Admin Console</span>}
          </button>
        )}
      </div>

      {/* Bottom Utility & Persona Switcher */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        {/* Settings */}
        <button
          onClick={() => handleNavigate('/app/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-surface-200/50 transition-colors cursor-pointer ${
            currentPath === '/app/settings' ? 'bg-surface-200 text-white' : ''
          } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
          title={isCollapsed && !isMobile ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {(!isCollapsed || isMobile) && <span className="truncate">Settings</span>}
        </button>

        {/* Back to Public Landing */}
        <button
          onClick={() => handleNavigate('/')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-surface-200/50 transition-colors cursor-pointer ${
            isCollapsed && !isMobile ? 'justify-center' : ''
          }`}
          title={isCollapsed && !isMobile ? 'Public Landing' : undefined}
        >
          <Layers className="w-4 h-4 shrink-0" />
          {(!isCollapsed || isMobile) && <span className="truncate">Platform Site</span>}
        </button>

        {/* User Persona Card */}
        {currentUser && (
          <div className="pt-2 border-t border-slate-800/60 mt-2">
            <div
              onClick={() => {
                if (isMobile) setMobileSidebarOpen(false);
                setRoleSwitchingOpen(true);
              }}
              className={`flex items-center gap-2.5 p-2 rounded-xl bg-surface-200/40 hover:bg-surface-200/80 border border-slate-800 transition-colors cursor-pointer group ${
                isCollapsed && !isMobile ? 'justify-center' : ''
              }`}
              title="Click to switch RBAC demo persona"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-cyan-500/30 shrink-0"
              />
              {(!isCollapsed || isMobile) && (
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-[11px] font-bold text-white truncate flex items-center gap-1">
                    <span>{currentUser.name.split(',')[0]}</span>
                    <Sparkles className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400 truncate">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
