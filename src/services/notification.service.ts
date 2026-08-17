import { api } from './api'

export async function sendTrainingAlert(trainingSessionId: string): Promise<void> {
  await api.post('/notifications/alerts', { trainingSessionId })
}