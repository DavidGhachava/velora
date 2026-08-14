import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../data/supabase'

interface AuthUser {
  id: string
  email: string
  name: string
  role: 'Owner'
}

interface OwnerProfile {
  email: string
  full_name: string
  role: 'owner'
  active: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  preview: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  enterDemo: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const demoUser: AuthUser = {
  id: 'preview-owner',
  email: 'davidavowo@gmail.com',
  name: 'David',
  role: 'Owner',
}

const getAuthorizedOwner = async (identity: User): Promise<AuthUser | null> => {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('app_users')
    .select('email, full_name, role, active')
    .eq('id', identity.id)
    .maybeSingle<OwnerProfile>()

  if (error || !data?.active || data.role !== 'owner') return null

  return {
    id: identity.id,
    email: data.email || identity.email || '',
    name: data.full_name,
    role: 'Owner',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    return window.sessionStorage.getItem('velora-owner-preview') ? demoUser : null
  })
  const [loading, setLoading] = useState(Boolean(supabase) && !window.sessionStorage.getItem('velora-owner-preview'))

  useEffect(() => {
    const client = supabase
    if (!client) return

    let mounted = true

    const applyIdentity = async (identity: User | null) => {
      if (window.sessionStorage.getItem('velora-owner-preview')) {
        if (mounted) {
          setUser(demoUser)
          setLoading(false)
        }
        return
      }
      const owner = identity ? await getAuthorizedOwner(identity) : null
      if (!mounted) return
      setUser(owner)
      setLoading(false)
    }

    void client.auth.getUser().then(({ data }) => applyIdentity(data.user))
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => void applyIdentity(session?.user ?? null), 0)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    preview: user?.id === demoUser.id,
    loading,
    signIn: async (email, password) => {
      if (!supabase) throw new Error('Owner sign-in is not configured yet.')

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)

      const owner = data.user ? await getAuthorizedOwner(data.user) : null
      if (!owner) {
        await supabase.auth.signOut()
        setUser(null)
        throw new Error('This account is not authorized to manage Velora.')
      }

      setUser(owner)
    },
    enterDemo: () => {
      window.sessionStorage.setItem('velora-owner-preview', 'true')
      setUser(demoUser)
      setLoading(false)
    },
    signOut: async () => {
      window.sessionStorage.removeItem('velora-owner-preview')
      if (supabase) await supabase.auth.signOut()
      setUser(null)
    },
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
