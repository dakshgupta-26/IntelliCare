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
  LogOut,
  Menu,
  Radio
} from 'lucide-react';
import { useHospitalStore } from '../../store/useHospitalStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCommandPaletteStore } from '../../store/useCommandPaletteStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useRouterStore } from '../../store/useRouterStore';
import { useLayoutStore } from '../../store/useLayoutStore';
import { NotificationPopover } from '../ui/NotificationPopover';
import { IntelliCareLogo } from '../brand/IntelliCareLogo';
import { OperationalRiskModal } from './dashboard/OperationalRiskModal';

export const AppHeader: React.FC = () => {
  const selectedHospital = useHospitalStore((state) => state.selectedHospital);
  const setSelectedHospital = useHospitalStore((state) => state.setSelectedHospital);
  const availableHospitals = useHospitalStore((state) => state.availableHospitals);
  const selectedDepartmentId = useHospitalStore((state) => state.selectedDepartmentId);
  const setSelectedDepartmentId = useHospitalStore((state) => state.setSelectedDepartmentId);
  const departments = useHospitalStore((state) => state.departments);

  const theme = useThemeStore((state) => state.resolvedTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const togglePalette = useCommandPaletteStore((state) => state.toggleOpen);
  const toggleNotifications = useNotificationStore((state) => state.toggleDrawer);
  const unreadNotificationsCount = useNotificationStore((state) => state.getUnreadCount());
  const toggleMobileSidebar = useLayoutStore((state) => state.toggleMobileSidebar);

  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const setRoleSwitchingOpen = useAuthStore((state) => state.setRoleSwitchingOpen);
  const navigate = useRouterStore((state) => state.navigate);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);

  const selectedHospitalObj =
    availableHospitals.find((h) => h.id === selectedHospital) || availableHospitals[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#07111f]/95 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-5 lg:px-6 py-2.5 transition-all">
        <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-[1700px] mx-auto">
          {/* ========================================================= */}
          {/* LEFT: Logo Branding & Decision OS Badge                   */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Sidebar Hamburger Button */}
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white bg-surface-200/60 dark:bg-[#0c182c] border border-slate-700/80 dark:border-slate-800 rounded-xl focus:outline-none cursor-pointer shrink-0"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5 text-cyan-400" />
            </button>

            {/* IntelliCare Master Branding */}
            <div
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center cursor-pointer group"
              title="IntelliCare Decision OS Command Dashboard"
            >
              <IntelliCareLogo
                variant="compact"
                size="sm"
                showBadge
                badgeText="DECISION OS"
                animated
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTER: Hospital Context & Department Scoping             */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 min-w-0">
            {/* Hospital & Campus Selector */}
            <div className="relative flex items-center bg-[#091526] hover:bg-[#0c1c34] border border-slate-800 hover:border-slate-700 rounded-xl px-2.5 py-1.5 transition-colors group">
              <Building2 className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
              <div className="flex flex-col text-left leading-tight pr-5">
                <span className="text-[11px] font-mono font-bold text-white truncate max-w-[170px] lg:max-w-[210px]">
                  {selectedHospitalObj.name.replace('Medical Center', '').trim()}
                </span>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                  <span>Main Campus</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Operational
                  </span>
                </div>
              </div>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Select Active Hospital Facility"
              >
                {availableHospitals.map((h) => (
                  <option key={h.id} value={h.id} className="bg-[#07111f] text-white">
                    {h.name} ({h.city})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none group-hover:text-cyan-400 transition-colors" />
            </div>

            {/* Department Context Selector */}
            <div className="relative flex items-center bg-[#091526] hover:bg-[#0c1c34] border border-slate-800 hover:border-slate-700 rounded-xl px-2.5 py-1.5 transition-colors group">
              <Radio className="w-3.5 h-3.5 text-indigo-400 mr-2 shrink-0" />
              <div className="flex flex-col text-left leading-tight pr-5">
                <span className="text-[11px] font-mono font-bold text-slate-200 truncate max-w-[130px] lg:max-w-[170px]">
                  {selectedDepartmentId === 'all'
                    ? 'All Departments'
                    : departments.find((d) => d.id === selectedDepartmentId)?.name || 'Department'}
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  {selectedDepartmentId === 'all' ? 'Hospital-Wide (7 Units)' : 'Filtered View'}
                </span>
              </div>
              <select
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Scope to specific Clinical Department"
              >
                <option value="all" className="bg-[#07111f] text-white">
                  All Departments (7 Units)
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#07111f] text-white">
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: Operational Status, Search, Run Scenario, Actions  */}
          {/* ========================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* High Acuity Load Indicator (Clickable Operational Risk Trigger) */}
            <button
              onClick={() => setIsRiskModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-mono transition-all cursor-pointer group"
              title="Click to view full Operational Risk Overview & Escalation Directives"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[11px]">HIGH ACUITY</span>
                <span className="text-[10px] text-amber-400/80 hidden xl:inline">
                  • Pressure Elevated
                </span>
              </div>
            </button>

            {/* Global Search Button (⌘K / Ctrl+K) */}
            <button
              onClick={togglePalette}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#091526] hover:bg-[#0c1c34] border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs font-mono text-slate-300 transition-all cursor-pointer group"
              title="Global Search (⌘K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
              <span className="hidden xl:inline text-slate-400 text-[11px]">
                Search ops, SOPs...
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Primary Action: Run Scenario */}
            <button
              onClick={() => navigate('/app/scenarios')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:shadow-[0_0_22px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
              title="Run What-If Sandbox Simulation"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-200" />
              <span className="hidden sm:inline">Run Scenario →</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-surface-200/80 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-surface-200/80 transition-colors relative cursor-pointer"
                title="Operational Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                )}
              </button>
              <NotificationPopover />
            </div>

            {/* User Profile Avatar Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 p-0.5 rounded-xl hover:bg-surface-200/80 transition-colors cursor-pointer"
                  aria-label="User menu"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40 shrink-0"
                  />
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-[#0c182c] border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-slide-up">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                      <div className="mt-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          {currentUser.role.replace('_', ' ')}
                        </span>
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
                        <span>Switch RBAC Persona</span>
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

      {/* Global Interactive Operational Risk Modal */}
      <OperationalRiskModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        onRunScenario={() => navigate('/app/scenarios')}
      />
    </>
  );
};
