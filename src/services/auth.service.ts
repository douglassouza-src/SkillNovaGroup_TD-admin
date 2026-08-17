import type { AuthenticatedUser, LoginCredentials, LoginResponse } from '../types'
import { api } from './api'

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials)
  return data
}

export async function me(): Promise<Pick<AuthenticatedUser, 'id' | 'role' | 'teamId'>> {
  const { data } = await api.get<{
    user: Pick<AuthenticatedUser, 'id' | 'role' | 'teamId'>
  }>('/auth/me')
  return data.user
}