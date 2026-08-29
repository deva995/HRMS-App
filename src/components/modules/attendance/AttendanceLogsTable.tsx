import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Laptop,
  AlertTriangle,
  FileEdit,
  CheckCircle,
  Filter,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AttendanceRecord } from '../../../types';
import { DataTable, Column } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';

export const AttendanceLogsTable: React.FC = () => {
  const { activeOrgAttendance, activeOrgEmployees, requestAttendanceRegularization, activeOrg } = useApp();

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [regularizeReason, setRegularizeReason] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !regularizeReason.trim()) return;

    requestAttendanceRegularization(selectedRecord.id, regularizeReason);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedRecord(null);
      setRegularizeReason('');
    }, 1500);
  };

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'employeeId',
      header: 'Employee & Code',
      sortable: true,
      render: (att) => {
        const emp = activeOrgEmployees.find((e) => e.id === att.employeeId);
        return (
          <div>
            <div className="font-bold text-slate-900">{emp?.name || 'Employee'}</div>
            <div className="text-[11px] text-slate-500 font-mono">{emp?.employeeCode || att.employeeId}</div>
          </div>
        );
      },
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (att) => (
        <div>
          <span className="font-semibold text-slate-800">{att.date}</span>
          <div className="text-[10px] text-slate-400 font-medium">Standard Day Shift</div>
        </div>
      ),
    },
    {
      key: 'clockInTime',
      header: 'Punch In / Out',
      render: (att) => (
        <div>
          <div className="text-slate-900 font-medium">
            In: <strong className="text-indigo-700">{att.clockInTime || '—'}</strong>
          </div>
          <div className="text-[11px] text-slate-500">
            Out: {att.clockOutTime ? <strong className="text-slate-700">{att.clockOutTime}</strong> : 'Pending'}
          </div>
        </div>
      ),
    },
    {
      key: 'workingHours',
      header: 'Hours Worked',
      sortable: true,
      render: (att) => (
        <span className="font-mono text-slate-800 font-semibold">
          {att.workingHours ? `${att.workingHours} hrs` : 'In Progress'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (att) => <StatusBadge status={att.status.toUpperCase()} />,
    },
    {
      key: 'location',
      header: 'Geofence Verification',
      render: (att) => {
        if (!att.location) return <span className="text-slate-400 text-[11px]">No GPS Signal</span>;
        const isInside = att.location.status === 'inside';
        return (
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isInside ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                }`}
              />
              <span
                className={`font-semibold text-[11px] ${
                  isInside ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isInside ? 'Inside Office Geofence' : `Out of Zone (${att.location.distanceMeters}m)`}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[160px]">
              Accuracy: ±{att.location.accuracyMeters || 15}m • {att.location.deviceUserAgent?.substring(0, 20) || 'Browser'}...
            </div>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Regularization',
      render: (att) => {
        if (att.regularizationStatus) {
          return (
            <StatusBadge
              status={
                att.regularizationStatus === 'pending'
                  ? 'Review Pending'
                  : att.regularizationStatus === 'approved'
                  ? 'Regularized'
                  : 'Rejected'
              }
            />
          );
        }
        return (
          <button
            onClick={() => setSelectedRecord(att)}
            className="p-1.5 rounded-md hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-[11px]"
            title="Request attendance regularization / punch correction"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Regularize</span>
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DisclaimerBanner type="geo_disclaimer" />

      <DataTable
        data={activeOrgAttendance}
        columns={columns}
        searchPlaceholder="Search punches by employee, date, or status..."
        filename={`Attendance_Logs_${activeOrg.code}`}
        pageSize={8}
      />

      {/* Regularization Modal */}
      <Modal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        title="Request Attendance Regularization"
        subtitle={`Submit a punch discrepancy review for ${selectedRecord?.employeeName} on ${selectedRecord?.date}`}
      >
        <form onSubmit={handleRegularizeSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">{selectedRecord?.employeeName}</div>
            <div className="text-slate-500">
              Punch Recorded: {selectedRecord?.clockInTime} | Status: {selectedRecord?.status}
            </div>
            {selectedRecord?.location && (
              <div className="text-[11px] text-amber-700">
                Location Distance: {selectedRecord.location.distanceMeters} meters from geofence
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason for Punch Correction / Out-of-Zone Work *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Client site meeting at Whitefield, biometric device glitch, or approved WFH..."
              value={regularizeReason}
              onChange={(e) => setRegularizeReason(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {isSuccess ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Regularization request submitted for manager approval!</span>
            </div>
          ) : (
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Submit Request
              </button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
