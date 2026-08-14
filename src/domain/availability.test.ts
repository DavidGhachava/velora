import { describe, expect, it } from 'vitest'
import { getAvailableRooms, intervalsOverlap } from './availability'
import { initialState } from '../data/seed'

describe('half-open reservation intervals', () => {
  it('allows same-day turnover', () => expect(intervalsOverlap('2026-08-11', '2026-08-14', '2026-08-14', '2026-08-17')).toBe(false))
  it('detects a contained overlap', () => expect(intervalsOverlap('2026-08-11', '2026-08-14', '2026-08-12', '2026-08-13')).toBe(true))
  it('removes assigned overlapping rooms from availability', () => {
    const roomType = initialState.roomTypes.find((room) => room.id === 'rt-suite')!
    const rooms = getAvailableRooms(roomType, initialState.rooms, initialState.reservations, '2026-08-12', '2026-08-13')
    expect(rooms.some((room) => room.id === 'room-301')).toBe(false)
  })
})
