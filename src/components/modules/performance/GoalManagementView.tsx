import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Target,
  User,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PerformanceGoal } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const GoalManagementView: React.FC = () => {
  const { activeOrgGoals, activeOrgEmployees, activeOrg, createGoal, updateGoalProgress } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Goal Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ownerId: activeOrgEmployees[0]?.id || '',
    type: 'Individual' as PerformanceGoal['type'],
    priority: 'High' as PerformanceGoal['priority'],
    targetValue: 100,
    unit: '%',
    dueDate: '2026-06-30',
  });

  const filteredGoals = activeOrgGoals.filter((g) => {
    if (filterType !== 'all' && g.type.toLowerCase() !== filterType.toLowerCase()) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    const owner = activeOrgEmployees.find((e) => e.id === formData.ownerId);

    createGoal({
      title: formData.title,
      description: formData.description,
      employeeId: formData.ownerId,
      ownerName: owner?.name || 'Assigned Lead',
      departmentId: owner?.departmentId || 'dept-eng',
      type: formData.type,
      priority: formData.priority,
      targetValue: Number(formData.targetValue),
      currentValue: 0,
      metricUnit: formData.unit,
      progressPercent: 0,
      status: 'In Progress',
      score: 4.0,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      keyResults: [
        { id: `kr-${Date.now()}-1`, title: 'Milestone 1: Deliver MVP specifications', completed: false, weight: 50 },
        { id: `kr-${Date.now()}-2`, title: 'Milestone 2: Production rollout & benchmark', completed: false, weight: 50 },
      ],
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      description: '',
      ownerId: activeOrgEmployees[0]?.id || '',
      type: 'Individual',
      priority: 'High',
      targetValue: 100,
      unit: '%',
      dueDate: '2026-06-30',
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Scope:</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {['all', 'individual', 'team', 'department', 'okr'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                  filterType === t
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All Goals' : `${t} OKRs`}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Goal / OKR</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {goal.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        goal.priority === 'High' || goal.priority === 'Urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {goal.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{goal.title}</h4>
                </div>

                <StatusBadge status={goal.status.toUpperCase()} />
              </div>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{goal.description}</p>
            </div>

            {/* Progress Slider Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Progress Tracker</span>
                <span className="font-bold text-indigo-700 font-mono">{goal.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{goal.ownerName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>Target: {goal.dueDate}</span>
                </div>
              </div>
            </div>

            {/* Key Results Checklist */}
            {goal.keyResults && goal.keyResults.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-[11px]">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Key Results ({goal.keyResults.filter((k) => k.completed).length}/{goal.keyResults.length})
                </div>
                {goal.keyResults.map((kr) => (
                  <div key={kr.id} className="flex items-center justify-between text-slate-700">
                    <span className="truncate max-w-[280px]">• {kr.title}</span>
                    <span className={kr.completed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {kr.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Progress Increment buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Quick Update:</span>
              <div className="flex items-center gap-1.5">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => updateGoalProgress(goal.id, pct, pct === 100 ? 'Completed' : 'In Progress')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      goal.progressPercent === pct
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Performance Goal / OKR"
        subtitle={`Set objectives and measurable milestones for ${activeOrg.name}`}
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Objective Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement automated microservices failover to achieve 99.99% uptime"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={2}
              placeholder="Provide strategic context and target deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Goal Owner</label>
              <select
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
              >
                {activeOrgEmployees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scope Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PerformanceGoal['type'] })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
              >
                <option value="Individual">Individual OKR</option>
                <option value="Team">Team OKR</option>
                <option value="Department">Department Goal</option>
                <option value="OKR">Company Strategic Initiative (OKR)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as PerformanceGoal['priority'] })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>
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
              Save Goal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
