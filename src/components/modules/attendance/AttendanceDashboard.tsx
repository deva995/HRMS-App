import React, { useState } from 'react';
import {
  MapPinCheckInside,
  Clock,
  AlertTriangle,
  Users,
  ShieldCheck,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../../context/AppContext';
import { KpiCard } from '../../common/KpiCard';
import { GeofenceMap } from './GeofenceMap';
import { GeoClockInModal } from './GeoClockInModal';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';

export const AttendanceDashboard: React.FC = () => {
  const { activeOrgAttendance, activeOrgEmployees, activeOrg } = useApp();
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);

  const totalEmployees = activeOrgEmployees.length;
  const presentCount = activeOrgAttendance.filter((a) => a.status === 'present').length;
  const lateCount = activeOrgAttendance.filter((a) => a.status === 'late').length;
  const outOfZoneCount = activeOrgAttendance.filter((a) => a.status === 'out_of_zone').length;
  const attendanceRate = totalEmployees > 0 ? (((presentCount + lateCount) / totalEmployees) * 100).toFixed(0) : '0';

  // 7-day attendance trend data
  const weeklyData = [
    { day: 'Mon', present: Math.max(1, presentCount - 2), late: 2, absent: 1 },
    { day: 'Tue', present: presentCount, late: 1, absent: 0 },
    { day: 'Wed', present: Math.max(1, presentCount - 1), late: 3, absent: 1 },
    { day: 'Thu', present: presentCount, late: lateCount, absent: 0 },
    { day: 'Fri', present: presentCount, late: 1, absent: 1 },
  ];

  // Geofence status distribution
  const geoData = [
    { name: 'Inside Geofence', value: presentCount + lateCount, color: '#10b981' },
    { name: 'Out of Zone', value: outOfZoneCount, color: '#f43f5e' },
  ];

  const recentPunchLocations = activeOrgAttendance
    .filter((a) => Boolean(a.location))
    .map((a) => a.location!);

  return (
    <div className="space-y-6">
      <DisclaimerBanner type="geo_disclaimer" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Today's Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle={`${presentCount + lateCount} / ${totalEmployees} Clocked In`}
          icon={<MapPinCheckInside className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-600"
          trend={{ value: 'Above target (90%)', isPositive: true }}
        />
        <KpiCard
          title="On-Time Arrivals"
          value={presentCount}
          subtitle="Within shift grace buffer"
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-indigo-50 text-indigo-600"
        />
        <KpiCard
          title="Late Arrivals"
          value={lateCount}
          subtitle="After 09:15 AM IST"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title="Out-of-Zone Punches"
          value={outOfZoneCount}
          subtitle="Outside configured radius"
          icon={<MapPin className="w-5 h-5" />}
          iconBgColor="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Analytics Charts & Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Stacked Bar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Weekly Attendance & Punctuality Trend</h4>
              <p className="text-xs text-slate-500">Present vs. Late vs. Absent daily volume</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="present" fill="#10b981" name="On-Time Present" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" name="Late Arrival" stackId="a" />
                <Bar dataKey="absent" fill="#f43f5e" name="Absent" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Punch Geofence Map */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Live Campus Perimeter</h4>
              <button
                onClick={() => setIsGeoModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md border border-indigo-200"
              >
                Test Punch
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-2">{activeOrg.geofences[0]?.name || 'HQ Campus'}</p>
          </div>

          <GeofenceMap
            geofences={activeOrg.geofences}
            recentLocations={recentPunchLocations}
            height="210px"
          />
        </div>
      </div>

      <GeoClockInModal isOpen={isGeoModalOpen} onClose={() => setIsGeoModalOpen(false)} />
    </div>
  );
};
