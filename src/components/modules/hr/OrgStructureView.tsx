import React, { useState } from 'react';
import {
  Network,
  Building2,
  Briefcase,
  Clock,
  Plus,
  ChevronRight,
  User,
  Users,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Department, Designation } from '../../../types';
import { Modal } from '../../common/Modal';

export const OrgStructureView: React.FC = () => {
  const {
    activeOrgDepartments,
    activeOrgDesignations,
    activeOrgEmployees,
    activeOrg,
    addDepartment,
    addDesignation,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hierarchy' | 'departments' | 'designations' | 'shifts'>('hierarchy');
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddDesigOpen, setIsAddDesigOpen] = useState(false);

  // New Department Form
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    headOfDepartment: '',
  });

  // New Designation Form
  const [desigForm, setDesigForm] = useState({
    title: '',
    departmentId: activeOrgDepartments[0]?.id || '',
    level: 'L3 - Senior',
  });

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name) return;
    addDepartment({
      name: deptForm.name,
      code: deptForm.code || deptForm.name.substring(0, 3).toUpperCase(),
      headOfDepartment: deptForm.headOfDepartment || 'To be appointed',
    });
    setIsAddDeptOpen(false);
    setDeptForm({ name: '', code: '', headOfDepartment: '' });
  };

  const handleAddDesig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desigForm.title) return;
    const dept = activeOrgDepartments.find((d) => d.id === desigForm.departmentId);
    addDesignation({
      title: desigForm.title,
      departmentId: desigForm.departmentId,
      departmentName: dept?.name || 'Engineering',
      level: desigForm.level,
    });
    setIsAddDesigOpen(false);
    setDesigForm({ title: '', departmentId: activeOrgDepartments[0]?.id || '', level: 'L3 - Senior' });
  };

  // Find top executive (reportingManagerId is undefined or self)
  const leaders = activeOrgEmployees.filter(
    (e) => !e.reportingManagerId || e.reportingManagerId === ''
  );

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <nav className="flex space-x-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'hierarchy'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Interactive Org Chart</span>
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'departments'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Departments ({activeOrgDepartments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('designations')}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'designations'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Designations ({activeOrgDesignations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`pb-2.5 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'shifts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Work Shifts & Timings</span>
          </button>
        </nav>
      </div>

      {/* Tab 1: Interactive Org Chart */}
      {activeTab === 'hierarchy' && (
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-6 overflow-x-auto">
          <div className="text-center mb-6">
            <h3 className="text-sm font-bold text-slate-900">Organizational Reporting Tree</h3>
            <p className="text-xs text-slate-500">Live reporting tree derived from employee records</p>
          </div>

          <div className="min-w-[700px] flex flex-col items-center space-y-6">
            {/* Top Leaders */}
            <div className="flex justify-center gap-6">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="bg-white rounded-xl border-2 border-indigo-600 p-4 shadow-md w-64 text-center space-y-2 hover:scale-[1.02] transition-transform"
                >
                  <img
                    src={leader.avatar}
                    alt={leader.name}
                    className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-indigo-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{leader.name}</h4>
                    <p className="text-xs font-semibold text-indigo-600">{leader.designation}</p>
                    <p className="text-[11px] text-slate-400">{leader.department}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-px h-6 bg-indigo-300" />

            {/* Department Heads / Managers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {activeOrgEmployees
                .filter((e) => leaders.some((l) => l.id === e.reportingManagerId))
                .map((mgr) => {
                  const directReports = activeOrgEmployees.filter((e) => e.reportingManagerId === mgr.id);
                  return (
                    <div
                      key={mgr.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={mgr.avatar}
                          alt={mgr.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{mgr.name}</div>
                          <div className="text-[11px] text-indigo-600 font-medium">{mgr.designation}</div>
                          <div className="text-[10px] text-slate-400">{mgr.department}</div>
                        </div>
                      </div>

                      {directReports.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1.5 flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" /> Direct Reports ({directReports.length})
                          </div>
                          <div className="space-y-1">
                            {directReports.map((dr) => (
                              <div
                                key={dr.id}
                                className="flex items-center justify-between p-1.5 rounded bg-slate-50 text-[11px]"
                              >
                                <span className="font-medium text-slate-800">{dr.name}</span>
                                <span className="text-slate-400 text-[10px]">{dr.designation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Business Units</h4>
            <button
              onClick={() => setIsAddDeptOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeOrgDepartments.map((dept) => {
              const count = activeOrgEmployees.filter((e) => e.departmentId === dept.id).length;
              return (
                <div key={dept.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700">
                      {dept.code}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600">{count} Employees</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{dept.name}</h4>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    Lead: <strong className="text-slate-800">{dept.headOfDepartment}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Designations */}
      {activeTab === 'designations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Job Roles & Titles</h4>
            <button
              onClick={() => setIsAddDesigOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Designation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeOrgDesignations.map((desig) => (
              <div key={desig.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{desig.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {desig.level}
                  </span>
                </div>
                <div className="text-xs text-slate-500">{desig.departmentName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Work Shifts */}
      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">General Day Shift</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Active</span>
            </div>
            <p className="text-xs text-slate-500">Standard operating business hours</p>
            <div className="pt-2 border-t border-slate-100 font-mono text-xs text-indigo-700 font-semibold">
              09:00 AM – 06:00 PM IST (45h/wk)
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Engineering Core Flex</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Active</span>
            </div>
            <p className="text-xs text-slate-500">Flexible R&D engineering overlap</p>
            <div className="pt-2 border-t border-slate-100 font-mono text-xs text-indigo-700 font-semibold">
              11:00 AM – 08:00 PM IST (40h/wk)
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">24/7 Operations Rotation</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">Rotational</span>
            </div>
            <p className="text-xs text-slate-500">Support and customer escalation tier</p>
            <div className="pt-2 border-t border-slate-100 font-mono text-xs text-indigo-700 font-semibold">
              Rotational Shifts (8 hrs + 1h lunch)
            </div>
          </div>
        </div>
      )}

      {/* Add Dept Modal */}
      <Modal
        isOpen={isAddDeptOpen}
        onClose={() => setIsAddDeptOpen(false)}
        title="Add Department"
        subtitle={`Create a new business department for ${activeOrg.name}`}
      >
        <form onSubmit={handleAddDept} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Data Science & AI"
              value={deptForm.name}
              onChange={(e) =>
                setDeptForm({
                  ...deptForm,
                  name: e.target.value,
                  code: e.target.value.substring(0, 3).toUpperCase(),
                })
              }
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department Code</label>
            <input
              type="text"
              placeholder="e.g. DSA"
              value={deptForm.code}
              onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Head of Department</label>
            <input
              type="text"
              placeholder="e.g. Dr. Ramesh Gupta"
              value={deptForm.headOfDepartment}
              onChange={(e) => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddDeptOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Designation Modal */}
      <Modal
        isOpen={isAddDesigOpen}
        onClose={() => setIsAddDesigOpen(false)}
        title="Add Designation"
        subtitle="Define a job title and seniority band"
      >
        <form onSubmit={handleAddDesig} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Staff Platform Architect"
              value={desigForm.title}
              onChange={(e) => setDesigForm({ ...desigForm, title: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={desigForm.departmentId}
              onChange={(e) => setDesigForm({ ...desigForm, departmentId: e.target.value })}
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
            <label className="block font-semibold text-slate-700 mb-1">Seniority Level</label>
            <select
              value={desigForm.level}
              onChange={(e) => setDesigForm({ ...desigForm, level: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="L1 - Associate">L1 - Associate</option>
              <option value="L2 - Mid Level">L2 - Mid Level</option>
              <option value="L3 - Senior">L3 - Senior</option>
              <option value="L4 - Lead / Staff">L4 - Lead / Staff</option>
              <option value="L5 - Director / VP">L5 - Director / VP</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddDesigOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Save Designation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
