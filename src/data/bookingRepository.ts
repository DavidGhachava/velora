import type { Language } from '../i18n/LocaleProvider'
import { supabase } from './supabase'

export interface AvailabilityResult {
  roomTypeId: string
  availableCount: number
}

export interface DirectBookingInput {
  roomTypeId: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  firstName: string
  lastName: string
  email: string
  phone: string
  locale: Language
  specialRequests: string
  extras: Array<{ sku: string; quantity: number }>
}

export interface DirectBookingResult {
  reservationId: string
  confirmationNumber: string
  roomId: string
  totalMinor: number
  currency: 'GEL'
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

export const searchLiveAvailability = async (checkIn: string, checkOut: string, guests: number): Promise<AvailabilityResult[]> => {
  if (!supabase) throw new Error('Live availability is not configured.')
  const { data, error } = await supabase.functions.invoke('search-availability', { body: { checkIn, checkOut, guests } })
  if (error) throw new Error(error.message)
  if (!record(data) || !Array.isArray(data.rooms)) throw new Error('Availability returned an invalid response.')
  return data.rooms.flatMap((item): AvailabilityResult[] => {
    if (!record(item) || typeof item.room_type_id !== 'string') return []
    const count = typeof item.available_count === 'number' ? item.available_count : Number(item.available_count)
    return Number.isFinite(count) ? [{ roomTypeId: item.room_type_id, availableCount: count }] : []
  })
}

export const createDirectBooking = async (input: DirectBookingInput): Promise<DirectBookingResult> => {
  if (!supabase) throw new Error('Booking is not configured.')
  const { data, error } = await supabase.functions.invoke('create-booking', { body: input })
  if (error) throw new Error(error.message)
  if (!record(data) || typeof data.reservation_id !== 'string' || typeof data.confirmation_number !== 'string' || typeof data.room_id !== 'string' || typeof data.total_minor !== 'number' || data.currency !== 'GEL') {
    throw new Error('Booking returned an invalid response.')
  }
  return {
    reservationId: data.reservation_id,
    confirmationNumber: data.confirmation_number,
    roomId: data.room_id,
    totalMinor: data.total_minor,
    currency: data.currency,
  }
}
