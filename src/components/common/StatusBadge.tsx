import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, size = 'sm' }) => {
  const getVariantClasses = () => {
    if (variant) {
      switch (variant) {
        case 'success':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'warning':
          return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'danger':
          return 'bg-rose-50 text-rose-700 border-rose-200';
        case 'info':
          return 'bg-sky-50 text-sky-700 border-sky-200';
        case 'purple':
          return 'bg-purple-50 text-purple-700 border-purple-200';
        default:
          return 'bg-slate-100 text-slate-700 border-slate-200';
      }
    }

    // Auto-detect by status string
    const s = status.toLowerCase();
    if (['active', 'approved', 'present', 'inside', 'completed', 'hired', 'published', 'verified', 'growth suite'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (['in progress', 'pending', 'under review', 'preview', 'screening', 'shortlisted', 'scheduled', 'warn', 'notice period'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (['outside', 'rejected', 'cancelled', 'late', 'absent', 'inactive', 'terminated', 'blocked', 'at risk', 'danger'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (['draft', 'not started', 'on leave', 'half_day', 'interview', 'technical', 'hr_round', 'offer'].includes(s)) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border whitespace-nowrap ${getVariantClasses()} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
