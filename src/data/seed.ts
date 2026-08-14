import type { AppState, ChannelEvent, Extra, Guest, HousekeepingTask, Reservation, Room, RoomType, ServiceOrder } from '../domain/types'

const images = {
  batumi: '/images/velora/batumi-daylight-hero-v3-2560.webp',
  garden: '/images/velora/garden-1600.webp',
  sea: '/images/velora/sea-1600.webp',
  suite: '/images/velora/suite-1600.webp',
  residence: '/images/velora/residence-1600.webp',
  pool: '/images/velora/pool-1600.webp',
  coast: '/images/velora/coast-1600.webp',
  dining: '/images/velora/dining-1600.webp',
}

export const roomTypes: RoomType[] = [
  {
    id: 'rt-white-sails-studio', propertySlug: 'white-sails-residential', propertyName: 'White Sails Residential Hotel', slug: 'white-sails-standard-studio', name: 'Standard Studio', tagline: 'Studio with kitchenette',
    description: 'Studio for two guests with a kitchenette, microwave, private bathroom and balcony.',
    sizeM2: 28, bed: 'Double or twin beds', maxGuests: 2, baseRate: 15000, accessible: false,
    roomIds: Array.from({ length: 6 }, (_, index) => `ws-${101 + index}`),
    amenities: ['Free Wi-Fi', 'Air conditioning', 'Kitchenette', 'Microwave', 'Washing machine', 'Private balcony', 'Smart TV'],
    image: '/images/hotels/white-sails-room-1-1200.webp', gallery: ['/images/hotels/white-sails-room-1-1200.webp', '/images/hotels/white-sails-room-2-1200.webp', '/images/hotels/white-sails-room-3-1200.webp'],
  },
  {
    id: 'rt-white-sails-suite', propertySlug: 'white-sails-residential', propertyName: 'White Sails Residential Hotel', slug: 'white-sails-suite', name: 'One-bedroom Suite', tagline: 'Separate bedroom and kitchen',
    description: 'One-bedroom apartment with a living area, equipped kitchenette and private balcony.',
    sizeM2: 48, bed: 'Queen bed and sofa bed', maxGuests: 4, baseRate: 23000, accessible: false,
    roomIds: Array.from({ length: 4 }, (_, index) => `ws-${201 + index}`),
    amenities: ['Free Wi-Fi', 'Air conditioning', 'Kitchenette', 'Microwave', 'Washing machine', 'Private balcony', 'Living area'],
    image: '/images/hotels/white-sails-room-2-1200.webp', gallery: ['/images/hotels/white-sails-room-2-1200.webp', '/images/hotels/white-sails-room-1-1200.webp', '/images/hotels/white-sails-room-4-1200.webp'],
  },
  {
    id: 'rt-solis-studio', propertySlug: 'solis-residence', propertyName: 'Solis Residence Aparthotel', slug: 'solis-superior-studio', name: 'Superior Studio', tagline: 'Sea-view studio with a private balcony',
    description: '35 m² studio for up to three guests with a queen bed, kitchen and private balcony.',
    sizeM2: 35, bed: 'Queen bed', maxGuests: 3, baseRate: 13000, accessible: false,
    roomIds: Array.from({ length: 6 }, (_, index) => `solis-${101 + index}`),
    amenities: ['Free Wi-Fi', 'Air conditioning', 'Kitchen', 'Microwave', 'Refrigerator', 'Washing machine', 'Private balcony', 'Sea-view option'],
    image: '/images/hotels/solis-residence-room-1-1600.webp', gallery: ['/images/hotels/solis-residence-room-1-1600.webp', '/images/hotels/solis-residence-room-3-1600.webp', '/images/hotels/solis-residence-room-4-1600.webp'],
  },
  {
    id: 'rt-solis-one-bedroom', propertySlug: 'solis-residence', propertyName: 'Solis Residence Aparthotel', slug: 'solis-sea-view-apartment', name: 'Sea-view Apartment', tagline: 'Separate bedroom and living space',
    description: '40 m² one-bedroom apartment for up to three guests with a kitchen and private balcony.',
    sizeM2: 40, bed: 'Queen bed and sofa bed', maxGuests: 3, baseRate: 19000, accessible: false,
    roomIds: Array.from({ length: 4 }, (_, index) => `solis-${201 + index}`),
    amenities: ['Free Wi-Fi', 'Air conditioning', 'Kitchen', 'Microwave', 'Refrigerator', 'Washing machine', 'Separate bedroom', 'Private balcony'],
    image: '/images/hotels/solis-residence-room-2-1600.webp', gallery: ['/images/hotels/solis-residence-room-2-1600.webp', '/images/hotels/solis-residence-room-3-1600.webp', '/images/hotels/solis-residence-room-4-1600.webp'],
  },
  {
    id: 'rt-garden', slug: 'garden-atelier', name: 'Garden Atelier', tagline: 'Ground-floor room with terrace',
    description: '38 m² ground-floor room with a king bed, planted terrace and step-free access.',
    sizeM2: 38, bed: 'King bed', maxGuests: 2, baseRate: 39000, accessible: true,
    roomIds: Array.from({ length: 12 }, (_, index) => `room-${101 + index}`),
    amenities: ['Free Wi-Fi', 'Air conditioning', 'Smart TV', 'Private garden', 'Rain shower', 'Breakfast terrace', 'Step-free entry', 'Minibar'],
    image: images.garden, gallery: [images.garden, images.pool, images.dining],
  },
  {
    id: 'rt-sea', slug: 'sea-terrace', name: 'Sea Terrace', tagline: 'Sea-view room with terrace',
    description: '46 m² sea-view room with a private terrace, king or twin beds and a soaking tub.',
    sizeM2: 46, bed: 'King or twin beds', maxGuests: 3, baseRate: 52000, accessible: true,
    roomIds: Array.from({ length: 16 }, (_, index) => `room-${201 + index}`),
    amenities: ['Free Wi-Fi', 'Air conditioning', 'Smart TV', 'Sea terrace', 'Soaking tub', 'Twin option', 'Accessible bathroom available', 'Minibar'],
    image: images.sea, gallery: [images.sea, images.coast, images.pool],
  },
  {
    id: 'rt-suite', slug: 'horizon-suite', name: 'Horizon Suite', tagline: 'Suite with separate living room',
    description: '72 m² suite with a king bedroom, separate living room and wraparound terrace.',
    sizeM2: 72, bed: 'King bed', maxGuests: 3, baseRate: 78000, accessible: false,
    roomIds: Array.from({ length: 10 }, (_, index) => `room-${301 + index}`),
    amenities: ['Free Wi-Fi', 'Air conditioning', 'Smart TV', 'Wraparound terrace', 'Separate living room', 'Outdoor shower', 'Daily aperitivo', 'Premium minibar'],
    image: images.suite, gallery: [images.suite, images.coast, images.dining],
  },
  {
    id: 'rt-residence', slug: 'velora-residence', name: 'Velora Residence', tagline: 'Two-bedroom residence with pool',
    description: '148 m² residence with two king bedrooms, kitchen, dining area, washing machine and private pool.',
    sizeM2: 148, bed: 'Two king bedrooms', maxGuests: 5, baseRate: 145000, accessible: false,
    roomIds: Array.from({ length: 4 }, (_, index) => `room-${401 + index}`),
    amenities: ['Free Wi-Fi', 'Air conditioning', 'Smart TV', 'Full kitchen', 'Microwave', 'Washing machine', 'Private infinity pool', 'Two bedrooms', 'Dedicated host', 'Dining salon', 'Airport transfer'],
    image: images.residence, gallery: [images.residence, images.pool, images.coast],
  },
]

