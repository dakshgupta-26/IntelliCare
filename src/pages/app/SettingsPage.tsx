import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsSectionId } from '../../components/app/settings/types';
import { SettingsSidebar } from '../../components/app/settings/SettingsSidebar';
import { SettingsHeader } from '../../components/app/settings/SettingsHeader';
import { SaveBar } from '../../components/app/settings/SaveBar';
import { SettingsSearchModal } from '../../components/app/settings/SettingsSearchModal';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Drawer } from '../../components/ui/Drawer';

// Section Components
import { OverviewSection } from '../../components/app/settings/sections/OverviewSection';
import { ProfileSection } from '../../components/app/settings/sections/ProfileSection';
import { OrganizationSection } from '../../components/app/settings/sections/OrganizationSection';
import { DepartmentsSection } from '../../components/app/settings/sections/DepartmentsSection';
import { OperationsSection } from '../../components/app/settings/sections/OperationsSection';
import { UsersRolesSection } from '../../components/app/settings/sections/UsersRolesSection';
import { SecuritySection } from '../../components/app/settings/sections/SecuritySection';
import { ThresholdsSection } from '../../components/app/settings/sections/ThresholdsSection';
import { NotificationsSection } from '../../components/app/settings/sections/NotificationsSection';
import { ForecastingSection } from '../../components/app/settings/sections/ForecastingSection';
import { OptimizationSection } from '../../components/app/settings/sections/OptimizationSection';
import { AISafetySection } from '../../components/app/settings/sections/AISafetySection';
import { IntegrationsSection } from '../../components/app/settings/sections/IntegrationsSection';
import { DataPrivacySection } from '../../components/app/settings/sections/DataPrivacySection';
import { AuditLogSection } from '../../components/app/settings/sections/AuditLogSection';
import { AppearanceSection } from '../../components/app/settings/sections/AppearanceSection';
import { DangerZoneSection } from '../../components/app/settings/sections/DangerZoneSection';

export const SettingsPage: React.FC = () => {
  const getSearchParam = useRouterStore((state) => state.getSearchParam);
  const activeSessions = useAuthStore((state) => state.activeSessions);

  // Initialize section from URL param if valid
  const initialSectionParam = (getSearchParam('section') as SettingsSectionId) || 'overview';
  const [activeSection, setActiveSection] = useState<SettingsSectionId>(initialSectionParam);

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Save system states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listen for global Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update section & sync URL state
  const handleSelectSection = (section: SettingsSectionId) => {
    setActiveSection(section);
    setIsMobileNavOpen(false);

    // Update URL query param smoothly
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('section', section);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleMarkDirty = () => {
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate real asynchronous save & store commit
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setHasUnsavedChanges(false);

    // Trigger toast confirmation
    setToastMessage('Configuration changes successfully saved and applied to cluster.');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDiscard = () => {
    setHasUnsavedChanges(false);
    setToastMessage('Unsaved modifications discarded.');
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Render current active section component
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection onNavigate={handleSelectSection} />;
      case 'profile':
        return <ProfileSection onMarkDirty={handleMarkDirty} />;
      case 'organization':
        return <OrganizationSection onMarkDirty={handleMarkDirty} />;
      case 'departments':
        return <DepartmentsSection onMarkDirty={handleMarkDirty} />;
      case 'operations':
        return <OperationsSection onMarkDirty={handleMarkDirty} />;
      case 'users':
        return <UsersRolesSection onMarkDirty={handleMarkDirty} />;
      case 'security':
        return <SecuritySection onMarkDirty={handleMarkDirty} />;
      case 'thresholds':
        return <ThresholdsSection onMarkDirty={handleMarkDirty} />;
      case 'notifications':
        return <NotificationsSection onMarkDirty={handleMarkDirty} />;
      case 'forecasting':
        return <ForecastingSection onMarkDirty={handleMarkDirty} />;
      case 'optimization':
        return <OptimizationSection onMarkDirty={handleMarkDirty} />;
      case 'ai':
        return <AISafetySection onMarkDirty={handleMarkDirty} />;
      case 'integrations':
        return <IntegrationsSection onMarkDirty={handleMarkDirty} />;
      case 'data-privacy':
        return <DataPrivacySection onMarkDirty={handleMarkDirty} />;
      case 'audit':
        return <AuditLogSection />;
      case 'appearance':
        return <AppearanceSection onMarkDirty={handleMarkDirty} />;
      case 'danger-zone':
        return <DangerZoneSection onMarkDirty={handleMarkDirty} />;
      default:
        return <OverviewSection onNavigate={handleSelectSection} />;
    }
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-80px)] rounded-3xl bg-[#040814] border border-white/[0.08] overflow-hidden shadow-2xl relative">
      {/* Desktop Left Settings Navigation Sidebar (lg and up) */}
      <div className="hidden lg:block shrink-0">
        <SettingsSidebar
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeSessionsCount={activeSessions.length}
        />
      </div>

      {/* Mobile Drawer Settings Navigation (< lg) */}
      {isMobileNavOpen && (
        <Drawer
          isOpen={true}
          onClose={() => setIsMobileNavOpen(false)}
          title="Console Navigation"
          subtitle="Select settings or governance domain"
          width="md"
        >
          <SettingsSidebar
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            isCollapsed={false}
            onToggleCollapse={() => {}}
            activeSessionsCount={activeSessions.length}
            isMobile={true}
          />
        </Drawer>
      )}

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020612]/60 overflow-hidden">
        {/* Sticky Settings Top Header */}
        <SettingsHeader
          activeSection={activeSection}
          hasUnsavedChanges={hasUnsavedChanges}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
        />

        {/* Dynamic Section Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {renderSectionContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Sticky Save Bar (Framer Motion) */}
      <SaveBar
        isVisible={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* Quick Jump Search Modal (Cmd+K) */}
      <SettingsSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSection={handleSelectSection}
      />

      {/* Save Success / Info Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#091428] border border-cyan-500/40 text-white text-xs font-mono shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(34,211,238,0.2)] flex items-center gap-3 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
