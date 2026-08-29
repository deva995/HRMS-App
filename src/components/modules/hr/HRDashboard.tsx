import React from 'react';
import { Users, UserPlus, Building2, UserMinus, TrendingUp, Sparkles, MapPin } from 'lucide-react';
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
import { StatusBadge } from '../../common/StatusBadge';

export const HRDashboard: React.FC = () => {
  const {
    activeOrgEmployees,
    activeOrgDepartments,
    activeOrgDesignations,
    activeOrgLocations,
    activeOrg,
  } = useApp();

  const totalEmployees = activeOrgEmployees.length;
  const activeCount = activeOrgEmployees.filter(
    (e) => e.employmentStatus === 'Active' || (e as any).status === 'active'
  ).length;
  const noticeCount = activeOrgEmployees.filter(
    (e) => e.employmentStatus === 'Notice Period' || (e as any).status === 'notice_period'
  ).length;
  const onLeaveCount = activeOrgEmployees.filter(
    (e) => e.employmentStatus === 'On Leave' || (e as any).status === 'on_leave'
  ).length;

  // Department distribution data
  const deptData = activeOrgDepartments.map((dept) => {
    const count = activeOrgEmployees.filter((e) => e.departmentId === dept.id).length;
    return {
      name: dept.name,
      count,
    };
  });

  // Location distribution data
  const locationMap = activeOrgEmployees.reduce<Record<string, number>>((acc, emp) => {
    const locObj = activeOrgLocations.find((l) => l.id === emp.workLocationId);
    const loc = locObj?.city || locObj?.name || (emp as any).workLocation || 'Bengaluru HQ';
    const locName = typeof loc === 'string' ? loc.split(',')[0].trim() : 'HQ Office';
    acc[locName] = (acc[locName] || 0) + 1;
    return acc;
  }, {});

  const locationData = Object.entries(locationMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Headcount"
          value={totalEmployees}
          subtitle="All active tenant members"
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-indigo-50 text-indigo-600"
          trend={{ value: '+8.4% QoQ', isPositive: true }}
        />
        <KpiCard
          title="Active Workforce"
          value={activeCount}
          subtitle={`${((activeCount / totalEmployees) * 100).toFixed(0)}% of total team`}
          icon={<UserPlus className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
          trend={{ value: 'Full capacity', isPositive: true }}
        />
        <KpiCard
          title="On Notice Period"
          value={noticeCount}
          subtitle="Pending offboarding"
          icon={<UserMinus className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-600"
          trend={{ value: 'Within healthy range', isNeutral: true }}
        />
        <KpiCard
          title="Departments"
          value={activeOrgDepartments.length}
          subtitle="Operating business units"
          icon={<Building2 className="w-5 h-5" />}
          iconBgColor="bg-sky-50 text-sky-600"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Headcount Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Department Headcount Distribution</h4>
              <p className="text-xs text-slate-500">Employee count across operating business units</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Split Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Workforce by Location</h4>
            <p className="text-xs text-slate-500 mb-2">Regional footprint breakdown</p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
            {locationData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value} emps</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Joiners Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Recent Joiners & Onboarding Batch</h4>
            <p className="text-xs text-slate-500">Newly onboarded talent for {activeOrg.name}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-2.5">Employee</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Department</th>
                <th className="px-4 py-2.5">Joined Date</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeOrgEmployees.slice(0, 4).map((emp) => {
                const desig = activeOrgDesignations.find((d) => d.id === emp.designationId);
                const dept = activeOrgDepartments.find((d) => d.id === emp.departmentId);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{emp.employeeCode}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{desig?.title || (emp as any).designation || 'Staff'}</td>
                    <td className="px-4 py-3 text-slate-600">{dept?.name || (emp as any).department || 'General'}</td>
                    <td className="px-4 py-3 text-slate-600">{emp.joiningDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={(emp.employmentStatus || (emp as any).status || 'Active').toUpperCase()} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
