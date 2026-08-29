import React from 'react';
import { Sparkles, Users, Award, TrendingUp } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const PerformanceAnalyticsView: React.FC = () => {
  const { activeOrgEmployees, activeOrg } = useApp();

  // 9-Box Talent Matrix grid positions
  const nineBox = [
    { title: 'High Potential / High Perf (Star)', count: 4, desc: 'Future C-suite & VP successors', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { title: 'High Potential / Medium Perf (Growth)', count: 3, desc: 'High upside, needs stretch goals', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { title: 'High Potential / Low Perf (Enigma)', count: 1, desc: 'Wrong role or onboarding gap', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { title: 'Med Potential / High Perf (Core Star)', count: 5, desc: 'Key domain subject matter experts', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { title: 'Med Potential / Med Perf (Core Contributor)', count: 8, desc: 'Consistent reliable backbone', color: 'bg-slate-50 text-slate-800 border-slate-200' },
    { title: 'Med Potential / Low Perf (Dilemma)', count: 2, desc: 'Needs targeted coaching / PIP', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { title: 'Low Potential / High Perf (Trusted Pro)', count: 3, desc: 'Experienced execution focus', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { title: 'Low Potential / Med Perf (Effective)', count: 2, desc: 'Delivers baseline requirements', color: 'bg-slate-50 text-slate-800 border-slate-200' },
    { title: 'Low Potential / Low Perf (Risk)', count: 1, desc: 'Immediate performance intervention', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  ];

  return (
    <div className="space-y-6">
      {/* 9-Box Talent Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              9-Box Succession & Talent Mapping Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Leadership potential vs. demonstrated performance mapping for {activeOrg.name}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-50 text-indigo-700">
            {activeOrgEmployees.length} Total Assessed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {nineBox.map((box, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 shadow-2xs ${box.color}`}
            >
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-xs leading-snug">{box.title}</h4>
                <span className="text-sm font-bold font-mono px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                  {box.count}
                </span>
              </div>
              <p className="text-[11px] opacity-80">{box.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
