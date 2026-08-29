import React, { useState, useMemo, useEffect } from 'react';
import { Search, Users, IndianRupee, MapPinCheckInside, TrendingUp, UserCheck, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModuleId } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const {
    activeOrgEmployees,
    activeOrgJobs,
    activeOrgCandidates,
    activeOrgGoals,
    setActiveModule,
    setActiveSubTab,
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle modal handled at app level
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return null;
    const q = query.toLowerCase();

    const empMatches = activeOrgEmployees
      .filter((e) => e.name.toLowerCase().includes(q) || e.employeeCode.toLowerCase().includes(q) || e.email.toLowerCase().includes(q))
      .slice(0, 4);

    const jobMatches = activeOrgJobs
      .filter((j) => j.title.toLowerCase().includes(q) || j.code.toLowerCase().includes(q))
      .slice(0, 3);

    const candMatches = activeOrgCandidates
      .filter((c) => c.name.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q)))
      .slice(0, 3);

    const goalMatches = activeOrgGoals
      .filter((g) => g.title.toLowerCase().includes(q) || g.ownerName.toLowerCase().includes(q))
      .slice(0, 3);

    return {
      employees: empMatches,
      jobs: jobMatches,
      candidates: candMatches,
      goals: goalMatches,
    };
  }, [query, activeOrgEmployees, activeOrgJobs, activeOrgCandidates, activeOrgGoals]);

  if (!isOpen) return null;

  const navigateTo = (mod: ModuleId | 'superadmin' | 'approvals', tab?: string) => {
    setActiveModule(mod);
    if (tab) setActiveSubTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search employees, jobs, candidates, OKRs... (e.g. 'Vikram', 'Architect')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!results ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <p>Type at least 2 characters to search across all HRMS records.</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px]">Employees</span>
                <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px]">Job Openings</span>
                <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px]">Candidates</span>
                <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px]">OKRs</span>
              </div>
            </div>
          ) : (
            <>
              {results.employees.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-500" /> Employees
                  </div>
                  <div className="space-y-1">
                    {results.employees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => navigateTo('hr', 'directory')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">{emp.name}</div>
                            <div className="text-[11px] text-slate-500">{emp.employeeCode} • {emp.email}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.jobs.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Job Openings
                  </div>
                  <div className="space-y-1">
                    {results.jobs.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => navigateTo('recruitment', 'jobs')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">{job.title}</div>
                          <div className="text-[11px] text-slate-500">{job.code} • {job.employmentType}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.candidates.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Candidates
                  </div>
                  <div className="space-y-1">
                    {results.candidates.map((cand) => (
                      <button
                        key={cand.id}
                        onClick={() => navigateTo('recruitment', 'pipeline')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">{cand.name}</div>
                          <div className="text-[11px] text-slate-500">Stage: <span className="capitalize">{cand.stage}</span> • {cand.skills.slice(0, 3).join(', ')}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.goals.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Goals & OKRs
                  </div>
                  <div className="space-y-1">
                    {results.goals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => navigateTo('performance', 'goals')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">{goal.title}</div>
                          <div className="text-[11px] text-slate-500">Owner: {goal.ownerName} • {goal.progressPercent}% progress</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">ESC</kbd> to close</span>
          <span>In-Memory Client Index</span>
        </div>
      </div>
    </div>
  );
};
