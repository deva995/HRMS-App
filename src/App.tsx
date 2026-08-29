import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { AuditLogModal } from './components/common/AuditLogModal';
import { GeoClockInModal } from './components/modules/attendance/GeoClockInModal';

// Module Views
import { SuperAdminView } from './components/modules/superadmin/SuperAdminView';
import { HRView } from './components/modules/hr/HRView';
import { PayrollView } from './components/modules/payroll/PayrollView';
import { AttendanceView } from './components/modules/attendance/AttendanceView';
import { PerformanceView } from './components/modules/performance/PerformanceView';
import { RecruitmentView } from './components/modules/recruitment/RecruitmentView';
import { ModulePlaceholderView } from './components/modules/common/ModulePlaceholderView';

import { Lock, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { MODULE_DEFINITIONS } from './types';

const MainLayout: React.FC = () => {
  const { activeModule, hasAccessToModule, activeOrg, role, toggleModuleForOrg, setActiveModule } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isClockInOpen, setIsClockInOpen] = useState(false);

  const isModuleAllowed = hasAccessToModule(activeModule);
  const currentModuleDef = MODULE_DEFINITIONS.find((m) => m.id === activeModule || m.key === activeModule);

  const renderModuleContent = () => {
    if (activeModule === 'superadmin') {
      return <SuperAdminView />;
    }

    if (!isModuleAllowed && role !== 'super_admin') {
      return (
        <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {currentModuleDef?.name || 'Module'} is not enabled for {activeOrg.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              This organization subscription does not include the {currentModuleDef?.name} module. A Super Admin can provision access in the Module Matrix.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                toggleModuleForOrg(activeOrg.id, activeModule);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Enable Module for {activeOrg.code} (Simulation)</span>
            </button>
            <button
              onClick={() => setActiveModule('superadmin')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Go to Super Admin Matrix
            </button>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case 'hr':
        return <HRView />;
      case 'payroll':
        return <PayrollView />;
      case 'attendance':
        return <AttendanceView />;
      case 'performance':
        return <PerformanceView />;
      case 'recruitment':
        return <RecruitmentView />;
      case 'leave':
      case 'ess':
      case 'engagement':
      case 'marketplace':
      case 'expenses':
        return <ModulePlaceholderView moduleKey={activeModule} />;
      default:
        return <HRView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenClockIn={() => setIsClockInOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Module Sidebar */}
        <Sidebar />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderModuleContent()}
        </main>
      </div>

      {/* Professional Polish Status Bar Footer */}
      <footer className="h-8 bg-slate-100/90 border-t border-slate-200 flex items-center px-4 sm:px-8 justify-between text-[11px] text-slate-500 shrink-0 select-none">
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="truncate">
            Tenant: <strong className="text-slate-700">{activeOrg.name}</strong> • Simulated Session Active
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>Enterprise HRMS • Professional Edition</span>
          <button
            onClick={() => setIsAuditOpen(true)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Audit Log (Simulated)
          </button>
        </div>
      </footer>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <AuditLogModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
      <GeoClockInModal isOpen={isClockInOpen} onClose={() => setIsClockInOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
