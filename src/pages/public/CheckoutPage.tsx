import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckoutExtras } from '../../components/public/CheckoutExtras'
import { CheckoutHeader } from '../../components/public/CheckoutHeader'
import { GuestPaymentForm, type GuestPaymentValues } from '../../components/public/GuestPaymentForm'
import { PriceSummary } from '../../components/public/PriceSummary'
import { useAppData } from '../../data/AppDataProvider'
import { getAvailableRooms, nightsBetween } from '../../domain/availability'
import { calculateTax, formatMoney } from '../../domain/money'
import type { FolioItem, Guest, Reservation } from '../../domain/types'
import { NotFoundPage } from '../NotFoundPage'
import { useLocale } from '../../i18n/LocaleProvider'

export function CheckoutPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { state, addReservation } = useAppData()
  const { t } = useLocale()
  const [step, setStep] = useState<'extras' | 'details'>('extras')
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const checkIn = params.get('checkIn') ?? '2026-08-14'
  const checkOut = params.get('checkOut') ?? '2026-08-17'
  const guestsCount = Number(params.get('guests') ?? '2')
  const room = state.roomTypes.find((item) => item.id === (params.get('roomType') ?? 'rt-suite'))
  if (!room) return <NotFoundPage />

  const stayNights = nightsBetween(checkIn, checkOut)
  const extrasPreview = state.extras.reduce((total, extra) => total + (selectedExtras[extra.id] ?? 0) * extra.price * (extra.unit === 'person' ? guestsCount : extra.unit === 'night' ? stayNights : 1), 0)
  const previewSubtotal = room.baseRate * stayNights + extrasPreview
  const previewTotal = previewSubtotal + calculateTax(previewSubtotal)
  const updateExtra = (id: string, quantity: number) => setSelectedExtras((current) => ({ ...current, [id]: quantity }))

  const submit = async (values: GuestPaymentValues) => {
    setSubmitting(true)
    setPaymentError(null)
    await new Promise((resolve) => window.setTimeout(resolve, 800))
    if (values.cardNumber.replaceAll(' ', '') === '4000000000000002') {
      setPaymentError('Your test card was declined. No charge was made. Try 4242 4242 4242 4242.')
      setSubmitting(false)
      return
    }
    const availableRoom = getAvailableRooms(room, state.rooms, state.reservations, checkIn, checkOut)[0]
    if (!availableRoom) {
      setPaymentError('This room category was just booked for your dates. Return to availability to choose another stay.')
      setSubmitting(false)
      return
    }
    const nights = nightsBetween(checkIn, checkOut)
    const extrasTotal = state.extras.reduce((total, extra) => total + (selectedExtras[extra.id] ?? 0) * extra.price * (extra.unit === 'person' ? guestsCount : extra.unit === 'night' ? nights : 1), 0)
    const subtotal = room.baseRate * nights + extrasTotal
    const tax = calculateTax(subtotal)
    const id = `res-${Date.now()}`
    const guestId = `g-${Date.now()}`
    const folio: FolioItem[] = [{ id: `${id}-room`, description: `${nights} nights · ${room.name}`, category: 'room', quantity: nights, unitAmount: room.baseRate, total: room.baseRate * nights, postedAt: new Date().toISOString() }]
    state.extras.forEach((extra) => {
      const quantity = selectedExtras[extra.id] ?? 0
      if (quantity > 0) folio.push({ id: `${id}-${extra.id}`, description: extra.name, category: 'extra', quantity, unitAmount: extra.price, total: quantity * extra.price * (extra.unit === 'person' ? guestsCount : extra.unit === 'night' ? nights : 1), postedAt: new Date().toISOString() })
    })
    folio.push({ id: `${id}-tax`, description: 'Taxes and fees', category: 'tax', quantity: 1, unitAmount: tax, total: tax, postedAt: new Date().toISOString() })
    const guest: Guest = { id: guestId, name: `${values.firstName} ${values.lastName}`, email: values.email, phone: values.phone, country: values.country, preferences: [] }
    const reservation: Reservation = { id, confirmationNumber: `VLR-2608-${String(state.reservations.length + 1010)}`, guestId, roomTypeId: room.id, roomId: availableRoom.id, checkIn, checkOut, adults: guestsCount, children: 0, status: 'confirmed', source: 'Direct', total: subtotal + tax, paid: subtotal + tax, eta: values.arrivalTime, specialRequest: values.request, createdAt: new Date().toISOString(), folio }
    try {
      await addReservation(reservation, guest)
      navigate(`/booking/confirmation/${id}`)
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'We could not complete the booking.')
      setSubmitting(false)
    }
  }

  const continueCheckout = () => {
    if (step === 'extras') {
      setStep('details')
      window.scrollTo(0, 0)
    } else {
      document.querySelector<HTMLFormElement>('.guest-form')?.requestSubmit()
    }
  }

  return <div className="checkout-page">
    <CheckoutHeader step={step} />
    <div className="checkout-layout">
      <div className="checkout-main">{step === 'extras' ? <CheckoutExtras extras={state.extras} selected={selectedExtras} onChange={updateExtra} onContinue={continueCheckout} /> : <GuestPaymentForm onSubmit={submit} onBack={() => setStep('extras')} loading={submitting} paymentError={paymentError} />}</div>
      <PriceSummary room={room} checkIn={checkIn} checkOut={checkOut} guests={guestsCount} extras={selectedExtras} catalog={state.extras} />
    </div>
    <div className="mobile-checkout-bar"><div><span>{t('Total')}</span><strong>{formatMoney(previewTotal)}</strong></div><button className="button button--primary button--md" type="button" disabled={submitting} onClick={continueCheckout}>{t(step === 'extras' ? 'Continue' : submitting ? 'Processing…' : 'Pay & reserve')}</button></div>
  </div>
}
