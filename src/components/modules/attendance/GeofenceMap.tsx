import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Geofence, AttendanceLocation } from '../../../types';

// Fix Leaflet's default icon assets URL in bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userInsideIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #10b981; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const userOutsideIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #f43f5e; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(244, 63, 94, 0.6); animation: pulse 1.5s infinite;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

interface GeofenceMapProps {
  geofences: Geofence[];
  currentLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    status?: 'inside' | 'outside' | 'unavailable';
  } | null;
  height?: string;
  className?: string;
  recentLocations?: AttendanceLocation[];
}

export const GeofenceMap: React.FC<GeofenceMapProps> = ({
  geofences,
  currentLocation,
  height = '360px',
  className = '',
  recentLocations = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center to primary geofence or India center
    const centerLat = geofences[0]?.latitude || 13.0489;
    const centerLng = geofences[0]?.longitude || 77.6200;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing overlay layers (except tileLayer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    const bounds = L.latLngBounds([]);

    // Draw configured geofences
    geofences.forEach((fence) => {
      const circle = L.circle([fence.latitude, fence.longitude], {
        color: '#6366f1',
        fillColor: '#818cf8',
        fillOpacity: 0.2,
        radius: fence.radiusMeters,
        weight: 2,
      }).addTo(map);

      const marker = L.marker([fence.latitude, fence.longitude], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="color: #1e293b; font-size: 13px;">${fence.name}</strong><br/>
            <span style="color: #64748b;">Radius: ${fence.radiusMeters} meters</span><br/>
            <span style="color: #475569; font-size: 11px;">${fence.address}</span>
          </div>
        `);

      bounds.extend([fence.latitude, fence.longitude]);
    });

    // Draw recent punches
    recentLocations.forEach((loc) => {
      const isInside = loc.status === 'inside';
      L.circleMarker([loc.latitude, loc.longitude], {
        radius: 6,
        fillColor: isInside ? '#10b981' : '#f43f5e',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px;">
            <strong>Clock-In Punch</strong><br/>
            Status: <span style="color: ${isInside ? '#10b981' : '#f43f5e'}">${loc.status.toUpperCase()}</span><br/>
            Distance to fence: ${loc.distanceMeters}m<br/>
            Time: ${new Date(loc.timestamp).toLocaleTimeString()}
          </div>
        `);
      bounds.extend([loc.latitude, loc.longitude]);
    });

    // Draw current active user location if present
    if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
      const isInside = currentLocation.status === 'inside';
      const userMarker = L.marker([currentLocation.latitude, currentLocation.longitude], {
        icon: isInside ? userInsideIcon : userOutsideIcon,
        zIndexOffset: 1000,
      }).addTo(map).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px;">
          <strong style="color: #0f172a;">Your Current Position</strong><br/>
          Status: <span style="font-weight: bold; color: ${isInside ? '#059669' : '#e11d48'}">${isInside ? 'Inside Authorized Geofence' : 'Outside Office Geofence'}</span><br/>
          Lat: ${currentLocation.latitude.toFixed(5)}, Lng: ${currentLocation.longitude.toFixed(5)}<br/>
          Accuracy: ~${currentLocation.accuracy || 15} meters
        </div>
      `);

      bounds.extend([currentLocation.latitude, currentLocation.longitude]);
      userMarker.openPopup();
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }

    // Leaflet container resize trigger
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      // Keep map instance alive or cleanup
    };
  }, [geofences, currentLocation, recentLocations]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-inner ${className}`}>
      <div ref={mapContainerRef} style={{ width: '100%', height }} className="z-10" />
      <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-slate-600 border border-slate-200 flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Geofence Perimeter
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Authorized Punch
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span> Out-of-Zone Punch
        </span>
      </div>
    </div>
  );
};
