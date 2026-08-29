export type Role =
  | 'super_admin'
  | 'org_admin'
  | 'hr_manager'
  | 'payroll_manager'
  | 'recruiter'
  | 'manager'
  | 'employee';

export type ModuleId =
  | 'hr'
  | 'payroll'
  | 'attendance'
  | 'performance'
  | 'recruitment'
  | 'leave'
  | 'ess'
  | 'engagement'
  | 'marketplace'
  | 'expenses';

export interface ModuleDefinition {
  id: ModuleId;
  key?: ModuleId;
  name: string;
  category: 'core' | 'talent' | 'workplace' | 'financial' | 'platform';
  description: string;
  iconName: string;
  isFullyBuilt: boolean;
  comingSoonBadge?: boolean;
}

export interface Geofence {
  id: string;
  orgId: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  address: string;
  isDefault: boolean;
}

export type AttendancePolicy = 'block' | 'warn' | 'approval_required';

export interface Organization {
  id: string;
  name: string;
  code: string;
  slug: string;
  logo: string;
  industry: string;
  headquarters: string;
  employeeCount: number;
  activeUsers: number;
  plan: 'Enterprise Starter' | 'Growth Suite' | 'Custom Scale';
  status: 'active' | 'inactive';
  enabledModules: ModuleId[];
  geofences: Geofence[];
  attendancePolicy: AttendancePolicy;
  createdAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  orgId: string;
  designation: string;
  departmentId: string;
}

export interface Department {
  id: string;
  orgId: string;
  name: string;
  code: string;
  headEmployeeId: string;
  headEmployeeName: string;
  employeeCount: number;
  budgetAllocated: number;
}

export interface Designation {
  id: string;
  orgId: string;
  title: string;
  departmentId: string;
  level: string;
  minExperienceYears: number;
}

export interface WorkLocation {
  id: string;
  orgId: string;
  name: string;
  city: string;
  state: string;
  address: string;
  isRemote: boolean;
}

export interface WorkShift {
  id: string;
  orgId: string;
  name: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "18:00"
  graceMinutes: number;
  halfDayHours: number;
}

export interface MockDocument {
  id: string;
  name: string;
  type: 'Identity Proof' | 'Educational Certificate' | 'Experience Letter' | 'Offer Letter' | 'Tax Declaration';
  fileSize: string;
  uploadedAt: string;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
}

export type LifecycleType =
  | 'onboarding'
  | 'promotion'
  | 'transfer'
  | 'role_change'
  | 'department_change'
  | 'salary_revision'
  | 'resignation'
  | 'exit';

export interface LifecycleEvent {
  id: string;
  employeeId: string;
  type: LifecycleType;
  effectiveDate: string;
  title: string;
  previousValue?: string;
  newValue: string;
  notes: string;
  approvedBy: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  orgId: string;
  employeeCode: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  departmentId: string;
  designationId: string;
  managerId: string | null;
  employmentType: 'Full-time' | 'Part-time' | 'Contractor' | 'Intern';
  joiningDate: string;
  workLocationId: string;
  shiftId: string;
  salaryDisplay: {
    basic: number;
    hra: number;
    allowances: number;
    grossMonthly: number;
    annualCtc: number;
  };
  bankDetailsMasked: string; // e.g. "•••• •••• 4821 (HDFC Bank)"
  documents: MockDocument[];
  employmentStatus: 'Active' | 'Onboarding' | 'On Leave' | 'Notice Period' | 'Resigned' | 'Terminated';
  lifecycleHistory: LifecycleEvent[];
}

export interface AttendanceLocation {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestamp: string;
  distanceMeters: number;
  status: 'inside' | 'outside' | 'unavailable';
  deviceUserAgent: string;
  nearestGeofenceName: string;
}

export interface AttendanceRecord {
  id: string;
  orgId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  clockInTime: string | null; // HH:MM
  clockOutTime: string | null; // HH:MM
  breakMinutes: number;
  workingHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'half_day' | 'late' | 'on_leave';
  location?: AttendanceLocation;
  regularizationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  regularizationReason?: string;
}

