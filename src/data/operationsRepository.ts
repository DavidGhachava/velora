import type { AppState, BookingSource, FolioItem, HousekeepingStatus, ReservationStatus, RoomCondition, ServiceOrder, OrderStatus } from '../domain/types'
import { initialState } from './seed'
import { supabase } from './supabase'

const requireClient = () => {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

const sourceFrom = (source: string): BookingSource => {
  if (source.toLowerCase() === 'direct') return 'Direct'
  if (source.toLowerCase() === 'phone') return 'Phone'
  if (source.toLowerCase() === 'walk-in') return 'Walk-in'
  if (source.toLowerCase() === 'airbnb') return 'Airbnb'
  return 'Booking.com'
}

const reservationStatusFrom = (status: string): ReservationStatus => {
  if (status === 'checked_in') return 'in_house'
  if (status === 'checked_out') return 'checked_out'
  if (status === 'cancelled') return 'cancelled'
  if (status === 'no_show') return 'no_show'
  return 'confirmed'
}

const orderStatusFrom = (status: string): OrderStatus => {
  if (status === 'received') return 'submitted'
  if (status === 'closed') return 'posted'
  if (['accepted', 'preparing', 'ready', 'delivered'].includes(status)) return status as OrderStatus
  return 'submitted'
}

const folioCategory = (entryType: string): FolioItem['category'] => {
  if (entryType === 'room_charge') return 'room'
  if (entryType === 'room_service') return 'room_service'
  if (entryType === 'minibar') return 'minibar'
  if (entryType === 'tax' || entryType === 'fee') return 'tax'
  if (entryType === 'payment' || entryType === 'refund') return 'payment'
  if (entryType === 'extra') return 'extra'
  return 'adjustment'
}

export const loadOperationsState = async (): Promise<AppState> => {
  const client = requireClient()
  const [
    roomsResult, roomTypesResult, roomTranslationsResult, guestsResult,
    reservationsResult, staysResult, assignmentsResult, foliosResult,
    entriesResult, paymentsResult, housekeepingResult, ordersResult, orderItemsResult,
  ] = await Promise.all([
    client.from('rooms').select('*').order('number'),
    client.from('room_types').select('*').order('display_order'),
    client.from('room_type_translations').select('*').eq('locale', 'en'),
    client.from('guests').select('*').order('created_at', { ascending: false }),
    client.from('reservations').select('*').order('check_in', { ascending: false }),
    client.from('reservation_stays').select('*').eq('status', 'active'),
    client.from('room_assignments').select('*').eq('status', 'active'),
    client.from('folios').select('*'),
    client.from('folio_entries').select('*').order('posted_at'),
    client.from('payments').select('*').eq('status', 'captured'),
    client.from('housekeeping_tasks').select('*').order('due_at'),
    client.from('service_orders').select('*').order('created_at', { ascending: false }),
    client.from('service_order_items').select('*'),
  ])
  const results = [roomsResult, roomTypesResult, roomTranslationsResult, guestsResult, reservationsResult, staysResult, assignmentsResult, foliosResult, entriesResult, paymentsResult, housekeepingResult, ordersResult, orderItemsResult]
  const failed = results.find((result) => result.error)
  if (failed?.error) throw new Error(failed.error.message)

  const rooms = (roomsResult.data ?? []).map((room) => ({
    id: room.id,
    number: room.number,
    floor: room.floor ?? 0,
    roomTypeId: room.room_type_id,
    condition: room.condition_status as RoomCondition,
    occupancy: room.occupancy_status as 'vacant' | 'occupied',
    operationalStatus: room.active ? 'active' as const : 'out_of_service' as const,
    privacy: room.privacy_status as 'none' | 'dnd',
  }))
  const roomTypes = (roomTypesResult.data ?? []).map((roomType) => {
    const translation = (roomTranslationsResult.data ?? []).find((item) => item.room_type_id === roomType.id)
    return {
      id: roomType.id,
      slug: roomType.slug,
      name: translation?.name ?? roomType.code,
      tagline: translation?.name ?? roomType.code,
      description: translation?.description ?? '',
      sizeM2: roomType.size_m2 ?? 0,
      bed: roomType.bed_type,
      maxGuests: roomType.max_guests,
      baseRate: roomType.base_rate_minor,
      roomIds: rooms.filter((room) => room.roomTypeId === roomType.id).map((room) => room.id),
      amenities: [],
      accessible: roomType.accessible,
      image: '/images/velora/suite-1600.webp',
      gallery: ['/images/velora/suite-1600.webp'],
    }
  })
  const guests = (guestsResult.data ?? []).map((guest) => ({
    id: guest.id,
    name: `${guest.first_name} ${guest.last_name}`.trim(),
    email: guest.email,
    phone: guest.phone ?? '',
    country: '',
    preferences: [],
  }))
  const staysByReservation = new Map((staysResult.data ?? []).map((stay) => [stay.reservation_id, stay]))
  const assignmentByStay = new Map((assignmentsResult.data ?? []).map((assignment) => [assignment.reservation_stay_id, assignment]))
  const folioByReservation = new Map((foliosResult.data ?? []).map((folio) => [folio.reservation_id, folio]))
  const reservations = (reservationsResult.data ?? []).map((reservation) => {
    const stay = staysByReservation.get(reservation.id)
    const assignment = stay ? assignmentByStay.get(stay.id) : undefined
    const folio = folioByReservation.get(reservation.id)
    const folioItems: FolioItem[] = (entriesResult.data ?? []).filter((entry) => entry.folio_id === folio?.id && entry.entry_type !== 'payment').map((entry) => ({
      id: entry.id,
      description: entry.description,
      category: folioCategory(entry.entry_type),
      quantity: 1,
      unitAmount: entry.amount_minor,
      total: entry.amount_minor,
      postedAt: entry.posted_at,
    }))
    const paid = (paymentsResult.data ?? []).filter((payment) => payment.reservation_id === reservation.id).reduce((sum, payment) => sum + payment.amount_minor, 0)
    return {
      id: reservation.id,
      confirmationNumber: reservation.confirmation_number,
      guestId: reservation.primary_guest_id,
      roomTypeId: stay?.room_type_id ?? '',
      roomId: assignment?.room_id ?? null,
      checkIn: reservation.check_in,
      checkOut: reservation.check_out,
      adults: reservation.adults,
      children: reservation.children,
      status: reservationStatusFrom(reservation.status),
      source: sourceFrom(reservation.source),
      total: reservation.total_minor,
      paid,
      specialRequest: reservation.special_requests ?? undefined,
      createdAt: reservation.created_at,
      folio: folioItems,
    }
  })
  const housekeeping = (housekeepingResult.data ?? []).map((task) => ({
    id: task.id,
    roomId: task.room_id,
    reservationId: task.reservation_id ?? undefined,
    serviceType: task.service_type === 'touch_up' ? 'stayover' as const : task.service_type as 'departure' | 'stayover' | 'inspection' | 'deep_clean',
    status: (task.status === 'assigned' || task.status === 'inspection_required' ? 'open' : task.status === 'cancelled' ? 'deferred' : task.status) as HousekeepingStatus,
    assignee: 'Unassigned',
    priority: task.priority === 'urgent' ? 'urgent' as const : task.priority === 'high' ? 'priority' as const : 'standard' as const,
    dueAt: task.due_at ?? task.created_at,
    note: task.notes ?? undefined,
  }))
  const serviceOrders: ServiceOrder[] = (ordersResult.data ?? []).map((order) => {
    const reservation = reservations.find((item) => item.id === order.reservation_id)
    const guest = guests.find((item) => item.id === reservation?.guestId)
    return {
      id: order.id,
      roomId: order.room_id,
      reservationId: order.reservation_id,
      guestName: guest?.name ?? 'Guest',
      items: (orderItemsResult.data ?? []).filter((item) => item.order_id === order.id).map((item) => ({ name: item.name_snapshot, quantity: item.quantity, price: item.unit_amount_minor })),
      status: orderStatusFrom(order.status),
      total: order.total_minor,
      createdAt: order.created_at,
    }
  })

  return { rooms, roomTypes, guests, reservations, extras: initialState.extras, housekeeping, serviceOrders, channelEvents: [] }
}

const runRpc = async (name: 'check_in_reservation' | 'check_out_reservation' | 'settle_reservation_folio', reservationId: string) => {
  const { error } = await requireClient().rpc(name, { p_reservation_id: reservationId })
  if (error) throw new Error(error.message)
}

export const checkInLive = (reservationId: string) => runRpc('check_in_reservation', reservationId)
export const checkOutLive = (reservationId: string) => runRpc('check_out_reservation', reservationId)
export const settleLive = (reservationId: string) => runRpc('settle_reservation_folio', reservationId)

export const assignRoomLive = async (reservationId: string, roomId: string) => {
  const { error } = await requireClient().rpc('assign_reservation_room', { p_reservation_id: reservationId, p_room_id: roomId })
  if (error) throw new Error(error.message)
}

export const setRoomConditionLive = async (roomId: string, condition: RoomCondition) => {
  const { error } = await requireClient().rpc('set_room_condition', { p_room_id: roomId, p_condition: condition })
  if (error) throw new Error(error.message)
}
