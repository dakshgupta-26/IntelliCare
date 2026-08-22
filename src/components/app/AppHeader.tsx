import React, { useState } from 'react';
import {
  Building2,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  ChevronDown,
  User,
  Shield,
  LogOut
} from 'lucide-react';
import { useHospitalStore } from '../../store/useHospitalStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCommandPaletteStore } from '../../store/useCommandPaletteStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useRouterStore } from '../../store/useRouterStore';
import { NotificationPopover } from '../ui/NotificationPopover';
import { Badge } from '../ui/Badge';

export const AppHeader: React.FC = () => {
  const selectedHospital = useHospitalStore((state) => state.selectedHospital);
  const setSelectedHospital = useHospitalStore((state) => state.setSelectedHospital);
  const availableHospitals = useHospitalStore((state) => state.availableHospitals);
  const selectedDepartmentId = useHospitalStore((state) => state.selectedDepartmentId);
  const setSelectedDepartmentId = useHospitalStore((state) => state.setSelectedDepartmentId);
  const departments = useHospitalStore((state) => state.departments);
  const operationalStatus = useHospitalStore((state) => state.operationalStatus);

  const theme = useThemeStore((state) => state.resolvedTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const togglePalette = useCommandPaletteStore((state) => state.toggleOpen);
  const toggleNotifications = useNotificationStore((state) => state.toggleDrawer);
  const unreadNotificationsCount = useNotificationStore((state) => state.getUnreadCount());

  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const setRoleSwitchingOpen = useAuthStore((state) => state.setRoleSwitchingOpen);
  const navigate = useRouterStore((state) => state.navigate);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getStatusBadge = () => {
    switch (operationalStatus) {
      case 'CODE_ORANGE':
        return <Badge variant="rose" dot size="sm">CODE ORANGE SURGE</Badge>;
      case 'HIGH_ACUITY':
        return <Badge variant="amber" dot size="sm">HIGH ACUITY LOAD</Badge>;
      case 'SURGE_WARNING':
        return <Badge variant="teal" dot size="sm">SURGE ELEVATION</Badge>;
      case 'OPTIMAL':
      default:
        return <Badge variant="emerald" dot size="sm">OPTIMAL STATE</Badge>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 dark:bg-[#07111f]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hospital & Department Scoping Controls */}
        <div className="flex items-center gap-3">
          {/* Hospital Switcher */}
          <div className="relative flex items-center">
            <Building2 className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none" />
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="bg-surface-200/80 dark:bg-[#0c182c] border border-slate-700/80 dark:border-slate-800 rounded-xl py-1.5 pl-9 pr-8 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 appearance-none cursor-pointer"
            >
              {availableHospitals.map((h) => (
                <option key={h.id} value={h.id} className="bg-navy-950 text-white">
                  {h.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="hidden md:flex items-center">
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="bg-surface-200/50 dark:bg-[#0c182c] border border-slate-700/80 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-navy-950 text-white">All Departments (5)</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id} className="bg-navy-950 text-white">
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Center: Command Palette Quick Search Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={togglePalette}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-surface-200/50 dark:bg-[#091424] border border-slate-700/80 dark:border-slate-800 hover:border-cyan-500/50 rounded-xl text-xs font-mono text-slate-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span>Search resources, forecasts, SOPs...</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-surface-300 dark:bg-slate-800 rounded border border-slate-700 text-slate-300">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Actions, Realtime Pulse, Notifications, Theme, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Telemetry Heartbeat */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>STREAMING LIVE</span>
          </div>

          {/* Quick Action: Run Scenario */}
          <button
            onClick={() => navigate('/app/scenarios')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono transition-all cursor-pointer"
            title="Launch What-If Sandbox Simulation"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Run Scenario</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-200/80 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-200/80 transition-colors relative cursor-pointer"
              title="Operational Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </button>
            <NotificationPopover />
          </div>

          {/* User Profile / Menu */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-200/80 transition-colors cursor-pointer"
                aria-label="User menu"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface-100 dark:bg-[#0c182c] border border-slate-700/80 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-slide-up">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1.5">
                      <Badge variant="cyan" size="sm">
                        {currentUser.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/app/profile');
                      }}
                      className="w-full px-4 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-surface-200/60 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>User Profile & Security</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setRoleSwitchingOpen(true);
                      }}
                      className="w-full px-4 py-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:bg-surface-200/60 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Switch RBAC Demo Role</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/app/settings');
                      }}
                      className="w-full px-4 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-surface-200/60 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>System Settings</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full px-4 py-2 text-xs font-mono text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
