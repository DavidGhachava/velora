import { CalendarPlus, Check, ExternalLink, Mail, MapPin, Printer } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PriceSummary } from '../../components/public/PriceSummary'
import { Button } from '../../components/ui/Button'
import { useAppData } from '../../data/AppDataProvider'
import { formatMoney } from '../../domain/money'
import { useLocale } from '../../i18n/LocaleProvider'
import { NotFoundPage } from '../NotFoundPage'

export function ConfirmationPage() {
  const { reservationId } = useParams()
  const { state } = useAppData()
  const { t } = useLocale()
  const reservation = state.reservations.find((item) => item.id === reservationId)
  if (!reservation) return <NotFoundPage />
  const guest = state.guests.find((item) => item.id === reservation.guestId)
  const room = state.roomTypes.find((item) => item.id === reservation.roomTypeId)
  if (!guest || !room) return <NotFoundPage />
  const extrasTotal = reservation.folio.filter((item) => item.category === 'extra').reduce((total, item) => total + item.total, 0)
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Velora Batumi · ${room.name}`)}&dates=${reservation.checkIn.replaceAll('-', '')}/${reservation.checkOut.replaceAll('-', '')}&details=${encodeURIComponent(`${t('Confirmation number')} ${reservation.confirmationNumber}`)}`
  return <section className="confirmation-page"><div className="confirmation-mark"><Check size={30} /></div><p className="eyebrow">{t('Reservation confirmed')}</p><h1>{t('Booking confirmed')}</h1><p className="confirmation-lead">{t('Confirmation details were prepared for')} {guest.email}.</p><div className="confirmation-number"><span>{t('Confirmation number')}</span><strong>{reservation.confirmationNumber}</strong></div><div className="confirmation-grid"><PriceSummary room={room} checkIn={reservation.checkIn} checkOut={reservation.checkOut} guests={reservation.adults} extraTotalOverride={extrasTotal} /><div className="next-steps"><h2>{t('Reservation details')}</h2><div className="itinerary-grid"><article><Mail /><strong>{t('Email')}</strong><span>{guest.email}</span></article><article><CalendarPlus /><strong>{reservation.checkIn} → {reservation.checkOut}</strong><span>{reservation.adults} {t('guests')} · {t(room.name)}</span></article><article><MapPin /><strong>{t('Arrival')} {reservation.eta ?? '15:00'}</strong><span>{room.propertyName ?? 'Velora Batumi'}</span></article></div><div className="confirmation-actions"><Link className="button button--primary button--lg" to={`/manage/${reservation.id}`}>{t('Manage reservation')}</Link><a className="button button--secondary button--lg" href={calendarUrl} target="_blank" rel="noreferrer">{t('Add to calendar')} <ExternalLink size={16} /></a><Button variant="secondary" size="lg" icon={<Printer size={16} />} onClick={() => window.print()}>{t('Print')}</Button></div><a className="directions-link" href="https://www.google.com/maps/search/?api=1&query=Batumi+Boulevard+Georgia" target="_blank" rel="noreferrer"><MapPin size={16} /> {t('Directions')} <ExternalLink size={14} /></a></div></div><p className="payment-proof">{t('Payment received')}: <strong>{formatMoney(reservation.paid)}</strong></p></section>
}
