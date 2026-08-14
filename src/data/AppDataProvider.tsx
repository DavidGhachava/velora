import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AppState, Guest, Reservation, RoomCondition, ServiceOrder } from '../domain/types'
import { checkInReservation, checkOutReservation, settleFolio, transitionRoomCondition } from '../domain/operations'
import { intervalsOverlap } from '../domain/availability'
import { loadState, resetState, saveState } from './repository'
import { supabase } from './supabase'

interface AppDataContextValue {
  state: AppState
  isLoading: boolean
  error: string | null
  notice: string | null
  addReservation: (reservation: Reservation, guest?: Guest) => Promise<void>
  checkIn: (reservationId: string) => Promise<void>
  settle: (reservationId: string) => Promise<void>
  checkOut: (reservationId: string) => Promise<void>
  setRoomCondition: (roomId: string, condition: RoomCondition) => Promise<void>
  assignRoom: (reservationId: string, roomId: string) => Promise<void>
  advanceOrder: (orderId: string) => Promise<void>
  createOrder: (order: ServiceOrder) => Promise<void>
  postMinibar: (reservationId: string, description: string, amount: number) => Promise<void>
  retryChannel: (eventId: string) => Promise<void>
  updateArrival: (reservationId: string, eta: string, request: string) => Promise<void>
  cancelReservation: (reservationId: string) => Promise<void>
  resetDemo: () => Promise<void>
  clearNotice: () => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['velora-state'], queryFn: loadState, staleTime: Infinity })
  const [notice, setNotice] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: async (next: AppState) => { await saveState(next); return next },
    onSuccess: (next) => queryClient.setQueryData(['velora-state'], next),
  })
  const state = query.data

  useEffect(() => {
    const client = supabase
    if (!client) return
    const channel = client.channel('velora-demo').on('postgres_changes', { event: '*', schema: 'public', table: 'demo_snapshots' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['velora-state'] })
    }).subscribe()
    return () => { void client.removeChannel(channel) }
  }, [queryClient])

  const commit = useCallback(async (next: AppState, message: string) => {
    await mutation.mutateAsync(next)
    setNotice(message)
  }, [mutation])

  const value = useMemo<AppDataContextValue | null>(() => {
    if (!state) return null
    return {
      state,
      isLoading: query.isLoading,
      error: query.error instanceof Error ? query.error.message : mutation.error instanceof Error ? mutation.error.message : null,
      notice,
      clearNotice: () => setNotice(null),
      addReservation: async (reservation, guest) => {
        const overlap = state.reservations.some((item) => item.roomId === reservation.roomId && ['confirmed', 'in_house'].includes(item.status) && intervalsOverlap(item.checkIn, item.checkOut, reservation.checkIn, reservation.checkOut))
        if (overlap) throw new Error('That room was just booked. Choose another available room.')
        await commit({ ...state, guests: guest ? [...state.guests, guest] : state.guests, reservations: [...state.reservations, reservation] }, `Reservation ${reservation.confirmationNumber} confirmed.`)
      },
      checkIn: async (id) => commit(checkInReservation(state, id), 'Guest checked in successfully.'),
      settle: async (id) => commit(settleFolio(state, id), 'Outstanding balance settled.'),
      checkOut: async (id) => commit(checkOutReservation(state, id), 'Guest checked out and a departure clean was created.'),
      setRoomCondition: async (roomId, condition) => {
        const room = state.rooms.find((item) => item.id === roomId)
        if (!room) throw new Error('Room not found.')
        const nextRoom = transitionRoomCondition(room, condition)
        const housekeeping = state.housekeeping.map((task) => task.roomId === roomId
          ? { ...task, status: condition === 'inspected' ? 'completed' as const : condition === 'clean' ? 'clean_complete' as const : condition === 'cleaning' ? 'in_progress' as const : task.status }
          : task)
        await commit({ ...state, rooms: state.rooms.map((item) => item.id === roomId ? nextRoom : item), housekeeping }, `Room ${room.number} is now ${condition}.`)
      },
      assignRoom: async (reservationId, roomId) => {
        const reservation = state.reservations.find((item) => item.id === reservationId)
        const room = state.rooms.find((item) => item.id === roomId)
        if (!reservation || !room) throw new Error('Reservation or room not found.')
        if (room.roomTypeId !== reservation.roomTypeId) throw new Error('Select a room in the reserved category.')
        const conflict = state.reservations.some((item) => item.id !== reservationId && item.roomId === roomId && ['confirmed', 'in_house'].includes(item.status) && intervalsOverlap(item.checkIn, item.checkOut, reservation.checkIn, reservation.checkOut))
        if (conflict) throw new Error(`Room ${room.number} overlaps another confirmed stay.`)
        await commit({ ...state, reservations: state.reservations.map((item) => item.id === reservationId ? { ...item, roomId } : item) }, `Room ${room.number} assigned.`)
      },
      advanceOrder: async (orderId) => {
        const order = state.serviceOrders.find((item) => item.id === orderId)
        if (!order) throw new Error('Order not found.')
        const sequence = ['submitted', 'accepted', 'preparing', 'ready', 'delivered', 'posted'] as const
        const current = sequence.indexOf(order.status)
        const next = sequence[Math.min(current + 1, sequence.length - 1)]
        if (!next) return
        await commit({ ...state, serviceOrders: state.serviceOrders.map((item) => item.id === orderId ? { ...item, status: next } : item) }, `Order ${order.id} moved to ${next}.`)
      },
      createOrder: async (order) => commit({ ...state, serviceOrders: [...state.serviceOrders, order] }, `Room-service order ${order.id} submitted.`),
      postMinibar: async (reservationId, description, amount) => {
        const reservation = state.reservations.find((item) => item.id === reservationId)
        if (!reservation) throw new Error('Reservation not found.')
        const entry = { id: `minibar-${Date.now()}`, description, category: 'minibar' as const, quantity: 1, unitAmount: amount, total: amount, postedAt: new Date().toISOString() }
        await commit({ ...state, reservations: state.reservations.map((item) => item.id === reservationId ? { ...item, total: item.total + amount, folio: [...item.folio, entry] } : item) }, `${description} posted to ${reservation.confirmationNumber}.`)
      },
      retryChannel: async (eventId) => commit({ ...state, channelEvents: state.channelEvents.map((event) => event.id === eventId ? { ...event, status: 'acknowledged', attempts: event.attempts + 1, occurredAt: new Date().toISOString() } : event) }, 'Channel event acknowledged.'),
      updateArrival: async (reservationId, eta, request) => commit({ ...state, reservations: state.reservations.map((reservation) => reservation.id === reservationId ? { ...reservation, eta, specialRequest: request } : reservation) }, 'Arrival details updated.'),
      cancelReservation: async (reservationId) => {
        const reservation = state.reservations.find((item) => item.id === reservationId)
        if (!reservation || reservation.status !== 'confirmed') throw new Error('Only confirmed future reservations can be cancelled online.')
        await commit({ ...state, reservations: state.reservations.map((item) => item.id === reservationId ? { ...item, status: 'cancelled', paid: 0 } : item) }, 'Reservation cancelled. The payment was refunded.')
      },
      resetDemo: async () => {
        const reset = await resetState()
        queryClient.setQueryData(['velora-state'], reset)
        setNotice('Workspace data restored.')
      },
    }
  }, [commit, mutation.error, notice, query.error, query.isLoading, queryClient, state])

  if (!value) return <div className="app-loading" role="status">Preparing Velora Batumi…</div>
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = (): AppDataContextValue => {
  const value = useContext(AppDataContext)
  if (!value) throw new Error('useAppData must be used within AppDataProvider')
  return value
}
