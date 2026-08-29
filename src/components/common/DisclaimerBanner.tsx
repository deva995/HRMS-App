import React from 'react';
import { AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface DisclaimerBannerProps {
  type: 'geo_disclaimer' | 'payroll_disclaimer' | 'prototype_notice' | 'rbac_notice';
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ type, className = '' }) => {
  if (type === 'geo_disclaimer') {
    return (
      <div className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs ${className}`}>
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Prototype Geolocation Notice: </span>
          Location is self-reported by the client device browser and not independently verified. In a production enterprise system, server-side IP cross-referencing, biometric clocks, or hardware beacon verification would be enforced.
        </div>
      </div>
    );
  }

  if (type === 'payroll_disclaimer') {
    return (
      <div className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs ${className}`}>
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-950">Illustrative Demo Calculations Only: </span>
          Payroll formulas here (PF ceiling, simplified PT, estimated TDS) are for UI demonstration only and are not statutory-compliant with Indian labor law or state-specific tax slabs.
        </div>
      </div>
    );
  }

  if (type === 'rbac_notice') {
    return (
      <div className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-purple-50/80 border border-purple-200/80 text-purple-900 text-xs ${className}`}>
        <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-purple-950">Simulated Access Control: </span>
          Roles and module visibility represent UI-level mock filtering only. No cryptographic tokens or backend auth gates are present in this client-side prototype.
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs ${className}`}>
      <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-slate-950">Frontend Prototype: </span>
        All changes persist in-memory for this browser session. Multi-tenant datasets are filtered client-side by organization ID.
      </div>
    </div>
  );
};
