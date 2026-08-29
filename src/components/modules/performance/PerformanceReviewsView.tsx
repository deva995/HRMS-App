import React, { useState } from 'react';
import {
  Star,
  CheckCircle,
  Clock,
  User,
  ArrowRight,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PerformanceReview } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const PerformanceReviewsView: React.FC = () => {
  const { activeOrgReviews, updateReviewRating, activeOrgEmployees, activeOrg } = useApp();

  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [managerRating, setManagerRating] = useState<number>(4);
  const [comments, setComments] = useState<string>('');
  const [strengths, setStrengths] = useState<string>('Exceptional architecture execution, high dependability, proactive mentoring.');
  const [improvements, setImprovements] = useState<string>('Delegate earlier in project sprints to avoid bottlenecking.');
  const [recommendation, setRecommendation] = useState<string>('Promotion with 15% merit increment');

  const handleOpenEvaluate = (rev: PerformanceReview) => {
    setSelectedReview(rev);
    setManagerRating(rev.managerRating || rev.selfRating || 4);
    setComments(rev.comments || '');
    setStrengths(rev.strengths || 'Exceptional problem solving and team alignment.');
    setImprovements(rev.areasForImprovement || 'Increase cross-department technical documentation.');
    setRecommendation(rev.recommendations || 'Promotion with 15% merit increment');
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    updateReviewRating(selectedReview.id, selectedReview.currentStage, managerRating, {
      strengths,
      areasForImprovement: improvements,
      comments: comments || 'Consistently delivers high impact work across core sprint objectives.',
      recommendations: recommendation,
    });

    setSelectedReview(null);
  };

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Annual Appraisal & 360° Review Cycle (FY 2025-26)
          </h3>
          <p className="text-xs text-slate-500">
            5-Stage multi-rater evaluation workflow for {activeOrg.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {activeOrgReviews.filter((r) => r.status === 'Completed').length} / {activeOrgReviews.length} Completed
          </span>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeOrgReviews.map((rev) => {
          const emp = activeOrgEmployees.find((e) => e.id === rev.employeeId);
          const finalScore = rev.finalRating || rev.managerRating || rev.selfRating || 0;

          return (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{emp?.name || 'Employee'}</h4>
                      <StatusBadge status={rev.currentStage.toUpperCase()} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Code: {emp?.employeeCode || rev.employeeId} • Cycle: {rev.reviewPeriod}
                    </p>
                  </div>

                  {finalScore > 0 && (
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="text-xs font-bold text-amber-900 font-mono">{finalScore.toFixed(1)} / 5</span>
                    </div>
                  )}
                </div>

                {/* 5-Stage Stepper Pill Tracker */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                  <span className={rev.selfRating ? 'text-emerald-700 font-bold' : ''}>1. Self ({rev.selfRating || '-'})</span>
                  <span>→</span>
                  <span className={rev.managerRating ? 'text-emerald-700 font-bold' : ''}>2. Manager ({rev.managerRating || '-'})</span>
                  <span>→</span>
                  <span className={rev.peerRating ? 'text-emerald-700 font-bold' : ''}>3. Peer ({rev.peerRating || '-'})</span>
                  <span>→</span>
                  <span className={rev.hrRating ? 'text-emerald-700 font-bold' : ''}>4. HR ({rev.hrRating || '-'})</span>
                  <span>→</span>
                  <span className={rev.currentStage === 'completed' ? 'text-emerald-700 font-bold' : ''}>5. Final</span>
                </div>

                {rev.strengths && (
                  <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600">
                    <strong className="text-slate-800">Strengths:</strong> {rev.strengths}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Status: <strong className="text-slate-700 capitalize">{rev.status}</strong>
                </span>
                <button
                  onClick={() => handleOpenEvaluate(rev)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{rev.status === 'Completed' ? 'View Evaluation' : 'Conduct Review'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Evaluation Modal */}
      {selectedReview && (
        <Modal
          isOpen={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          title={`Performance Appraisal — ${activeOrgEmployees.find((e) => e.id === selectedReview.employeeId)?.name || 'Employee'}`}
          subtitle={`Review Stage: ${selectedReview.currentStage.toUpperCase()} for ${selectedReview.reviewPeriod}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
            {/* Self vs Manager Rating Sliders */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Evaluation Rating (1.0 to 5.0 Scale)</span>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="font-bold text-sm text-slate-900 font-mono">{managerRating} / 5.0</span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={managerRating}
                onChange={(e) => setManagerRating(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>1.0 Needs Support</span>
                <span>2.0 Developing</span>
                <span>3.0 Meets Expectations</span>
                <span>4.0 Exceeds Target</span>
                <span>5.0 Outstanding Impact</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Key Strengths & Achievements</label>
              <textarea
                rows={2}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Areas for Development & Next Goals</label>
              <textarea
                rows={2}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Appraisal Recommendation</label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-hidden"
              >
                <option value="Promotion with 15% merit increment">Promotion with 15% merit increment</option>
                <option value="Standard annual increment (8-10%)">Standard annual increment (8-10%)</option>
                <option value="Role elevation to Team Lead">Role elevation to Team Lead</option>
                <option value="Retain in current grade">Retain in current grade</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Advance Review Stage
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
