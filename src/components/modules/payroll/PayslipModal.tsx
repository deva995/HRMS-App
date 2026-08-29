import React from 'react';
import { Download, IndianRupee, FileText, CheckCircle2, Building, ShieldAlert } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Payslip } from '../../../types';
import { Modal } from '../../common/Modal';
import { StatusBadge } from '../../common/StatusBadge';
import { generatePayslipPdf } from '../../../utils/pdfGenerator';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';

interface PayslipModalProps {
  record: Payslip | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ record, isOpen, onClose }) => {
  const { activeOrg, activeOrgEmployees } = useApp();

  if (!record || !isOpen) return null;

  const emp = activeOrgEmployees.find((e) => e.id === record.employeeId) || activeOrgEmployees[0];

  const handleDownloadPdf = () => {
    if (emp) generatePayslipPdf(record, emp, activeOrg);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payslip — ${record.month} ${record.year}`}
      subtitle={`${emp?.name || 'Employee'} (${emp?.employeeCode || record.employeeId})`}
      maxWidth="3xl"
    >
      <div className="space-y-4 text-xs">
        {/* Compliance disclaimer */}
        <DisclaimerBanner type="payroll_disclaimer" />

        {/* Payslip Card Sheet */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-5 shadow-xs">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeOrg.logo}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeOrg.name}</h3>
                  <p className="text-slate-500 text-[11px]">{activeOrg.headquarters}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-indigo-700 font-mono">
                {record.month.toUpperCase()} {record.year}
              </div>
              <StatusBadge status="PROCESSED" />
            </div>
          </div>

          {/* Employee & Bank Info Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Employee Name</div>
              <div className="font-bold text-slate-900 mt-0.5">{emp?.name || 'Employee'}</div>
              <div className="text-[11px] text-slate-500 font-mono">{emp?.employeeCode || record.employeeId}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Email & Phone</div>
              <div className="font-semibold text-slate-900 mt-0.5">{emp?.email}</div>
              <div className="text-[11px] text-slate-500">{emp?.phone}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Bank Details</div>
              <div className="font-mono text-slate-900 mt-0.5">{record.bankNameMasked}</div>
              <div className="text-[11px] text-slate-500">{record.paymentMode}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Pay Period Status</div>
              <div className="font-bold text-emerald-700 mt-0.5">
                Paid & Disbursed
              </div>
              <div className="text-[11px] text-slate-500">{record.generatedAt}</div>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-3.5 py-2 font-bold text-slate-800 border-b border-slate-200 text-xs flex justify-between">
                <span>Earnings Breakdown</span>
                <span>Amount (INR)</span>
              </div>
              <div className="p-3 space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{record.basic.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{record.hra.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-600">Special Allowances</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{record.specialAllowances.toLocaleString('en-IN')}
                  </span>
                </div>
                {record.performanceBonus > 0 && (
                  <div className="flex justify-between pt-2 text-emerald-700 font-medium">
                    <span>Performance Bonus</span>
                    <span className="font-bold font-mono">₹{record.performanceBonus.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 font-bold text-slate-900 border-t border-slate-200 bg-slate-50/50 -mx-3 -mb-3 p-3">
                  <span>Gross Earnings</span>
                  <span className="font-mono">₹{record.grossEarnings.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-3.5 py-2 font-bold text-slate-800 border-b border-slate-200 text-xs flex justify-between">
                <span>Deductions & Taxes</span>
                <span>Amount (INR)</span>
              </div>
              <div className="p-3 space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Provident Fund (Employee EPF)</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{record.providentFund.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-600">Professional Tax (PT)</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{record.professionalTax.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-600">Income Tax (TDS Estimated)</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₹{record.taxDeductedAtSource.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-3 font-bold text-slate-900 border-t border-slate-200 bg-slate-50/50 -mx-3 -mb-3 p-3">
                  <span>Total Deductions</span>
                  <span className="font-mono text-rose-600">₹{record.totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-md">
            <div>
              <div className="text-xs text-indigo-200 font-semibold">Net Payout Transferred</div>
              <div className="text-2xl font-bold font-mono tracking-tight mt-0.5">
                ₹{record.netPayable.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              Disbursed Date: <span className="text-white font-medium">{record.generatedAt}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Payslip PDF</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
