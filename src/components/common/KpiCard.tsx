import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon: ReactNode;
  iconBgColor?: string;
  badge?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = 'bg-indigo-50 text-indigo-600',
  badge,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
        {subtitle && <span>{subtitle}</span>}
        {trend && (
          <div
            className={`flex items-center font-medium ${
              trend.isNeutral
                ? 'text-slate-500'
                : trend.isPositive
                ? 'text-emerald-600'
                : 'text-rose-600'
            }`}
          >
            {trend.isNeutral ? (
              <Minus className="w-3.5 h-3.5 mr-1" />
            ) : trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
