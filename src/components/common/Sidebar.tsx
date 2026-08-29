import React from 'react';
import {
  LayoutDashboard,
  Users,
  IndianRupee,
  MapPinCheckInside,
  TrendingUp,
  UserCheck,
  CalendarRange,
  UserCog,
  HeartHandshake,
  Boxes,
  Receipt,
  ShieldAlert,
  SlidersHorizontal,
  Lock,
  CheckCircle2,
  GitPullRequest,
  History,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModuleId } from '../../types';

interface NavItem {
  id: ModuleId | 'superadmin' | 'approvals' | 'dashboard' | 'audit';
  name: string;
  icon: React.ReactNode;
  isFullyBuilt?: boolean;
  category: 'core' | 'talent' | 'workplace' | 'admin' | 'general';
  defaultTab?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    setActiveSubTab,
    activeOrg,
    currentRole,
    hasAccessToModule,
    activeOrgWorkflows,
  } = useApp();

  const pendingApprovalsCount = activeOrgWorkflows.filter((w) => w.status === 'pending').length;

  const fullyBuiltModules: NavItem[] = [
    {
      id: 'hr',
      name: 'HR Software',
      icon: <Users className="w-4 h-4" />,
      isFullyBuilt: true,
      category: 'core',
      defaultTab: 'directory',
    },
    {
      id: 'payroll',
      name: 'Payroll Software',
      icon: <IndianRupee className="w-4 h-4" />,
      isFullyBuilt: true,
      category: 'core',
      defaultTab: 'overview',
    },
    {
      id: 'attendance',
      name: 'Attendance & Geo',
      icon: <MapPinCheckInside className="w-4 h-4" />,
      isFullyBuilt: true,
      category: 'workplace',
      defaultTab: 'dashboard',
    },
    {
      id: 'performance',
      name: 'Performance & OKRs',
      icon: <TrendingUp className="w-4 h-4" />,
      isFullyBuilt: true,
      category: 'talent',
      defaultTab: 'dashboard',
    },
    {
      id: 'recruitment',
      name: 'Recruitment & ATS',
      icon: <UserCheck className="w-4 h-4" />,
      isFullyBuilt: true,
      category: 'talent',
      defaultTab: 'dashboard',
    },
  ];

  const comingSoonModules: NavItem[] = [
    {
      id: 'leave',
      name: 'Leave Management',
      icon: <CalendarRange className="w-4 h-4" />,
      isFullyBuilt: false,
      category: 'core',
    },
    {
      id: 'ess',
      name: 'Employee Self Service',
      icon: <UserCog className="w-4 h-4" />,
      isFullyBuilt: false,
      category: 'core',
    },
    {
      id: 'engagement',
      name: 'Employee Engagement',
      icon: <HeartHandshake className="w-4 h-4" />,
      isFullyBuilt: false,
      category: 'talent',
    },
    {
      id: 'marketplace',
      name: 'Unite Marketplace',
      icon: <Boxes className="w-4 h-4" />,
      isFullyBuilt: false,
      category: 'workplace',
    },
    {
      id: 'expenses',
      name: 'Expense Management',
      icon: <Receipt className="w-4 h-4" />,
      isFullyBuilt: false,
      category: 'core',
    },
  ];

  const handleNavClick = (item: NavItem) => {
    setActiveModule(item.id);
    if (item.defaultTab) {
      setActiveSubTab(item.defaultTab);
    } else {
      setActiveSubTab('overview');
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-[calc(100vh-4rem)]">
      {/* Primary General Section */}
      <div className="p-3 space-y-1">
        <button
          onClick={() => {
            setActiveModule('dashboard');
            setActiveSubTab('overview');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveModule('approvals');
            setActiveSubTab('all');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'approvals'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <GitPullRequest className="w-4 h-4" />
            <span>Approval Hub</span>
          </div>
          {pendingApprovalsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
              {pendingApprovalsCount}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Active Suite Modules (5)
      </div>

      {/* Fully Built Modules */}
      <div className="px-3 space-y-1 flex-1">
        {fullyBuiltModules.map((item) => {
          const isAssignedToOrg = activeOrg.enabledModules.includes(item.id as ModuleId);
          const isEnabledForOrg = hasAccessToModule(item.id as ModuleId);
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isAssignedToOrg
                  ? 'hover:bg-slate-800/80 text-slate-300'
                  : 'text-slate-500 hover:bg-slate-800/40 opacity-70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : isAssignedToOrg ? 'text-slate-400' : 'text-slate-600'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.name}</span>
              </div>

              {!isAssignedToOrg && (
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1"
                  title={`Unassigned for ${activeOrg.name} in Super Admin Matrix`}
                >
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                  <span>Locked</span>
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Upcoming Roadmap (5)
        </div>

        {/* Coming Soon Modules */}
        {comingSoonModules.map((item) => {
          const isAssignedToOrg = activeOrg.enabledModules.includes(item.id as ModuleId);
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : isAssignedToOrg
                  ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
                  : 'text-slate-500 hover:bg-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-slate-500">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {!isAssignedToOrg && (
                  <Lock className="w-2.5 h-2.5 text-amber-400/70" title={`Unassigned for ${activeOrg.name}`} />
                )}
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  Soon
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Super Admin & Governance Section */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-1">
        <div className="px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Super Admin & Governance</span>
          {currentRole === 'super_admin' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>

        <button
          onClick={() => {
            setActiveModule('superadmin');
            setActiveSubTab('assignment');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'superadmin' && activeOrg.id
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>Module Assignment</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Live Grid
          </span>
        </button>

        <button
          onClick={() => {
            setActiveModule('superadmin');
            setActiveSubTab('organizations');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <Building className="w-4 h-4" />
          <span>Organizations ({useApp().organizations.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveModule('superadmin');
            setActiveSubTab('roles');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Roles & UI Permissions</span>
        </button>
      </div>

      {/* User Identity Footer */}
      <div className="border-t border-slate-800 p-3 bg-slate-950/60">
        <div className="flex items-center rounded-lg bg-slate-800/90 border border-slate-700/50 p-2">
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
            {useApp().currentUserName.split(' ').map((n) => n[0]).join('').substring(0, 2)}
          </div>
          <div className="ml-2.5 overflow-hidden min-w-0">
            <p className="truncate text-xs font-semibold text-white">{useApp().currentUserName}</p>
            <p className="truncate text-[10px] text-slate-400 uppercase tracking-wide">
              {currentRole.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
