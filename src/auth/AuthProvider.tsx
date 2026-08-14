import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../data/supabase'

interface AuthUser { id: string; email: string; name: string; role: string }
interface AuthContextValue { user: AuthUser | null; loading: boolean; signIn: (email: string, password: string) => Promise<void>; enterDemo: () => void; signOut: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null)

const mapUser = (user: User): AuthUser => ({ id: user.id, email: user.email ?? 'staff@velorabatumi.example', name: user.user_metadata.full_name as string | undefined ?? 'Velora team member', role: 'Property manager' })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => window.sessionStorage.getItem('velora-demo-auth') ? { id: 'demo-manager', email: 'alex@velorabatumi.example', name: 'Alex Morgan', role: 'Property manager' } : null)
  const [loading, setLoading] = useState(Boolean(supabase))
  useEffect(() => {
    const client = supabase
    if (!client) return
    void client.auth.getUser().then(({ data }) => { if (data.user) setUser(mapUser(data.user)); setLoading(false) })
    const { data } = client.auth.onAuthStateChange((_event, session) => setUser(session?.user ? mapUser(session.user) : null))
    return () => data.subscription.unsubscribe()
  }, [])
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    signIn: async (email, password) => {
      if (!supabase) throw new Error('Staff sign-in is not configured. Use workspace access instead.')
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      if (data.user) setUser(mapUser(data.user))
    },
    enterDemo: () => { window.sessionStorage.setItem('velora-demo-auth', 'true'); setUser({ id: 'demo-manager', email: 'alex@velorabatumi.example', name: 'Alex Morgan', role: 'Property manager' }) },
    signOut: async () => { window.sessionStorage.removeItem('velora-demo-auth'); if (supabase) await supabase.auth.signOut(); setUser(null) },
  }), [loading, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
