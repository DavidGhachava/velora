import { useMemo, useState } from 'react'
import { useAppData } from '../data/AppDataProvider'
import { batumiHotels, type BatumiHotel } from '../data/batumiHotels'
import { getAvailableRoomTypes } from '../domain/availability'
import { usePublicCatalog } from './usePublicCatalog'

export type PropertySort = 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'size-desc' | 'size-asc'

export interface PropertyFilters {
  query: string
  area: string
  propertyType: string
  arrival: string
  departure: string
  maxPriceGel: number
  minimumRating: number
  minimumRooms: number
  amenities: string[]
}

export const directoryAmenities = ['Wi-Fi', 'Kitchen', 'Pool', 'Parking']
const initialFilters: PropertyFilters = { query: '', area: 'all', propertyType: 'all', arrival: '', departure: '', maxPriceGel: 1000, minimumRating: 0, minimumRooms: 0, amenities: [] }

const comparePublishedPrice = (a: BatumiHotel, b: BatumiHotel, direction: 1 | -1) => {
  if (a.startingRateGel === undefined) return b.startingRateGel === undefined ? 0 : 1
  if (b.startingRateGel === undefined) return -1
  return (a.startingRateGel - b.startingRateGel) * direction
}

export function filterAndSortProperties(filters: PropertyFilters, sort: PropertySort, bookableSlugs: Set<string | undefined> | null, hotels = batumiHotels) {
  const normalizedQuery = filters.query.trim().toLowerCase()
  return hotels.filter((hotel) => {
    const searchable = `${hotel.name} ${hotel.brand} ${hotel.area} ${hotel.highlights.join(' ')} ${(hotel.includedAmenities ?? []).join(' ')}`.toLowerCase()
    const amenities = [...(hotel.includedAmenities ?? []), ...(hotel.availableAmenities ?? []), ...hotel.highlights].join(' ').toLowerCase()
    return (!normalizedQuery || searchable.includes(normalizedQuery))
      && (filters.propertyType === 'all' || (hotel.propertyType ?? 'Hotel') === filters.propertyType)
      && (filters.area === 'all' || hotel.area === filters.area)
      && (filters.maxPriceGel === 1000 || (hotel.startingRateGel !== undefined && hotel.startingRateGel <= filters.maxPriceGel * 100))
      && (filters.minimumRating === 0 || (hotel.reviews?.score ?? 0) >= filters.minimumRating)
      && hotel.roomCount >= filters.minimumRooms
      && filters.amenities.every((amenity) => amenities.includes(amenity.toLowerCase()))
      && (bookableSlugs === null || (hotel.bookable === true && bookableSlugs.has(hotel.slug)))
  }).sort((a, b) => {
    if (sort === 'price-asc') return comparePublishedPrice(a, b, 1)
    if (sort === 'price-desc') return comparePublishedPrice(a, b, -1)
    if (sort === 'rating') return (b.reviews?.score ?? -1) - (a.reviews?.score ?? -1)
    if (sort === 'size-desc') return b.roomCount - a.roomCount
    if (sort === 'size-asc') return a.roomCount - b.roomCount
    return hotels.indexOf(a) - hotels.indexOf(b)
  })
}

export function usePropertyDirectory() {
  const { state } = useAppData()
  const catalog = usePublicCatalog()
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters)
  const [sort, setSort] = useState<PropertySort>('recommended')

  const dateError = filters.arrival && filters.departure && filters.departure <= filters.arrival ? 'Departure must be after arrival.' : ''
  const bookableSlugs = useMemo(() => {
    if (!filters.arrival || !filters.departure || dateError) return null
    return new Set(getAvailableRoomTypes(state.roomTypes, state.rooms, state.reservations, filters.arrival, filters.departure, 1).map((room) => room.propertySlug).filter(Boolean))
  }, [dateError, filters.arrival, filters.departure, state.reservations, state.roomTypes, state.rooms])

  const properties = useMemo(() => filterAndSortProperties(filters, sort, bookableSlugs, catalog.data.properties), [bookableSlugs, catalog.data.properties, filters, sort])

  const activeFilterCount = [filters.propertyType !== 'all', filters.area !== 'all', Boolean(filters.arrival || filters.departure), filters.maxPriceGel !== 1000, filters.minimumRating > 0, filters.minimumRooms > 0, ...filters.amenities.map(() => true)].filter(Boolean).length
  const updateFilter = <Key extends keyof PropertyFilters>(key: Key, value: PropertyFilters[Key]) => setFilters((current) => ({ ...current, [key]: value }))
  const toggleAmenity = (amenity: string) => setFilters((current) => ({ ...current, amenities: current.amenities.includes(amenity) ? current.amenities.filter((item) => item !== amenity) : [...current.amenities, amenity] }))
  const clearFilters = () => setFilters((current) => ({ ...initialFilters, query: current.query }))

  return { properties, filters, sort, setSort, updateFilter, toggleAmenity, clearFilters, activeFilterCount, dateError, isLoading: catalog.isFetching, error: catalog.error }
}
