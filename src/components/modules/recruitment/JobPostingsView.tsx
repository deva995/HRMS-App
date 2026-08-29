import React, { useState } from 'react';
import { Briefcase, Plus, MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { JobRequisition } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const JobPostingsView: React.FC = () => {
  const { activeOrgJobs, activeOrgCandidates, activeOrgDepartments, addJobPosting, activeOrg } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    code: 'REQ-2026-09',
    departmentId: activeOrgDepartments[0]?.id || '',
    locationId: 'loc-1',
    employmentType: 'Full-time' as JobRequisition['employmentType'],
    experienceLevel: 'Mid Level (3-6 yrs)' as JobRequisition['experienceLevel'],
    minSalary: 1200000,
    maxSalary: 2000000,
    description: 'We are seeking an experienced specialist to lead mission-critical product features.',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    addJobPosting({
      title: formData.title,
      code: `REQ-${Date.now().toString().slice(-4)}`,
      departmentId: formData.departmentId,
      locationId: formData.locationId,
      employmentType: formData.employmentType,
      experienceLevel: formData.experienceLevel,
      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
      description: formData.description,
      skills: ['React', 'TypeScript', 'Node.js', 'System Design'],
      qualifications: ["Bachelor's in Computer Science or equivalent"],
      hiringManagerId: 'emp-1',
      status: 'Published',
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      code: 'REQ-2026-09',
      departmentId: activeOrgDepartments[0]?.id || '',
      locationId: 'loc-1',
      employmentType: 'Full-time',
      experienceLevel: 'Mid Level (3-6 yrs)',
      minSalary: 1200000,
      maxSalary: 2000000,
      description: '',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Active Job Requisitions</h3>
          <p className="text-xs text-slate-500">Open headcount openings for {activeOrg.name}</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post New Job Requisition</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeOrgJobs.map((job) => {
          const applicantCount = activeOrgCandidates.filter((c) => c.jobId === job.id).length;
          const dept = activeOrgDepartments.find((d) => d.id === job.departmentId);

          return (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                      {dept?.name || 'Department'} • {job.code}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{job.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.employmentType} • {job.experienceLevel}</span>
                    </p>
                  </div>
                  <StatusBadge status={job.status.toUpperCase()} />
                </div>

                <p className="text-xs text-slate-500 mt-2.5 line-clamp-2">{job.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="font-semibold text-slate-900">{applicantCount} Applicants</span>
                  <span>•</span>
                  <span>₹{(job.minSalary / 100000).toFixed(1)}L - ₹{(job.maxSalary / 100000).toFixed(1)}L CTC</span>
                </div>

                <span className="text-[11px] text-slate-400">
                  {job.createdAt}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Job Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Post New Job Opening"
        subtitle={`Create candidate pipeline requisition for ${activeOrg.name}`}
      >
        <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Fullstack Engineer (React / Node.js)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
              >
                {activeOrgDepartments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as JobRequisition['employmentType'] })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as JobRequisition['experienceLevel'] })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
              >
                <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                <option value="Mid Level (3-6 yrs)">Mid Level (3-6 yrs)</option>
                <option value="Senior (7-10 yrs)">Senior (7-10 yrs)</option>
                <option value="Lead / Principal (10+ yrs)">Lead / Principal (10+ yrs)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Max Annual CTC (₹)</label>
              <input
                type="number"
                value={formData.maxSalary}
                onChange={(e) => setFormData({ ...formData, maxSalary: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Description & Responsibilities</label>
            <textarea
              rows={3}
              placeholder="Outline role responsibilities, core stack, and requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Publish Job Requisition
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
