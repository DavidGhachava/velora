import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { RoomCondition } from '../domain/types'
import { assignRoomLive, checkInLive, checkOutLive, loadOperationsState, setRoomConditionLive, settleLive } from '../data/operationsRepository'
import { supabase } from '../data/supabase'
import { useAuth } from '../auth/AuthProvider'
import { useAppData } from '../data/AppDataProvider'

const emptyState = { rooms: [], roomTypes: [], guests: [], reservations: [], extras: [], housekeeping: [], serviceOrders: [], channelEvents: [] }

export function useOperationsData() {
  const queryClient = useQueryClient()
  const { preview } = useAuth()
  const local = useAppData()
  const [notice, setNotice] = useState<string | null>(null)
  const query = useQuery({ queryKey: ['operations-state'], queryFn: loadOperationsState, enabled: !preview })
  const mutation = useMutation({
    mutationFn: async ({ action, message }: { action: () => Promise<void>; message: string }) => {
      await action()
      return message
    },
    onSuccess: async (message) => {
      setNotice(message)
      await queryClient.invalidateQueries({ queryKey: ['operations-state'] })
    },
  })

  useEffect(() => {
    if (!supabase || preview) return
    const channel = supabase.channel(`operations-state-${crypto.randomUUID()}`).on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['operations-state'] })
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['operations-state'] })
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'housekeeping_tasks' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['operations-state'] })
    }).subscribe()
    return () => { void supabase?.removeChannel(channel) }
  }, [preview, queryClient])

  const run = async (action: () => Promise<void>, message: string): Promise<void> => {
    await mutation.mutateAsync({ action, message })
  }
  return {
    state: preview ? local.state : query.data ?? emptyState,
    isLoading: preview ? local.isLoading : query.isLoading,
    error: preview ? local.error : query.error instanceof Error ? query.error.message : mutation.error instanceof Error ? mutation.error.message : null,
    notice: preview ? local.notice : notice,
    clearNotice: preview ? local.clearNotice : () => setNotice(null),
    checkIn: (id: string) => preview ? local.checkIn(id) : run(() => checkInLive(id), 'Guest checked in.'),
    checkOut: (id: string) => preview ? local.checkOut(id) : run(() => checkOutLive(id), 'Guest checked out and housekeeping was notified.'),
    settle: (id: string) => preview ? local.settle(id) : run(() => settleLive(id), 'Folio balance settled.'),
    assignRoom: (reservationId: string, roomId: string) => preview ? local.assignRoom(reservationId, roomId) : run(() => assignRoomLive(reservationId, roomId), 'Room assignment saved.'),
    setRoomCondition: (roomId: string, condition: RoomCondition) => preview ? local.setRoomCondition(roomId, condition) : run(() => setRoomConditionLive(roomId, condition), `Room moved to ${condition}.`),
  }
}
