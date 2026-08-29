import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  Organization,
  Role,
  ModuleId,
  ModuleDefinition,
  Employee,
  Department,
  Designation,
  WorkLocation,
  WorkShift,
  AttendanceRecord,
  SalaryStructureConfig,
  PayrollRun,
  Payslip,
  PerformanceGoal,
  PerformanceReview,
  JobRequisition,
  Candidate,
  CandidateStage,
  Interview,
  AppNotification,
  ApprovalWorkflow,
  AuditLogEntry,
  LifecycleType,
  AttendanceLocation,
  Geofence,
  AttendancePolicy,
} from '../types';
import {
  INITIAL_ORGANIZATIONS,
  MODULE_DEFINITIONS,
  INITIAL_DEPARTMENTS,
  INITIAL_DESIGNATIONS,
  INITIAL_LOCATIONS,
  INITIAL_SHIFTS,
  INITIAL_SALARY_CONFIG,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_PAYROLL_RUNS,
  INITIAL_PAYSLIPS,
  INITIAL_PERFORMANCE_GOALS,
  INITIAL_PERFORMANCE_REVIEWS,
  INITIAL_JOB_REQUISITIONS,
  INITIAL_CANDIDATES,
  INITIAL_INTERVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_APPROVAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';
import { evaluateGeofenceStatus } from '../utils/geoUtils';

interface AppContextType {
  // Tenant & Role State
  organizations: Organization[];
  activeOrgId: string;
  activeOrg: Organization;
  currentRole: Role;
  currentUserName: string;
  setActiveOrgId: (orgId: string) => void;
  setCurrentRole: (role: Role) => void;

  // Navigation
  activeModule: ModuleId | 'superadmin' | 'approvals' | 'audit' | 'dashboard';
  activeSubTab: string;
  setActiveModule: (mod: ModuleId | 'superadmin' | 'approvals' | 'audit' | 'dashboard') => void;
  setActiveSubTab: (tab: string) => void;
  availableModules: ModuleDefinition[];

  // Tenant / Module Management
  toggleModuleForOrg: (orgId: string, moduleId: ModuleId) => void;
  setModulesForOrg: (orgId: string, moduleIds: ModuleId[]) => void;
  createOrganization: (data: Partial<Organization>) => void;
  updateOrganization: (orgId: string, data: Partial<Organization>) => void;
  toggleOrgStatus: (orgId: string) => void;
  updateOrgAttendancePolicy: (orgId: string, policy: AttendancePolicy) => void;
  addGeofence: (orgId: string, geofence: Omit<Geofence, 'id' | 'orgId'>) => void;
  removeGeofence: (geofenceId: string) => void;

  // HR Module
  departments: Department[];
  designations: Designation[];
  locations: WorkLocation[];
  shifts: WorkShift[];
  employees: Employee[];
  activeOrgEmployees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id' | 'orgId' | 'lifecycleHistory'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  recordLifecycleEvent: (
    employeeId: string,
    type: LifecycleType,
    title: string,
    newValue: string,
    notes: string,
    previousValue?: string
  ) => void;
  addDepartment: (name: string, code: string, headName: string) => void;

  // Attendance Module
  attendanceRecords: AttendanceRecord[];
  activeOrgAttendance: AttendanceRecord[];
  clockInWithLocation: (
    employeeId: string,
    coords?: { latitude: number; longitude: number; accuracy: number },
    userAgent?: string
  ) => { success: boolean; status: 'inside' | 'outside' | 'blocked'; message: string };
  clockOut: (employeeId: string) => void;
  submitRegularizationRequest: (recordId: string, reason: string) => void;
  approveRegularizationRequest: (recordId: string, approved: boolean) => void;

  // Payroll Module
  salaryConfig: SalaryStructureConfig;
  payrollRuns: PayrollRun[];
  activeOrgPayrollRuns: PayrollRun[];
  payslips: Payslip[];
  activeOrgPayslips: Payslip[];
  updateSalaryConfig: (config: Partial<SalaryStructureConfig>) => void;
  processPayrollRun: (month: string, year: number) => PayrollRun;
  advancePayrollApproval: (runId: string, comments?: string) => void;

  // Performance Module
  performanceGoals: PerformanceGoal[];
  activeOrgGoals: PerformanceGoal[];
  performanceReviews: PerformanceReview[];
  activeOrgReviews: PerformanceReview[];
  createGoal: (goal: Omit<PerformanceGoal, 'id' | 'orgId'>) => void;
  updateGoalProgress: (goalId: string, progress: number, status: PerformanceGoal['status']) => void;
  updateReviewRating: (
    reviewId: string,
    stage: PerformanceReview['currentStage'],
    rating: number,
    feedback: { strengths?: string; areasForImprovement?: string; comments?: string; recommendations?: string }
  ) => void;

  // Recruitment Module
  jobs: JobRequisition[];
  activeOrgJobs: JobRequisition[];
  candidates: Candidate[];
  activeOrgCandidates: Candidate[];
  interviews: Interview[];
  activeOrgInterviews: Interview[];
  createJob: (job: Omit<JobRequisition, 'id' | 'orgId' | 'applicantCount' | 'createdAt'>) => void;
  updateJobStatus: (jobId: string, status: JobRequisition['status']) => void;
  moveCandidateStage: (candidateId: string, newStage: CandidateStage) => void;
  addCandidate: (cand: Omit<Candidate, 'id' | 'orgId' | 'appliedAt'>) => void;
  scheduleInterview: (interview: Omit<Interview, 'id' | 'orgId'>) => void;
  completeInterviewFeedback: (interviewId: string, feedback: string, score: number) => void;

  // Approvals & Notifications & Audit
  notifications: AppNotification[];
  approvalWorkflows: ApprovalWorkflow[];
  activeOrgWorkflows: ApprovalWorkflow[];
  auditLogs: AuditLogEntry[];
  activeOrgAuditLogs: AuditLogEntry[];
  approveWorkflowStep: (workflowId: string, comments?: string) => void;
  rejectWorkflowStep: (workflowId: string, comments?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (action: string, module: string, recordType: string, recordId: string, previousValue?: string, newValue?: string) => void;

  // Access Control Helper
  hasAccessToModule: (moduleId: ModuleId) => boolean;
  canPerformAction: (requiredRoles: Role[]) => boolean;

  // Convenience Aliases
  role: Role;
  activeOrgDepartments: Department[];
  activeOrgDesignations: Designation[];
  activeOrgLocations: WorkLocation[];
  activeOrgShifts: WorkShift[];
  activeOrgPayroll: Payslip[];
  updateEmployeeLifecycle: (
    empId: string,
    event: { type: LifecycleType; effectiveDate: string; reason?: string; notes?: string; previousRole?: string; newRole?: string; previousDepartment?: string; newDepartment?: string },
    updates?: Partial<Employee>
  ) => void;
  updateAttendancePolicy: (policy: AttendancePolicy) => void;
  requestAttendanceRegularization: (recordId: string, reason: string) => void;
  resolveAttendanceRegularization: (recordId: string, approved: boolean) => void;
  addGoal: (goal: Omit<PerformanceGoal, 'id' | 'orgId'>) => void;
  submitReviewEvaluation: (
    reviewId: string,
    stage: PerformanceReview['currentStage'],
    rating: number,
    feedback: { strengths?: string; areasForImprovement?: string; comments?: string; recommendations?: string }
  ) => void;
  addJobPosting: (job: Omit<JobRequisition, 'id' | 'orgId' | 'applicantCount' | 'createdAt'>) => void;
  updateCandidateStage: (candidateId: string, newStage: CandidateStage) => void;
  convertCandidateToEmployee: (candidateId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Core Tenant & Session State
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [activeOrgId, setActiveOrgId] = useState<string>('org-1');
  const [currentRole, setCurrentRole] = useState<Role>('super_admin');

  // Navigation State
  const [activeModule, setActiveModule] = useState<ModuleId | 'superadmin' | 'approvals' | 'audit' | 'dashboard'>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  // Entities State (All In-Memory, Client-Side Prototype)
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [designations, setDesignations] = useState<Designation[]>(INITIAL_DESIGNATIONS);
  const [locations, setLocations] = useState<WorkLocation[]>(INITIAL_LOCATIONS);
  const [shifts, setShifts] = useState<WorkShift[]>(INITIAL_SHIFTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [salaryConfig, setSalaryConfig] = useState<SalaryStructureConfig>(INITIAL_SALARY_CONFIG);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(INITIAL_PAYROLL_RUNS);
  const [payslips, setPayslips] = useState<Payslip[]>(INITIAL_PAYSLIPS);
  const [performanceGoals, setPerformanceGoals] = useState<PerformanceGoal[]>(INITIAL_PERFORMANCE_GOALS);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(INITIAL_PERFORMANCE_REVIEWS);
  const [jobs, setJobs] = useState<JobRequisition[]>(INITIAL_JOB_REQUISITIONS);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [approvalWorkflows, setApprovalWorkflows] = useState<ApprovalWorkflow[]>(INITIAL_APPROVAL_WORKFLOWS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Derived Active Organization
  const activeOrg = useMemo(() => {
    return organizations.find((o) => o.id === activeOrgId) || organizations[0];
  }, [organizations, activeOrgId]);

  // Current simulated user name based on role
  const currentUserName = useMemo(() => {
    switch (currentRole) {
      case 'super_admin':
        return 'System Administrator (Platform)';
      case 'org_admin':
        return 'Amit Patel (Director & Org Admin)';
      case 'hr_manager':
        return 'Priya Nair (Head of HR)';
      case 'payroll_manager':
        return 'Karthik Subramanian (Payroll Lead)';
      case 'recruiter':
        return 'Divya Joshi (Talent Acquisition)';
      case 'manager':
        return 'Vikram Malhotra (VP Engineering)';
      case 'employee':
        return 'Ananya Desai (Senior Engineer)';
      default:
        return 'Demo User';
    }
  }, [currentRole]);

  // Scoped datasets by active tenant orgId
  const activeOrgEmployees = useMemo(() => employees.filter((e) => e.orgId === activeOrgId), [employees, activeOrgId]);
  const activeOrgAttendance = useMemo(() => attendanceRecords.filter((a) => a.orgId === activeOrgId), [attendanceRecords, activeOrgId]);
  const activeOrgPayrollRuns = useMemo(() => payrollRuns.filter((p) => p.orgId === activeOrgId), [payrollRuns, activeOrgId]);
  const activeOrgPayslips = useMemo(() => payslips.filter((p) => p.orgId === activeOrgId), [payslips, activeOrgId]);
  const activeOrgGoals = useMemo(() => performanceGoals.filter((g) => g.orgId === activeOrgId), [performanceGoals, activeOrgId]);
  const activeOrgReviews = useMemo(() => performanceReviews.filter((r) => r.orgId === activeOrgId), [performanceReviews, activeOrgId]);
  const activeOrgJobs = useMemo(() => jobs.filter((j) => j.orgId === activeOrgId), [jobs, activeOrgId]);
  const activeOrgCandidates = useMemo(() => candidates.filter((c) => c.orgId === activeOrgId), [candidates, activeOrgId]);
  const activeOrgInterviews = useMemo(() => interviews.filter((i) => i.orgId === activeOrgId), [interviews, activeOrgId]);
  const activeOrgWorkflows = useMemo(() => approvalWorkflows.filter((w) => w.orgId === activeOrgId), [approvalWorkflows, activeOrgId]);
  const activeOrgAuditLogs = useMemo(() => auditLogs.filter((a) => a.orgId === activeOrgId), [auditLogs, activeOrgId]);

  // Audit Logger Helper
  const addAuditLog = (
    action: string,
    module: string,
    recordType: string,
    recordId: string,
    previousValue?: string,
    newValue?: string
  ) => {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orgId: activeOrgId,
      userId: `user-${currentRole}`,
      userName: currentUserName,
      userRole: currentRole,
      action,
      module,
      recordType,
      recordId,
      previousValue,
      newValue,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  /**
   * Access Control Simulation
   * NOTE: This is UI-level show/hide simulation only for prototype demonstrations,
   * NOT real cryptographic authorization or server-side RBAC.
   */
  const hasAccessToModule = (moduleId: ModuleId): boolean => {
    if (currentRole === 'super_admin') return true;
    return activeOrg.enabledModules.includes(moduleId);
  };

  const canPerformAction = (requiredRoles: Role[]): boolean => {
    if (currentRole === 'super_admin') return true;
    return requiredRoles.includes(currentRole);
  };

  // Centerpiece Feature: Live Module Assignment Grid Toggling
  const toggleModuleForOrg = (orgId: string, moduleId: ModuleId) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== orgId) return org;
        const exists = org.enabledModules.includes(moduleId);
        const nextModules = exists
          ? org.enabledModules.filter((m) => m !== moduleId)
          : [...org.enabledModules, moduleId];

        addAuditLog(
          exists ? 'MODULE_DISABLED' : 'MODULE_ENABLED',
          'Super Admin',
          'OrganizationModule',
          `${org.code}/${moduleId}`,
          exists ? 'Enabled' : 'Disabled',
          exists ? 'Disabled' : 'Enabled'
        );

        return {
          ...org,
          enabledModules: nextModules,
        };
      })
    );
  };

  const setModulesForOrg = (orgId: string, moduleIds: ModuleId[]) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== orgId) return org;
        addAuditLog(
          'MODULE_ASSIGNMENT_UPDATED',
          'Super Admin',
          'OrganizationModules',
          org.code,
          `${org.enabledModules.length} modules`,
          `${moduleIds.length} modules (${moduleIds.join(', ')})`
        );
        return {
          ...org,
          enabledModules: moduleIds,
        };
      })
    );
  };

  const createOrganization = (data: Partial<Organization>) => {
    const newId = `org-${Date.now()}`;
    const newOrg: Organization = {
      id: newId,
      name: data.name || 'New Enterprise Corp',
      code: (data.code || 'CORP').toUpperCase(),
      slug: (data.slug || 'new-corp').toLowerCase(),
      logo: data.logo || '🏢',
      industry: data.industry || 'Technology & Services',
      headquarters: data.headquarters || 'Bengaluru, Karnataka',
      employeeCount: 1,
      activeUsers: 1,
      plan: data.plan || 'Growth Suite',
      status: 'active',
      enabledModules: data.enabledModules || ['hr', 'payroll', 'attendance'],
      attendancePolicy: 'warn',
      createdAt: new Date().toISOString().split('T')[0],
      geofences: [
        {
          id: `geo-${Date.now()}`,
          orgId: newId,
          name: 'Main Headquarters',
          latitude: 12.9716,
          longitude: 77.5946,
          radiusMeters: 300,
          address: 'MG Road, Bengaluru 560001',
          isDefault: true,
        },
      ],
    };
    setOrganizations((prev) => [...prev, newOrg]);
    addAuditLog('ORGANIZATION_CREATED', 'Super Admin', 'Organization', newOrg.code, undefined, newOrg.name);
  };

  const updateOrganization = (orgId: string, data: Partial<Organization>) => {
    setOrganizations((prev) =>
      prev.map((org) => (org.id === orgId ? { ...org, ...data } : org))
    );
    addAuditLog('ORGANIZATION_UPDATED', 'Super Admin', 'Organization', orgId, undefined, JSON.stringify(data));
  };

  const toggleOrgStatus = (orgId: string) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== orgId) return org;
        const newStatus = org.status === 'active' ? 'inactive' : 'active';
        addAuditLog(
          'ORGANIZATION_STATUS_CHANGED',
          'Super Admin',
          'Organization',
          org.code,
          org.status,
          newStatus
        );
        return { ...org, status: newStatus };
      })
    );
  };

  const updateOrgAttendancePolicy = (orgId: string, policy: AttendancePolicy) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, attendancePolicy: policy } : o))
    );
    addAuditLog('ATTENDANCE_POLICY_UPDATED', 'Attendance', 'Policy', orgId, activeOrg.attendancePolicy, policy);
  };

  const addGeofence = (orgId: string, geofenceData: Omit<Geofence, 'id' | 'orgId'>) => {
    const newGeo: Geofence = {
      ...geofenceData,
      id: `geo-${Date.now()}`,
      orgId,
    };
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== orgId) return org;
        return {
          ...org,
          geofences: [...org.geofences, newGeo],
        };
      })
    );
    addAuditLog('GEOFENCE_ADDED', 'Attendance', 'Geofence', newGeo.id, undefined, newGeo.name);
  };

  const removeGeofence = (geofenceId: string) => {
    setOrganizations((prev) =>
      prev.map((org) => ({
        ...org,
        geofences: org.geofences.filter((g) => g.id !== geofenceId),
      }))
    );
    addAuditLog('GEOFENCE_REMOVED', 'Attendance', 'Geofence', geofenceId);
  };

  // HR Module Handlers
  const addEmployee = (empData: Omit<Employee, 'id' | 'orgId' | 'lifecycleHistory'>) => {
    const newId = `emp-${Date.now()}`;
    const code = `${activeOrg.code}-${1000 + activeOrgEmployees.length + 1}`;
    const newEmployee: Employee = {
      ...empData,
      id: newId,
      orgId: activeOrgId,
      employeeCode: code,
      lifecycleHistory: [
        {
          id: `lc-${Date.now()}`,
          employeeId: newId,
          type: 'onboarding',
          effectiveDate: empData.joiningDate,
          title: `Joined as ${empData.employmentType}`,
          newValue: 'Active Employee',
          notes: 'New employee onboarding record created in system.',
          approvedBy: currentUserName,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    setOrganizations((prev) =>
      prev.map((o) => (o.id === activeOrgId ? { ...o, employeeCount: o.employeeCount + 1 } : o))
    );
    addAuditLog('EMPLOYEE_CREATED', 'HR Software', 'Employee', code, undefined, newEmployee.name);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );
    addAuditLog('EMPLOYEE_UPDATED', 'HR Software', 'Employee', id, undefined, JSON.stringify(updates));
  };

  const recordLifecycleEvent = (
    employeeId: string,
    type: LifecycleType,
    title: string,
    newValue: string,
    notes: string,
    previousValue?: string
  ) => {
    const event = {
      id: `lc-${Date.now()}`,
      employeeId,
      type,
      effectiveDate: new Date().toISOString().split('T')[0],
      title,
      previousValue,
      newValue,
      notes,
      approvedBy: currentUserName,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        let nextStatus = emp.employmentStatus;
        if (type === 'resignation') nextStatus = 'Notice Period';
        if (type === 'exit') nextStatus = 'Terminated';
        if (type === 'onboarding') nextStatus = 'Active';

        return {
          ...emp,
          employmentStatus: nextStatus,
          lifecycleHistory: [event, ...emp.lifecycleHistory],
        };
      })
    );

    addAuditLog(
      `LIFECYCLE_${type.toUpperCase()}`,
      'HR Software',
      'EmployeeLifecycle',
      employeeId,
      previousValue,
      newValue
    );
  };

  const addDepartment = (name: string, code: string, headName: string) => {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      orgId: activeOrgId,
      name,
      code: code.toUpperCase(),
      headEmployeeId: 'emp-101',
      headEmployeeName: headName,
      employeeCount: 0,
      budgetAllocated: 5000000,
    };
    setDepartments((prev) => [...prev, newDept]);
    addAuditLog('DEPARTMENT_CREATED', 'HR Software', 'Department', newDept.code, undefined, name);
  };

  // Attendance Module Handlers
  const clockInWithLocation = (
    employeeId: string,
    coords?: { latitude: number; longitude: number; accuracy: number },
    userAgent?: string
  ): { success: boolean; status: 'inside' | 'outside' | 'blocked'; message: string } => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().substring(0, 5);

    let locationInfo: AttendanceLocation | undefined;
    let status: 'inside' | 'outside' | 'blocked' = 'inside';
    let message = 'Clocked in successfully inside geofence perimeter.';

    if (coords) {
      const geoResult = evaluateGeofenceStatus(coords.latitude, coords.longitude, activeOrg.geofences);
      const isInside = geoResult.status === 'inside';

      locationInfo = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracyMeters: coords.accuracy,
        timestamp: new Date().toISOString(),
        distanceMeters: geoResult.distanceMeters,
        status: isInside ? 'inside' : 'outside',
        deviceUserAgent: userAgent || navigator.userAgent,
        nearestGeofenceName: geoResult.nearestGeofence?.name || 'Unknown Location',
      };

      if (!isInside) {
        if (activeOrg.attendancePolicy === 'block') {
          return {
            success: false,
            status: 'blocked',
            message: `Clock-in blocked by organization policy: You are ${geoResult.distanceMeters}m away from the nearest authorized geofence.`,
          };
        } else if (activeOrg.attendancePolicy === 'approval_required') {
          status = 'outside';
          message = `Clocked in outside authorized zone (${geoResult.distanceMeters}m away). Manager approval request generated.`;
        } else {
          status = 'outside';
          message = `Warning: Clocked in ${geoResult.distanceMeters}m outside authorized zone. Recorded with warning tag.`;
        }
      }
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      orgId: activeOrgId,
      employeeId,
      date: today,
      clockInTime: nowTime,
      clockOutTime: null,
      breakMinutes: 0,
      workingHours: 0,
      overtimeHours: 0,
      status: 'present',
      location: locationInfo,
      regularizationStatus: status === 'outside' ? 'pending' : 'none',
      regularizationReason: status === 'outside' ? 'Automated out-of-geofence approval flag' : undefined,
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);
    addAuditLog('ATTENDANCE_CLOCK_IN', 'Attendance', 'AttendanceRecord', newRecord.id, undefined, `${employeeId} at ${nowTime}`);

    return { success: true, status, message };
  };

  const clockOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().substring(0, 5);

    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.employeeId === employeeId && rec.date === today && !rec.clockOutTime) {
          const inParts = (rec.clockInTime || '09:00').split(':').map(Number);
          const outParts = nowTime.split(':').map(Number);
          const inMinutes = inParts[0] * 60 + inParts[1];
          const outMinutes = outParts[0] * 60 + outParts[1];
          const totalHours = Math.max(0, parseFloat(((outMinutes - inMinutes - rec.breakMinutes) / 60).toFixed(1)));

          return {
            ...rec,
            clockOutTime: nowTime,
            workingHours: totalHours,
            overtimeHours: totalHours > 8.5 ? parseFloat((totalHours - 8.5).toFixed(1)) : 0,
          };
        }
        return rec;
      })
    );
    addAuditLog('ATTENDANCE_CLOCK_OUT', 'Attendance', 'AttendanceRecord', employeeId, undefined, nowTime);
  };

  const submitRegularizationRequest = (recordId: string, reason: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, regularizationStatus: 'pending', regularizationReason: reason }
          : r
      )
    );
    addAuditLog('REGULARIZATION_SUBMITTED', 'Attendance', 'AttendanceRecord', recordId, undefined, reason);
  };

  const approveRegularizationRequest = (recordId: string, approved: boolean) => {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, regularizationStatus: approved ? 'approved' : 'rejected' }
          : r
      )
    );
    addAuditLog(
      approved ? 'REGULARIZATION_APPROVED' : 'REGULARIZATION_REJECTED',
      'Attendance',
      'AttendanceRecord',
      recordId
    );
  };

  // Payroll Module Handlers
  const updateSalaryConfig = (config: Partial<SalaryStructureConfig>) => {
    setSalaryConfig((prev) => ({ ...prev, ...config }));
    addAuditLog('SALARY_STRUCTURE_CONFIGURED', 'Payroll', 'SalaryConfig', 'global', undefined, JSON.stringify(config));
  };

  const processPayrollRun = (month: string, year: number): PayrollRun => {
    const runId = `payrun-${Date.now()}`;
    const activeEmps = activeOrgEmployees.filter((e) => e.employmentStatus === 'Active');

    let totalGross = 0;
    let totalNet = 0;
    let totalDeductions = 0;
    let totalTax = 0;
    let totalPF = 0;

    const generatedPayslips: Payslip[] = activeEmps.map((emp) => {
      const gross = emp.salaryDisplay.grossMonthly;
      const basic = Math.round((gross * salaryConfig.basicPercentageOfGross) / 100);
      const hra = Math.round((basic * salaryConfig.hraPercentageOfBasic) / 100);
      const allowances = gross - (basic + hra);
      const bonus = 0;

      // Illustrative Demo Formulas (Capped at 15k ceiling for PF demo)
      const pfEligibleBasic = Math.min(basic, salaryConfig.pfCeilingLimit);
      const pf = Math.round((pfEligibleBasic * salaryConfig.pfRatePercentage) / 100);
      const pt = salaryConfig.professionalTaxFixed;
      const tax = Math.round((gross * salaryConfig.estimatedTdsPercentage) / 100);
      const deductions = pf + pt + tax;
      const net = gross - deductions;

      totalGross += gross;
      totalNet += net;
      totalDeductions += deductions;
      totalTax += tax;
      totalPF += pf;

      return {
        id: `ps-${emp.id}-${month.toLowerCase()}-${year}`,
        orgId: activeOrgId,
        payrollRunId: runId,
        employeeId: emp.id,
        month,
        year,
        basic,
        hra,
        specialAllowances: allowances,
        performanceBonus: bonus,
        grossEarnings: gross,
        providentFund: pf,
        professionalTax: pt,
        taxDeductedAtSource: tax,
        totalDeductions: deductions,
        netPayable: net,
        paymentMode: 'Direct Deposit / NEFT',
        bankNameMasked: emp.bankDetailsMasked,
        generatedAt: new Date().toISOString().split('T')[0],
      };
    });

    const newRun: PayrollRun = {
      id: runId,
      orgId: activeOrgId,
      month,
      year,
      status: 'draft',
      totalGross,
      totalNet,
      totalDeductions,
      totalTax,
      totalPF,
      employeeCount: activeEmps.length,
      approvalWorkflow: {
        id: `wf-${runId}`,
        orgId: activeOrgId,
        module: 'payroll',
        entityId: runId,
        entityTitle: `${month} ${year} Payroll Run (${activeEmps.length} Employees)`,
        requestedBy: currentUserName,
        requestedAt: new Date().toISOString().split('T')[0],
        currentStepIndex: 0,
        steps: [
          { role: 'payroll_manager', roleTitle: 'Payroll Lead Verification', approverName: currentUserName, status: 'pending' },
          { role: 'hr_manager', roleTitle: 'Head of HR Authorization', status: 'pending' },
          { role: 'org_admin', roleTitle: 'Executive Disbursement Sign-off', status: 'pending' },
        ],
        status: 'pending',
      },
    };

    setPayrollRuns((prev) => [newRun, ...prev]);
    setPayslips((prev) => [...generatedPayslips, ...prev]);

    addAuditLog('PAYROLL_RUN_GENERATED', 'Payroll', 'PayrollRun', runId, undefined, `${month} ${year}`);
    return newRun;
  };

  const advancePayrollApproval = (runId: string, comments?: string) => {
    setPayrollRuns((prev) =>
      prev.map((run) => {
        if (run.id !== runId) return run;
        const currentIdx = run.approvalWorkflow.currentStepIndex;
        const steps = [...run.approvalWorkflow.steps];

        if (steps[currentIdx]) {
          steps[currentIdx] = {
            ...steps[currentIdx],
            status: 'approved',
            approverName: currentUserName,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments,
          };
        }

        const nextIdx = currentIdx + 1;
        const isComplete = nextIdx >= steps.length;
        const nextStatus = isComplete ? 'processed' : nextIdx === 1 ? 'preview' : 'hr_approved';

        return {
          ...run,
          status: nextStatus,
          processedAt: isComplete ? new Date().toISOString().split('T')[0] : undefined,
          approvalWorkflow: {
            ...run.approvalWorkflow,
            currentStepIndex: nextIdx,
            steps,
            status: isComplete ? 'approved' : 'pending',
          },
        };
      })
    );

    addAuditLog('PAYROLL_APPROVAL_ADVANCED', 'Payroll', 'PayrollRun', runId, undefined, `Step approved by ${currentUserName}`);
  };

  // Performance Module Handlers
  const createGoal = (goalData: Omit<PerformanceGoal, 'id' | 'orgId'>) => {
    const newGoal: PerformanceGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      orgId: activeOrgId,
    };
    setPerformanceGoals((prev) => [newGoal, ...prev]);
    addAuditLog('GOAL_CREATED', 'Performance', 'PerformanceGoal', newGoal.id, undefined, newGoal.title);
  };

  const updateGoalProgress = (goalId: string, progress: number, status: PerformanceGoal['status']) => {
    setPerformanceGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, progressPercent: progress, status } : g))
    );
    addAuditLog('GOAL_UPDATED', 'Performance', 'PerformanceGoal', goalId, undefined, `${progress}% - ${status}`);
  };

  const updateReviewRating = (
    reviewId: string,
    stage: PerformanceReview['currentStage'],
    rating: number,
    feedback: { strengths?: string; areasForImprovement?: string; comments?: string; recommendations?: string }
  ) => {
    setPerformanceReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const stageMap: Record<string, string> = {
          self: 'manager',
          manager: 'peer',
          peer: 'hr',
          hr: 'final',
          final: 'completed',
        };
        const nextStage = (stageMap[stage] || 'completed') as PerformanceReview['currentStage'];

        return {
          ...r,
          currentStage: nextStage,
          selfRating: stage === 'self' ? rating : r.selfRating,
          managerRating: stage === 'manager' ? rating : r.managerRating,
          peerRating: stage === 'peer' ? rating : r.peerRating,
          hrRating: stage === 'hr' ? rating : r.hrRating,
          finalRating: stage === 'final' ? rating : r.finalRating,
          strengths: feedback.strengths || r.strengths,
          areasForImprovement: feedback.areasForImprovement || r.areasForImprovement,
          comments: feedback.comments || r.comments,
          recommendations: feedback.recommendations || r.recommendations,
          status: nextStage === 'completed' ? 'Completed' : 'Pending Approval',
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      })
    );

    addAuditLog('REVIEW_RATED', 'Performance', 'PerformanceReview', reviewId, undefined, `Stage: ${stage}, Rating: ${rating}`);
  };

  // Recruitment Handlers
  const createJob = (jobData: Omit<JobRequisition, 'id' | 'orgId' | 'applicantCount' | 'createdAt'>) => {
    const newJob: JobRequisition = {
      ...jobData,
      id: `job-${Date.now()}`,
      orgId: activeOrgId,
      applicantCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);
    addAuditLog('JOB_REQUISITION_CREATED', 'Recruitment', 'JobRequisition', newJob.code, undefined, newJob.title);
  };

  const updateJobStatus = (jobId: string, status: JobRequisition['status']) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status } : j)));
    addAuditLog('JOB_STATUS_UPDATED', 'Recruitment', 'JobRequisition', jobId, undefined, status);
  };

  const moveCandidateStage = (candidateId: string, newStage: CandidateStage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
    addAuditLog('CANDIDATE_STAGE_MOVED', 'Recruitment', 'Candidate', candidateId, undefined, newStage);
  };

  const addCandidate = (candData: Omit<Candidate, 'id' | 'orgId' | 'appliedAt'>) => {
    const newCand: Candidate = {
      ...candData,
      id: `cand-${Date.now()}`,
      orgId: activeOrgId,
      appliedAt: new Date().toISOString().split('T')[0],
    };
    setCandidates((prev) => [newCand, ...prev]);
    setJobs((prev) =>
      prev.map((j) => (j.id === candData.jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j))
    );
    addAuditLog('CANDIDATE_SOURCED', 'Recruitment', 'Candidate', newCand.id, undefined, newCand.name);
  };

  const scheduleInterview = (interviewData: Omit<Interview, 'id' | 'orgId'>) => {
    const newInterview: Interview = {
      ...interviewData,
      id: `int-${Date.now()}`,
      orgId: activeOrgId,
    };
    setInterviews((prev) => [newInterview, ...prev]);
    addAuditLog('INTERVIEW_SCHEDULED', 'Recruitment', 'Interview', newInterview.id, undefined, newInterview.title);
  };

  const completeInterviewFeedback = (interviewId: string, feedback: string, score: number) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === interviewId ? { ...i, status: 'Completed', feedback, score } : i))
    );
    addAuditLog('INTERVIEW_FEEDBACK_SUBMITTED', 'Recruitment', 'Interview', interviewId, undefined, `Score: ${score}/5`);
  };

  // Workflow Handlers
  const approveWorkflowStep = (workflowId: string, comments?: string) => {
    setApprovalWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== workflowId) return wf;
        const currentIdx = wf.currentStepIndex;
        const steps = [...wf.steps];
        if (steps[currentIdx]) {
          steps[currentIdx] = {
            ...steps[currentIdx],
            status: 'approved',
            approverName: currentUserName,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments,
          };
        }
        const nextIdx = currentIdx + 1;
        const isFinished = nextIdx >= steps.length;

        return {
          ...wf,
          currentStepIndex: nextIdx,
          steps,
          status: isFinished ? 'approved' : 'pending',
        };
      })
    );
    addAuditLog('WORKFLOW_STEP_APPROVED', 'Approvals', 'ApprovalWorkflow', workflowId, undefined, comments);
  };

  const rejectWorkflowStep = (workflowId: string, comments?: string) => {
    setApprovalWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== workflowId) return wf;
        const currentIdx = wf.currentStepIndex;
        const steps = [...wf.steps];
        if (steps[currentIdx]) {
          steps[currentIdx] = {
            ...steps[currentIdx],
            status: 'rejected',
            approverName: currentUserName,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            comments,
          };
        }

        return {
          ...wf,
          steps,
          status: 'rejected',
        };
      })
    );
    addAuditLog('WORKFLOW_STEP_REJECTED', 'Approvals', 'ApprovalWorkflow', workflowId, undefined, comments);
  };

  // Notification Handlers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const convertCandidateToEmployee = (candidateId: string) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      orgId: activeOrgId,
      employeeCode: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
      name: cand.name,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      email: cand.email,
      phone: cand.phone,
      dob: '1994-05-15',
      gender: 'Male',
      address: cand.location,
      emergencyContact: {
        name: 'Family Contact',
        relationship: 'Spouse',
        phone: cand.phone,
      },
      departmentId: departments[0]?.id || 'dept-1',
      designationId: designations[0]?.id || 'desig-1',
      managerId: employees[0]?.id || null,
      employmentType: 'Full-time',
      joiningDate: new Date().toISOString().split('T')[0],
      workLocationId: locations[0]?.id || 'loc-1',
      shiftId: shifts[0]?.id || 'shift-1',
      salaryDisplay: {
        basic: Math.round(cand.expectedSalary * 0.5 / 12),
        hra: Math.round(cand.expectedSalary * 0.25 / 12),
        allowances: Math.round(cand.expectedSalary * 0.25 / 12),
        grossMonthly: Math.round(cand.expectedSalary / 12),
        annualCtc: cand.expectedSalary,
      },
      bankDetailsMasked: '•••• •••• 9921 (HDFC Bank)',
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: cand.resumeFileName || 'Resume_Document.pdf',
          type: 'Identity Proof',
          fileSize: '1.4 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
          verificationStatus: 'Verified',
        },
      ],
      employmentStatus: 'Active',
      lifecycleHistory: [
        {
          id: `lc-${Date.now()}`,
          employeeId: `emp-${Date.now()}`,
          type: 'onboarding',
          effectiveDate: new Date().toISOString().split('T')[0],
          title: 'Hired & Onboarded via ATS Pipeline',
          newValue: 'Active Employee',
          notes: `Converted from Candidate Requisition`,
          approvedBy: currentUserName,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: 'hired' } : c))
    );
    addAuditLog('CANDIDATE_HIRED_AND_ONBOARDED', 'Recruitment', 'Employee', newEmp.id, cand.name, newEmp.employeeCode);
  };

  const updateEmployeeLifecycle = (
    empId: string,
    event: { type: LifecycleType; effectiveDate: string; reason?: string; notes?: string; previousRole?: string; newRole?: string; previousDepartment?: string; newDepartment?: string },
    updates?: Partial<Employee>
  ) => {
    if (updates) {
      updateEmployee(empId, updates);
    }
    recordLifecycleEvent(
      empId,
      event.type,
      event.notes || `Transition: ${event.type}`,
      event.newRole || event.newDepartment || event.type,
      event.reason || '',
      event.previousRole || event.previousDepartment
    );
  };

  const activeOrgDepartments = useMemo(() => departments.filter((d) => d.orgId === activeOrgId), [departments, activeOrgId]);
  const activeOrgDesignations = useMemo(() => designations.filter((d) => d.orgId === activeOrgId), [designations, activeOrgId]);
  const activeOrgLocations = useMemo(() => locations.filter((l) => l.orgId === activeOrgId), [locations, activeOrgId]);
  const activeOrgShifts = useMemo(() => shifts.filter((s) => s.orgId === activeOrgId), [shifts, activeOrgId]);

  return (
    <AppContext.Provider
      value={{
        organizations,
        activeOrgId,
        activeOrg,
        currentRole,
        currentUserName,
        setActiveOrgId,
        setCurrentRole,
        activeModule,
        activeSubTab,
        setActiveModule,
        setActiveSubTab,
        availableModules: MODULE_DEFINITIONS,
        toggleModuleForOrg,
        setModulesForOrg,
        createOrganization,
        updateOrganization,
        toggleOrgStatus,
        updateOrgAttendancePolicy,
        addGeofence,
        removeGeofence,
        departments,
        designations,
        locations,
        shifts,
        employees,
        activeOrgEmployees,
        addEmployee,
        updateEmployee,
        recordLifecycleEvent,
        addDepartment,
        attendanceRecords,
        activeOrgAttendance,
        clockInWithLocation,
        clockOut,
        submitRegularizationRequest,
        approveRegularizationRequest,
        salaryConfig,
        payrollRuns,
        activeOrgPayrollRuns,
        payslips,
        activeOrgPayslips,
        updateSalaryConfig,
        processPayrollRun,
        advancePayrollApproval,
        performanceGoals,
        activeOrgGoals,
        performanceReviews,
        activeOrgReviews,
        createGoal,
        updateGoalProgress,
        updateReviewRating,
        jobs,
        activeOrgJobs,
        candidates,
        activeOrgCandidates,
        interviews,
        activeOrgInterviews,
        createJob,
        updateJobStatus,
        moveCandidateStage,
        addCandidate,
        scheduleInterview,
        completeInterviewFeedback,
        notifications,
        approvalWorkflows,
        activeOrgWorkflows,
        auditLogs,
        activeOrgAuditLogs,
        approveWorkflowStep,
        rejectWorkflowStep,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
        hasAccessToModule,
        canPerformAction,

        // Aliases
        role: currentRole,
        activeOrgDepartments,
        activeOrgDesignations,
        activeOrgLocations,
        activeOrgShifts,
        activeOrgPayroll: activeOrgPayslips,
        updateEmployeeLifecycle,
        updateAttendancePolicy: updateOrgAttendancePolicy,
        requestAttendanceRegularization: submitRegularizationRequest,
        resolveAttendanceRegularization: approveRegularizationRequest,
        addGoal: createGoal,
        submitReviewEvaluation: updateReviewRating,
        addJobPosting: createJob,
        updateCandidateStage: moveCandidateStage,
        convertCandidateToEmployee,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
