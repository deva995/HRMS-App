import React, { useState } from 'react';
import { LayoutDashboard, PlayCircle, History, Sliders, IndianRupee } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PayrollDashboard } from './PayrollDashboard';
import { PayrollProcessingWizard } from './PayrollProcessingWizard';
import { PayrollHistoryTable } from './PayrollHistoryTable';
import { SalaryStructureConfig } from './SalaryStructureConfig';

export const PayrollView: React.FC = () => {
  const { activeSubTab, setActiveSubTab } = useApp();

  const tabs = [
    { id: 'overview', label: 'Payroll Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'processing', label: 'Process Payroll Run', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'history', label: 'Payslips & History', icon: <History className="w-4 h-4" /> },
    { id: 'structure', label: 'Salary Rules & Tax', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs font-semibold transition-all ${
                activeSubTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'overview' && (
        <PayrollDashboard onStartProcessing={() => setActiveSubTab('processing')} />
      )}
      {activeSubTab === 'processing' && (
        <PayrollProcessingWizard onComplete={() => setActiveSubTab('history')} />
      )}
      {activeSubTab === 'history' && <PayrollHistoryTable />}
      {activeSubTab === 'structure' && <SalaryStructureConfig />}
    </div>
  );
};
