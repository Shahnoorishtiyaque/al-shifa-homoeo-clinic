import { useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService.js'
import { AuthContext } from './authContext.js'
import { hasCredentials } from '../services/api.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => hasCredentials())

  useEffect(() => {
    let active = true
    if (!hasCredentials()) return () => { active = false }

    authService.currentUser()
      .then(current => { if (active) setUser(current) })
      .catch(() => { if (active) { authService.logout(); setUser(null) } })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [])

  const value = useMemo(() => ({ user, loading,
    async login(email, password) { const current = await authService.login(email, password); setUser(current); return current },
    logout() { authService.logout(); setUser(null) },
  }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
