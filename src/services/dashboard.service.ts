import type { ManagerDashboard } from '../types'
import { api } from './api'

export async function getManagerDashboard(): Promise<ManagerDashboard> {
  const { data } = await api.get<{ dashboard: ManagerDashboard }>('/dashboard/manager')
  return data.dashboard
}