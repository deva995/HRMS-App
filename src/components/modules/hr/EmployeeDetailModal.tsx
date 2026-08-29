import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  IndianRupee,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Employee, EmployeeLifecycleEvent } from '../../../types';
import { Modal } from '../../common/Modal';
import { StatusBadge } from '../../common/StatusBadge';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLifecycleModal?: (emp: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  isOpen,
  onClose,
  onOpenLifecycleModal,
}) => {
  const { activeOrgDepartments, activeOrgDesignations, activeOrgEmployees } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'compensation' | 'documents' | 'history'>('profile');

  if (!employee || !isOpen) return null;

  const dept = activeOrgDepartments.find((d) => d.id === employee.departmentId);
  const desig = activeOrgDesignations.find((d) => d.id === employee.designationId);
  const manager = activeOrgEmployees.find((e) => e.id === employee.managerId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${employee.name} — ${employee.employeeCode}`}
      subtitle={`${desig?.title || 'Team Member'} • ${dept?.name || 'Department'}`}
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Profile Header Hero */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{employee.name}</h3>
                <StatusBadge status={employee.employmentStatus.toUpperCase()} />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{desig?.title || 'Team Member'} • {dept?.name || 'Core Team'}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span>Code: <strong className="text-slate-200">{employee.employeeCode}</strong></span>
                <span>•</span>
                <span>Joined: <strong className="text-slate-200">{employee.joiningDate}</strong></span>
                <span>•</span>
                <span>Type: <strong className="text-slate-200">{employee.employmentType}</strong></span>
              </div>
            </div>
          </div>

          {onOpenLifecycleModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLifecycleModal(employee);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs"
            >
              Change Status / Lifecycle
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-2.5 px-1 border-b-2 transition-all ${
                activeTab === 'profile'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Personal & Work Details
            </button>
            <button
              onClick={() => setActiveTab('compensation')}
              className={`pb-2.5 px-1 border-b-2 transition-all ${
                activeTab === 'compensation'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Compensation & Bank
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-2.5 px-1 border-b-2 transition-all ${
                activeTab === 'documents'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Documents ({employee.documents.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 px-1 border-b-2 transition-all ${
                activeTab === 'history'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Lifecycle Timeline ({employee.lifecycleHistory?.length || 0})
            </button>
          </nav>
        </div>

        {/* Tab 1: Profile & Work Info */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" /> Personal Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Email Address</span>
                  <span className="font-medium text-slate-900">{employee.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Phone Number</span>
                  <span className="font-medium text-slate-900">{employee.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-medium text-slate-900">{employee.dob}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Gender</span>
                  <span className="font-medium text-slate-900 capitalize">{employee.gender}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Emergency Contact</span>
                  <span className="font-medium text-slate-900">{employee.emergencyContact.name} ({employee.emergencyContact.relationship})</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Employment & Org Structure
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Department</span>
                  <span className="font-medium text-slate-900">{dept?.name || 'Engineering'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Designation</span>
                  <span className="font-medium text-slate-900">{desig?.title || 'Specialist'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Reporting Manager</span>
                  <span className="font-medium text-slate-900">{manager ? manager.name : 'Direct Report to CEO'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Employment Type</span>
                  <span className="font-medium text-slate-900 capitalize">{employee.employmentType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Work Shift</span>
                  <span className="font-medium text-slate-900">General Shift (09:00 - 18:00 IST)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Compensation & Bank */}
        {activeTab === 'compensation' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-600" /> Salary Structure Breakdown (Annual CTC)
                </h4>
                <span className="text-sm font-bold text-emerald-700 font-mono">
                  ₹{(employee.salaryDisplay?.annualCtc || 1800000).toLocaleString('en-IN')}/year
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Basic Salary</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    ₹{(employee.salaryDisplay?.basic || 75000).toLocaleString('en-IN')}/mo
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">House Rent (HRA)</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    ₹{(employee.salaryDisplay?.hra || 37500).toLocaleString('en-IN')}/mo
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Special Allowances</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    ₹{(employee.salaryDisplay?.allowances || 37500).toLocaleString('en-IN')}/mo
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Gross Monthly</div>
                  <div className="font-bold text-indigo-700 mt-0.5">
                    ₹{(employee.salaryDisplay?.grossMonthly || 150000).toLocaleString('en-IN')}/mo
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Masked Bank & Statutory Accounts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">Bank Account (Masked)</div>
                  <div className="font-mono font-semibold text-slate-900">{employee.bankDetailsMasked || '•••• 4821 (HDFC)'}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">PAN Number (Masked)</div>
                  <div className="font-mono font-semibold text-slate-900">ABCDE••••F</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500">PF / UAN Number (Masked)</div>
                  <div className="font-mono font-semibold text-slate-900">1009••••8821</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {employee.documents.map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 capitalize">{doc.type} • Uploaded {doc.uploadedAt}</div>
                    </div>
                  </div>
                  <StatusBadge status={doc.verificationStatus.toUpperCase()} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Lifecycle History */}
        {activeTab === 'history' && (
          <div className="space-y-3 text-xs">
            <div className="relative pl-6 border-l-2 border-indigo-200 ml-3 space-y-5 py-2">
              {employee.lifecycleHistory && employee.lifecycleHistory.length > 0 ? (
                employee.lifecycleHistory.map((evt) => (
                  <div key={evt.id} className="relative group">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 capitalize">{evt.type.replace('_', ' ')}</span>
                        <span className="text-[10px] text-slate-400">{evt.effectiveDate}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{evt.title} - {evt.notes}</p>
                      {evt.previousValue && evt.newValue && (
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-indigo-700 bg-indigo-50 p-1.5 rounded w-fit">
                          <span>{evt.previousValue}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-semibold">{evt.newValue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400">No lifecycle transitions recorded yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
