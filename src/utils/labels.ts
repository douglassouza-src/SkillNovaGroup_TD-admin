import type { Evaluation, ParticipationStatus, Role, TrainingType } from '../types'

export const trainingTypeLabels: Record<TrainingType, string> = {
  MANDATORY: 'Obrigatório',
  OPTIONAL: 'Opcional',
}

export const participationLabels: Record<ParticipationStatus, string> = {
  PARTICIPATED: 'Participou',
  ABSENT: 'Ausente',
}

export const evaluationLabels: Record<Evaluation, string> = {
  POOR: 'Ruim',
  GOOD: 'Bom',
  VERY_GOOD: 'Muito bom',
}

export const roleLabels: Record<Role, string> = {
  MASTER: 'Master',
  MANAGER: 'Gestor',
  COORDINATOR: 'Coordenador',
  TECHNICIAN: 'Técnico',
}

export const evaluationColors: Record<Evaluation, 'error' | 'info' | 'success'> = {
  POOR: 'error',
  GOOD: 'info',
  VERY_GOOD: 'success',
}