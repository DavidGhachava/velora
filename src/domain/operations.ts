import { formatISO } from 'date-fns'
import type { AppState, FolioItem, HousekeepingTask, Reservation, Room } from './types'
import { sum } from './money'

export class DomainError extends Error {
  override name = 'DomainError'
}

export const folioBalance = (reservation: Reservation): number =>
  sum(reservation.folio.map((item) => item.total)) - reservation.paid

export const checkInReservation = (state: AppState, reservationId: string): AppState => {
  const reservation = state.reservations.find((item) => item.id === reservationId)
  if (!reservation || reservation.status !== 'confirmed') throw new DomainError('Only confirmed reservations can check in.')
  if (!reservation.roomId) throw new DomainError('Assign a room before check-in.')
  const room = state.rooms.find((item) => item.id === reservation.roomId)
  if (!room || room.condition !== 'inspected' || room.operationalStatus !== 'active') {
    throw new DomainError('The assigned room must be active and inspected before check-in.')
  }
  return {
    ...state,
    reservations: state.reservations.map((item) => item.id === reservationId ? { ...item, status: 'in_house' } : item),
    rooms: state.rooms.map((item) => item.id === room.id ? { ...item, occupancy: 'occupied' } : item),
  }
}

export const checkOutReservation = (state: AppState, reservationId: string): AppState => {
  const reservation = state.reservations.find((item) => item.id === reservationId)
  if (!reservation || reservation.status !== 'in_house') throw new DomainError('Only in-house reservations can check out.')
  if (folioBalance(reservation) > 0) throw new DomainError('Settle the outstanding folio balance before checkout.')
  if (!reservation.roomId) throw new DomainError('This stay has no assigned room.')
  const now = new Date()
  const task: HousekeepingTask = {
    id: `hk-${Date.now()}`,
    roomId: reservation.roomId,
    reservationId,
    serviceType: 'departure',
    status: 'open',
    assignee: 'Unassigned',
    priority: 'priority',
    dueAt: formatISO(new Date(now.getTime() + 90 * 60 * 1000)),
  }
  return {
    ...state,
    reservations: state.reservations.map((item) => item.id === reservationId ? { ...item, status: 'checked_out' } : item),
    rooms: state.rooms.map((item) => item.id === reservation.roomId ? { ...item, occupancy: 'vacant', condition: 'dirty' } : item),
    housekeeping: [...state.housekeeping, task],
  }
}

export const settleFolio = (state: AppState, reservationId: string): AppState => {
  const reservation = state.reservations.find((item) => item.id === reservationId)
  if (!reservation) throw new DomainError('Reservation not found.')
  const balance = folioBalance(reservation)
  if (balance <= 0) return state
  const payment: FolioItem = {
    id: `payment-${Date.now()}`,
    description: 'Card payment',
    category: 'payment',
    quantity: 1,
    unitAmount: -balance,
    total: -balance,
    postedAt: new Date().toISOString(),
  }
  return {
    ...state,
    reservations: state.reservations.map((item) => item.id === reservationId
      ? { ...item, paid: item.paid + balance, folio: [...item.folio, payment] }
      : item),
  }
}

export const transitionRoomCondition = (room: Room, next: Room['condition']): Room => {
  const allowed: Record<Room['condition'], Room['condition'][]> = {
    dirty: ['cleaning'],
    cleaning: ['clean', 'inspected'],
    clean: ['inspected', 'cleaning'],
    inspected: ['dirty', 'cleaning'],
  }
  if (!allowed[room.condition].includes(next)) throw new DomainError(`Cannot move ${room.condition} room to ${next}.`)
  return { ...room, condition: next }
}
