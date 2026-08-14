export type ReservationStatus = 'confirmed' | 'in_house' | 'checked_out' | 'cancelled' | 'no_show'
export type RoomCondition = 'dirty' | 'cleaning' | 'clean' | 'inspected'
export type RoomOccupancy = 'vacant' | 'occupied'
export type OperationalStatus = 'active' | 'out_of_service'
export type BookingSource = 'Direct' | 'Booking.com' | 'Airbnb' | 'Phone' | 'Walk-in'
export type HousekeepingStatus = 'open' | 'in_progress' | 'clean_complete' | 'completed' | 'deferred'
export type OrderStatus = 'submitted' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'posted'
export type SyncStatus = 'acknowledged' | 'queued' | 'failed' | 'conflict'

export interface RoomType {
  id: string
  propertySlug?: string
  propertyName?: string
  slug: string
  name: string
  tagline: string
  description: string
  sizeM2: number
  bed: string
  maxGuests: number
  baseRate: number
  roomIds: string[]
  amenities: string[]
  accessible: boolean
  image: string
  gallery: string[]
}

export interface Room {
  id: string
  number: string
  floor: number
  roomTypeId: string
  condition: RoomCondition
  occupancy: RoomOccupancy
  operationalStatus: OperationalStatus
  privacy: 'none' | 'dnd'
}

export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  country: string
  preferences: string[]
  vip?: boolean
}

export interface FolioItem {
  id: string
  description: string
  category: 'room' | 'extra' | 'minibar' | 'room_service' | 'tax' | 'payment' | 'adjustment'
  quantity: number
  unitAmount: number
  total: number
  postedAt: string
}

export interface Reservation {
  id: string
  confirmationNumber: string
  guestId: string
  roomTypeId: string
  roomId: string | null
  checkIn: string
  checkOut: string
  adults: number
  children: number
  status: ReservationStatus
  source: BookingSource
  total: number
  paid: number
  eta?: string
  specialRequest?: string
  createdAt: string
  folio: FolioItem[]
}

export interface Extra {
  id: string
  name: string
  description: string
  price: number
  unit: 'stay' | 'person' | 'night'
  icon: string
  image: string
  imageAlt: string
}

export interface HousekeepingTask {
  id: string
  roomId: string
  reservationId?: string
  serviceType: 'departure' | 'stayover' | 'inspection' | 'deep_clean'
  status: HousekeepingStatus
  assignee: string
  priority: 'standard' | 'priority' | 'urgent'
  dueAt: string
  note?: string
}

export interface ServiceOrder {
  id: string
  roomId: string
  reservationId: string
  guestName: string
  items: { name: string; quantity: number; price: number }[]
  status: OrderStatus
  total: number
  createdAt: string
}

export interface ChannelEvent {
  id: string
  channel: 'Booking.com' | 'Airbnb'
  direction: 'Inbound' | 'Outbound'
  type: string
  reference: string
  status: SyncStatus
  attempts: number
  occurredAt: string
  summary: string
}

export interface BookingDraft {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  roomTypeId: string
  selectedExtras: Record<string, number>
}

export interface AppState {
  rooms: Room[]
  roomTypes: RoomType[]
  guests: Guest[]
  reservations: Reservation[]
  extras: Extra[]
  housekeeping: HousekeepingTask[]
  serviceOrders: ServiceOrder[]
  channelEvents: ChannelEvent[]
}
