import { SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AvailabilityCard } from '../../components/public/AvailabilityCard'
import { RoomRefinePanel, type RoomRefineFilters } from '../../components/public/RoomRefinePanel'
import { StaySearch } from '../../components/public/StaySearch'
import { useAppData } from '../../data/AppDataProvider'
import { getBatumiHotel } from '../../data/batumiHotels'
import { getAvailableRoomTypes, nightsBetween } from '../../domain/availability'
import { useLocale } from '../../i18n/LocaleProvider'

const initialFilters: RoomRefineFilters = { sort: 'recommended', minRate: 10000, maxRate: 80000, minSize: 0, bed: 'all', accessibleOnly: false, amenities: [] }

export function SearchPage() {
  const [params] = useSearchParams()
  const { state } = useAppData()
  const { t } = useLocale()
  const checkIn = params.get('checkIn') ?? '2026-08-14'
  const checkOut = params.get('checkOut') ?? '2026-08-17'
  const guests = Number(params.get('guests') ?? '2')
  const propertySlug = params.get('property') ?? undefined
  const property = getBatumiHotel(propertySlug)
  const [filters, setFilters] = useState<RoomRefineFilters>(initialFilters)
  const availableRooms = useMemo(() => getAvailableRoomTypes(state.roomTypes, state.rooms, state.reservations, checkIn, checkOut, guests), [checkIn, checkOut, guests, state])
  const results = useMemo(() => availableRooms.filter((room) => {
    const amenityText = room.amenities.join(' ').toLowerCase()
    return (!propertySlug || room.propertySlug === propertySlug) && (!filters.accessibleOnly || room.accessible) && room.baseRate >= filters.minRate && room.baseRate <= filters.maxRate && room.sizeM2 >= filters.minSize && (filters.bed === 'all' || room.bed.toLowerCase().includes(filters.bed)) && filters.amenities.every((amenity) => amenity === 'Balcony' ? amenityText.includes('balcony') || amenityText.includes('terrace') : amenityText.includes(amenity.toLowerCase()))
  }).sort((a, b) => {
    if (filters.sort === 'price-asc') return a.baseRate - b.baseRate
    if (filters.sort === 'price-desc') return b.baseRate - a.baseRate
    if (filters.sort === 'size-desc') return b.sizeM2 - a.sizeM2
    if (filters.sort === 'capacity-desc') return b.maxGuests - a.maxGuests
    return availableRooms.indexOf(a) - availableRooms.indexOf(b)
  }), [availableRooms, filters, propertySlug])
  const nights = nightsBetween(checkIn, checkOut)
  const query = params.toString()
  const activeCount = [filters.minRate !== initialFilters.minRate, filters.maxRate !== initialFilters.maxRate, filters.minSize > 0, filters.bed !== 'all', filters.accessibleOnly, ...filters.amenities.map(() => true)].filter(Boolean).length
  const updateFilter = <Key extends keyof RoomRefineFilters>(key: Key, value: RoomRefineFilters[Key]) => setFilters((current) => ({ ...current, [key]: value }))
  const toggleAmenity = (amenity: string) => setFilters((current) => ({ ...current, amenities: current.amenities.includes(amenity) ? current.amenities.filter((item) => item !== amenity) : [...current.amenities, amenity] }))

  return <div className="search-page">
    <section className="search-intro"><div><p className="eyebrow">{property?.name ?? t('Batumi properties')}</p><h1>{t('Available rooms')}</h1><p>{checkIn} → {checkOut} · {nights} {t('nights')} · {guests} {t('guests')}</p></div><StaySearch className="search-panel--page" defaults={{ checkIn, checkOut, guests }} propertySlug={propertySlug} /></section>
    <section className="search-results"><RoomRefinePanel filters={filters} activeCount={activeCount} update={updateFilter} toggleAmenity={toggleAmenity} clear={() => setFilters(initialFilters)} /><div className="results-list"><div className="results-header"><div><p className="eyebrow">{t('Available for your dates')}</p><h2>{results.length} {t(results.length === 1 ? 'room type' : 'room types')}</h2></div><span>{t('Complete stay prices shown before payment')}</span></div>{results.length > 0 ? results.map((room) => <AvailabilityCard key={room.id} room={room} nights={nights} query={query} />) : <div className="no-results"><SearchX size={34} /><h2>{t('No rooms match these filters.')}</h2><p>{t('Change the dates or clear the filters.')}</p><button className="button button--secondary button--md" onClick={() => setFilters(initialFilters)}>{t('Clear filters')}</button></div>}</div></section>
  </div>
}
