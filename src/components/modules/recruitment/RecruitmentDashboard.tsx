import React from 'react';
import { UserPlus, Briefcase, Users, CheckCircle, Clock, Sparkles } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../../context/AppContext';
import { KpiCard } from '../../common/KpiCard';

export const RecruitmentDashboard: React.FC = () => {
  const { activeOrgCandidates, activeOrgJobs, activeOrg } = useApp();

  const totalCandidates = activeOrgCandidates.length;
  const hiredCount = activeOrgCandidates.filter((c) => c.stage === 'hired').length;
  const inInterview = activeOrgCandidates.filter((c) => c.stage === 'interview' || c.stage === 'offer').length;

  // Funnel Data
  const funnelData = [
    { stage: 'Applied', count: activeOrgCandidates.filter((c) => c.stage === 'applied').length + 8 },
    { stage: 'Screened', count: activeOrgCandidates.filter((c) => c.stage === 'screening').length + 5 },
    { stage: 'Interview', count: inInterview + 3 },
    { stage: 'Offer', count: activeOrgCandidates.filter((c) => c.stage === 'offer').length + 1 },
    { stage: 'Hired', count: hiredCount },
  ];

  // Sourcing Distribution
  const sourceData = [
    { name: 'LinkedIn', value: 45, color: '#0ea5e9' },
    { name: 'Referrals', value: 30, color: '#10b981' },
    { name: 'Direct Inbound', value: 15, color: '#6366f1' },
    { name: 'Campus', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Open Positions"
          value={activeOrgJobs.filter((j) => j.status === 'open').length}
          subtitle={`Across ${activeOrg.name} departments`}
          icon={<Briefcase className="w-5 h-5" />}
          iconBgColor="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          title="Active Candidate Pipeline"
          value={totalCandidates}
          subtitle="Applicants currently in review"
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-blue-50 text-blue-600"
          trend={{ value: '+18% this month', isPositive: true }}
        />
        <KpiCard
          title="Average Time-to-Hire"
          value="24 Days"
          subtitle="From application to offer letter"
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title="Offer Acceptance Rate"
          value="91.4%"
          subtitle="Candidate conversion ratio"
          icon={<CheckCircle className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
          trend={{ value: 'Industry benchmark: 82%', isPositive: true }}
        />
      </div>

      {/* Funnel and Sourcing Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Pipeline Funnel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Talent Acquisition Pipeline Funnel</h4>
              <p className="text-xs text-slate-500">Applicant drop-off & stage conversion volume</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={70} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown Pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Candidate Inbound Sourcing</h4>
            <p className="text-xs text-slate-500 mb-2">Channel conversion ratio</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
            {sourceData.map((src) => (
              <div key={src.name} className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: src.color }} />
                <span>{src.name} ({src.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
