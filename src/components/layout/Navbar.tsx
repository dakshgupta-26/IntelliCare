import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';
import { IntelliCareLogo } from '../brand';
import { scrollToTarget } from '../../hooks/useLenis';

interface NavLinkItem {
  label: string;
  id: string;
  path: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'Platform', id: 'platform', path: '/platform' },
  { label: 'Intelligence', id: 'intelligence', path: '/intelligence' },
  { label: 'Optimization', id: 'optimization', path: '/optimization' },
  { label: 'Scenarios', id: 'scenarios', path: '/scenarios' },
  { label: 'Architecture', id: 'architecture', path: '/architecture' },
  { label: 'Technology', id: 'technology', path: '/technology' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const currentPath = useRouterStore((state) => state.currentPath);
  const navigate = useRouterStore((state) => state.navigate);

  // Scroll state detection for floating navbar state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // IntersectionObserver for active section highlight on the marketing landing page
  useEffect(() => {
    if (currentPath !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = NAV_LINKS.map((l) => l.id);
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPath]);

  const handleLinkClick = (link: NavLinkItem) => {
    setMobileMenuOpen(false);

    if (currentPath === '/') {
      const targetId = `#${link.id}`;
      scrollToTarget(targetId);
      window.history.replaceState(null, '', targetId);
    } else {
      navigate(link.path);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
        scrolled
          ? 'bg-[#030612]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-2.5 sm:py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="w-full flex items-center justify-between pl-[clamp(28px,4vw,80px)] pr-[clamp(20px,3vw,56px)]">
        {/* Official Master IntelliCare Logo */}
        <IntelliCareLogo
          variant="full"
          size="md"
          showBadge
          badgeText="AI OPS"
          animated
          onClick={() => {
            if (currentPath === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/');
            }
          }}
        />

        {/* Center Desktop Navigation Pill */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-1 bg-[#070E1E]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        >
          {NAV_LINKS.map((link) => {
            const isActive = currentPath === '/' 
              ? activeSection === link.id 
              : currentPath === link.path;

            return (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link)}
                className={`relative px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-cyan-400/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[1.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
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
              onClick={() => handleLinkClick(NAV_LINKS[0])}
              className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeSection === 'platform' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Platform
            </button>
            <button
              onClick={() => handleLinkClick(NAV_LINKS[1])}
              className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeSection === 'intelligence' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Intelligence
            </button>
            <button
              onClick={() => handleLinkClick(NAV_LINKS[4])}
              className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeSection === 'architecture' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Architecture
            </button>
          </div>

          {/* Secondary Sign In Navigation Action */}
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-white/[0.08] hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            Sign In
          </button>

          {/* Primary Launch Workspace CTA with elevation and arrow move */}
          <button
            onClick={() => navigate('/app/dashboard')}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-sans font-bold text-xs shadow-[0_0_18px_rgba(34,211,238,0.3)] hover:shadow-[0_0_26px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
          >
            <span>Launch</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-[#0B1220] border border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[58px] sm:top-[64px] bg-[#040816]/98 backdrop-blur-2xl border-b border-white/[0.1] px-5 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200 z-50">
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {/* Status Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-bold">TELEMETRY INGEST ACTIVE</span>
              </div>
              <span>LATENCY 12MS</span>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentPath === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    navigate('/');
                  }
                }}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/[0.04] hover:text-cyan-300 text-left cursor-pointer transition-colors"
              >
                <span>Overview</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                    activeSection === link.id
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/dashboard');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 rounded-xl border border-white/[0.1] bg-[#0B1020] text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
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
