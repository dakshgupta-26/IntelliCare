import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, Menu, X } from 'lucide-react';
import { useRouterStore, AppRoute } from '../../store/useRouterStore';

interface NavItem {
  name: string;
  path: AppRoute;
  badge?: string;
}

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = useRouterStore((state) => state.currentPath);
  const navigate = useRouterStore((state) => state.navigate);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks: NavItem[] = [
    { name: 'Platform', path: '/platform' },
    { name: 'Intelligence', path: '/intelligence' },
    { name: 'Optimization', path: '/optimization' },
    { name: 'Scenarios', path: '/scenarios' },
    { name: 'Architecture', path: '/architecture' },
    { name: 'Technology', path: '/technology' },
  ];

  const handleNav = (path: AppRoute) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-[#050814]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
          : 'py-4 sm:py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Identity */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl cursor-pointer text-left"
          aria-label="IntelliCare AI Ops Home"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/30 via-slate-800 to-slate-900 p-[1px] border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 shadow-[0_0_12px_rgba(25,199,243,0.15)]">
            <div className="w-full h-full bg-[#070B17] rounded-[7px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              IntelliCare
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              AI OPS
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation Pill */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-1 bg-[#0B1220]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        >
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.name}
                onClick={() => handleNav(link.path)}
                className={`relative px-3.5 py-1 text-xs font-mono font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-cyan-400/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[1.5px] bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(25,199,243,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Nav Links & Enterprise CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Secondary links for medium desktop (lg to xl) */}
          <div className="flex xl:hidden items-center gap-1 mr-1">
            <button
              onClick={() => handleNav('/platform')}
              className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                currentPath === '/platform' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Platform
            </button>
            <button
              onClick={() => handleNav('/intelligence')}
              className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                currentPath === '/intelligence' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Intelligence
            </button>
            <button
              onClick={() => handleNav('/architecture')}
              className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                currentPath === '/architecture' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Architecture
            </button>
          </div>

          <button
            onClick={() => handleNav('/login')}
            className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-white/[0.08] hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            Sign In
          </button>

          {/* Magnetic-styled Launch Workspace CTA */}
          <button
            onClick={() => handleNav('/app/dashboard')}
            className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-sans font-bold text-xs shadow-[0_2px_12px_rgba(25,199,243,0.25)] hover:shadow-[0_4px_20px_rgba(25,199,243,0.35)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => handleNav('/app/dashboard')}
            className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
          >
            <span>Launch</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-[#0B1220] border border-white/[0.08] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#070B17]/98 backdrop-blur-2xl border-b border-white/[0.1] px-5 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200 z-50">
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {/* Status Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-bold">TELEMETRY INGEST ACTIVE</span>
              </div>
              <span>LATENCY 184MS</span>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleNav('/')}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/[0.04] hover:text-cyan-300 text-left cursor-pointer transition-colors"
              >
                <span>Overview</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.path)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                    currentPath === link.path
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
              <button
                onClick={() => handleNav('/app/dashboard')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNav('/login')}
                className="w-full py-2.5 rounded-lg border border-white/[0.1] bg-[#0B1020] text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                Sign In to Enterprise Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

