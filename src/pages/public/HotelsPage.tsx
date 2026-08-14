import { BadgeCheck, Search, X } from 'lucide-react'
import { HotelCard } from '../../components/public/HotelCard'
import { PropertyDirectoryFilters } from '../../components/public/PropertyDirectoryFilters'
import { ResponsiveImage } from '../../components/ui/ResponsiveImage'
import { batumiHotels } from '../../data/batumiHotels'
import { heroImages } from '../../data/seed'
import { usePropertyDirectory } from '../../hooks/usePropertyDirectory'
import { useLocale } from '../../i18n/LocaleProvider'

export function HotelsPage() {
  const directory = usePropertyDirectory()
  const { t } = useLocale()
  const areas = [...new Set(batumiHotels.map((hotel) => hotel.area))]
  return <div className="hotels-page">
    <section className="page-hero page-hero--hotels"><ResponsiveImage src={heroImages.batumi} sizes="100vw" fetchPriority="high" alt="Batumi skyline beside the Black Sea" /><div><p className="eyebrow">{t('Accommodation')}</p><h1>{t('Hotels and apartments in Batumi')}</h1></div></section>
    <section className="hotel-directory section"><div className="content-container">
      <div className="directory-search-row"><label className="directory-search"><Search size={18} /><span className="sr-only">{t('Search Batumi properties')}</span><input value={directory.filters.query} onChange={(event) => directory.updateFilter('query', event.target.value)} placeholder={t('Search by property, area or amenity')} />{directory.filters.query && <button type="button" aria-label={t('Clear search')} onClick={() => directory.updateFilter('query', '')}><X size={16} /></button>}</label><div className="verified-note"><BadgeCheck size={16} /><span>{t('Verified property details')}</span></div></div>
      <div className="hotel-directory-layout"><PropertyDirectoryFilters {...directory} areas={areas} /><div className="hotel-directory-results"><div className="hotel-results-heading"><div><p className="eyebrow">{t('Search results')}</p><h2>{directory.properties.length} {t(directory.properties.length === 1 ? 'property' : 'properties')}</h2></div><span>{directory.filters.arrival && directory.filters.departure ? `${directory.filters.arrival} – ${directory.filters.departure}` : t('Apartment prices shown in Georgian lari')}</span></div>{directory.properties.length ? <div className="hotel-grid">{directory.properties.map((hotel) => <HotelCard key={hotel.slug} hotel={hotel} />)}</div> : <div className="directory-empty"><h2>{t('No properties match these filters.')}</h2><p>{t('Try a wider price, another area or different dates.')}</p><button className="button button--secondary button--md" onClick={directory.clearFilters}>{t('Clear filters')}</button></div>}</div></div>
    </div></section>
  </div>
}
