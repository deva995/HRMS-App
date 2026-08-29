import React from 'react';
import { IndianRupee, TrendingUp, CreditCard, ShieldAlert, Sparkles, Download, Play } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useApp } from '../../../context/AppContext';
import { KpiCard } from '../../common/KpiCard';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';

interface PayrollDashboardProps {
  onStartProcessing: () => void;
}

export const PayrollDashboard: React.FC<PayrollDashboardProps> = ({ onStartProcessing }) => {
  const { activeOrgPayroll, activeOrgEmployees, activeOrg } = useApp();

  const totalGross = activeOrgPayroll.reduce((acc, p) => acc + p.grossSalary, 0);
  const totalNet = activeOrgPayroll.reduce((acc, p) => acc + p.netSalary, 0);
  const totalPf = activeOrgPayroll.reduce((acc, p) => acc + p.pfEmployee, 0);
  const totalTds = activeOrgPayroll.reduce((acc, p) => acc + p.tds, 0);

  // Trend data
  const trendData = [
    { month: 'Nov', payout: Math.round(totalNet * 0.92) },
    { month: 'Dec', payout: Math.round(totalNet * 0.95) },
    { month: 'Jan', payout: Math.round(totalNet * 0.96) },
    { month: 'Feb', payout: Math.round(totalNet * 0.98) },
    { month: 'Mar', payout: totalNet },
  ];

  return (
    <div className="space-y-6">
      <DisclaimerBanner type="payroll_disclaimer" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Monthly Net Disbursed"
          value={`₹${(totalNet / 100000).toFixed(2)}L`}
          subtitle={`For ${activeOrgPayroll.length} active records`}
          icon={<IndianRupee className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
          trend={{ value: '+4.2% MoM', isPositive: true }}
        />
        <KpiCard
          title="Gross Payroll Run"
          value={`₹${(totalGross / 100000).toFixed(2)}L`}
          subtitle="Total pre-tax compensation"
          icon={<CreditCard className="w-5 h-5" />}
          iconBgColor="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          title="EPF Contribution"
          value={`₹${totalPf.toLocaleString('en-IN')}`}
          subtitle="Employee retirement trust"
          icon={<ShieldAlert className="w-5 h-5" />}
          iconBgColor="bg-blue-50 text-blue-600"
        />
        <KpiCard
          title="TDS Income Tax"
          value={`₹${totalTds.toLocaleString('en-IN')}`}
          subtitle="Withheld for tax authorities"
          icon={<TrendingUp className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main Charts & Action Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Net Salary Disbursement Trend (5-Month)</h4>
              <p className="text-xs text-slate-500">Monthly compensation trajectory in INR</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Net Disbursed']}
                />
                <Area type="monotone" dataKey="payout" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#payrollGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Processing Action Box */}
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Payroll Cycle Management</h4>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              Process Upcoming Salary Cycle
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Launch the automated wizard to verify employee attendance logs, compute LOP adjustments, calculate EPF/PT, and disburse payslips.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <button
              onClick={onStartProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Payroll Processing Run</span>
            </button>
            <div className="text-center text-[11px] text-slate-500">
              Target Tenant: <span className="text-slate-300 font-semibold">{activeOrg.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
