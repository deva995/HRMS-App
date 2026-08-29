import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { StatusBadge } from '../../common/StatusBadge';

export const AttendanceCalendarView: React.FC = () => {
  const { activeOrgEmployees, activeOrgAttendance } = useApp();
  const [selectedEmpId, setSelectedEmpId] = useState<string>(activeOrgEmployees[0]?.id || 'emp-101');
  const [currentMonth, setCurrentMonth] = useState<number>(3); // 0-indexed, 3 = April
  const [currentYear, setCurrentYear] = useState<number>(2026);

  const selectedEmployee = activeOrgEmployees.find((e) => e.id === selectedEmpId) || activeOrgEmployees[0];

  // Generate days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getDayStatus = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(currentYear, currentMonth, day);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { type: 'weekend', label: 'Weekend Off', color: 'bg-slate-100 text-slate-400 border-slate-200' };
    }

    const rec = activeOrgAttendance.find((a) => a.employeeId === selectedEmpId && a.date === formattedDate);
    if (!rec) {
      // If past date in current month, mark present or leave
      if (day <= 15) {
        return { type: 'present', label: 'Present (09:02 - 18:05)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' };
      }
      return { type: 'scheduled', label: 'Working Day (Scheduled)', color: 'bg-white text-slate-600 border-slate-200' };
    }

    if (rec.status === 'present') {
      return { type: 'present', label: `Present (${rec.clockInTime} - ${rec.clockOutTime || '18:00'})`, color: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' };
    }
    if (rec.status === 'late') {
      return { type: 'late', label: `Late Arrival (${rec.clockInTime})`, color: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold' };
    }
    if (rec.status === 'out_of_zone') {
      return { type: 'out_of_zone', label: `Out of Zone Punch (${rec.location?.distanceMeters}m)`, color: 'bg-rose-50 text-rose-800 border-rose-200 font-semibold' };
    }
    return { type: 'absent', label: 'Absent / On Leave', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-900 focus:outline-hidden"
            >
              {activeOrgEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth((m) => (m === 0 ? 11 : m - 1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-900 w-32 text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={() => setCurrentMonth((m) => (m === 11 ? 0 : m + 1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 bg-slate-50/50 rounded-lg border border-dashed border-slate-100" />
          ))}

          {/* Actual days */}
          {days.map((day) => {
            const status = getDayStatus(day);
            return (
              <div
                key={`day-${day}`}
                className={`h-20 p-2 rounded-lg border flex flex-col justify-between transition-all hover:shadow-2xs ${status.color}`}
              >
                <div className="font-bold text-xs">{day}</div>
                <div className="text-[10px] leading-tight line-clamp-2">{status.label}</div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200"></span>
            <span>Present (On-Time)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200"></span>
            <span>Late Arrival</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-50 border border-rose-200"></span>
            <span>Out of Zone / Discrepancy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></span>
            <span>Weekend Off</span>
          </div>
        </div>
      </div>
    </div>
  );
};
