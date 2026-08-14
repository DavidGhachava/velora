import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckoutExtras } from '../../components/public/CheckoutExtras'
import { CheckoutHeader } from '../../components/public/CheckoutHeader'
import { GuestPaymentForm, type GuestPaymentValues } from '../../components/public/GuestPaymentForm'
import { PriceSummary } from '../../components/public/PriceSummary'
import { useAppData } from '../../data/AppDataProvider'
import { createDirectBooking } from '../../data/bookingRepository'
import { nightsBetween } from '../../domain/availability'
import { calculateTax, formatMoney } from '../../domain/money'
import type { FolioItem, Guest, Reservation } from '../../domain/types'
import { usePublicCatalog } from '../../hooks/usePublicCatalog'
import { useLocale } from '../../i18n/LocaleProvider'
import { NotFoundPage } from '../NotFoundPage'
import { defaultStayDates } from '../../domain/bookingDates'

export function CheckoutPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { state, addReservation } = useAppData()
  const catalog = usePublicCatalog()
  const { t, language } = useLocale()
  const defaultDates = defaultStayDates()
  const [step, setStep] = useState<'extras' | 'details'>('extras')
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const checkIn = params.get('checkIn') ?? defaultDates.checkIn
  const checkOut = params.get('checkOut') ?? defaultDates.checkOut
  const guestsCount = Number(params.get('guests') ?? '2')
  const room = catalog.data.roomTypes.find((item) => item.id === params.get('roomType'))
  if (!room) return <NotFoundPage />

  const stayNights = nightsBetween(checkIn, checkOut)
  const extrasPreview = state.extras.reduce((total, extra) => total + (selectedExtras[extra.id] ?? 0) * extra.price * (extra.unit === 'person' ? guestsCount : extra.unit === 'night' ? stayNights : 1), 0)
  const previewSubtotal = room.baseRate * stayNights + extrasPreview
  const previewTotal = previewSubtotal + calculateTax(previewSubtotal)
  const updateExtra = (id: string, quantity: number) => setSelectedExtras((current) => ({ ...current, [id]: quantity }))

  const submit = async (values: GuestPaymentValues) => {
    setSubmitting(true)
    setPaymentError(null)
    if (values.cardNumber.replaceAll(' ', '') === '4000000000000002') {
      setPaymentError('Your test card was declined. No charge was made. Try 4242 4242 4242 4242.')
      setSubmitting(false)
      return
    }

    try {
      const booked = await createDirectBooking({
        roomTypeId: room.id,
        checkIn,
        checkOut,
        adults: guestsCount,
        children: 0,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        locale: language,
        specialRequests: values.request,
        extras: Object.entries(selectedExtras).filter(([, quantity]) => quantity > 0).map(([sku, quantity]) => ({ sku, quantity })),
      })
      const guestId = `guest-${booked.reservationId}`
      const roomSubtotal = room.baseRate * stayNights
      const extrasTotal = state.extras.reduce((total, extra) => total + (selectedExtras[extra.id] ?? 0) * extra.price * (extra.unit === 'person' ? guestsCount : extra.unit === 'night' ? stayNights : 1), 0)
      const serverTax = booked.totalMinor - roomSubtotal - extrasTotal
      const folio: FolioItem[] = [
        { id: `${booked.reservationId}-room`, description: `${stayNights} nights · ${room.name}`, category: 'room', quantity: stayNights, unitAmount: room.baseRate, total: roomSubtotal, postedAt: new Date().toISOString() },
        ...state.extras.filter((extra) => (selectedExtras[extra.id] ?? 0) > 0).map((extra): FolioItem => ({ id: `${booked.reservationId}-${extra.id}`, description: extra.name, category: 'extra', quantity: selectedExtras[extra.id] ?? 0, unitAmount: extra.price, total: (selectedExtras[extra.id] ?? 0) * extra.price * (extra.unit === 'person' ? guestsCount : extra.unit === 'night' ? stayNights : 1), postedAt: new Date().toISOString() })),
        { id: `${booked.reservationId}-tax`, description: 'Taxes and fees', category: 'tax', quantity: 1, unitAmount: serverTax, total: serverTax, postedAt: new Date().toISOString() },
      ]
      const guest: Guest = { id: guestId, name: `${values.firstName} ${values.lastName}`, email: values.email, phone: values.phone, country: values.country, preferences: [] }
      const reservation: Reservation = {
        id: booked.reservationId,
        confirmationNumber: booked.confirmationNumber,
        guestId,
        roomTypeId: room.id,
        roomId: booked.roomId,
        checkIn,
        checkOut,
        adults: guestsCount,
        children: 0,
        status: 'confirmed',
        source: 'Direct',
        total: booked.totalMinor,
        paid: booked.totalMinor,
        eta: values.arrivalTime,
        specialRequest: values.request,
        createdAt: new Date().toISOString(),
        folio,
      }
      await addReservation(reservation, guest)
      navigate(`/booking/confirmation/${booked.reservationId}`)
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
