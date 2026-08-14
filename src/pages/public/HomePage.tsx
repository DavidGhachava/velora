import { ArrowRight, Clock3, MapPin, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HotelCard } from '../../components/public/HotelCard'
import { RoomCard } from '../../components/public/RoomCard'
import { StaySearch } from '../../components/public/StaySearch'
import { ResponsiveImage } from '../../components/ui/ResponsiveImage'
import { useAppData } from '../../data/AppDataProvider'
import { batumiHotels } from '../../data/batumiHotels'
import { heroImages } from '../../data/seed'
import { formatMoney } from '../../domain/money'
import { useLocale } from '../../i18n/LocaleProvider'

export function HomePage() {
  const { state } = useAppData()
  const { t, formatNumber } = useLocale()
  const areaCount = new Set(batumiHotels.map((hotel) => hotel.area)).size
  const roomCount = batumiHotels.reduce((total, hotel) => total + hotel.roomCount, 0)
  const apartmentStartingRate = Math.min(...batumiHotels.filter((hotel) => hotel.propertyType === 'Apartment').map((hotel) => hotel.startingRateGel ?? Number.POSITIVE_INFINITY))

  return <>
    <section className="public-hero">
      <ResponsiveImage className="public-hero__media" src={heroImages.batumi} sizes="100vw" fetchPriority="high" alt="Bright daytime view of Batumi Boulevard, the Black Sea, Alphabet Tower, Batumi Tower and surrounding mountains" />
      <div className="public-hero__content">
        <div className="public-hero__title"><p className="eyebrow">{t('Batumi, Georgia')}</p><h1>{t('Stay in Batumi')}</h1></div>
        <div className="hero-booking">
          <StaySearch />
        </div>
      </div>
    </section>
    <section className="stay-highlights" aria-label={t('Location information')}><div><MapPin /><span><strong>{t('Batumi Boulevard')}</strong>{t('Hotels near the city centre and beach')}</span></div><div><Clock3 /><span><strong>{t('Batumi Airport')}</strong>{t('About 10–20 minutes by car')}</span></div><div><Waves /><span><strong>{t('Black Sea coast')}</strong>{t('Beachfront and city options')}</span></div></section>
    <section className="section section--hotel-discovery"><div className="content-container">
      <div className="discovery-heading"><div><p className="eyebrow">{t('Batumi accommodation')}</p><h2>{t('Hotels and apartments')}</h2></div><div className="discovery-stats"><div><strong>{batumiHotels.length}</strong><span>{t('properties')}</span></div><div><strong>{areaCount}</strong><span>{t('areas')}</span></div><div><strong>{formatNumber(roomCount)}</strong><span>{t('rooms')}</span></div></div></div>
      <div className="value-callout"><div><span className="value-callout__mark">₾</span><div><strong>{t('Apartments from')} {formatMoney(apartmentStartingRate)}</strong><span>{t('Kitchen-equipped options near New Boulevard')}</span></div></div><Link to="/hotels">{t('View apartments')} <ArrowRight size={16} /></Link></div>
      <div className="hotel-grid hotel-grid--featured">{batumiHotels.slice(0, 3).map((hotel) => <HotelCard key={hotel.slug} hotel={hotel} />)}</div>
      <div className="section-action"><Link className="button button--secondary button--lg" to="/hotels">{t('View all properties')}</Link></div>
    </div></section>
    <section id="featured-rooms" className="section section--sand"><div className="content-container"><div className="compact-section-heading"><div><p className="eyebrow">Velora Batumi</p><h2>{t('Available room types')}</h2></div><Link className="inline-action" to="/rooms">{t('View all rooms')} <ArrowRight size={16} /></Link></div><div className="room-grid">{state.roomTypes.map((room) => <RoomCard key={room.id} room={room} />)}</div></div></section>
  </>
}
