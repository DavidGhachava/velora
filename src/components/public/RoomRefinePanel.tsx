import { Filter, RotateCcw } from 'lucide-react'
import { formatMoney } from '../../domain/money'
import { useLocale } from '../../i18n/LocaleProvider'

export type RoomSort = 'recommended' | 'price-asc' | 'price-desc' | 'size-desc' | 'capacity-desc'
export interface RoomRefineFilters { sort: RoomSort; minRate: number; maxRate: number; minSize: number; bed: string; accessibleOnly: boolean; amenities: string[] }
interface Props { filters: RoomRefineFilters; activeCount: number; update: <Key extends keyof RoomRefineFilters>(key: Key, value: RoomRefineFilters[Key]) => void; toggleAmenity: (amenity: string) => void; clear: () => void }
const amenityOptions = ['Kitchen', 'Balcony', 'Sea view', 'Washing machine']

export function RoomRefinePanel({ filters, activeCount, update, toggleAmenity, clear }: Props) {
  const { t } = useLocale()
  return <aside className="filters room-refine" aria-label={t('Filter and sort rooms')}>
    <div className="room-refine__heading"><p className="eyebrow"><Filter size={14} /> {t('Refine')}</p>{activeCount > 0 && <span>{activeCount} {t('active')}</span>}</div>
    <label><span>{t('Sort results')}</span><select value={filters.sort} onChange={(event) => update('sort', event.target.value as RoomSort)}><option value="recommended">{t('Recommended')}</option><option value="price-asc">{t('Price: low to high')}</option><option value="price-desc">{t('Price: high to low')}</option><option value="size-desc">{t('Largest rooms first')}</option><option value="capacity-desc">{t('Highest capacity')}</option></select></label>
    <div className="refine-price-grid"><label><span>{t('Minimum price')}</span><input type="range" min="10000" max="80000" step="1000" value={filters.minRate} onChange={(event) => update('minRate', Math.min(Number(event.target.value), filters.maxRate))} /><strong>{formatMoney(filters.minRate)}</strong></label><label><span>{t('Maximum price')}</span><input type="range" min="10000" max="80000" step="1000" value={filters.maxRate} onChange={(event) => update('maxRate', Math.max(Number(event.target.value), filters.minRate))} /><strong>{formatMoney(filters.maxRate)}</strong></label></div>
    <div className="refine-select-grid"><label><span>{t('Minimum room size')}</span><select value={filters.minSize} onChange={(event) => update('minSize', Number(event.target.value))}><option value="0">{t('Any size')}</option><option value="30">30+ m²</option><option value="40">40+ m²</option><option value="50">50+ m²</option></select></label><label><span>{t('Bed type')}</span><select value={filters.bed} onChange={(event) => update('bed', event.target.value)}><option value="all">{t('Any bed')}</option><option value="king">{t('King bed')}</option><option value="queen">{t('Queen bed')}</option><option value="twin">{t('Twin beds')}</option></select></label></div>
    <fieldset className="refine-checks"><legend>{t('Amenities')}</legend>{amenityOptions.map((amenity) => <label className="check-row" key={amenity}><input type="checkbox" checked={filters.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} /> {t(amenity)}</label>)}</fieldset>
    <label className="check-row refine-accessible"><input type="checkbox" checked={filters.accessibleOnly} onChange={(event) => update('accessibleOnly', event.target.checked)} /> {t('Accessible room option')}</label>
    <button className="room-refine__clear" type="button" onClick={clear} disabled={activeCount === 0}><RotateCcw size={15} /> {t('Clear filters')}</button>
  </aside>
}