export interface SalaryStructureConfig {
  basicPercentageOfGross: number; // e.g. 50%
  hraPercentageOfBasic: number;    // e.g. 40% (non-metro) or 50% (metro)
  allowancesPercentageOfGross: number;
  pfRatePercentage: number;       // e.g. 12%
  pfCeilingLimit: number;         // e.g. 15000 (simplified demo)
  professionalTaxFixed: number;   // e.g. 200
  estimatedTdsPercentage: number; // e.g. 10%
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalStep {
  role: Role;
  roleTitle: string;
  approverName?: string;
  status: ApprovalStatus;
  timestamp?: string;
  comments?: string;
}

export interface ApprovalWorkflow {
  id: string;
  orgId: string;
  module: 'attendance' | 'payroll' | 'recruitment' | 'performance';
  entityId: string;
  entityTitle: string;
  requestedBy: string;
  requestedAt: string;
  currentStepIndex: number;
  steps: ApprovalStep[];
  status: ApprovalStatus;
}

export interface PayrollRun {
  id: string;
  orgId: string;
  month: string; // e.g. "March"
  year: number;  // e.g. 2026
  status: 'draft' | 'preview' | 'hr_approved' | 'processed';
  processedAt?: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  totalTax: number;
  totalPF: number;
  employeeCount: number;
  approvalWorkflow: ApprovalWorkflow;
}

export interface Payslip {
  id: string;
  orgId: string;
  payrollRunId: string;
  employeeId: string;
  month: string;
  year: number;
  basic: number;
  hra: number;
  specialAllowances: number;
  performanceBonus: number;
  grossEarnings: number;
  providentFund: number;
  professionalTax: number;
  taxDeductedAtSource: number;
  totalDeductions: number;
  netPayable: number;
  paymentMode: string;
  bankNameMasked: string;
  generatedAt: string;
}

export type GoalType = 'Individual' | 'Team' | 'Department' | 'OKR' | 'KPI';
export type GoalPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type GoalStatus = 'Not Started' | 'In Progress' | 'Under Review' | 'Completed' | 'At Risk';

export interface PerformanceGoal {
  id: string;
  orgId: string;
  employeeId: string;
  title: string;
  description: string;
  type: GoalType;
  ownerName: string;
  departmentId: string;
  startDate: string;
  dueDate: string;
  priority: GoalPriority;
  targetValue: number;
  currentValue: number;
  metricUnit: string;
  progressPercent: number;
  status: GoalStatus;
  score: number; // 1-100
}

export type ReviewStage = 'self' | 'manager' | 'peer' | 'hr' | 'final' | 'completed';

export interface PerformanceReview {
  id: string;
  orgId: string;
  employeeId: string;
  reviewPeriod: string; // e.g. "Q1 2026 Annual Cycle"
  currentStage: ReviewStage;
  selfRating: number;   // 1 to 5
  managerRating: number;
  peerRating: number;
  hrRating: number;
  finalRating: number;
  strengths: string;
  areasForImprovement: string;
  comments: string;
  recommendations: string;
  status: 'Draft' | 'Pending Approval' | 'Completed';
  lastUpdated: string;
}

export interface JobRequisition {
  id: string;
  orgId: string;
  title: string;
  code: string;
  departmentId: string;
  locationId: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  experienceLevel: 'Entry Level (0-2 yrs)' | 'Mid Level (3-6 yrs)' | 'Senior (7-10 yrs)' | 'Lead / Principal (10+ yrs)';
  minSalary: number;
  maxSalary: number;
  description: string;
  skills: string[];
  qualifications: string[];
  hiringManagerId: string;
  status: 'Draft' | 'Published' | 'Closed';
  applicantCount: number;
  createdAt: string;
}

export type CandidateStage =
  | 'applied'
  | 'screening'
  | 'shortlisted'
  | 'interview'
  | 'technical'
  | 'hr_round'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface Candidate {
  id: string;
  orgId: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeFileName: string;
  skills: string[];
  experienceYears: number;
  education: string;
  currentCompany: string;
  currentSalary: number;
  expectedSalary: number;
  noticePeriodDays: number;
  location: string;
  source: 'LinkedIn' | 'Naukri' | 'Referral' | 'Career Portal' | 'Agency';
  stage: CandidateStage;
  rating: number; // 1-5
  notes: string;
  appliedAt: string;
}

export interface Interview {
  id: string;
  orgId: string;
  candidateId: string;
  jobId: string;
  title: string;
  roundName: string;
  scheduledDate: string;
  scheduledTime: string;
  interviewerId: string;
  interviewerName: string;
  type: 'Video (Google Meet)' | 'In-Person (HQ)' | 'Phone Call';
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  feedback?: string;
  score?: number; // 1-5
}

export interface AppNotification {
  id: string;
  orgId: string;
  title: string;
  message: string;
  type: 'payroll' | 'attendance' | 'review' | 'recruitment' | 'approval' | 'system';
  read: boolean;
  timestamp: string;
  actionLink?: {
    module: ModuleId | 'superadmin' | 'approvals';
    tab?: string;
  };
}

export interface AuditLogEntry {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  module: string;
  recordType: string;
  recordId: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

// Convenience Type Aliases
export type ModuleKey = ModuleId;
export type EmployeeLifecycleEvent = LifecycleEvent;
export type PayrollRecord = Payslip;
export type Goal = PerformanceGoal;
export type JobPosting = JobRequisition;

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    id: 'hr',
    name: 'HR Software',
    category: 'core',
    description: 'Complete employee directory, profile management, org hierarchy, and lifecycle tracking.',
    iconName: 'Users',
    isFullyBuilt: true,
  },
  {
    id: 'payroll',
    name: 'Payroll Software',
    category: 'financial',
    description: 'Illustrative salary structures, payroll preview wizard, approval workflows, and PDF payslips.',
    iconName: 'IndianRupee',
    isFullyBuilt: true,
  },
  {
    id: 'attendance',
    name: 'Attendance Management',
    category: 'workplace',
    description: 'Geo-fetching clock in/out, office geofence validation, interactive map preview, and shifts.',
    iconName: 'MapPinCheckInside',
    isFullyBuilt: true,
  },
  {
    id: 'performance',
    name: 'Performance Management',
    category: 'talent',
    description: 'Goal management, OKR tracking, 5-stage performance reviews, and department analytics.',
    iconName: 'TrendingUp',
    isFullyBuilt: true,
  },
  {
    id: 'recruitment',
    name: 'Recruitment Software',
    category: 'talent',
    description: 'Job requisitions, interactive candidate Kanban pipeline, interview scheduler, and metrics.',
    iconName: 'UserPlus',
    isFullyBuilt: true,
  },
  {
    id: 'leave',
    name: 'Leave Management',
    category: 'workplace',
    description: 'Statutory leave accruals, casual & sick leave tracking, multi-tier approvals, and year-end encashment.',
    iconName: 'CalendarOff',
    isFullyBuilt: false,
    comingSoonBadge: true,
  },
  {
    id: 'ess',
    name: 'Employee Self Service (ESS)',
    category: 'core',
    description: 'Mobile-responsive employee portal for personal documents, tax declarations, and payslips.',
    iconName: 'UserCheck',
    isFullyBuilt: false,
    comingSoonBadge: true,
  },
  {
    id: 'engagement',
    name: 'Employee Engagement',
    category: 'talent',
    description: 'eNPS pulse surveys, peer-to-peer recognition, kudos badges, and interactive townhall boards.',
    iconName: 'HeartHandshake',
    isFullyBuilt: false,
    comingSoonBadge: true,
  },
  {
    id: 'marketplace',
    name: 'App Marketplace & Integrations',
    category: 'platform',
    description: 'Connectors for Slack, Microsoft Teams, Google Workspace, SAP ERP, and biometric hardware SDKs.',
    iconName: 'Boxes',
    isFullyBuilt: false,
    comingSoonBadge: true,
  },
  {
    id: 'expenses',
    name: 'Expense Management',
    category: 'financial',
    description: 'Travel & expense claims, receipt OCR scanning, policy enforcement, and reimbursement payouts.',
    iconName: 'Receipt',
    isFullyBuilt: false,
    comingSoonBadge: true,
  },
];

