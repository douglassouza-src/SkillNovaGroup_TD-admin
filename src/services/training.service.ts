import type {
    SessionParticipant,
  TechnicianHistoryItem,
  TechnicianTodo,
  Training,
  TrainingSession,
  TrainingType,
} from '../types'
import { api } from './api'

export async function listTrainings(): Promise<Training[]> {
  const { data } = await api.get<{ trainings: Training[] }>('/trainings')
  return data.trainings ?? []
}

export async function listTrainingSessions(trainingId: string): Promise<TrainingSession[]> {
  const { data } = await api.get<{ sessions: TrainingSession[] }>(
    `/trainings/${trainingId}/sessions`,
  )
  return data.sessions ?? []
}

export async function listMyTodo(): Promise<TechnicianTodo[]> {
  const { data } = await api.get<{ trainings: TechnicianTodo[] }>('/trainings/me/todo')
  return data.trainings ?? []
}

export async function listMyHistory(): Promise<TechnicianHistoryItem[]> {
  const { data } = await api.get<{ history: TechnicianHistoryItem[] }>('/trainings/me/history')
  return data.history ?? []
}


export interface CreateTrainingPayload {
  name: string
  description?: string | null
  type: TrainingType
}

export async function createTraining(payload: CreateTrainingPayload): Promise<void> {
  await api.post('/trainings', payload)
}

export async function associateTeam(trainingId: string, teamId: string): Promise<void> {
  await api.post(`/trainings/${trainingId}/teams`, { teamId })
}

export interface CreateSessionPayload {
  trainingId: string
  startAt: string
  endAt: string
  location?: string | null
  notes?: string | null
}

export interface ReschedulePayload {
  startAt: string
  endAt: string
  reason?: string | null
}

export async function createSession(payload: CreateSessionPayload): Promise<void> {
  await api.post('/trainings/sessions', payload)
}

export async function rescheduleSession(
  sessionId: string,
  payload: ReschedulePayload,
): Promise<void> {
  await api.patch(`/trainings/sessions/${sessionId}/reschedule`, payload)
}

export async function cancelSession(sessionId: string, reason: string): Promise<void> {
  await api.patch(`/trainings/sessions/${sessionId}/cancel`, { reason })
}

export interface SessionWithTraining extends TrainingSession {
  trainingName: string
  trainingType: TrainingType
}

export async function listAllSessions(): Promise<SessionWithTraining[]> {
  const trainings = await listTrainings()
  const grouped = await Promise.all(
    trainings.map(async (training) => {
      const sessions = await listTrainingSessions(training.id)
      return sessions.map((session) => ({
        ...session,
        trainingName: training.name,
        trainingType: training.type,
      }))
    }),
  )
  return grouped
    .flat()
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())
}

export async function listSessionParticipants(sessionId: string): Promise<SessionParticipant[]> {
  const { data } = await api.get<{ participants: SessionParticipant[] }>(
    `/trainings/sessions/${sessionId}/participants`,
  )
  return data.participants ?? []
}

export async function addParticipant(sessionId: string, userId: string): Promise<void> {
  await api.post(`/trainings/sessions/${sessionId}/participants`, { userId })
}

export async function recordAttendance(
  sessionId: string,
  participantId: string,
  participationStatus: ParticipationStatus,
): Promise<void> {
  await api.patch(
    `/trainings/sessions/${sessionId}/participants/${participantId}/attendance`,
    { participationStatus },
  )
}

export async function recordEvaluation(
  participantId: string,
  evaluation: Evaluation,
): Promise<void> {
  await api.patch(`/trainings/participants/${participantId}/evaluation`, { evaluation })
}