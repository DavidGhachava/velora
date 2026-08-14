import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BatumiHotel } from '../../data/batumiHotels'
import { formatMoney } from '../../domain/money'
import { useLocale } from '../../i18n/LocaleProvider'
import { AmenityGrid } from './AmenityGrid'

export function PropertyOverview({ hotel }: { hotel: BatumiHotel }) {
  const { t } = useLocale()
  const includedAmenities = hotel.includedAmenities ?? ['Wi-Fi', 'Air conditioning', 'Daily housekeeping', '24-hour reception']
  const availableAmenities = hotel.availableAmenities ?? hotel.highlights
  return <section className="section hotel-profile__content"><div className={`content-container hotel-profile__layout${hotel.bookable ? '' : ' hotel-profile__layout--single'}`}>
    <main>
      <p className="eyebrow">{t(hotel.category)} · {t(hotel.area)}</p><h2>{t('Property overview')}</h2><p className="room-detail-lead">{t(hotel.summary)}</p>
      <div className="property-highlights">{hotel.highlights.map((fact) => <span key={fact}><Check size={15} />{t(fact)}</span>)}</div>
      <section className="hotel-amenities" aria-labelledby="hotel-amenities-title"><div className="amenities-heading"><div><p className="eyebrow">{t('Amenities')}</p><h3 id="hotel-amenities-title">{t('Included')}</h3></div><span><span aria-hidden="true">✓</span> {t('Included')}</span></div><AmenityGrid amenities={includedAmenities} /><div className="amenities-secondary"><h4>{t('Available at the property')}</h4><p>{t('Availability and additional charges can depend on the selected room.')}</p><AmenityGrid amenities={availableAmenities} compact /></div></section>
      <section className="profile-practical"><p className="eyebrow">{t('Policies')}</p><h3>{t('Booking information')}</h3>{hotel.practical.map((fact) => <p key={fact}>{t(fact)}</p>)}</section>
    </main>
    {hotel.bookable && <aside className="official-booking-card"><p className="eyebrow">{t('Price and availability')}</p>{hotel.startingRateGel && <div className="official-booking-card__rate"><span>{t('From')}</span><strong>{formatMoney(hotel.startingRateGel)}</strong><span>{t('per night')}</span></div>}<h3>{t('Book with Velora')}</h3><p>{t('Choose a room, complete payment and manage the reservation inside Velora.')}</p><Link className="button button--primary button--lg" to={`/availability?property=${hotel.slug}&checkIn=2026-08-14&checkOut=2026-08-17&guests=2`}>{t('Book a room')}</Link></aside>}
  </div></section>
}
