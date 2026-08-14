import { Accessibility, ArrowUpRight, BedDouble, Maximize2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { RoomType } from '../../domain/types'
import { formatMoney } from '../../domain/money'
import { useLocale } from '../../i18n/LocaleProvider'
import { ResponsiveImage } from '../ui/ResponsiveImage'

export function RoomCard({ room, bookingQuery }: { room: RoomType; bookingQuery?: string }) {
  const href = `/rooms/${room.slug}${bookingQuery ? `?${bookingQuery}` : ''}`
  const { t } = useLocale()
  return <article className="room-card">
    <Link className="room-card__media" to={href} aria-label={`${t('View room')} ${room.name}`}><ResponsiveImage className="room-card__image" src={room.image} sizes="(max-width: 767px) calc(100vw - 40px), 50vw" loading="lazy" alt={`${room.name} at ${room.propertyName ?? 'Velora Batumi'}`} /><span className="room-card__tag">{room.accessible ? t('Accessible option') : room.propertyName ?? 'Velora Batumi'}</span></Link>
    <div className="room-card__body"><div className="room-card__heading"><h3><Link to={href}>{t(room.name)}</Link></h3><p className="price"><strong>{formatMoney(room.baseRate)}</strong><span>{t('/ night')}</span></p></div><div className="room-facts"><span><Maximize2 size={15} /> {room.sizeM2} m²</span><span><BedDouble size={15} /> {t(room.bed)}</span><span><Users size={15} /> {room.maxGuests}</span>{room.accessible && <span className="sr-only"><Accessibility size={15} /> {t('Accessible option')}</span>}</div><Link className="room-card__action" to={href}>{t('View room')} <ArrowUpRight size={16} /></Link></div>
  </article>
}
