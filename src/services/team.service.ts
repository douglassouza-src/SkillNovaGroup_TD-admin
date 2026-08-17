import type { Team } from '../types'
import { api } from './api'

interface RawTeam {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  manager_id: string | null
  manager_name: string | null
  coordinator_id: string | null
  coordinator_name: string | null
}

function normalize(raw: RawTeam): Team {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    isActive: raw.is_active,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    manager: raw.manager_id ? { id: raw.manager_id, name: raw.manager_name ?? '' } : null,
    coordinator: raw.coordinator_id
      ? { id: raw.coordinator_id, name: raw.coordinator_name ?? '' }
      : null,
  }
}

export async function listTeams(): Promise<Team[]> {
  const { data } = await api.get<{ teams: RawTeam[] } | RawTeam[]>('/teams')
  const raw = Array.isArray(data) ? data : data.teams
  return (raw ?? []).map(normalize)
}

export async function getTeam(teamId: string): Promise<Team> {
  const { data } = await api.get<{ team: RawTeam } | RawTeam>(`/teams/${teamId}`)
  const raw = 'team' in (data as { team?: RawTeam }) ? (data as { team: RawTeam }).team : (data as RawTeam)
  return normalize(raw)
}

export interface TeamPayload {
  name: string
  description?: string | null
}

export async function createTeam(payload: TeamPayload): Promise<void> {
  await api.post('/teams', payload)
}

export async function updateTeam(teamId: string, payload: TeamPayload): Promise<void> {
  await api.patch(`/teams/${teamId}`, payload)
}

export async function assignManager(teamId: string, managerId: string): Promise<void> {
  await api.patch(`/teams/${teamId}/manager`, { managerId })
}

export async function assignCoordinator(teamId: string, coordinatorId: string): Promise<void> {
  await api.patch(`/teams/${teamId}/coordinator`, { coordinatorId })
}