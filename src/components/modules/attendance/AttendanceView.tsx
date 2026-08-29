import React from 'react';
import { LayoutDashboard, List, Calendar, Sliders, CheckSquare } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AttendanceDashboard } from './AttendanceDashboard';
import { AttendanceLogsTable } from './AttendanceLogsTable';
import { AttendanceCalendarView } from './AttendanceCalendarView';
import { GeofenceSettingsView } from './GeofenceSettingsView';
import { RegularizationRequestsView } from './RegularizationRequestsView';

export const AttendanceView: React.FC = () => {
  const { activeSubTab, setActiveSubTab, activeOrgAttendance } = useApp();

  const pendingReqs = activeOrgAttendance.filter((a) => a.regularizationStatus === 'pending').length;

  const tabs = [
    { id: 'dashboard', label: 'Attendance Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'logs', label: 'Daily Punch Logs', icon: <List className="w-4 h-4" /> },
    { id: 'calendar', label: 'Monthly Calendar', icon: <Calendar className="w-4 h-4" /> },
    {
      id: 'regularization',
      label: 'Regularization Requests',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingReqs > 0 ? pendingReqs : undefined,
    },
    { id: 'geofence', label: 'Geofences & Policy', icon: <Sliders className="w-4 h-4" /> },
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
      {activeSubTab === 'dashboard' && <AttendanceDashboard />}
      {activeSubTab === 'logs' && <AttendanceLogsTable />}
      {activeSubTab === 'calendar' && <AttendanceCalendarView />}
      {activeSubTab === 'regularization' && <RegularizationRequestsView />}
      {activeSubTab === 'geofence' && <GeofenceSettingsView />}
    </div>
  );
};
