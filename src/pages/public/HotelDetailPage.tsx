import { ArrowLeft, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ApartmentDetailTemplate } from '../../components/public/ApartmentDetailTemplate'
import { PropertyOverview } from '../../components/public/PropertyOverview'
import { getBatumiHotel } from '../../data/batumiHotels'
import { NotFoundPage } from '../NotFoundPage'
import { useLocale } from '../../i18n/LocaleProvider'

export function HotelDetailPage() {
  const { slug } = useParams()
  const { t } = useLocale()
  const hotel = getBatumiHotel(slug)
  if (!hotel) return <NotFoundPage />
  if (hotel.propertyType === 'Apartment') return <ApartmentDetailTemplate hotel={hotel} />

  return <div className="hotel-profile">
    <section className="hotel-profile__hero">
      <img src={hotel.image} srcSet={`${hotel.imageSmall} 640w, ${hotel.image} 1280w`} sizes="100vw" width="1280" height="800" fetchPriority="high" decoding="async" alt={hotel.imageAlt} />
      <div><Link to="/hotels"><ArrowLeft size={15} /> {t('All properties')}</Link><p className="eyebrow">{hotel.brand}</p><h1>{hotel.name}</h1><p><MapPin size={17} /> {hotel.address}</p></div>
    </section>
    <PropertyOverview hotel={hotel} />
  </div>
}
