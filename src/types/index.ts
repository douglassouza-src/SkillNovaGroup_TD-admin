export const ROLES = ['MASTER', 'MANAGER', 'COORDINATOR', 'TECHNICIAN'] as const
export type Role = (typeof ROLES)[number]

export function normalizeRole(role: string | null | undefined): Role {
  const normalized = role?.toUpperCase?.() ?? ''
  if (normalized === 'MASTER' || normalized === 'MANAGER' || normalized === 'COORDINATOR' || normalized === 'TECHNICIAN') {
    return normalized
  }
  return 'TECHNICIAN'
}

export const PARTICIPATION_STATUS = ['ABSENT', 'PARTICIPATED'] as const
export type ParticipationStatus = (typeof PARTICIPATION_STATUS)[number]

export const EVALUATIONS = ['POOR', 'GOOD', 'VERY_GOOD'] as const
export type Evaluation = (typeof EVALUATIONS)[number]

export const TRAINING_TYPES = ['MANDATORY', 'OPTIONAL'] as const
export type TrainingType = (typeof TRAINING_TYPES)[number]

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  role: Role
  teamId: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthenticatedUser
  token: string
}

export interface UserRef {
  id: string
  name: string
}

export interface Team {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  manager: UserRef | null
  coordinator: UserRef | null
}

export interface Training {
  id: string
  name: string
  description: string | null
  type: TrainingType
  isActive: boolean
  createdAt: string
}

export interface TrainingSession {
  id: string
  trainingId: string
  startAt: string
  endAt: string
  location: string | null
  notes: string | null
  isCancelled: boolean
  cancelledAt: string | null
  cancellationReason: string | null
}

export interface TrainingParticipant {
  id: string
  trainingSessionId: string
  userId: string
  participationStatus: ParticipationStatus
  evaluation: Evaluation | null
  attendanceRecordedAt: string | null
  evaluatedAt: string | null
  createdAt: string
}

export interface TechnicianTodo {
  trainingId: string
  trainingName: string
  type: TrainingType
  session: {
    id: string
    startAt: string
    endAt: string
    location: string | null
  }
}

export interface TechnicianHistoryItem {
  trainingId: string
  trainingName: string
  trainingType: TrainingType
  sessionId: string
  startAt: string
  endAt: string
  location?: string | null
  participationStatus: ParticipationStatus
  evaluation: Evaluation | null
}

export const ADMIN_ROLES: Role[] = ['MASTER', 'MANAGER', 'COORDINATOR']

export function isAdminRole(role: Role): boolean {
  return ADMIN_ROLES.includes(role)
}

export interface SessionParticipant {
  id: string
  trainingSessionId: string
  userId: string
  userName: string
  userEmail: string
  teamId: string | null
  teamName: string | null
  participationStatus: ParticipationStatus
  evaluation: Evaluation | null
  attendanceRecordedAt: string | null
  evaluatedAt: string | null
  createdAt: string
}

export interface ManagerDashboardSummary {
  teams: number
  technicians: number
  totalTrainings: number
  mandatoryTrainings: number
  completedSessions: number
  participationRate: number
  absenceRate: number
  averageEvaluation: number
}

export interface ManagerDashboardEvaluations {
  poor: number
  good: number
  veryGood: number
  total: number
}

export interface ManagerDashboardTeam {
  teamId: string
  teamName: string
  technicians: number
  participants: number
  participationRate: number
  absenceRate: number
  averageEvaluation: number
}

export interface ManagerDashboard {
  summary: ManagerDashboardSummary
  evaluations: ManagerDashboardEvaluations
  byTeam: ManagerDashboardTeam[]
}