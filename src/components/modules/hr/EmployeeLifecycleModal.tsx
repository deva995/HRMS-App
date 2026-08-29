import React, { useState } from 'react';
import { UserCog, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Employee, EmployeeLifecycleEvent } from '../../../types';
import { Modal } from '../../common/Modal';

interface EmployeeLifecycleModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeLifecycleModal: React.FC<EmployeeLifecycleModalProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  const { updateEmployeeLifecycle, activeOrgDepartments, activeOrgDesignations } = useApp();

  const [type, setType] = useState<string>('promotion');
  const [newDepartmentId, setNewDepartmentId] = useState<string>('');
  const [newDesignationId, setNewDesignationId] = useState<string>('');
  const [newStatus, setNewStatus] = useState<Employee['employmentStatus']>('Active');
  const [reason, setReason] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  if (!employee || !isOpen) return null;

  const currentDept = activeOrgDepartments.find((d) => d.id === employee.departmentId);
  const currentDesig = activeOrgDesignations.find((d) => d.id === employee.designationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const updates: Partial<Employee> = {};
    if (newDepartmentId) updates.departmentId = newDepartmentId;
    if (newDesignationId) updates.designationId = newDesignationId;
    if (newStatus) updates.employmentStatus = newStatus;

    const newDeptObj = activeOrgDepartments.find((d) => d.id === newDepartmentId);
    const newDesigObj = activeOrgDesignations.find((d) => d.id === newDesignationId);

    updateEmployeeLifecycle(
      employee.id,
      {
        type: type as any,
        effectiveDate,
        title: `${type.toUpperCase()}: ${newDesigObj?.title || newDeptObj?.name || newStatus}`,
        notes: reason,
        previousValue: currentDesig?.title || currentDept?.name || employee.employmentStatus,
        newValue: newDesigObj?.title || newDeptObj?.name || newStatus,
      },
      updates
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Lifecycle Transition"
      subtitle={`Trigger status, department, or role changes for ${employee.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-bold text-slate-900">{employee.name}</div>
            <div className="text-slate-500">{currentDesig?.title || 'Team Member'} • {currentDept?.name || 'Department'}</div>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Transition Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
          >
            <option value="promotion">Role Promotion</option>
            <option value="transfer">Department / Location Transfer</option>
            <option value="status_change">Employment Status Change</option>
            <option value="resignation">Voluntary Resignation</option>
            <option value="exit">Offboarding / Exit</option>
          </select>
        </div>

        {type === 'promotion' && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Designation</label>
            <select
              value={newDesignationId}
              onChange={(e) => setNewDesignationId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="">Keep Current ({currentDesig?.title || 'Current'})</option>
              {activeOrgDesignations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === 'transfer' && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Department</label>
            <select
              value={newDepartmentId}
              onChange={(e) => setNewDepartmentId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="">Keep Current ({currentDept?.name || 'Current'})</option>
              {activeOrgDepartments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {(type === 'status_change' || type === 'resignation' || type === 'exit') && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Employment Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as Employee['employmentStatus'])}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="Notice Period">Notice Period</option>
              <option value="Suspended">Suspended</option>
              <option value="Exited">Exited</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Effective Date *</label>
            <input
              type="date"
              required
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Action Approver</label>
            <input
              type="text"
              disabled
              value="Current Admin Session"
              className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Business Justification / Reason *</label>
          <textarea
            required
            rows={2}
            placeholder="e.g. Excellent H1 performance score, leadership recommendation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Transition will be automatically logged to the immutable simulated audit history.</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
          >
            Apply Lifecycle Transition
          </button>
        </div>
      </form>
    </Modal>
  );
};
