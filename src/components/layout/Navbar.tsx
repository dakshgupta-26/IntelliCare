import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform', href: '#platform' },
    { name: 'Intelligence', href: '#intelligence' },
    { name: 'Optimization', href: '#optimization' },
    { name: 'Scenarios', href: '#scenarios' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Technology', href: '#technology' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-950/80 backdrop-blur-xl border-b border-slate-800/80 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 rounded-lg"
          aria-label="IntelliCare Home"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan via-brand-blue to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_22px_rgba(6,182,212,0.6)] transition-all duration-300">
            <div className="w-full h-full bg-navy-950 rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-brand-cyan group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                IntelliCare
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI OPS
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-100/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800/80 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs font-medium text-slate-300 hover:text-cyan-300 px-3.5 py-1.5 rounded-full transition-colors hover:bg-surface-200/50"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA & Status */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Live Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-100/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOLVER READY</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">84ms</span>
          </div>

          <button
            onClick={() => {
              const el = document.querySelector('#platform');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Sign In
          </button>

          <Button
            size="sm"
            variant="primary"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => {
              const el = document.querySelector('#optimization-demo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Platform
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-surface-100 border border-slate-800 rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-navy-950/95 backdrop-blur-2xl border-b border-slate-800 px-6 py-6 transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <Badge variant="emerald" dot size="sm">
                INFERENCE ENGINE ONLINE
              </Badge>
              <span className="text-xs font-mono text-slate-400">LATENCY 84MS</span>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-2 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.querySelector('#optimization-demo');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Launch Live Simulator
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
