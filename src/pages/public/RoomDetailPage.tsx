import { Accessibility, ArrowLeft, BedDouble, Maximize2, Users } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AmenityGrid } from '../../components/public/AmenityGrid'
import { ResponsiveImage } from '../../components/ui/ResponsiveImage'
import { useAppData } from '../../data/AppDataProvider'
import { formatMoney } from '../../domain/money'
import { useLocale } from '../../i18n/LocaleProvider'
import { NotFoundPage } from '../NotFoundPage'

export function RoomDetailPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const { state } = useAppData()
  const { t } = useLocale()
  const room = state.roomTypes.find((item) => item.slug === slug)
  if (!room) return <NotFoundPage />
  const bookingParams = new URLSearchParams({ checkIn: params.get('checkIn') ?? '2026-08-14', checkOut: params.get('checkOut') ?? '2026-08-17', guests: params.get('guests') ?? '2', roomType: room.id })
  const bookingUrl = `/booking?${bookingParams.toString()}`
  return <>
    <section className="room-detail-hero"><ResponsiveImage src={room.image} sizes="100vw" fetchPriority="high" alt={`${room.name} room interior`} /><div><Link className="hero-back-link" to={room.propertySlug ? `/hotels/${room.propertySlug}` : '/rooms'}><ArrowLeft size={15} /> {room.propertyName ?? t('All rooms')}</Link><p className="eyebrow">{room.propertyName ?? 'Velora Batumi'}</p><h1>{t(room.name)}</h1></div></section>
    <section className="section"><div className="content-container room-detail-layout"><div className="room-detail-copy"><p className="eyebrow">{t('Room information')}</p><h2>{t('Room details')}</h2><p className="room-detail-lead">{t(room.description)}</p><div className="room-detail-facts"><span><Maximize2 /> <strong>{room.sizeM2} m²</strong>{t('Room size')}</span><span><BedDouble /> <strong>{t(room.bed)}</strong>{t('Bed type')}</span><span><Users /> <strong>{t('Up to')} {room.maxGuests}</strong>{t('Maximum guests')}</span>{room.accessible && <span><Accessibility /> <strong>{t('Accessible option')}</strong>{t('Available')}</span>}</div><div className="amenities-heading"><div><p className="eyebrow">{t('Amenities')}</p><h3>{t('Included in the price')}</h3></div><span><span aria-hidden="true">✓</span> {t('Included')}</span></div><AmenityGrid amenities={room.amenities} /><div className="policy-box"><h3>{t('Policies')}</h3><p>{t('Check-in from 15:00 · Check-out by 11:00. Flexible cancellation until 7 days before arrival. The complete stay total, taxes and payment timing appear before you reserve.')}</p></div></div><aside className="booking-card"><p className="eyebrow">{t('Price per night')}</p><p className="booking-price">{formatMoney(room.baseRate)} <span>{t('per night')}</span></p><p>{t('Breakfast optional · No booking fee.')}</p><Link className="button button--primary button--lg" to={bookingUrl}>{t('Reserve')}</Link><Link className="text-link" to={`/availability?${bookingParams.toString()}`}>{t('Compare rooms')}</Link></aside></div></section>
    <section className="gallery-strip" aria-label={`${room.name} gallery`}>{room.gallery.map((image, index) => <ResponsiveImage key={image} src={image} sizes="(max-width: 767px) 100vw, 33vw" loading="lazy" alt={`${room.name} gallery view ${index + 1}`} />)}</section>
    <div className="mobile-booking-bar"><div><span>{t('From')}</span><strong>{formatMoney(room.baseRate)} {t('/ night')}</strong></div><Link className="button button--primary button--md" to={bookingUrl}>{t('Choose room')}</Link></div>
  </>
}
