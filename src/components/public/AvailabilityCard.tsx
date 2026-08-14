import { Accessibility, BedDouble, Check, Maximize2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../domain/money'
import type { RoomType } from '../../domain/types'
import { useLocale } from '../../i18n/LocaleProvider'
import { ResponsiveImage } from '../ui/ResponsiveImage'

export function AvailabilityCard({ room, nights, query }: { room: RoomType; nights: number; query: string }) {
  const { t } = useLocale()
  return <article className="availability-card">
    <Link className="availability-card__media" to={`/rooms/${room.slug}?${query}`}><ResponsiveImage src={room.image} sizes="(max-width: 767px) calc(100vw - 40px), 360px" loading="lazy" alt={`${room.name} at ${room.propertyName ?? 'Velora Batumi'}`} />{room.accessible && <span><Accessibility size={14} /> {t('Accessible')}</span>}</Link>
    <div className="availability-card__body"><div>{room.propertyName && <p className="eyebrow">{room.propertyName}</p>}<h3><Link to={`/rooms/${room.slug}?${query}`}>{t(room.name)}</Link></h3></div><div className="availability-card__facts"><span><Maximize2 /> {room.sizeM2} m²</span><span><BedDouble /> {t(room.bed)}</span><span><Users /> {t('Up to')} {room.maxGuests}</span></div><p>{t(room.description)}</p><ul><li><Check /> {t('Free cancellation until 7 days before arrival')}</li><li><Check /> {t('No booking fee')}</li></ul></div>
    <div className="availability-card__rate"><p>{t('Total price')}</p><strong>{formatMoney(room.baseRate * nights)}</strong><span>{nights} {t('nights')} · {formatMoney(room.baseRate)} {t('per night')}</span><Link className="button button--primary button--md" to={`/booking?${query}&roomType=${room.id}`}>{t('Reserve')}</Link><Link className="text-link" to={`/rooms/${room.slug}?${query}`}>{t('Room details')}</Link></div>
  </article>
}
