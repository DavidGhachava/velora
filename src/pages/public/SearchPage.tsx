import { SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { AvailabilityCard } from '../../components/public/AvailabilityCard'
import { RoomRefinePanel, type RoomRefineFilters } from '../../components/public/RoomRefinePanel'
import { StaySearch } from '../../components/public/StaySearch'
import { searchLiveAvailability } from '../../data/bookingRepository'
import { nightsBetween } from '../../domain/availability'
import { useLocale } from '../../i18n/LocaleProvider'
import { usePublicCatalog } from '../../hooks/usePublicCatalog'
import { defaultStayDates } from '../../domain/bookingDates'

const initialFilters: RoomRefineFilters = { sort: 'recommended', minRate: 10000, maxRate: 80000, minSize: 0, bed: 'all', accessibleOnly: false, amenities: [] }

export function SearchPage() {
  const [params] = useSearchParams()
  const catalog = usePublicCatalog()
  const defaultDates = defaultStayDates()
  const { t } = useLocale()
  const checkIn = params.get('checkIn') ?? defaultDates.checkIn
  const checkOut = params.get('checkOut') ?? defaultDates.checkOut
  const guests = Number(params.get('guests') ?? '2')
  const propertySlug = params.get('property') ?? undefined
  const property = catalog.data.properties.find((item) => item.slug === propertySlug)
  const [filters, setFilters] = useState<RoomRefineFilters>(initialFilters)
  const availability = useQuery({ queryKey: ['availability', checkIn, checkOut, guests], queryFn: () => searchLiveAvailability(checkIn, checkOut, guests), retry: 1 })
  const availableIds = useMemo(() => new Set((availability.data ?? []).map((item) => item.roomTypeId)), [availability.data])
  const availableRooms = useMemo(() => catalog.data.roomTypes.filter((room) => room.maxGuests >= guests && (!availability.data || availableIds.has(room.id))), [availability.data, availableIds, catalog.data.roomTypes, guests])
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
    <section className="search-results"><RoomRefinePanel filters={filters} activeCount={activeCount} update={updateFilter} toggleAmenity={toggleAmenity} clear={() => setFilters(initialFilters)} /><div className="results-list">{availability.isPending && <p className="catalog-status" role="status">{t('Checking live availability…')}</p>}{availability.error && <p className="catalog-status catalog-status--error" role="alert">{t('Live availability could not be checked. Try again.')}</p>}<div className="results-header"><div><p className="eyebrow">{t('Available for your dates')}</p><h2>{results.length} {t(results.length === 1 ? 'room type' : 'room types')}</h2></div><span>{t('Complete stay prices shown before payment')}</span></div>{results.length > 0 ? results.map((room) => <AvailabilityCard key={room.id} room={room} nights={nights} query={query} />) : <div className="no-results"><SearchX size={34} /><h2>{t('No rooms match these filters.')}</h2><p>{t('Change the dates or clear the filters.')}</p><button className="button button--secondary button--md" onClick={() => setFilters(initialFilters)}>{t('Clear filters')}</button></div>}</div></section>
  </div>
}
