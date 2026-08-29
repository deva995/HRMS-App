import React, { useState } from 'react';
import { MapPin, Plus, Shield, CheckCircle, Sliders, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Geofence, Organization } from '../../../types';
import { Modal } from '../../common/Modal';
import { GeofenceMap } from './GeofenceMap';
import { DisclaimerBanner } from '../../common/DisclaimerBanner';

export const GeofenceSettingsView: React.FC = () => {
  const { activeOrg, addGeofence, removeGeofence, updateAttendancePolicy } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [policy, setPolicy] = useState<Organization['attendancePolicy']>(activeOrg.attendancePolicy);
  const [policySaved, setPolicySaved] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 13.0489,
    longitude: 77.6200,
    radiusMeters: 300,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addGeofence({
      name: formData.name,
      address: formData.address,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      radiusMeters: Number(formData.radiusMeters),
    });
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      address: '',
      latitude: 13.0489,
      longitude: 77.6200,
      radiusMeters: 300,
    });
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateAttendancePolicy(policy);
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner type="geo_disclaimer" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Office Geofences List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Authorized Office Geofences</h3>
              <p className="text-xs text-slate-500">Configured premises perimeter for {activeOrg.name}</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Office Location</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeOrg.geofences.map((fence) => (
              <div
                key={fence.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {fence.name}
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {fence.radiusMeters}m Radius
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{fence.address}</p>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      Lat: {fence.latitude.toFixed(5)}, Lng: {fence.longitude.toFixed(5)}
                    </div>
                  </div>
                </div>

                {activeOrg.geofences.length > 1 && (
                  <button
                    onClick={() => removeGeofence(fence.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Delete Geofence"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Leaflet Map Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Live Perimeter Map Visualization
            </h4>
            <GeofenceMap geofences={activeOrg.geofences} height="280px" />
          </div>
        </div>

        {/* Attendance Enforcement Policy */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs h-fit space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" /> Out-of-Zone Clock Policy
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              How the app responds when an employee clocks in outside the geofence radius.
            </p>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-3 text-xs">
            <label className="block p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="policy"
                  value="block"
                  checked={policy === 'block'}
                  onChange={() => setPolicy('block')}
                  className="accent-indigo-600"
                />
                <span className="font-bold text-slate-900">Strict: Block Out-of-Zone Punches</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5">
                Punches outside allowed geofence perimeter are rejected immediately.
              </p>
            </label>

            <label className="block p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="policy"
                  value="approval_required"
                  checked={policy === 'approval_required'}
                  onChange={() => setPolicy('approval_required')}
                  className="accent-indigo-600"
                />
                <span className="font-bold text-slate-900">Manager Approval Required</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5">
                Allows punch but creates a pending regularization task for team manager.
              </p>
            </label>

            <label className="block p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="policy"
                  value="allow_with_warning"
                  checked={policy === 'allow_with_warning'}
                  onChange={() => setPolicy('allow_with_warning')}
                  className="accent-indigo-600"
                />
                <span className="font-bold text-slate-900">Flexible: Allow with Warning</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5">
                Records distance and device context for audit without blocking.
              </p>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all"
              >
                {policySaved ? 'Policy Updated in Memory!' : 'Save Enforcement Policy'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Geofence Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Authorized Office Geofence"
        subtitle={`Define office perimeter coordinates for ${activeOrg.name}`}
      >
        <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Premises / Campus Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Manyata Embassy Business Park Block C"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Postal Address</label>
            <input
              type="text"
              placeholder="e.g. Outer Ring Road, Nagavara, Bengaluru 560045"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Radius (Meters)</label>
              <input
                type="number"
                value={formData.radiusMeters}
                onChange={(e) => setFormData({ ...formData, radiusMeters: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Save Geofence
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
