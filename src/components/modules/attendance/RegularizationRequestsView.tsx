import React from 'react';
import { Check, X, Clock, MapPin, UserCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AttendanceRecord } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';

export const RegularizationRequestsView: React.FC = () => {
  const { activeOrgAttendance, resolveAttendanceRegularization } = useApp();

  const requests = activeOrgAttendance.filter((a) => Boolean(a.regularizationStatus));

  return (
    <div className="space-y-4">
      <DisclaimerBanner type="geo_disclaimer" />

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Attendance Regularization & Punch Exceptions
            </h3>
            <p className="text-xs text-slate-500">
              Review employee punch correction requests and out-of-zone approvals.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {requests.filter((r) => r.regularizationStatus === 'pending').length} Pending Action
          </span>
        </div>

        {requests.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {requests.map((rec) => (
              <div key={rec.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rec.employeeName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{rec.employeeCode}</span>
                    <StatusBadge
                      status={
                        rec.regularizationStatus === 'pending'
                          ? 'Review Pending'
                          : rec.regularizationStatus === 'approved'
                          ? 'Approved'
                          : 'Rejected'
                      }
                    />
                  </div>

                  <div className="text-slate-600 flex items-center gap-3 text-[11px]">
                    <span>Date: <strong className="text-slate-800">{rec.date}</strong></span>
                    <span>•</span>
                    <span>Punch Time: <strong className="text-indigo-700">{rec.clockInTime}</strong></span>
                    {rec.location && (
                      <>
                        <span>•</span>
                        <span className="text-rose-600 font-medium">
                          Distance: {rec.location.distanceMeters}m from office
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1 italic">
                    "{rec.regularizationReason || 'Location anomaly correction'}"
                  </p>
                </div>

                {rec.regularizationStatus === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => resolveAttendanceRegularization(rec.id, false, 'Rejected by manager')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => resolveAttendanceRegularization(rec.id, true, 'Approved by manager')}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No attendance regularization requests at this moment.
          </div>
        )}
      </div>
    </div>
  );
};
