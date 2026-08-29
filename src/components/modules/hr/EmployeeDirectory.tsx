import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Building2,
  MapPin,
  Filter,
  UserPlus,
  Eye,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Employee } from '../../../types';
import { DataTable, Column } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import { EmployeeLifecycleModal } from './EmployeeLifecycleModal';

export const EmployeeDirectory: React.FC = () => {
  const {
    activeOrgEmployees,
    activeOrgDepartments,
    activeOrgDesignations,
    activeOrgLocations,
    activeOrg,
    addEmployee,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [lifecycleEmployee, setLifecycleEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Employee Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 98765 43210',
    departmentId: activeOrgDepartments[0]?.id || '',
    designationId: activeOrgDesignations[0]?.id || '',
    joiningDate: new Date().toISOString().split('T')[0],
    workLocation: activeOrg.geofences[0]?.address || 'Bengaluru HQ',
    employmentType: 'full_time' as Employee['employmentType'],
    gender: 'female' as Employee['gender'],
    ctcAnnual: 1200000,
  });

  const filteredEmployees = useMemo(() => {
    return activeOrgEmployees.filter((emp) => {
      if (selectedDept !== 'all' && emp.departmentId !== selectedDept) return false;
      const statusVal = emp.employmentStatus || (emp as any).status;
      if (selectedStatus !== 'all' && statusVal !== selectedStatus) return false;
      return true;
    });
  }, [activeOrgEmployees, selectedDept, selectedStatus]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const dept = activeOrgDepartments.find((d) => d.id === formData.departmentId);
    const desig = activeOrgDesignations.find((d) => d.id === formData.designationId);

    const monthlyGross = Math.round(formData.ctcAnnual / 12);
    const basic = Math.round(monthlyGross * 0.5);
    const hra = Math.round(basic * 0.5);
    const pfEmployee = Math.min(basic * 0.12, 1800);
    const specialAllowance = monthlyGross - basic - hra;
    const netSalary = monthlyGross - pfEmployee - 200 - 1500;

    addEmployee({
      name: formData.name,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      email: formData.email,
      phone: formData.phone,
      dob: '1995-05-15',
      gender: (formData.gender === 'female' ? 'Female' : 'Male') as Employee['gender'],
      address: 'Bengaluru, Karnataka, India',
      emergencyContact: {
        name: 'Family Contact',
        relationship: 'Spouse',
        phone: '+91 98765 00000',
      },
      departmentId: formData.departmentId,
      designationId: formData.designationId,
      managerId: null,
      employmentType: (formData.employmentType === 'full_time' ? 'Full-time' : 'Contractor') as Employee['employmentType'],
      joiningDate: formData.joiningDate,
      workLocationId: activeOrg.locations?.[0]?.id || 'loc-1',
      shiftId: 'shift-1',
      salaryDisplay: {
        basic,
        hra,
        allowances: specialAllowance,
        grossMonthly: monthlyGross,
        annualCtc: Number(formData.ctcAnnual),
      },
      bankDetailsMasked: '•••• •••• 5678 (HDFC Bank)',
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          name: 'Offer Letter Signed.pdf',
          type: 'Employment Contract',
          uploadedAt: formData.joiningDate,
          verificationStatus: 'Verified',
          fileSize: '1.2 MB',
        },
      ],
      employmentStatus: 'Active',
    });

    setIsAddModalOpen(false);
  };

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee Name & Code',
      sortable: true,
      render: (emp) => (
        <div className="flex items-center gap-3">
          <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
          <div>
            <div
              onClick={() => setSelectedEmployee(emp)}
              className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer flex items-center gap-1.5"
            >
              {emp.name}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">{emp.employeeCode} • {emp.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'departmentId',
      header: 'Department & Designation',
      sortable: true,
      render: (emp) => {
        const dept = activeOrgDepartments.find((d) => d.id === emp.departmentId);
        const desig = activeOrgDesignations.find((d) => d.id === emp.designationId);
        return (
          <div>
            <div className="font-semibold text-slate-800">{desig?.title || 'Team Member'}</div>
            <div className="text-[11px] text-slate-500">{dept?.name || emp.departmentId}</div>
          </div>
        );
      },
    },
    {
      key: 'workLocationId',
      header: 'Location & Type',
      render: (emp) => {
        const loc = activeOrgLocations.find((l) => l.id === emp.workLocationId);
        return (
          <div>
            <div className="text-slate-800 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-slate-400" /> {loc?.city || 'Bengaluru'}
            </div>
            <div className="text-[11px] text-slate-500 capitalize">{emp.employmentType}</div>
          </div>
        );
      },
    },
    {
      key: 'joiningDate',
      header: 'Joining Date',
      sortable: true,
      render: (emp) => <span className="font-medium text-slate-700">{emp.joiningDate}</span>,
    },
    {
      key: 'employmentStatus',
      header: 'Status',
      render: (emp) => <StatusBadge status={emp.employmentStatus.toUpperCase()} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (emp) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedEmployee(emp)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
            title="View Profile Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLifecycleEmployee(emp)}
            className="p-1.5 rounded-md hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
            title="Change Lifecycle Status"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Departments ({activeOrgEmployees.length})</option>
              {activeOrgDepartments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="notice_period">Notice Period</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* Main Employee View */}
      {viewMode === 'table' ? (
        <DataTable
          data={filteredEmployees}
          columns={columns}
          searchPlaceholder="Search by name, employee ID, role..."
          filename={`Employees_${activeOrg.code}`}
          pageSize={8}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => {
            const desig = activeOrgDesignations.find((d) => d.id === emp.designationId);
            const dept = activeOrgDepartments.find((d) => d.id === emp.departmentId);
            const loc = activeOrgLocations.find((l) => l.id === emp.workLocationId);
            const locName = loc?.city || loc?.name || (emp as any).workLocation || 'Main Office';
            const statusVal = (emp.employmentStatus || (emp as any).status || 'Active').toUpperCase();

            return (
              <div
                key={emp.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <StatusBadge status={statusVal} />
                </div>

                <div>
                  <h4
                    onClick={() => setSelectedEmployee(emp)}
                    className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer text-sm"
                  >
                    {emp.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">{desig?.title || (emp as any).designation || 'Staff'}</p>
                  <p className="text-[11px] text-slate-400">{dept?.name || (emp as any).department || 'General'}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{locName}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{emp.employeeCode}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="px-2 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setLifecycleEmployee(emp)}
                      className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 rounded"
                    >
                      Lifecycle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
        onOpenLifecycleModal={(emp) => setLifecycleEmployee(emp)}
      />

      {/* Lifecycle Modal */}
      <EmployeeLifecycleModal
        employee={lifecycleEmployee}
        isOpen={Boolean(lifecycleEmployee)}
        onClose={() => setLifecycleEmployee(null)}
      />

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Employee"
        subtitle={`Add a new staff record to ${activeOrg.name}`}
        maxWidth="2xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Radhika Iyer"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. radhika@zenithtech.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                {activeOrgDepartments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation</label>
              <select
                value={formData.designationId}
                onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                {activeOrgDesignations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Employee['gender'] })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Annual CTC (INR)</label>
              <input
                type="number"
                value={formData.ctcAnnual}
                onChange={(e) => setFormData({ ...formData, ctcAnnual: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
              <input
                type="text"
                value={formData.workLocation}
                onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Complete Onboarding
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
