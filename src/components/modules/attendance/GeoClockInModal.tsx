import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, CheckCircle, Clock, ShieldAlert, Laptop } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Modal } from '../../common/Modal';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';
import { StatusBadge } from '../../common/StatusBadge';
import { GeofenceMap } from './GeofenceMap';
import { getCurrentBrowserPosition, evaluateGeofenceStatus } from '../../../utils/geoUtils';

interface GeoClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeoClockInModal: React.FC<GeoClockInModalProps> = ({ isOpen, onClose }) => {
  const {
    activeOrg,
    activeOrgEmployees,
    clockInWithLocation,
    clockOut,
    activeOrgAttendance,
  } = useApp();

  // Pick demo active employee (e.g. first employee or someone selected)
  const [selectedEmpId, setSelectedEmpId] = useState<string>(activeOrgEmployees[0]?.id || 'emp-101');
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Position state
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>({
    latitude: activeOrg.geofences[0]?.latitude || 13.0489,
    longitude: activeOrg.geofences[0]?.longitude || 77.6200,
    accuracy: 15,
  });

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  const selectedEmployee = activeOrgEmployees.find((e) => e.id === selectedEmpId) || activeOrgEmployees[0];
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = activeOrgAttendance.find((a) => a.employeeId === selectedEmpId && a.date === today);

  // Evaluate current coordinates against organization geofences
  const geoEvaluation = currentCoords
    ? evaluateGeofenceStatus(currentCoords.latitude, currentCoords.longitude, activeOrg.geofences)
    : null;

  // Real Browser Geolocation API
  const handleRequestBrowserLocation = async () => {
    setIsFetchingGps(true);
    setErrorMsg(null);
    try {
      const pos = await getCurrentBrowserPosition();
      setCurrentCoords({
        latitude: pos.latitude,
        longitude: pos.longitude,
        accuracy: pos.accuracy,
      });
      setFeedback({
        type: 'success',
        message: `Retrieved device GPS coordinates (Accuracy: ±${pos.accuracy}m).`,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not fetch device geolocation.');
    } finally {
      setIsFetchingGps(false);
    }
  };

  // Preset location simulations for easy demo testing
  const handleSetPresetLocation = (preset: 'inside' | 'outside' | 'remote') => {
    setErrorMsg(null);
    const defaultFence = activeOrg.geofences[0];
    if (preset === 'inside' && defaultFence) {
      // 30m from center
      setCurrentCoords({
        latitude: defaultFence.latitude + 0.0002,
        longitude: defaultFence.longitude + 0.0001,
        accuracy: 10,
      });
      setFeedback({ type: 'success', message: 'Simulated position: Inside Office Campus perimeter.' });
    } else if (preset === 'outside' && defaultFence) {
      // 14km away (e.g. from home / cafe)
      setCurrentCoords({
        latitude: defaultFence.latitude - 0.125,
        longitude: defaultFence.longitude - 0.095,
        accuracy: 25,
      });
      setFeedback({ type: 'warning', message: 'Simulated position: 14.5 km away from Office (Outside Geofence).' });
    } else if (preset === 'remote') {
      setCurrentCoords({
        latitude: 12.9352,
        longitude: 77.6245,
        accuracy: 30,
      });
      setFeedback({ type: 'warning', message: 'Simulated position: Remote Work Location (Koramangala).' });
    }
  };

  const handleClockIn = () => {
    if (!selectedEmpId || !currentCoords) return;
    const res = clockInWithLocation(
      selectedEmpId,
      currentCoords,
      navigator.userAgent
    );

    if (res.success) {
      setFeedback({
        type: res.status === 'inside' ? 'success' : 'warning',
        message: res.message,
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.message,
      });
    }
  };

  const handleClockOut = () => {
    if (!selectedEmpId) return;
    clockOut(selectedEmpId);
    setFeedback({
      type: 'success',
      message: 'Clock-out timestamp recorded successfully.',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Geo-Attendance Clock In / Out"
      subtitle={`Location-verified time tracking for ${activeOrg.name}`}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Security disclaimer banner */}
        <DisclaimerBanner type="geo_disclaimer" />

        {/* Employee Picker & Today's Punch Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Punching Employee:
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => {
                setSelectedEmpId(e.target.value);
                setFeedback(null);
              }}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            >
              {activeOrgEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Today's Attendance Status:
            </label>
            <div className="flex items-center gap-2 h-9 px-3 bg-white rounded-lg border border-slate-200 text-xs">
              {todayRecord ? (
                <>
                  <StatusBadge status={todayRecord.status.toUpperCase()} />
                  <span className="text-slate-600">
                    In: <strong className="text-slate-900">{todayRecord.clockInTime}</strong>
                    {todayRecord.clockOutTime && ` | Out: ${todayRecord.clockOutTime}`}
                  </span>
                </>
              ) : (
                <span className="text-slate-400">Not Clocked In Today</span>
              )}
            </div>
          </div>
        </div>

        {/* Geofence Detection Details Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Geofence Verification Signal
              </h4>
            </div>

            {geoEvaluation && (
              <StatusBadge
                status={
                  geoEvaluation.status === 'inside'
                    ? 'Inside Allowed Location'
                    : 'Outside Authorized Location'
                }
              />
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-[11px] text-slate-500">Nearest Office</div>
              <div className="font-semibold text-slate-900 truncate">
                {geoEvaluation?.nearestGeofence?.name || 'Main HQ'}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-[11px] text-slate-500">Distance to Office</div>
              <div className="font-semibold text-slate-900">
                {geoEvaluation?.distanceMeters || 0} meters
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-[11px] text-slate-500">Allowed Radius</div>
              <div className="font-semibold text-slate-900">
                {geoEvaluation?.nearestGeofence?.radiusMeters || 300} meters
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-[11px] text-slate-500">Org Policy</div>
              <div className="font-semibold text-slate-900 capitalize">
                {activeOrg.attendancePolicy.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Quick Simulation Buttons & Real GPS Fetcher */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => handleSetPresetLocation('inside')}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
              >
                In Office (35m)
              </button>
              <button
                type="button"
                onClick={() => handleSetPresetLocation('outside')}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
              >
                Out of Zone (14km)
              </button>
            </div>

            <button
              type="button"
              onClick={handleRequestBrowserLocation}
              disabled={isFetchingGps}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 ${isFetchingGps ? 'animate-spin' : ''}`} />
              <span>{isFetchingGps ? 'Requesting GPS...' : 'Use Real Device GPS'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Leaflet Map Preview */}
          <GeofenceMap
            geofences={activeOrg.geofences}
            currentLocation={
              currentCoords
                ? {
                    latitude: currentCoords.latitude,
                    longitude: currentCoords.longitude,
                    accuracy: currentCoords.accuracy,
                    status: geoEvaluation?.status,
                  }
                : null
            }
            height="220px"
          />

          {/* Device & UA Informational String */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
            <Laptop className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Client Device Agent: {navigator.userAgent}</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : feedback.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>

          {todayRecord && !todayRecord.clockOutTime && (
            <button
              type="button"
              onClick={handleClockOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Clock Out</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClockIn}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow-md transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Clock In Now</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
