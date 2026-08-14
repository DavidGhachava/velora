import { CalendarDays, ChevronDown, Filter, RotateCcw } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { formatMoney } from '../../domain/money'
import { directoryAmenities, type PropertyFilters, type PropertySort } from '../../hooks/usePropertyDirectory'
import { useLocale } from '../../i18n/LocaleProvider'

interface Props {
  filters: PropertyFilters
  sort: PropertySort
  areas: string[]
  activeFilterCount: number
  dateError: string
  setSort: (sort: PropertySort) => void
  updateFilter: <Key extends keyof PropertyFilters>(key: Key, value: PropertyFilters[Key]) => void
  toggleAmenity: (amenity: string) => void
  clearFilters: () => void
}

const showDatePicker = (event: MouseEvent<HTMLInputElement>) => event.currentTarget.showPicker?.()

export function PropertyDirectoryFilters({ filters, sort, areas, activeFilterCount, dateError, setSort, updateFilter, toggleAmenity, clearFilters }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useLocale()
  return <aside className={`property-refine${mobileOpen ? ' is-open' : ''}`} aria-label={t('Refine properties')}>
    <button className="property-refine__toggle" type="button" aria-expanded={mobileOpen} aria-controls="property-refine-fields" onClick={() => setMobileOpen((open) => !open)}><span><Filter size={15} /> <b>{t('Refine')}</b>{activeFilterCount > 0 && <i>{activeFilterCount}</i>}</span><ChevronDown size={17} /></button>
    <div className="property-refine__fields" id="property-refine-fields">
      <label><span>{t('Sort results')}</span><select value={sort} onChange={(event) => setSort(event.target.value as PropertySort)}><option value="recommended">{t('Recommended')}</option><option value="price-asc">{t('Price: low to high')}</option><option value="price-desc">{t('Price: high to low')}</option><option value="rating">{t('Guest rating')}</option><option value="size-desc">{t('Largest properties')}</option><option value="size-asc">{t('Smallest properties')}</option></select></label>
      <fieldset><legend>{t('Stay dates')}</legend><label><span>{t('Arrival')}</span><div className="property-date-input"><CalendarDays size={15} /><input className="date-picker-input" type="date" value={filters.arrival} onClick={showDatePicker} onChange={(event) => updateFilter('arrival', event.target.value)} /></div></label><label><span>{t('Departure')}</span><div className="property-date-input"><CalendarDays size={15} /><input className="date-picker-input" type="date" min={filters.arrival || undefined} value={filters.departure} onClick={showDatePicker} onChange={(event) => updateFilter('departure', event.target.value)} /></div></label>{dateError && <p className="field-error">{t(dateError)}</p>}</fieldset>
      <fieldset><legend>{t('Property')}</legend><label><span>{t('Type')}</span><select value={filters.propertyType} onChange={(event) => updateFilter('propertyType', event.target.value)}><option value="all">{t('All types')}</option><option value="Hotel">{t('Hotels')}</option><option value="Apartment">{t('Apartments')}</option></select></label><label><span>{t('Area')}</span><select value={filters.area} onChange={(event) => updateFilter('area', event.target.value)}><option value="all">{t('All Batumi areas')}</option>{areas.map((area) => <option value={area} key={area}>{t(area)}</option>)}</select></label></fieldset>
      <fieldset><legend>{t('Price and rating')}</legend><label><span>{t('Maximum nightly price')}</span><select value={filters.maxPriceGel} onChange={(event) => updateFilter('maxPriceGel', Number(event.target.value))}><option value="1000">{t('Any price')}</option>{[150, 250, 400, 600].map((price) => <option value={price} key={price}>{t('Up to')} {formatMoney(price * 100)}</option>)}</select></label><label><span>{t('Minimum guest score')}</span><select value={filters.minimumRating} onChange={(event) => updateFilter('minimumRating', Number(event.target.value))}><option value="0">{t('Any score')}</option><option value="7">7+ {t('Good')}</option><option value="8">8+ {t('Very good')}</option><option value="9">9+ {t('Exceptional')}</option></select></label></fieldset>
      <fieldset><legend>{t('Size and amenities')}</legend><label><span>{t('Property size')}</span><select value={filters.minimumRooms} onChange={(event) => updateFilter('minimumRooms', Number(event.target.value))}><option value="0">{t('Any size')}</option>{[50, 100, 200].map((count) => <option value={count} key={count}>{count}+ {t('rooms')}</option>)}</select></label><div className="property-refine__checks">{directoryAmenities.map((amenity) => <label key={amenity}><input type="checkbox" checked={filters.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} /> {t(amenity)}</label>)}</div></fieldset>
      <button className="property-refine__clear" type="button" onClick={clearFilters} disabled={activeFilterCount === 0}><RotateCcw size={15} /> {t('Clear filters')}</button>
    </div>
  </aside>
}
