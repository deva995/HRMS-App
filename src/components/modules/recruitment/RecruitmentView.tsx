import React from 'react';
import { LayoutDashboard, Columns3, Briefcase } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { RecruitmentDashboard } from './RecruitmentDashboard';
import { CandidateKanbanView } from './CandidateKanbanView';
import { JobPostingsView } from './JobPostingsView';

export const RecruitmentView: React.FC = () => {
  const { activeSubTab, setActiveSubTab, activeOrgCandidates } = useApp();

  const tabs = [
    { id: 'kanban', label: 'Candidate Pipeline (Kanban)', icon: <Columns3 className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Recruitment Analytics', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'jobs', label: 'Job Requisitions', icon: <Briefcase className="w-4 h-4" /> },
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
      {activeSubTab === 'kanban' && <CandidateKanbanView />}
      {activeSubTab === 'dashboard' && <RecruitmentDashboard />}
      {activeSubTab === 'jobs' && <JobPostingsView />}
    </div>
  );
};
