import { ArrowLeft, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BatumiHotel } from '../../data/batumiHotels'
import { PropertyGallery } from './PropertyGallery'
import { PropertyOverview } from './PropertyOverview'
import { PropertyReviews } from './PropertyReviews'
import { useLocale } from '../../i18n/LocaleProvider'

export function ApartmentDetailTemplate({ hotel }: { hotel: BatumiHotel }) {
  const { t } = useLocale()
  return <div className="hotel-profile apartment-profile">
    <section className="hotel-profile__intro">
      <div><Link to="/hotels"><ArrowLeft size={15} /> {t('All properties')}</Link><p className="eyebrow">{hotel.brand}</p><h1>{hotel.name}</h1></div>
      <div className="hotel-profile__intro-meta"><p><MapPin size={17} /> {hotel.address}</p><span>{hotel.gallery?.length ?? 0} {t('property photos')}</span></div>
    </section>
    <PropertyGallery hotel={hotel} />
    <PropertyOverview hotel={hotel} />
    <PropertyReviews hotel={hotel} />
  </div>
}
