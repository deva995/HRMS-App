import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  Star,
  BellRing,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ModuleKey, MODULE_DEFINITIONS } from '../../../types';

interface ModulePlaceholderViewProps {
  moduleKey: ModuleKey;
}

export const ModulePlaceholderView: React.FC<ModulePlaceholderViewProps> = ({ moduleKey }) => {
  const { activeOrg, hasAccessToModule, toggleModuleForOrg, role } = useApp();
  const [isRequested, setIsRequested] = useState(false);

  const def = MODULE_DEFINITIONS.find((m) => m.id === moduleKey || m.key === moduleKey);
  const isEnabled = hasAccessToModule(moduleKey);

  const moduleFeatures: Record<ModuleKey, { title: string; desc: string }[]> = {
    hr: [],
    payroll: [],
    attendance: [],
    performance: [],
    recruitment: [],
    leave: [
      { title: 'Statutory Leave Policy Engine', desc: 'Auto-accrual for Earned Leave (EL), Casual (CL), Sick (SL), and Maternity/Paternity mandates.' },
      { title: 'Multi-Level Approval Matrix', desc: 'Configurable routing to Team Lead, Department Head, and HR with auto-escalation.' },
      { title: 'Leave Balance Encashment & Year-End Lapse', desc: 'Carry-forward caps with direct payroll sync for unutilized balance encashment.' },
    ],
    ess: [
      { title: 'Self-Service Tax Declarations (Section 80C, HRA, 80D)', desc: 'Upload investment proofs and calculate old vs new tax regime liability.' },
      { title: 'Expense Claim Reimbursements', desc: 'Receipt OCR scanning, multi-currency conversion, and manager sign-off.' },
      { title: 'Letter Generation & Requests', desc: 'Instantly generate bonafide, employment verification, and address proof letters.' },
    ],
    engagement: [
      { title: 'Employee Net Promoter Score (eNPS) Surveys', desc: 'Anonymous pulse polling with sentiment analysis and departmental heatmaps.' },
      { title: 'Peer-to-Peer Kudos & Rewards', desc: 'Reward tokens redeemable for gift vouchers and company merchandise.' },
      { title: 'Townhall Q&A & Community Boards', desc: 'Upvote questions for leadership AMA and company announcements feed.' },
    ],
    marketplace: [
      { title: 'Enterprise Single Sign-On (SSO)', desc: 'SAML 2.0 and OIDC integrations for Okta, Azure AD, and Google Workspace.' },
      { title: 'Direct ERP Sync (SAP, NetSuite, Tally)', desc: 'Real-time general ledger journal posting for payroll debits and credits.' },
      { title: 'Background Verification Connectors', desc: 'One-click criminal, court record, and education verification checks.' },
    ],
    expenses: [
      { title: 'Corporate Card Integration', desc: 'Real-time transaction feed sync with automatic receipt matching.' },
      { title: 'Mileage & Per-Diem Tracking', desc: 'GPS-calculated travel claims based on corporate per-diem tier matrices.' },
      { title: 'Advance Cash Requests', desc: 'Pre-trip travel allowances with automated expense reconciliation.' },
    ],
  };

  const features = moduleFeatures[moduleKey] || [
    { title: 'Advanced Automation', desc: 'Automated policy enforcement and event triggers.' },
    { title: 'Real-time Analytics', desc: 'Customizable reports and interactive visualization.' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upcoming Enterprise Extension</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {def?.name || 'Advanced Capability Module'}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {def?.description || 'Expand your HR operations with advanced automated workflows.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {role === 'super_admin' ? (
              <button
                onClick={() => toggleModuleForOrg(activeOrg.id, moduleKey)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isEnabled
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-indigo-500 hover:bg-indigo-400 text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{isEnabled ? 'Revoke Module Provisioning' : 'Provision Module for Tenant'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsRequested(true)}
                disabled={isRequested}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-sm"
              >
                <BellRing className="w-4 h-4" />
                <span>{isRequested ? 'Early Access Request Registered' : 'Request Early Access for Organization'}</span>
              </button>
            )}

            <div className="text-xs text-slate-400">
              Tenant Status:{' '}
              <strong className={isEnabled ? 'text-emerald-400' : 'text-amber-400'}>
                {isEnabled ? 'Enabled in Subscription' : 'Not Subscribed'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Blueprint Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Module Architectural Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">{feat.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
