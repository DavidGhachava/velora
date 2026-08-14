import { ArrowRight, Clock3, DoorOpen, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BatumiHotel } from '../../data/batumiHotels'
import { formatMoney } from '../../domain/money'
import { useLocale } from '../../i18n/LocaleProvider'

export function HotelCard({ hotel }: { hotel: BatumiHotel }) {
  const { t } = useLocale()
  return <article className="hotel-card">
    <Link className="hotel-card__media" to={`/hotels/${hotel.slug}`} aria-label={`Explore ${hotel.name}`}>
      <img src={hotel.imageSmall} srcSet={`${hotel.imageSmall} 640w, ${hotel.image} 1280w`} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 50vw, 440px" width="1280" height="800" loading="lazy" decoding="async" alt={hotel.imageAlt} />
      <span>{t(hotel.category)}</span>
    </Link>
    <div className="hotel-card__body">
      <div className="hotel-card__meta"><span><MapPin size={14} /> {t(hotel.area)}</span><span>{hotel.brand}</span></div>
      <h3><Link to={`/hotels/${hotel.slug}`}>{hotel.name}</Link></h3>
      {hotel.startingRateGel && <p className="hotel-card__rate"><span>{t('From')}</span><strong>{formatMoney(hotel.startingRateGel)}</strong><span>{t('/ night')}</span></p>}
      <div className="hotel-card__numbers"><div><DoorOpen /><strong>{hotel.roomCount}</strong><span>{t('rooms')}</span></div><div><Clock3 /><strong>{hotel.checkIn}</strong><span>{t('check-in')}</span></div><div><Clock3 /><strong>{hotel.checkOut}</strong><span>{t('check-out')}</span></div></div>
      <div className="hotel-card__actions"><Link className="button button--primary button--sm" to={`/hotels/${hotel.slug}`}>{t('View property')} <ArrowRight size={15} /></Link></div>
    </div>
  </article>
}
