import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Users,
  Calendar,
  IndianRupee,
  Download,
  FileSpreadsheet,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PayrollRecord } from '../../../types';
import { exportToCsv } from '../../../utils/csvExporter';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';

interface PayrollProcessingWizardProps {
  onComplete: () => void;
}

export const PayrollProcessingWizard: React.FC<PayrollProcessingWizardProps> = ({ onComplete }) => {
  const { activeOrg, activeOrgEmployees, processPayrollRun, salaryConfig } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>('April');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedRunId, setProcessedRunId] = useState<string | null>(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Calculate totals for preview
  const eligibleEmployees = activeOrgEmployees.filter(
    (e) => e.employmentStatus === 'Active' || (e as any).status === 'active'
  );

  const totalGross = eligibleEmployees.reduce((acc, emp) => {
    const gross = emp.salaryDisplay?.grossMonthly || (emp.salaryDisplay?.annualCtc ? Math.round(emp.salaryDisplay.annualCtc / 12) : 150000);
    return acc + gross;
  }, 0);

  const totalDeductions = eligibleEmployees.reduce((acc, emp) => {
    const gross = emp.salaryDisplay?.grossMonthly || 150000;
    const basic = Math.round((gross * (salaryConfig?.basicPercentageOfGross || 50)) / 100);
    const pfCeiling = salaryConfig?.pfCeilingLimit || 15000;
    const pfRate = salaryConfig?.pfRatePercentage || 12;
    const pf = Math.round((Math.min(basic, pfCeiling) * pfRate) / 100);
    const pt = salaryConfig?.professionalTaxFixed || 200;
    const tax = Math.round((gross * (salaryConfig?.estimatedTdsPercentage || 10)) / 100);
    return acc + pf + pt + tax;
  }, 0);

  const totalNet = totalGross - totalDeductions;

  const handleExecutePayroll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const run = processPayrollRun(selectedMonth, selectedYear);
      setProcessedRunId(run.id);
      setIsProcessing(false);
      setStep(4);
    }, 600);
  };

  const handleDownloadBankTransferCsv = () => {
    const bankRows = eligibleEmployees.map((emp) => {
      const gross = emp.salaryDisplay?.grossMonthly || 150000;
      const basic = Math.round((gross * (salaryConfig?.basicPercentageOfGross || 50)) / 100);
      const pfCeiling = salaryConfig?.pfCeilingLimit || 15000;
      const pfRate = salaryConfig?.pfRatePercentage || 12;
      const pf = Math.round((Math.min(basic, pfCeiling) * pfRate) / 100);
      const pt = salaryConfig?.professionalTaxFixed || 200;
      const tax = Math.round((gross * (salaryConfig?.estimatedTdsPercentage || 10)) / 100);
      const net = gross - (pf + pt + tax);

      return {
        beneficiary_name: emp.name,
        employee_code: emp.employeeCode,
        account_number: (emp.bankDetailsMasked || '•••• •••• 4821').replace(/[^\d•]/g, '') || '••••4821',
        ifsc_code: 'HDFC0001824',
        net_amount: net,
        currency: 'INR',
        narration: `Salary ${selectedMonth} ${selectedYear}`,
      };
    });

    exportToCsv(`Bank_Disbursement_${selectedMonth}_${selectedYear}_${activeOrg.code}`, bankRows, [
      { key: 'beneficiary_name', label: 'Beneficiary Name' },
      { key: 'employee_code', label: 'Employee ID' },
      { key: 'account_number', label: 'Bank Account' },
      { key: 'ifsc_code', label: 'IFSC Code' },
      { key: 'net_amount', label: 'Net Disbursed (INR)' },
      { key: 'narration', label: 'Payment Narration' },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Wizard Progress Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Payroll Processing Run</h3>
            <p className="text-xs text-slate-500">
              Interactive 4-step wizard to compute, verify, and disburse payroll for {activeOrg.name}
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                    step === s
                      ? 'bg-indigo-600 text-white font-bold'
                      : step > s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 4 && <div className={`w-4 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <DisclaimerBanner type="payroll_disclaimer" className="mb-5" />

        {/* STEP 1: Select Pay Period & Review Headcount */}
        {step === 1 && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Pay Month *</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-hidden"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Financial Year *</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-hidden"
                >
                  <option value={2026}>2026 (FY 2025-26)</option>
                  <option value={2025}>2025 (FY 2024-25)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Active Headcount Included in Batch: {eligibleEmployees.length} Employees</span>
              </div>
              <p className="text-slate-500">
                All active and notice-period staff assigned to {activeOrg.name} will have their salary calculated in this batch.
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                <span>Continue to Attendance Reconciliation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Attendance Reconciliation */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-indigo-950">Loss of Pay (LOP) & Working Days Check</h4>
                <p className="text-indigo-800 text-[11px]">
                  Standard Working Days: 22 Days. Unpaid absences and out-of-zone discrepancies have been reconciled.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                100% Reconciled
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-2">Employee</th>
                    <th className="px-4 py-2">Working Days</th>
                    <th className="px-4 py-2">Days Present</th>
                    <th className="px-4 py-2">LOP Days</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eligibleEmployees.slice(0, 6).map((emp, idx) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-900">{emp.name}</td>
                      <td className="px-4 py-2.5 text-slate-600">22</td>
                      <td className="px-4 py-2.5 text-slate-600">{idx === 2 ? 21 : 22}</td>
                      <td className="px-4 py-2.5 font-semibold text-amber-600">{idx === 2 ? 1 : 0}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                          Ready
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                <span>Review Batch Numbers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Earnings & Deductions Batch Review */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Gross Salary</div>
                <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                  ₹{totalGross.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Statutory Deductions</div>
                <div className="text-xl font-bold text-rose-600 font-mono mt-1">
                  ₹{totalDeductions.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="text-[11px] text-indigo-900 font-semibold uppercase">Total Net Disbursement</div>
                <div className="text-xl font-bold text-indigo-700 font-mono mt-1">
                  ₹{totalNet.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Batch Approval & Disburse Authorization</div>
                <div className="text-xs text-slate-400">
                  Ready to process {eligibleEmployees.length} salary slips for {selectedMonth} {selectedYear}
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecutePayroll}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isProcessing ? 'Processing Batch...' : 'Authorize & Disburse'}</span>
              </button>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success & Export */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Payroll Disbursed Successfully for {selectedMonth} {selectedYear}!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                All employee payslips have been generated in-memory and are available in the Payroll History & Payslip download tab.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadBankTransferCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Download Bank NEFT / NACH CSV</span>
              </button>

              <button
                type="button"
                onClick={onComplete}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xs"
              >
                <span>View Generated Payslips</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
