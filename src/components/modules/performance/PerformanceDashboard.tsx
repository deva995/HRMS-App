import React from 'react';
import { Target, Award, CheckCircle2, TrendingUp, Star, Users } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useApp } from '../../../context/AppContext';
import { KpiCard } from '../../common/KpiCard';

export const PerformanceDashboard: React.FC = () => {
  const { activeOrgGoals, activeOrgReviews, activeOrgEmployees, activeOrg } = useApp();

  const totalGoals = activeOrgGoals.length;
  const completedGoals = activeOrgGoals.filter((g) => g.status === 'completed' || g.progressPercent === 100).length;
  const avgProgress = totalGoals > 0 ? (activeOrgGoals.reduce((acc, g) => acc + g.progressPercent, 0) / totalGoals).toFixed(0) : '0';

  const completedReviews = activeOrgReviews.filter((r) => r.status === 'completed').length;
  const reviewCompletionRate = activeOrgReviews.length > 0 ? (((completedReviews) / activeOrgReviews.length) * 100).toFixed(0) : '0';

  // Departmental Competency Radar
  const radarData = [
    { subject: 'Technical Execution', score: 88, fullMark: 100 },
    { subject: 'Product Velocity', score: 82, fullMark: 100 },
    { subject: 'Collaboration & Morale', score: 91, fullMark: 100 },
    { subject: 'Goal Attainment', score: 79, fullMark: 100 },
    { subject: 'Leadership & Mentorship', score: 85, fullMark: 100 },
  ];

  // Goals by Department
  const deptGoalData = [
    { dept: 'Engineering', active: 12, completed: 8 },
    { dept: 'Product', active: 6, completed: 4 },
    { dept: 'Sales', active: 8, completed: 5 },
    { dept: 'Marketing', active: 5, completed: 4 },
    { dept: 'Operations', active: 4, completed: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Company OKR Progress"
          value={`${avgProgress}%`}
          subtitle={`${completedGoals} of ${totalGoals} Milestones Achieved`}
          icon={<Target className="w-5 h-5" />}
          iconBgColor="bg-indigo-50 text-indigo-600"
          trend={{ value: '+12% this quarter', isPositive: true }}
        />
        <KpiCard
          title="Review Cycle Completion"
          value={`${reviewCompletionRate}%`}
          subtitle={`${completedReviews} / ${activeOrgReviews.length} Evaluated`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          title="Average Rating"
          value="4.3 / 5.0"
          subtitle="Top tier organization benchmark"
          icon={<Star className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title="High Potentials Identified"
          value="9 Leaders"
          subtitle="Ready for succession track"
          icon={<Award className="w-5 h-5" />}
          iconBgColor="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Goal Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">OKR Progress by Department</h4>
              <p className="text-xs text-slate-500">Active vs. Completed Quarterly Goals</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptGoalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="completed" fill="#10b981" name="Completed Goals" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" fill="#6366f1" name="Active Goals" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Organizational Competency Radar</h4>
            <p className="text-xs text-slate-500 mb-2">360° cross-functional scoring index</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={70}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569' }} />
                <Radar name="Org Index" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
