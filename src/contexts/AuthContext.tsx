import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authService from '../services/auth.service'
import {
  clearSession,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '../services/storage'
import type { AuthenticatedUser, LoginCredentials } from '../types'

interface AuthContextValue {
  user: AuthenticatedUser | null
  isLoading: boolean
  signIn: (credentials: LoginCredentials) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(getStoredUser)
  const [isLoading, setIsLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) {
      setIsLoading(false)
      return
    }

    let active = true

    authService
      .me()
      .then((current) => {
        if (!active) return
        const stored = getStoredUser()
        const merged: AuthenticatedUser = {
          id: current.id,
          name: stored?.name ?? '',
          email: stored?.email ?? '',
          role: current.role,
          teamId: current.teamId,
        }
        setStoredUser(merged)
        setUser(merged)
      })
      .catch(() => {
        if (!active) return
        clearSession()
        setUser(null)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const { token, user: loggedUser } = await authService.login(credentials)
    setToken(token)
    setStoredUser(loggedUser)
    setUser(loggedUser)
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, signIn, signOut }),
    [user, isLoading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}