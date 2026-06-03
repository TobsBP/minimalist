'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../hooks/use-auth'
import * as authService from '../service'
import type { AuthUser, LoginInput, RegisterInput } from '../types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    setUser(await authService.login(input))
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    setUser(await authService.register(input))
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
