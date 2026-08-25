import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
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
  User,
  Shield,
  Sun,
  ArrowRight,
  Sparkles,
  Command,
  Activity
} from 'lucide-react';
import { useCommandPaletteStore } from '../../store/useCommandPaletteStore';
import { useRouterStore } from '../../store/useRouterStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useResourceStore } from '../../store/useResourceStore';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
}

export const CommandPalette: React.FC = () => {
  const isOpen = useCommandPaletteStore((state) => state.isOpen);
  const setIsOpen = useCommandPaletteStore((state) => state.setIsOpen);
  const navigate = useRouterStore((state) => state.navigate);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setRoleSwitchingOpen = useAuthStore((state) => state.setRoleSwitchingOpen);
  const resources = useResourceStore((state) => state.resources);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global key listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Static action commands
  const staticCommands = useMemo<CommandItem[]>(
    () => [
      { id: 'nav-dash', category: 'Navigation', title: 'Go to Command Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />, path: '/app/dashboard' },
      { id: 'nav-res', category: 'Navigation', title: 'Manage Hospital Resources & Beds', icon: <Boxes className="w-4 h-4 text-blue-400" />, path: '/app/resources' },
      { id: 'nav-ml', category: 'Intelligence', title: 'ML Model Studio (Random Forest, XGBoost, LSTM)', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, path: '/app/models' },
      { id: 'nav-clin', category: 'Intelligence', title: 'Clinical AI & Patient Deterioration Risk', icon: <Activity className="w-4 h-4 text-emerald-400" />, path: '/app/clinical-ai' },
      { id: 'nav-fore', category: 'Navigation', title: 'Demand Intelligence Forecasting', icon: <TrendingUp className="w-4 h-4 text-teal-400" />, path: '/app/forecasting' },
      { id: 'nav-opt', category: 'Navigation', title: 'MILP Resource Optimization Solver', icon: <Cpu className="w-4 h-4 text-indigo-400" />, path: '/app/optimization' },
      { id: 'nav-scen', category: 'Navigation', title: 'What-If Crisis Scenario Simulator', icon: <Sliders className="w-4 h-4 text-purple-400" />, path: '/app/scenarios' },
      { id: 'nav-know', category: 'Navigation', title: 'Operational SOPs & Knowledge Base', icon: <BookOpen className="w-4 h-4 text-emerald-400" />, path: '/app/knowledge' },
      { id: 'nav-rec', category: 'Navigation', title: 'Review AI Recommendations', icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />, path: '/app/recommendations' },
      { id: 'nav-ana', category: 'Navigation', title: 'Operational Analytics & Trends', icon: <BarChart3 className="w-4 h-4 text-sky-400" />, path: '/app/analytics' },
      { id: 'nav-alt', category: 'Navigation', title: 'Alerts & Critical Triage Center', icon: <AlertTriangle className="w-4 h-4 text-rose-400" />, path: '/app/alerts' },
      { id: 'nav-act', category: 'Navigation', title: 'Cryptographic Activity Audit Ledger', icon: <History className="w-4 h-4 text-slate-400" />, path: '/app/activity' },
      { id: 'nav-set', category: 'Navigation', title: 'Hospital & System Settings', icon: <Settings className="w-4 h-4 text-slate-300" />, path: '/app/settings' },
      { id: 'nav-prof', category: 'Navigation', title: 'User Profile & Security', icon: <User className="w-4 h-4 text-slate-300" />, path: '/app/profile' },
      { id: 'nav-admin', category: 'Administration', title: 'Organization RBAC & User Admin', icon: <Shield className="w-4 h-4 text-rose-400" />, path: '/admin' },
      { id: 'act-theme', category: 'Quick Actions', title: 'Toggle Light / Dark Theme Mode', icon: <Sun className="w-4 h-4 text-amber-400" />, action: () => toggleTheme() },
      { id: 'act-roles', category: 'Quick Actions', title: 'Switch User Role / Demo Persona', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, action: () => setRoleSwitchingOpen(true) }
    ],
    [toggleTheme, setRoleSwitchingOpen]
  );

  // Dynamic resource search commands
  const resourceCommands = useMemo<CommandItem[]>(() => {
    return resources.slice(0, 6).map((res) => ({
      id: `res-${res.id}`,
      category: 'Resources',
      title: `${res.name} (${res.code})`,
      subtitle: `${res.departmentName} • ${res.utilizationRate}% utilized`,
      icon: <Boxes className="w-4 h-4 text-cyan-400" />,
      path: `/app/resources/${res.id}`
    }));
  }, [resources]);

  const allItems = useMemo<CommandItem[]>(() => {
    const list = [...staticCommands, ...resourceCommands];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [staticCommands, resourceCommands, query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false);
    setQuery('');
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity duration-200"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Palette Box */}
      <div
        className="relative w-full max-w-2xl bg-surface-100 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col transition-all duration-200 animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Search input field */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-surface-200/40">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search resources, or jump to a page..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-1 ml-2">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-surface-300 rounded border border-slate-700">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Command className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No matching commands or resources found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for "ICU", "Forecasting", "Nurses", or "Theme"</p>
            </div>
          ) : (
            allItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-surface-200/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-surface-200 text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-medium truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.2 rounded bg-surface-300/40">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-surface-200/40 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>IntelliCare Decision OS</span>
        </div>
      </div>
    </div>
  );
};