const roomNumbers = roomTypes.flatMap((type) => type.roomIds.map((id) => ({ id, roomTypeId: type.id })))

export const rooms: Room[] = roomNumbers.map(({ id, roomTypeId }, index) => {
  const number = id.replace('room-', '')
  return {
    id,
    number,
    floor: Number(number[0]),
    roomTypeId,
    condition: index === 8 ? 'dirty' : index === 17 ? 'cleaning' : index === 25 ? 'clean' : 'inspected',
    occupancy: [1, 4, 13, 21, 29].includes(index) ? 'occupied' : 'vacant',
    operationalStatus: index === 37 ? 'out_of_service' : 'active',
    privacy: index === 13 ? 'dnd' : 'none',
  }
})

export const guests: Guest[] = [
  { id: 'g-1', name: 'Amelia Laurent', email: 'amelia@example.com', phone: '+33 6 12 34 56 78', country: 'France', preferences: ['Feather-free pillows', 'Sparkling water'], vip: true },
  { id: 'g-2', name: 'Noah Bennett', email: 'noah@example.com', phone: '+44 7700 900123', country: 'United Kingdom', preferences: ['Late arrival'] },
  { id: 'g-3', name: 'Sofia Rossi', email: 'sofia@example.com', phone: '+39 320 555 0192', country: 'Italy', preferences: ['Vegetarian'] },
  { id: 'g-4', name: 'Elias Weber', email: 'elias@example.com', phone: '+49 151 5550101', country: 'Germany', preferences: ['High floor'] },
  { id: 'g-5', name: 'Maya Chen', email: 'maya@example.com', phone: '+1 415 555 0134', country: 'United States', preferences: ['Yoga mat'], vip: true },
  { id: 'g-6', name: 'Lucas Martin', email: 'lucas@example.com', phone: '+34 611 222 333', country: 'Spain', preferences: [] },
  { id: 'g-7', name: 'Ingrid Solberg', email: 'ingrid@example.com', phone: '+47 900 11 222', country: 'Norway', preferences: ['Quiet room'] },
  { id: 'g-8', name: 'Theo Morgan', email: 'theo@example.com', phone: '+61 412 345 678', country: 'Australia', preferences: ['Twin beds'] },
]

