import React, { useState } from 'react';
import { IndianRupee, Settings, Save, CheckCircle, Calculator, Info } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';

export const SalaryStructureConfig: React.FC = () => {
  const { activeOrg } = useApp();

  // Config parameters
  const [basicPct, setBasicPct] = useState<number>(50);
  const [hraPct, setHraPct] = useState<number>(50);
  const [pfRate, setPfRate] = useState<number>(12);
  const [pfCeiling, setPfCeiling] = useState<number>(15000);
  const [ptMonthly, setPtMonthly] = useState<number>(200);
  const [testCtc, setTestCtc] = useState<number>(1200000);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Live calculation model
  const monthlyGross = Math.round(testCtc / 12);
  const basic = Math.round((monthlyGross * basicPct) / 100);
  const hra = Math.round((basic * hraPct) / 100);
  const specialAllowance = Math.max(0, monthlyGross - basic - hra);
  const pfMonthly = Math.round(Math.min(basic, pfCeiling) * (pfRate / 100));
  const estimatedTds = Math.round(monthlyGross > 50000 ? (monthlyGross - 50000) * 0.1 : 0);
  const totalDeductions = pfMonthly + ptMonthly + estimatedTds;
  const netMonthly = monthlyGross - totalDeductions;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner type="payroll_disclaimer" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Statutory & Component Rulebook</h3>
              <p className="text-xs text-slate-500">Configure salary breakup rules for {activeOrg.name}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
              India Standard FY 2025-26
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-semibold text-slate-800">Basic Salary (% of Monthly Gross)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="30"
                    max="60"
                    value={basicPct}
                    onChange={(e) => setBasicPct(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <span className="font-bold text-slate-900 w-10 text-right">{basicPct}%</span>
                </div>
                <p className="text-[10px] text-slate-400">Standard market practice: 40% - 50%</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-semibold text-slate-800">HRA (% of Basic Salary)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="30"
                    max="50"
                    value={hraPct}
                    onChange={(e) => setHraPct(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <span className="font-bold text-slate-900 w-10 text-right">{hraPct}%</span>
                </div>
                <p className="text-[10px] text-slate-400">Metro default: 50% of Basic, Non-metro: 40%</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-semibold text-slate-800">EPF Contribution Rate (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={pfRate}
                    onChange={(e) => setPfRate(Number(e.target.value))}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                  <span className="text-slate-500 font-bold">%</span>
                </div>
                <p className="text-[10px] text-slate-400">Statutory employee EPF contribution rate</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-semibold text-slate-800">Professional Tax (PT Karnataka)</label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={ptMonthly}
                    onChange={(e) => setPtMonthly(Number(e.target.value))}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                  <span className="text-slate-500">/mo</span>
                </div>
                <p className="text-[10px] text-slate-400">Fixed ₹200/month for gross salary &gt; ₹15,000</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              {isSaved && (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Parameters updated in memory
                </span>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Salary Rules</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Simulator Preview */}
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Calculator className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Interactive Live Simulator</h4>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-medium">Test Annual CTC (INR):</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  step="50000"
                  value={testCtc}
                  onChange={(e) => setTestCtc(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Monthly Gross:</span>
                <span className="font-mono text-white">₹{monthlyGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>• Basic ({basicPct}%):</span>
                <span className="font-mono">₹{basic.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>• HRA ({hraPct}%):</span>
                <span className="font-mono">₹{hra.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>• Special Allowance:</span>
                <span className="font-mono">₹{specialAllowance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-rose-400 text-[11px]">
                <span>• Total Deductions (PF+PT+TDS):</span>
                <span className="font-mono">-₹{totalDeductions.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl">
            <div className="text-[10px] text-indigo-300 uppercase font-semibold">Simulated Monthly Take-Home (Net)</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
              ₹{netMonthly.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
