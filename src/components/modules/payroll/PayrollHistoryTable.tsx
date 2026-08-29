import React, { useState } from 'react';
import { Eye, Download, FileText, IndianRupee, Calendar } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Payslip } from '../../../types';
import { DataTable, Column } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';
import { PayslipModal } from './PayslipModal';
import { generatePayslipPdf } from '../../../utils/pdfGenerator';

export const PayrollHistoryTable: React.FC = () => {
  const { activeOrgPayroll, activeOrgEmployees, activeOrg } = useApp();
  const [selectedRecord, setSelectedRecord] = useState<Payslip | null>(null);

  const columns: Column<Payslip>[] = [
    {
      key: 'employeeId',
      header: 'Employee & Code',
      sortable: true,
      render: (rec) => {
        const emp = activeOrgEmployees.find((e) => e.id === rec.employeeId);
        return (
          <div>
            <div
              onClick={() => setSelectedRecord(rec)}
              className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
            >
              {emp?.name || 'Employee'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">{emp?.employeeCode || rec.employeeId}</div>
          </div>
        );
      },
    },
    {
      key: 'month',
      header: 'Pay Period',
      sortable: true,
      render: (rec) => (
        <span className="font-semibold text-slate-800">
          {rec.month} {rec.year}
        </span>
      ),
    },
    {
      key: 'grossEarnings',
      header: 'Gross Salary',
      sortable: true,
      render: (rec) => (
        <span className="font-mono font-medium text-slate-700">
          ₹{rec.grossEarnings.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'totalDeductions',
      header: 'Total Deductions',
      render: (rec) => (
        <span className="font-mono text-rose-600 font-medium">
          -₹{rec.totalDeductions.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'netPayable',
      header: 'Net Take-Home',
      sortable: true,
      render: (rec) => (
        <span className="font-mono font-bold text-emerald-700">
          ₹{rec.netPayable.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'paymentMode',
      header: 'Status',
      render: () => <StatusBadge status="PROCESSED" />,
    },
    {
      key: 'id',
      header: 'Payslip',
      render: (rec) => {
        const emp = activeOrgEmployees.find((e) => e.id === rec.employeeId) || activeOrgEmployees[0];
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedRecord(rec)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
              title="View Payslip"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (emp) generatePayslipPdf(rec, emp, activeOrg);
              }}
              className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={activeOrgPayroll}
        columns={columns}
        searchPlaceholder="Search payslips by employee name, ID, or month..."
        filename={`Payroll_Register_${activeOrg.code}`}
        pageSize={8}
      />

      <PayslipModal
        record={selectedRecord}
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
