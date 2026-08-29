import React from 'react';
import { SlidersHorizontal, Building, ShieldCheck, Settings, KeyRound, Server } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ModuleAssignmentGrid } from './ModuleAssignmentGrid';
import { OrganizationList } from './OrganizationList';

export const SuperAdminView: React.FC = () => {
  const { activeSubTab, setActiveSubTab, activeOrg } = useApp();

  const tabs = [
    { id: 'assignment', label: 'Module Assignment Matrix', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'organizations', label: 'Tenant Organizations', icon: <Building className="w-4 h-4" /> },
    { id: 'roles', label: 'Role & Permission Matrix', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'settings', label: 'Platform Configuration', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs font-semibold transition-all ${
                activeSubTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'assignment' && <ModuleAssignmentGrid />}
      {activeSubTab === 'organizations' && <OrganizationList />}
      {activeSubTab === 'roles' && <RolesPermissionsPreview />}
      {activeSubTab === 'settings' && <PlatformSettingsView />}
    </div>
  );
};

const RolesPermissionsPreview: React.FC = () => {
  const roles = [
    {
      name: 'Super Admin',
      scope: 'Global Platform',
      desc: 'Can provision tenants, toggle module matrix, override permissions across all organizations.',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      name: 'Org Admin',
      scope: 'Tenant Scoped',
      desc: 'Full administrative access within their assigned organization. Cannot toggle other tenants.',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      name: 'HR Manager',
      scope: 'Employee & Org Lifecycle',
      desc: 'Full read/write on employee directory, onboarding, department structures, and lifecycle workflows.',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      name: 'Payroll Manager',
      scope: 'Compensation & Deductions',
      desc: 'Manages salary components, triggers monthly payroll processing runs, approves batches, downloads tax reports.',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      name: 'Recruiter / Talent Lead',
      scope: 'ATS & Hiring Pipeline',
      desc: 'Manages job postings, moves candidates across Kanban stages, schedules interviews and records feedback.',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      name: 'Team Manager',
      scope: 'Direct Reports',
      desc: 'Views team attendance, approves regularization & leaves, conducts employee performance reviews.',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      name: 'Employee',
      scope: 'Self Profile',
      desc: 'Performs geo clock-in/out, views own payslips, self-evaluates goals and reviews, views colleagues in directory.',
      color: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-900">Simulated Role-Based Access Control (RBAC)</h3>
        <p className="text-xs text-slate-500 mt-1">
          Use the role switcher in the top right navigation bar to test the application from any role persona perspective.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {roles.map((role) => (
            <div key={role.name} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${role.color}`}>
                  {role.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{role.scope}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlatformSettingsView: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Platform Environment Settings</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Prototype environment parameters and state persistence controls.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Server className="w-4 h-4 text-indigo-600" />
            <span>State Engine</span>
          </div>
          <p className="text-xs text-slate-600">
            Pure In-Memory React Context. All edits are ephemeral to the active browser session.
          </p>
          <div className="text-[11px] font-mono text-emerald-600 font-semibold">● Client-Side Active</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Multi-Tenant Architecture</span>
          </div>
          <p className="text-xs text-slate-600">
            Logical tenant isolation via scoped queries filtering by <code>activeOrgId</code>.
          </p>
          <div className="text-[11px] font-mono text-indigo-600 font-semibold">● Multi-Tenant Simulated</div>
        </div>
      </div>
    </div>
  );
};