const roomFolio = (nights: number, nightly: number): Reservation['folio'] => [
  { id: `fi-${nightly}-room`, description: `${nights} nights accommodation`, category: 'room', quantity: nights, unitAmount: nightly, total: nights * nightly, postedAt: '2026-08-08T12:00:00Z' },
  { id: `fi-${nightly}-tax`, description: 'Local taxes and fees', category: 'tax', quantity: 1, unitAmount: Math.round(nights * nightly * 0.1), total: Math.round(nights * nightly * 0.1), postedAt: '2026-08-08T12:00:00Z' },
]

export const reservations: Reservation[] = [
  { id: 'res-1001', confirmationNumber: 'VLR-2608-1001', guestId: 'g-1', roomTypeId: 'rt-suite', roomId: 'room-301', checkIn: '2026-08-11', checkOut: '2026-08-14', adults: 2, children: 0, status: 'in_house', source: 'Direct', total: 257400, paid: 257400, eta: '15:30', createdAt: '2026-06-18T10:00:00Z', folio: roomFolio(3, 78000) },
  { id: 'res-1002', confirmationNumber: 'VLR-2608-1002', guestId: 'g-2', roomTypeId: 'rt-sea', roomId: 'room-202', checkIn: '2026-08-11', checkOut: '2026-08-13', adults: 2, children: 1, status: 'confirmed', source: 'Booking.com', total: 114400, paid: 0, eta: '18:00', createdAt: '2026-07-22T09:00:00Z', folio: roomFolio(2, 52000) },
  { id: 'res-1003', confirmationNumber: 'VLR-2608-1003', guestId: 'g-3', roomTypeId: 'rt-garden', roomId: 'room-105', checkIn: '2026-08-10', checkOut: '2026-08-12', adults: 1, children: 0, status: 'in_house', source: 'Airbnb', total: 85800, paid: 85800, createdAt: '2026-07-11T08:00:00Z', folio: roomFolio(2, 39000) },
  { id: 'res-1004', confirmationNumber: 'VLR-2608-1004', guestId: 'g-4', roomTypeId: 'rt-garden', roomId: null, checkIn: '2026-08-11', checkOut: '2026-08-15', adults: 2, children: 0, status: 'confirmed', source: 'Phone', total: 171600, paid: 50000, eta: '14:00', createdAt: '2026-08-01T14:00:00Z', folio: roomFolio(4, 39000) },
  { id: 'res-1005', confirmationNumber: 'VLR-2608-1005', guestId: 'g-5', roomTypeId: 'rt-residence', roomId: 'room-401', checkIn: '2026-08-12', checkOut: '2026-08-16', adults: 4, children: 1, status: 'confirmed', source: 'Direct', total: 638000, paid: 319000, eta: '13:30', specialRequest: 'Celebrating an anniversary', createdAt: '2026-05-04T11:00:00Z', folio: roomFolio(4, 145000) },
  { id: 'res-1006', confirmationNumber: 'VLR-2608-1006', guestId: 'g-6', roomTypeId: 'rt-sea', roomId: 'room-207', checkIn: '2026-08-13', checkOut: '2026-08-17', adults: 2, children: 0, status: 'confirmed', source: 'Airbnb', total: 228800, paid: 228800, createdAt: '2026-07-19T15:00:00Z', folio: roomFolio(4, 52000) },
  { id: 'res-1007', confirmationNumber: 'VLR-2608-1007', guestId: 'g-7', roomTypeId: 'rt-suite', roomId: 'room-304', checkIn: '2026-08-14', checkOut: '2026-08-18', adults: 2, children: 0, status: 'confirmed', source: 'Direct', total: 343200, paid: 343200, createdAt: '2026-06-30T10:00:00Z', folio: roomFolio(4, 78000) },
  { id: 'res-1008', confirmationNumber: 'VLR-2608-1008', guestId: 'g-8', roomTypeId: 'rt-sea', roomId: 'room-210', checkIn: '2026-08-08', checkOut: '2026-08-11', adults: 2, children: 0, status: 'checked_out', source: 'Booking.com', total: 171600, paid: 171600, createdAt: '2026-05-21T12:00:00Z', folio: roomFolio(3, 52000) },
]

