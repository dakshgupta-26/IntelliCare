import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, Menu, X, Layers, Cpu, TrendingUp, Sliders } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useRouterStore, AppRoute } from '../../store/useRouterStore';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = useRouterStore((state) => state.currentPath);
  const navigate = useRouterStore((state) => state.navigate);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; path: AppRoute; icon: React.ReactNode }[] = [
    { name: 'Platform', path: '/platform', icon: <Layers className="w-4 h-4" /> },
    { name: 'Intelligence', path: '/intelligence', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Optimization', path: '/optimization', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Scenarios', path: '/scenarios', icon: <Sliders className="w-4 h-4" /> },
  ];

  const handleNav = (path: AppRoute) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-950/85 backdrop-blur-xl border-b border-slate-800/80 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 rounded-lg cursor-pointer"
          aria-label="IntelliCare Home"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-blue to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(22,199,243,0.35)] group-hover:shadow-[0_0_22px_rgba(22,199,243,0.6)] transition-all duration-300">
            <div className="w-full h-full bg-navy-950 rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-brand-cyan group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                IntelliCare
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI OPS
              </span>
            </div>
          </div>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-100/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800 shadow-inner">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.name}
                onClick={() => handleNav(link.path)}
                className={`text-xs font-mono font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-surface-200/50'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Right Nav Links & CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNav('/architecture')}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPath === '/architecture'
                ? 'text-cyan-300 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Architecture
          </button>

          <button
            onClick={() => handleNav('/technology')}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPath === '/technology'
                ? 'text-cyan-300 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Technology
          </button>

          <Button
            size="sm"
            variant="primary"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => handleNav('/platform')}
          >
            Explore Platform
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-surface-100 border border-slate-800 rounded-lg focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-navy-950/98 backdrop-blur-2xl border-b border-slate-800 px-6 py-6 transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <Badge variant="emerald" dot size="sm">
                INFERENCE ENGINE READY
              </Badge>
              <span className="text-xs font-mono text-slate-400">LATENCY 84MS</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNav('/')}
                className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-2.5 transition-colors flex items-center justify-between text-left cursor-pointer border-b border-slate-800/40"
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.path)}
                  className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-2.5 transition-colors flex items-center justify-between text-left cursor-pointer border-b border-slate-800/40"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}

              <button
                onClick={() => handleNav('/architecture')}
                className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-2.5 transition-colors flex items-center justify-between text-left cursor-pointer border-b border-slate-800/40"
              >
                <span>Architecture</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>

              <button
                onClick={() => handleNav('/technology')}
                className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-2.5 transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <span>Technology</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => handleNav('/platform')}
              >
                Explore Platform
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
