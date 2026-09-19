import React, { useState } from 'react';
import { Palette, Moon, Monitor, Eye } from 'lucide-react';
import { useThemeStore } from '../../../../store/useThemeStore';

interface AppearanceSectionProps {
  onMarkDirty: () => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({ onMarkDirty }) => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    onMarkDirty();
  };

  const handleDensityChange = (newDensity: 'comfortable' | 'compact') => {
    setDensity(newDensity);
    onMarkDirty();
  };

  const handleMotionChange = (val: boolean) => {
    setReducedMotion(val);
    onMarkDirty();
  };


  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>Color Palette & Clinical Lighting Theme</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Engineered for low-eye-strain 24/7 command centers and high-ambient-light emergency wards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Dark Mode */}
          <div
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-cyan-500/[0.08] border-cyan-500/40 shadow-[0_0_16px_rgba(34,211,238,0.1)]'
                : 'bg-black/40 border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-5 h-5 text-cyan-400" />
              {theme === 'dark' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  Active
                </span>
              )}
            </div>
            <span className="font-display font-bold text-sm text-white block">Obsidian Dark</span>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Deep navy & slate. Zero eye strain for night shift coordinators.
            </p>
          </div>

          {/* System */}
          <div
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              theme === 'system'
                ? 'bg-cyan-500/[0.08] border-cyan-500/40 shadow-[0_0_16px_rgba(34,211,238,0.1)]'
                : 'bg-black/40 border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Monitor className="w-5 h-5 text-slate-400" />
              {theme === 'system' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  Active
                </span>
              )}
            </div>
            <span className="font-display font-bold text-sm text-white block">System Synchronized</span>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Aligns with OS circadian schedule automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Interface Density & Accessibility */}
      <div className="p-6 rounded-3xl bg-[#070D1A] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <span>Display Density & Accessibility Standards</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimize data density for large wallboard displays or focused workstation monitors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Density */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-white block">Display Density</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {density === 'comfortable' ? 'Comfortable (Standard Padding)' : 'Compact (Maximum Data Density)'}
              </span>
            </div>
            <div className="flex rounded-lg border border-white/[0.08] bg-black/50 p-0.5">
              <button
                type="button"
                onClick={() => handleDensityChange('comfortable')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer ${
                  density === 'comfortable' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => handleDensityChange('compact')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer ${
                  density === 'compact' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-white block">Reduced Motion Mode</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Disables spring physics and transitions.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleMotionChange(!reducedMotion)}
              className={`px-3 py-1 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                reducedMotion
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold'
                  : 'bg-white/[0.05] border-white/[0.08] text-slate-500'
              }`}
            >
              {reducedMotion ? 'Enabled' : 'Off'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
