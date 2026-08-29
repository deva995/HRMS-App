import React, { useState } from 'react';
import {
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Star,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Candidate, CandidateStage } from '../../../types';
import { Modal } from '../../common/Modal';

export const CandidateKanbanView: React.FC = () => {
  const {
    activeOrgCandidates,
    activeOrgJobs,
    updateCandidateStage,
    convertCandidateToEmployee,
    activeOrg,
  } = useApp();

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSuccessConverted, setIsSuccessConverted] = useState(false);

  const stages: { id: CandidateStage; label: string; color: string }[] = [
    { id: 'applied', label: 'Applied', color: 'border-slate-300 bg-slate-100 text-slate-700' },
    { id: 'screening', label: 'Screening', color: 'border-blue-300 bg-blue-50 text-blue-800' },
    { id: 'interview', label: 'Interview', color: 'border-indigo-300 bg-indigo-50 text-indigo-800' },
    { id: 'offer', label: 'Offer Extended', color: 'border-amber-300 bg-amber-50 text-amber-800' },
    { id: 'hired', label: 'Hired', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  ];

  const handleMoveStage = (candidateId: string, nextStage: CandidateStage) => {
    updateCandidateStage(candidateId, nextStage);
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, stage: nextStage });
    }
  };

  const handleConvert = (candidate: Candidate) => {
    convertCandidateToEmployee(candidate);
    setIsSuccessConverted(true);
    setTimeout(() => {
      setIsSuccessConverted(false);
      setSelectedCandidate(null);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1000px]">
          {stages.map((stage) => {
            const candidatesInStage = activeOrgCandidates.filter((c) => c.stage === stage.id);

            return (
              <div
                key={stage.id}
                className="w-72 shrink-0 bg-slate-100/70 rounded-2xl border border-slate-200/80 p-3.5 flex flex-col max-h-[75vh]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{stage.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                      {candidatesInStage.length}
                    </span>
                  </div>
                </div>

                {/* Candidate Cards List */}
                <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                  {candidatesInStage.map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs hover:text-indigo-600">
                            {cand.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]">
                            {cand.jobTitle}
                          </p>
                        </div>

                        {cand.score && (
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{cand.score}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                        <span>Exp: {cand.experienceYears}y</span>
                        <span>{cand.appliedDate}</span>
                      </div>

                      {/* Stage Progression Buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                        {stage.id !== 'hired' && stage.id !== 'rejected' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIdx = stages.findIndex((s) => s.id === stage.id) + 1;
                              if (nextIdx < stages.length) {
                                handleMoveStage(cand.id, stages[nextIdx].id);
                              }
                            }}
                            className="w-full py-1 px-2 rounded text-[10px] font-semibold bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>Move to Next Stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {stage.id === 'hired' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConvert(cand);
                            }}
                            className="w-full py-1 px-2 rounded text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1 transition-colors"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Onboard as Employee</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {candidatesInStage.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Profile Modal */}
      <Modal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        title={`Candidate: ${selectedCandidate?.name}`}
        subtitle={`Applied for ${selectedCandidate?.jobTitle} • ${selectedCandidate?.department}`}
        maxWidth="2xl"
      >
        {selectedCandidate && (
          <div className="space-y-4 text-xs">
            {/* Top Contact Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Email Address</div>
                <div className="font-medium text-slate-900 mt-0.5 truncate">{selectedCandidate.email}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Phone</div>
                <div className="font-medium text-slate-900 mt-0.5">{selectedCandidate.phone}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Experience</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedCandidate.experienceYears} Years</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Expected CTC</div>
                <div className="font-bold text-indigo-700 font-mono mt-0.5">
                  ₹{selectedCandidate.expectedSalary ? (selectedCandidate.expectedSalary / 100000).toFixed(1) : 15} LPA
                </div>
              </div>
            </div>

            {/* Skills & Resume Summary */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Tagged Core Competencies:</label>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Interview Notes */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 text-xs">Hiring Manager Feedback & Assessment</div>
              <p className="text-slate-600 leading-relaxed">
                {selectedCandidate.notes ||
                  'Strong domain expertise demonstrated during the system design round. Culture fit is aligned with team standards.'}
              </p>
            </div>

            {/* Stage Transition Selector */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Current Pipeline Stage</div>
                <div className="text-[11px] text-slate-500 capitalize">Currently in {selectedCandidate.stage}</div>
              </div>
              <select
                value={selectedCandidate.stage}
                onChange={(e) => handleMoveStage(selectedCandidate.id, e.target.value as CandidateStage)}
                className="text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-900 focus:outline-hidden"
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Success Message or Action Buttons */}
            {isSuccessConverted ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Successfully converted to active employee record! Added to HR Directory.</span>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleConvert(selectedCandidate)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Onboard into Employee Directory</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
