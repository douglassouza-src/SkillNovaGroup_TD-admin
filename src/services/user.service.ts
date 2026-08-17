import type { Role, UserRef } from '../types'
import { api } from './api'

export interface UserOption extends UserRef {
  email: string
  role: Role
  teamId: string | null
  teamName: string | null
  isActive: boolean
}

interface RawUser {
  id: string
  name: string
  email: string
  role: Role
  team_id: string | null
  team_name: string | null
  is_active: boolean
}

export async function listUsers(): Promise<UserOption[]> {
  const { data } = await api.get<{ users: RawUser[] }>('/users')
  return (data.users ?? []).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    teamId: user.team_id,
    teamName: user.team_name,
    isActive: user.is_active,
  }))
}