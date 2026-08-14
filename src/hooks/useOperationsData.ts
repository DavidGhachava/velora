import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { RoomCondition } from '../domain/types'
import { assignRoomLive, checkInLive, checkOutLive, loadOperationsState, setRoomConditionLive, settleLive } from '../data/operationsRepository'
import { supabase } from '../data/supabase'

const emptyState = { rooms: [], roomTypes: [], guests: [], reservations: [], extras: [], housekeeping: [], serviceOrders: [], channelEvents: [] }

export function useOperationsData() {
  const queryClient = useQueryClient()
  const [notice, setNotice] = useState<string | null>(null)
  const query = useQuery({ queryKey: ['operations-state'], queryFn: loadOperationsState })
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
    if (!supabase) return
    const channel = supabase.channel(`operations-state-${crypto.randomUUID()}`).on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['operations-state'] })
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['operations-state'] })
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'housekeeping_tasks' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['operations-state'] })
    }).subscribe()
    return () => { void supabase?.removeChannel(channel) }
  }, [queryClient])

  const run = async (action: () => Promise<void>, message: string): Promise<void> => {
    await mutation.mutateAsync({ action, message })
  }
  return {
    state: query.data ?? emptyState,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : mutation.error instanceof Error ? mutation.error.message : null,
    notice,
    clearNotice: () => setNotice(null),
    checkIn: (id: string) => run(() => checkInLive(id), 'Guest checked in.'),
    checkOut: (id: string) => run(() => checkOutLive(id), 'Guest checked out and housekeeping was notified.'),
    settle: (id: string) => run(() => settleLive(id), 'Folio balance settled.'),
    assignRoom: (reservationId: string, roomId: string) => run(() => assignRoomLive(reservationId, roomId), 'Room assignment saved.'),
    setRoomCondition: (roomId: string, condition: RoomCondition) => run(() => setRoomConditionLive(roomId, condition), `Room moved to ${condition}.`),
  }
}
