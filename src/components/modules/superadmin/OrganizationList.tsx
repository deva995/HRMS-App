import React, { useState } from 'react';
import { Building2, Plus, Power, Edit3, MapPin, Users, CheckCircle, Shield } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Organization } from '../../../types';
import { Modal } from '../../common/Modal';
import { StatusBadge } from '../../common/StatusBadge';
import { DataTable, Column } from '../../common/DataTable';

export const OrganizationList: React.FC = () => {
  const { organizations, createOrganization, updateOrganization, toggleOrgStatus, setActiveOrgId, activeOrgId } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  // Form State for new org
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    slug: '',
    logo: '🏢',
    industry: 'Information Technology',
    headquarters: 'Bengaluru, Karnataka',
    plan: 'Growth Suite' as Organization['plan'],
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    createOrganization({
      ...formData,
      enabledModules: ['hr', 'payroll', 'attendance', 'performance', 'recruitment'],
    });
    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      code: '',
      slug: '',
      logo: '🏢',
      industry: 'Information Technology',
      headquarters: 'Bengaluru, Karnataka',
      plan: 'Growth Suite',
    });
  };

  const columns: Column<Organization>[] = [
    {
      key: 'name',
      header: 'Organization Name',
      sortable: true,
      render: (org) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl p-2 rounded-xl bg-slate-100 border border-slate-200">{org.logo}</span>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              {org.name}
              {org.id === activeOrgId && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                  Current Session
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Code: {org.code} • {org.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Industry & HQ',
      render: (org) => (
        <div>
          <div className="font-medium text-slate-800">{org.industry}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> {org.headquarters}
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Tier & Modules',
      render: (org) => (
        <div>
          <StatusBadge status={org.plan} />
          <div className="text-[11px] text-slate-500 mt-1">
            {org.enabledModules.length} of 10 Modules active
          </div>
        </div>
      ),
    },
    {
      key: 'employeeCount',
      header: 'Headcount',
      sortable: true,
      render: (org) => (
        <div className="font-semibold text-slate-900">
          {org.employeeCount} <span className="text-[11px] text-slate-500 font-normal">employees</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (org) => <StatusBadge status={org.status.toUpperCase()} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (org) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveOrgId(org.id)}
            className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 transition-colors"
          >
            Switch
          </button>
          <button
            onClick={() => toggleOrgStatus(org.id)}
            className={`p-1.5 rounded-md border transition-colors ${
              org.status === 'active'
                ? 'text-rose-600 hover:bg-rose-50 border-rose-200'
                : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
            }`}
            title={org.status === 'active' ? 'Deactivate Tenant' : 'Activate Tenant'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Tenant Organizations Directory</h3>
          <p className="text-xs text-slate-500">
            Manage simulated customer tenants, subscription tiers, and provisioning status.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Org</span>
        </button>
      </div>

      <DataTable
        data={organizations}
        columns={columns}
        searchPlaceholder="Search organizations by name or code..."
        filename="Organizations_Directory"
        pageSize={6}
      />

      {/* Provision New Org Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision New Simulated Tenant"
        subtitle="Creates an isolated in-memory tenant workspace"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Org Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme FinTech India"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    code: e.target.value.substring(0, 5).toUpperCase(),
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tenant Code (Prefix) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ACM"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
              <input
                type="text"
                placeholder="e.g. HealthTech, Logistics"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">HQ Location</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, BKC"
                value={formData.headquarters}
                onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subscription Plan
              </label>
              <select
                value={formData.plan}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value as Organization['plan'] })
                }
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="Enterprise Starter">Enterprise Starter</option>
                <option value="Growth Suite">Growth Suite</option>
                <option value="Custom Scale">Custom Scale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Icon / Logo</label>
              <select
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="🏢">🏢 Corporate</option>
                <option value="🚀">🚀 Startup / Tech</option>
                <option value="🚚">🚚 Logistics</option>
                <option value="🌿">🌿 Healthcare</option>
                <option value="🏦">🏦 Banking & FinTech</option>
                <option value="⚙️">⚙️ Manufacturing</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-900 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>New organizations are seeded with standard HR, Payroll, and Attendance modules.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Provision Organization
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
