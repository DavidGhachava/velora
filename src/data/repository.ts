import type { AppState } from '../domain/types'
import type { Json } from './database.types'
import { initialState } from './seed'
import { supabase } from './supabase'

const STORAGE_KEY = 'velora-batumi-demo-state-v3'
const SNAPSHOT_NAME = 'velora-batumi-v3'

const cloneSeed = (): AppState => structuredClone(initialState)

export const loadState = async (): Promise<AppState> => {
  if (supabase) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session) {
      const { data, error } = await supabase.from('demo_snapshots').select('payload').eq('name', SNAPSHOT_NAME).maybeSingle()
      if (!error && data?.payload) return data.payload as unknown as AppState
    }
  }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return cloneSeed()
  try {
    return JSON.parse(stored) as AppState
  } catch {
    return cloneSeed()
  }
}

export const saveState = async (state: AppState): Promise<void> => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  if (supabase) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) return
    const payload = JSON.parse(JSON.stringify(state)) as Json
    const { error } = await supabase.from('demo_snapshots').upsert({ name: SNAPSHOT_NAME, payload, updated_at: new Date().toISOString() }, { onConflict: 'name' })
    if (error) throw new Error(error.message)
  }
}

export const resetState = async (): Promise<AppState> => {
  const state = cloneSeed()
  await saveState(state)
  return state
}
