import React, { useState } from 'react';
import {
  Building2,
  UserCheck2,
  Search,
  Bell,
  History,
  MapPin,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { GeoClockInModal } from '../modules/attendance/GeoClockInModal';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';
import { AuditLogModal } from './AuditLogModal';

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenAudit?: () => void;
  onOpenClockIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onOpenAudit,
  onOpenClockIn,
}) => {
  const {
    organizations,
    activeOrgId,
    activeOrg,
    currentRole,
    currentUserName,
    setActiveOrgId,
    setCurrentRole,
    notifications,
    activeOrgWorkflows,
  } = useApp();

  const [internalGeoOpen, setInternalGeoOpen] = useState(false);
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const [internalNotifOpen, setInternalNotifOpen] = useState(false);
  const [internalAuditOpen, setInternalAuditOpen] = useState(false);

  const handleOpenSearch = onOpenSearch || (() => setInternalSearchOpen(true));
  const handleOpenNotif = onOpenNotifications || (() => setInternalNotifOpen(true));
  const handleOpenAudit = onOpenAudit || (() => setInternalAuditOpen(true));
  const handleOpenClockIn = onOpenClockIn || (() => setInternalGeoOpen(true));

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingApprovalsCount = activeOrgWorkflows.filter((w) => w.status === 'pending').length;

  const roles: { key: Role; label: string }[] = [
    { key: 'super_admin', label: 'Super Admin (Platform)' },
    { key: 'org_admin', label: 'Org Admin (Executive)' },
    { key: 'hr_manager', label: 'HR Manager' },
    { key: 'payroll_manager', label: 'Payroll Manager' },
    { key: 'recruiter', label: 'Recruiter / Talent Lead' },
    { key: 'manager', label: 'Team Manager' },
    { key: 'employee', label: 'Employee (Individual)' },
  ];

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        {/* Left Side: Logo & Active Tenant Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-xs tracking-tighter text-base">
              Z
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-bold text-slate-900 leading-none tracking-tight">ZenithHRMS</div>
              <div className="text-[10px] text-slate-400 font-medium">Enterprise Suite</div>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Multi-Tenant Organization Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition-all">
              <span className="text-base">{activeOrg.logo}</span>
              <div className="text-left max-w-[140px] sm:max-w-[200px]">
                <div className="text-xs font-semibold text-slate-900 truncate leading-tight">
                  {activeOrg.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                  <span>{activeOrg.code}</span> • <span>{activeOrg.enabledModules.length} Modules</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>

            {/* Dropdown for Tenant Selection */}
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Switch Simulated Tenant
              </div>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => setActiveOrgId(org.id)}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                    org.id === activeOrgId
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">{org.logo}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-slate-900">{org.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {org.headquarters} • {org.employeeCount} Emps
                      </div>
                    </div>
                  </div>
                  {org.id === activeOrgId && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Geo Clock-in Button */}
          <button
            onClick={handleOpenClockIn}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all shadow-2xs hover:shadow-xs"
            title="Clock In / Out with Geofence verification"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Geo Clock-In</span>
          </button>

          {/* Global Search Trigger */}
          <button
            onClick={handleOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-700 text-xs transition-colors"
            title="Search records (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quick Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Audit Log Trigger */}
          <button
            onClick={handleOpenAudit}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="View Simulated Audit Log"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={handleOpenNotif}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Role Switcher Simulator */}
          <div className="relative group">
            <div className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-lg border border-indigo-200/80 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer transition-all">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                {currentRole === 'super_admin' ? 'SA' : currentRole.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-indigo-950 truncate max-w-[130px]">
                  {currentRole.replace('_', ' ').toUpperCase()}
                </div>
                <div className="text-[10px] text-indigo-600 truncate max-w-[130px]">
                  {currentUserName}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400 ml-0.5" />
            </div>

            {/* Role Switcher Dropdown */}
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                <UserCheck2 className="w-3.5 h-3.5 text-indigo-500" /> Switch Simulated Role
              </div>
              <div className="text-[10px] text-slate-500 px-2 pb-1.5">
                Gating changes UI elements only (mock authorization).
              </div>
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setCurrentRole(r.key)}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                    r.key === currentRole
                      ? 'bg-indigo-50 text-indigo-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700 text-xs'
                  }`}
                >
                  <span className="text-xs">{r.label}</span>
                  {r.key === currentRole && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Internal Modals & Drawers fallback if callbacks not provided */}
      {!onOpenClockIn && (
        <GeoClockInModal isOpen={internalGeoOpen} onClose={() => setInternalGeoOpen(false)} />
      )}
      {!onOpenSearch && (
        <GlobalSearchModal isOpen={internalSearchOpen} onClose={() => setInternalSearchOpen(false)} />
      )}
      {!onOpenNotifications && (
        <NotificationsDrawer isOpen={internalNotifOpen} onClose={() => setInternalNotifOpen(false)} />
      )}
      {!onOpenAudit && (
        <AuditLogModal isOpen={internalAuditOpen} onClose={() => setInternalAuditOpen(false)} />
      )}
    </>
  );
};