export const extras: Extra[] = [
  { id: 'extra-transfer', name: 'Airport transfer', description: 'Private transfer from Batumi International Airport to the property.', price: 9500, unit: 'stay', icon: 'car', image: images.batumi, imageAlt: 'Batumi skyline on the route from the airport' },
  { id: 'extra-breakfast', name: 'Breakfast', description: 'Daily breakfast for one guest.', price: 3800, unit: 'person', icon: 'coffee', image: images.dining, imageAlt: 'Breakfast table prepared for guests' },
  { id: 'extra-spa', name: '60-minute spa treatment', description: 'One 60-minute wellness treatment for one guest.', price: 16500, unit: 'person', icon: 'sparkles', image: images.pool, imageAlt: 'Calm pool and wellness area' },
  { id: 'extra-sail', name: 'Two-hour boat trip', description: 'Private two-hour Black Sea boat trip for the reservation.', price: 28000, unit: 'stay', icon: 'sailboat', image: images.coast, imageAlt: 'Black Sea coast near Batumi' },
]

export const housekeeping: HousekeepingTask[] = [
  { id: 'hk-1', roomId: 'room-109', serviceType: 'departure', status: 'open', assignee: 'Elena', priority: 'urgent', dueAt: '2026-08-11T13:00:00Z', note: 'VIP arrival at 14:00' },
  { id: 'hk-2', roomId: 'room-206', serviceType: 'stayover', status: 'deferred', assignee: 'Marco', priority: 'standard', dueAt: '2026-08-11T15:00:00Z', note: 'DND at 11:20' },
  { id: 'hk-3', roomId: 'room-302', serviceType: 'inspection', status: 'clean_complete', assignee: 'Lucia', priority: 'priority', dueAt: '2026-08-11T13:30:00Z' },
  { id: 'hk-4', roomId: 'room-214', serviceType: 'departure', status: 'in_progress', assignee: 'Ana', priority: 'standard', dueAt: '2026-08-11T14:30:00Z' },
]

export const serviceOrders: ServiceOrder[] = [
  { id: 'ord-1', roomId: 'room-301', reservationId: 'res-1001', guestName: 'Amelia Laurent', items: [{ name: 'Wild herb risotto', quantity: 1, price: 3400 }, { name: 'Mineral water', quantity: 1, price: 800 }], status: 'preparing', total: 4620, createdAt: '2026-08-11T11:42:00Z' },
  { id: 'ord-2', roomId: 'room-105', reservationId: 'res-1003', guestName: 'Sofia Rossi', items: [{ name: 'Citrus breakfast', quantity: 1, price: 2800 }], status: 'delivered', total: 3080, createdAt: '2026-08-11T08:12:00Z' },
]

export const channelEvents: ChannelEvent[] = [
  { id: 'sync-1', channel: 'Booking.com', direction: 'Outbound', type: 'availability.updated', reference: 'INV-SEA-0811', status: 'acknowledged', attempts: 1, occurredAt: '2026-08-11T12:04:00Z', summary: 'Sea Terrace availability updated for 11–18 Aug.' },
  { id: 'sync-2', channel: 'Airbnb', direction: 'Inbound', type: 'reservation.created', reference: 'AIR-889201', status: 'acknowledged', attempts: 1, occurredAt: '2026-08-11T11:51:00Z', summary: 'Reservation VLR-2608-1006 imported and mapped.' },
  { id: 'sync-3', channel: 'Booking.com', direction: 'Outbound', type: 'rate.updated', reference: 'RATE-HZN-0815', status: 'failed', attempts: 3, occurredAt: '2026-08-11T11:38:00Z', summary: 'Horizon Suite rate update timed out.' },
  { id: 'sync-4', channel: 'Airbnb', direction: 'Inbound', type: 'reservation.modified', reference: 'AIR-881774', status: 'conflict', attempts: 1, occurredAt: '2026-08-11T10:16:00Z', summary: 'Requested dates intersect an existing locked assignment.' },
]

export const initialState: AppState = { rooms, roomTypes, guests, reservations, extras, housekeeping, serviceOrders, channelEvents }

export const heroImages = images
