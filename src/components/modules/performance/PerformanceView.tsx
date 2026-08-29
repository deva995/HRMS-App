import React from 'react';
import { LayoutDashboard, Target, Star, BarChart3 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PerformanceDashboard } from './PerformanceDashboard';
import { GoalManagementView } from './GoalManagementView';
import { PerformanceReviewsView } from './PerformanceReviewsView';
import { PerformanceAnalyticsView } from './PerformanceAnalyticsView';

export const PerformanceView: React.FC = () => {
  const { activeSubTab, setActiveSubTab, activeOrgReviews } = useApp();

  const pendingReviews = activeOrgReviews.filter((r) => r.status !== 'completed').length;

  const tabs = [
    { id: 'dashboard', label: 'Performance Analytics', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'goals', label: 'Objectives & OKRs', icon: <Target className="w-4 h-4" /> },
    {
      id: 'reviews',
      label: '360° Appraisals',
      icon: <Star className="w-4 h-4" />,
      badge: pendingReviews > 0 ? pendingReviews : undefined,
    },
    { id: 'nine_box', label: '9-Box Talent Matrix', icon: <BarChart3 className="w-4 h-4" /> },
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
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'dashboard' && <PerformanceDashboard />}
      {activeSubTab === 'goals' && <GoalManagementView />}
      {activeSubTab === 'reviews' && <PerformanceReviewsView />}
      {activeSubTab === 'nine_box' && <PerformanceAnalyticsView />}
    </div>
  );
};
