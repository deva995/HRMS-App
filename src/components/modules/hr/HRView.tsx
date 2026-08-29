import React from 'react';
import { LayoutDashboard, Users, Network, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { HRDashboard } from './HRDashboard';
import { EmployeeDirectory } from './EmployeeDirectory';
import { OrgStructureView } from './OrgStructureView';

export const HRView: React.FC = () => {
  const { activeSubTab, setActiveSubTab } = useApp();

  const tabs = [
    { id: 'directory', label: 'Employee Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'dashboard', label: 'HR Analytics', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'org_structure', label: 'Org Chart & Hierarchy', icon: <Network className="w-4 h-4" /> },
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
      {activeSubTab === 'directory' && <EmployeeDirectory />}
      {activeSubTab === 'dashboard' && <HRDashboard />}
      {activeSubTab === 'org_structure' && <OrgStructureView />}
    </div>
  );
};
