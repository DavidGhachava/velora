import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PriceSummary } from '../../components/public/PriceSummary'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAppData } from '../../data/AppDataProvider'
import { formatMoney } from '../../domain/money'
import { NotFoundPage } from '../NotFoundPage'
import { useLocale } from '../../i18n/LocaleProvider'

type ManageTab = 'stay' | 'guest' | 'payment'

export function ManagePage() {
  const { reservationId } = useParams()
  const { state, updateArrival, cancelReservation } = useAppData()
  const { t } = useLocale()
  const reservation = state.reservations.find((item) => item.id === reservationId)
  const [eta, setEta] = useState(reservation?.eta ?? '15:00')
  const [request, setRequest] = useState(reservation?.specialRequest ?? '')
  const [tab, setTab] = useState<ManageTab>('stay')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!reservation) return <NotFoundPage />
  const guest = state.guests.find((item) => item.id === reservation.guestId)
  const room = state.roomTypes.find((item) => item.id === reservation.roomTypeId)
  if (!guest || !room) return <NotFoundPage />
  const extrasTotal = reservation.folio.filter((item) => item.category === 'extra').reduce((total, item) => total + item.total, 0)
  const save = async () => { setSaving(true); setError(null); try { await updateArrival(reservation.id, eta, request) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save.') } finally { setSaving(false) } }
  const cancel = async () => { if (!window.confirm(`Cancel ${reservation.confirmationNumber}? The full payment of ${formatMoney(reservation.paid)} will be refunded.`)) return; try { await cancelReservation(reservation.id) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not cancel.') } }

  return <section className="manage-page">
    <div className="manage-heading"><div><p className="eyebrow">Velora Batumi</p><h1>{t('Manage reservation')}</h1></div><div><StatusBadge status={reservation.status} /><span>{reservation.confirmationNumber}</span></div></div>
    {error && <div className="alert alert--error" role="alert">{error}</div>}
    <div className="manage-tabs" role="tablist" aria-label={t('Reservation details')}>{(['stay', 'guest', 'payment'] as const).map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)}>{t(item === 'guest' ? 'Guest details' : item === 'payment' ? 'Payment & folio' : 'Stay & arrival')}</button>)}</div>
    <div className="manage-grid"><div className="manage-panel" role="tabpanel">
      {tab === 'stay' && <><h2>{t('Arrival details')}</h2><p>{t('Saved changes are sent to the front desk.')}</p><div className="manage-stay-summary"><div><span>{t('Arrival')}</span><strong>{reservation.checkIn}</strong></div><div><span>{t('Departure')}</span><strong>{reservation.checkOut}</strong></div><div><span>{t('Room')}</span><strong>{t(room.name)}</strong></div></div><div className="field"><label htmlFor="manage-eta">{t('Approximate arrival')}</label><input id="manage-eta" type="time" value={eta} onChange={(event) => setEta(event.target.value)} /></div><div className="field"><label htmlFor="manage-request">{t('Special request')}</label><textarea id="manage-request" value={request} onChange={(event) => setRequest(event.target.value)} /></div><Button loading={saving} onClick={save}>{t('Save changes')}</Button></>}
      {tab === 'guest' && <><h2>{t('Guest details')}</h2><dl className="manage-details"><div><dt>{t('Name')}</dt><dd>{guest.name}</dd></div><div><dt>{t('Email')}</dt><dd>{guest.email}</dd></div><div><dt>{t('Phone')}</dt><dd>{guest.phone}</dd></div><div><dt>{t('Country')}</dt><dd>{t(guest.country)}</dd></div></dl></>}
      {tab === 'payment' && <><h2>{t('Payment and folio')}</h2><div className="manage-folio">{reservation.folio.map((item) => <div key={item.id}><span>{t(item.description)}</span><strong>{formatMoney(item.total)}</strong></div>)}<div className="manage-folio__total"><span>{t('Paid')}</span><strong>{formatMoney(reservation.paid)}</strong></div></div><Button variant="secondary" onClick={() => window.print()}>{t('Print folio')}</Button></>}
    </div><PriceSummary room={room} checkIn={reservation.checkIn} checkOut={reservation.checkOut} guests={reservation.adults} extraTotalOverride={extrasTotal} /></div>
    <div className="manage-footer"><div><h3>{t('Contact the hotel')}</h3><p><a href="mailto:stay@velorabatumi.example">stay@velorabatumi.example</a></p></div>{reservation.status === 'confirmed' && <Button variant="danger" onClick={cancel}>{t('Cancel reservation')}</Button>}<Link className="text-link" to="/hotels">{t('View Batumi properties')}</Link></div>
  </section>
}
