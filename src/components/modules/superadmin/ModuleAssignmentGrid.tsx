import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Check,
  X,
  Building2,
  AlertCircle,
  Sparkles,
  Layers,
  Info,
  CheckCircle2,
  ArrowRight,
  Eye,
  RefreshCw,
  Search,
  Zap,
  Lock,
  Unlock,
  Boxes,
  Users,
  IndianRupee,
  MapPinCheckInside,
  TrendingUp,
  UserCheck,
  CalendarRange,
  UserCog,
  HeartHandshake,
  Receipt,
  LayoutGrid,
  TableProperties,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ModuleId, ModuleDefinition, Organization } from '../../../types';

export const ModuleAssignmentGrid: React.FC = () => {
  const {
    organizations,
    availableModules,
    toggleModuleForOrg,
    setModulesForOrg,
    activeOrgId,
    setActiveOrgId,
    currentRole,
    setCurrentRole,
    setActiveModule,
  } = useApp();

  const [viewMode, setViewMode] = useState<'matrix' | 'cards' | 'analytics'>('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>(activeOrgId || organizations[0]?.id || 'org-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    message: string;
    orgName: string;
    moduleName?: string;
  } | null>(null);

  const showToast = (message: string, orgName: string, moduleName?: string) => {
    setNotificationToast({ show: true, message, orgName, moduleName });
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // Filter organizations by search
  const filteredOrgs = useMemo(() => {
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [organizations, searchQuery]);

  // Filter modules by category
  const filteredModules = useMemo(() => {
    if (selectedCategory === 'all') return availableModules;
    if (selectedCategory === 'fully_built') return availableModules.filter((m) => m.isFullyBuilt);
    if (selectedCategory === 'roadmap') return availableModules.filter((m) => !m.isFullyBuilt);
    return availableModules.filter((m) => m.category === selectedCategory);
  }, [availableModules, selectedCategory]);

  const focusedOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0];

  const getModuleIcon = (id: ModuleId) => {
    switch (id) {
      case 'hr':
        return <Users className="w-4 h-4" />;
      case 'payroll':
        return <IndianRupee className="w-4 h-4" />;
      case 'attendance':
        return <MapPinCheckInside className="w-4 h-4" />;
      case 'performance':
        return <TrendingUp className="w-4 h-4" />;
      case 'recruitment':
        return <UserCheck className="w-4 h-4" />;
      case 'leave':
        return <CalendarRange className="w-4 h-4" />;
      case 'ess':
        return <UserCog className="w-4 h-4" />;
      case 'engagement':
        return <HeartHandshake className="w-4 h-4" />;
      case 'marketplace':
        return <Boxes className="w-4 h-4" />;
      case 'expenses':
        return <Receipt className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const handleToggle = (org: Organization, module: ModuleDefinition) => {
    const isEnabled = org.enabledModules.includes(module.id);
    toggleModuleForOrg(org.id, module.id);
    showToast(
      isEnabled
        ? `Unassigned '${module.name}' from ${org.name}. Navigation updated.`
        : `Assigned '${module.name}' to ${org.name}. Navigation updated.`,
      org.name,
      module.name
    );
  };

  const handleEnableAll = (org: Organization) => {
    const allIds = availableModules.map((m) => m.id);
    setModulesForOrg(org.id, allIds);
    showToast(`Assigned all 10 modules to ${org.name}. Navigation updated.`, org.name);
  };

  const handleDisableAll = (org: Organization) => {
    setModulesForOrg(org.id, ['hr']); // Keep minimal core
    showToast(`Reset ${org.name} to minimal core (HR only). Navigation updated.`, org.name);
  };

  const handleApplyPreset = (org: Organization, preset: 'starter' | 'growth' | 'full') => {
    let moduleIds: ModuleId[] = [];
    if (preset === 'starter') {
      moduleIds = ['hr', 'attendance', 'ess'];
    } else if (preset === 'growth') {
      moduleIds = ['hr', 'payroll', 'attendance', 'performance', 'recruitment'];
    } else {
      moduleIds = availableModules.map((m) => m.id);
    }
    setModulesForOrg(org.id, moduleIds);
    showToast(`Applied '${preset.toUpperCase()}' bundle to ${org.name}.`, org.name);
  };

  const handleSwitchAndPreview = (org: Organization) => {
    setActiveOrgId(org.id);
    showToast(`Switched active tenant to ${org.name}. Check left sidebar navigation.`, org.name);
  };

  // Module category grouping for card view
  const categoryGroups = [
    {
      key: 'core',
      title: 'Core HR & Employee Lifecycle',
      description: 'Directory, organization chart, attendance, self-service & leaves',
      moduleIds: ['hr', 'leave', 'ess'] as ModuleId[],
    },
    {
      key: 'financial',
      title: 'Compensation, Payroll & Expenses',
      description: 'Statutory compliance, salary structures, wizard & expense claims',
      moduleIds: ['payroll', 'expenses'] as ModuleId[],
    },
    {
      key: 'talent',
      title: 'Talent, Performance & Engagement',
      description: 'Goals/OKRs, reviews, recruitment pipeline & eNPS surveys',
      moduleIds: ['performance', 'recruitment', 'engagement'] as ModuleId[],
    },
    {
      key: 'workplace',
      title: 'Workplace, Geo-Fencing & Integrations',
      description: 'Geofencing, shifts, biometric connectors & Unite marketplace',
      moduleIds: ['attendance', 'marketplace'] as ModuleId[],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Centerpiece Banner with Explicit Non-Persistence Notice */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Super Admin Entitlement Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              <span className="text-[10px] text-emerald-300 font-mono">Live In-Memory Sync</span>
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Multi-Tenant Module Assignment Screen
            </h2>
            
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Manage module access across all 10 HRMS modules for each tenant organization. Toggling any checkbox or switch updates the simulated navigation sidebar for that tenant in real-time with zero latency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Modules</div>
              <div className="text-lg font-bold text-white font-mono">10 Suite Modules</div>
              <div className="text-[10px] text-indigo-300">5 Live Built • 5 Roadmap</div>
            </div>
          </div>
        </div>

        {/* Clear Simulation & Non-Persistence Notice */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-amber-200/90 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-amber-300 font-semibold">Simulation Notice:</strong> Module assignments operate entirely in client memory for evaluation. No backend database persistence is invoked. Toggling access modifies the live application state and mock navigation for simulated users immediately.
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-indigo-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-md">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xs flex-1">
            <div className="font-semibold text-white">{notificationToast.message}</div>
            <div className="text-[10px] text-indigo-300">Tenant: {notificationToast.orgName} • Navigation refreshed</div>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* View Switcher & Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'matrix'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>Matrix Grid (10×N)</span>
          </button>

          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Per-Tenant Cards</span>
          </button>

          <button
            onClick={() => setViewMode('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'analytics'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Adoption Analytics</span>
          </button>
        </div>

        {/* Search & Category Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All 10 Modules</option>
            <option value="fully_built">Fully Built (5 Live)</option>
            <option value="roadmap">Roadmap (5 Planned)</option>
            <option value="core">Core HR</option>
            <option value="financial">Financial & Payroll</option>
            <option value="talent">Talent & Performance</option>
            <option value="workplace">Workplace & Geo</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: MATRIX GRID */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Multi-Tenant Assignment Matrix</span>
                <span className="text-[11px] font-normal px-2 py-0.5 bg-slate-200/80 rounded-full text-slate-700">
                  {filteredOrgs.length} Organizations • {filteredModules.length} Modules
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any cell toggle or use organization-level bulk actions. Changes take effect instantaneously across mock navigation.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 self-start sm:self-auto">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-indigo-600 inline-flex items-center justify-center text-white text-[10px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>Assigned</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-300 inline-flex items-center justify-center text-slate-400 text-[10px]">
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>Unassigned</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5 min-w-[220px] sticky left-0 bg-slate-50 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                    Simulated Organization
                  </th>
                  {filteredModules.map((mod) => (
                    <th key={mod.id} className="px-3 py-3 text-center min-w-[100px]">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900">
                        <span className="text-indigo-600">{getModuleIcon(mod.id)}</span>
                        <span>{mod.name.replace(' Software', '').replace(' Management', '')}</span>
                      </div>
                      <div className="mt-0.5">
                        {mod.isFullyBuilt ? (
                          <span className="inline-block text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Live
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Roadmap
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right min-w-[180px]">Organization Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrgs.map((org) => {
                  const isCurrentActive = org.id === activeOrgId;
                  const enabledCount = org.enabledModules.length;
                  const percentage = Math.round((enabledCount / 10) * 100);

                  return (
                    <tr
                      key={org.id}
                      className={`transition-colors ${
                        isCurrentActive ? 'bg-indigo-50/40 hover:bg-indigo-50/60' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Organization Info Column */}
                      <td className="px-4 py-3.5 sticky left-0 bg-white shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl shrink-0 p-1 bg-slate-100 rounded-lg">{org.logo}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-2 truncate">
                              <span className="truncate">{org.name}</span>
                              {isCurrentActive && (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-600 text-white rounded shrink-0">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono font-medium text-slate-700">{org.code}</span>
                              <span>•</span>
                              <span>{org.employeeCount} Emps</span>
                              <span>•</span>
                              <span className="font-semibold text-indigo-600">{enabledCount}/10 Enabled</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-28 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Module Checkbox Columns */}
                      {filteredModules.map((mod) => {
                        const isAssigned = org.enabledModules.includes(mod.id);
                        return (
                          <td key={mod.id} className="px-3 py-3 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => handleToggle(org, mod)}
                              className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer ${
                                isAssigned
                                  ? 'bg-indigo-600 text-white shadow-2xs hover:bg-indigo-700 hover:scale-105 ring-2 ring-indigo-200'
                                  : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-500 border border-slate-200'
                              }`}
                              title={`${isAssigned ? 'Unassign' : 'Assign'} ${mod.name} for ${org.name}`}
                              aria-label={`${isAssigned ? 'Unassign' : 'Assign'} ${mod.name} for ${org.name}`}
                            >
                              {isAssigned ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : (
                                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                              )}
                            </button>
                          </td>
                        );
                      })}

                      {/* Quick Organization Bulk Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEnableAll(org)}
                            className="px-2 py-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors"
                            title="Assign all 10 modules"
                          >
                            All 10
                          </button>
                          <button
                            onClick={() => handleDisableAll(org)}
                            className="px-2 py-1 text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
                            title="Reset to minimal core (HR only)"
                          >
                            Min Core
                          </button>
                          <button
                            onClick={() => handleSwitchAndPreview(org)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${
                              isCurrentActive
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-white hover:bg-slate-900'
                            }`}
                            title="Switch active tenant and preview navigation"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isCurrentActive ? 'Active' : 'Preview'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PER-TENANT FOCUSED CARDS */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {/* Tenant Selector Strip */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Tenant to Configure
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {organizations.map((org) => {
                const isSelected = org.id === focusedOrg.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => setSelectedOrgId(org.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-200 text-indigo-950 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{org.logo}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{org.code}</span>
                    </div>
                    <div className="mt-2 font-bold text-xs truncate">{org.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {org.enabledModules.length}/10 Active
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focused Organization Header & Presets */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl p-2 bg-slate-100 rounded-2xl">{focusedOrg.logo}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{focusedOrg.name}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    {focusedOrg.plan}
                  </span>
                  {focusedOrg.id === activeOrgId && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200">
                      Currently Active in Header
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {focusedOrg.industry} • {focusedOrg.headquarters} • {focusedOrg.employeeCount} Total Employees
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="font-semibold text-slate-700">
                    Entitled Suite: {focusedOrg.enabledModules.length} of 10 Modules Assigned
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Bundle Presets */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase px-1">Apply Presets:</span>
              <button
                onClick={() => handleApplyPreset(focusedOrg, 'starter')}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Starter (3)
              </button>
              <button
                onClick={() => handleApplyPreset(focusedOrg, 'growth')}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Growth (5)
              </button>
              <button
                onClick={() => handleApplyPreset(focusedOrg, 'full')}
                className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-2xs"
              >
                Full Suite (10)
              </button>
              <button
                onClick={() => handleSwitchAndPreview(focusedOrg)}
                className="px-3 py-1 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3 h-3" />
                <span>Switch to Tenant</span>
              </button>
            </div>
          </div>

          {/* Categorized Module Cards Grid */}
          <div className="space-y-6">
            {categoryGroups.map((group) => {
              const groupModules = availableModules.filter((m) => group.moduleIds.includes(m.id));
              if (groupModules.length === 0) return null;

              return (
                <div key={group.key} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {group.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{group.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupModules.map((mod) => {
                      const isAssigned = focusedOrg.enabledModules.includes(mod.id);

                      return (
                        <div
                          key={mod.id}
                          className={`rounded-xl border p-4 transition-all flex flex-col justify-between space-y-3 ${
                            isAssigned
                              ? 'bg-white border-slate-300 shadow-xs ring-1 ring-indigo-500/20'
                              : 'bg-slate-50/80 border-slate-200 opacity-75'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isAssigned
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {getModuleIcon(mod.id)}
                              </div>
                              <div>
                                <h5 className="font-bold text-sm text-slate-900">{mod.name}</h5>
                                <span className="text-[10px] font-mono uppercase text-slate-400">
                                  KEY: {mod.id}
                                </span>
                              </div>
                            </div>

                            {/* iOS Style Interactive Toggle Switch */}
                            <button
                              type="button"
                              onClick={() => handleToggle(focusedOrg, mod)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isAssigned ? 'bg-indigo-600' : 'bg-slate-300'
                              }`}
                              role="switch"
                              aria-checked={isAssigned}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  isAssigned ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                            {mod.description}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              {mod.isFullyBuilt ? (
                                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Live Module
                                </span>
                              ) : (
                                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200">
                                  Roadmap Feature
                                </span>
                              )}
                            </div>

                            <span
                              className={`font-semibold ${
                                isAssigned ? 'text-indigo-600' : 'text-slate-400'
                              }`}
                            >
                              {isAssigned ? 'Visible in Navigation' : 'Locked / Hidden'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: ADOPTION ANALYTICS */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Managed Tenants
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {organizations.length} Organizations
              </div>
              <div className="text-xs text-slate-500 mt-1">Multi-tenant environment</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Core HR Adoption
              </div>
              <div className="text-2xl font-bold text-indigo-600 mt-1 font-mono">100%</div>
              <div className="text-xs text-emerald-600 mt-1">Assigned across all organizations</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Full-Suite Organizations
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {organizations.filter((o) => o.enabledModules.length >= 8).length} of {organizations.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">≥ 8 modules assigned</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Global State Updates
              </div>
              <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">Instantaneous</div>
              <div className="text-xs text-slate-500 mt-1">Simulated reactive navigation</div>
            </div>
          </div>

          {/* Module Breakdown List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Module-by-Module Adoption Distribution</h3>
              <p className="text-xs text-slate-500">
                View which organizations currently have entitlements for each specific module.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {availableModules.map((mod) => {
                const assignedOrgs = organizations.filter((o) => o.enabledModules.includes(mod.id));
                const adoptionRate = Math.round((assignedOrgs.length / organizations.length) * 100);

                return (
                  <div key={mod.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50">
                    <div className="flex items-center gap-3 min-w-[240px]">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 shrink-0">
                        {getModuleIcon(mod.id)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          <span>{mod.name}</span>
                          {mod.isFullyBuilt ? (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 rounded">
                              Live
                            </span>
                          ) : (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1.5 rounded">
                              Roadmap
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{mod.description}</div>
                      </div>
                    </div>

                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Adoption Rate</span>
                        <span>{adoptionRate}% ({assignedOrgs.length}/{organizations.length} Orgs)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${adoptionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Assigned Tenant Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {organizations.map((org) => {
                        const isAssigned = org.enabledModules.includes(mod.id);
                        return (
                          <button
                            key={org.id}
                            onClick={() => handleToggle(org, mod)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                              isAssigned
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 line-through opacity-60'
                            }`}
                            title={`Click to toggle ${mod.name} for ${org.name}`}
                          >
                            {org.logo} {org.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Live Simulated Navigation Inspector Box */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Simulated Navigation Preview Engine
            </h4>
          </div>
          <div className="text-[11px] text-slate-400">
            Active Tenant Selected: <strong className="text-indigo-300 font-bold">{focusedOrg.name}</strong> ({focusedOrg.code})
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400">Visible in Left Sidebar:</span>
          {availableModules.map((mod) => {
            const isAssigned = focusedOrg.enabledModules.includes(mod.id);
            return (
              <span
                key={mod.id}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                  isAssigned
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-400/30'
                    : 'bg-slate-800/60 text-slate-500 border border-slate-800 line-through'
                }`}
              >
                {getModuleIcon(mod.id)}
                <span>{mod.name}</span>
                {isAssigned ? (
                  <Unlock className="w-2.5 h-2.5 text-emerald-400 ml-0.5" />
                ) : (
                  <Lock className="w-2.5 h-2.5 text-rose-400 ml-0.5" />
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
