import { describe, expect, it } from 'vitest'
import { checkInReservation, checkOutReservation, DomainError, settleFolio } from './operations'
import { initialState } from '../data/seed'

describe('front-desk transitions', () => {
  it('requires a physical room before check-in', () => expect(() => checkInReservation(structuredClone(initialState), 'res-1004')).toThrow(DomainError))
  it('checks in a ready assigned room', () => {
    const next = checkInReservation(structuredClone(initialState), 'res-1002')
    expect(next.reservations.find((item) => item.id === 'res-1002')?.status).toBe('in_house')
    expect(next.rooms.find((item) => item.id === 'room-202')?.occupancy).toBe('occupied')
  })
  it('settles then checks out and creates a dirty turnover', () => {
    const paid = settleFolio(structuredClone(initialState), 'res-1001')
    const next = checkOutReservation(paid, 'res-1001')
    expect(next.rooms.find((item) => item.id === 'room-301')?.condition).toBe('dirty')
    expect(next.housekeeping.some((task) => task.reservationId === 'res-1001')).toBe(true)
  })
})
