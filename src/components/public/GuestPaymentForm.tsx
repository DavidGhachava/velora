import { zodResolver } from '@hookform/resolvers/zod'
import { LockKeyhole } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { useLocale } from '../../i18n/LocaleProvider'

const schema = z.object({
  firstName: z.string().min(2, 'Enter your first name.'),
  lastName: z.string().min(2, 'Enter your last name.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().min(7, 'Enter a valid phone number.'),
  country: z.string().min(2, 'Choose your country.'),
  arrivalTime: z.string().min(1, 'Choose an approximate arrival time.'),
  request: z.string().max(500),
  cardNumber: z.string().regex(/^(?:\d[ ]?){16}$/, 'Enter a 16-digit card number.'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY.'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Use 3 or 4 digits.'),
  terms: z.literal(true, { error: 'Accept the booking and cancellation terms.' }),
})

export type GuestPaymentValues = z.infer<typeof schema>

export function GuestPaymentForm({ onSubmit, onBack, loading, paymentError }: { onSubmit: (values: GuestPaymentValues) => Promise<void>; onBack: () => void; loading: boolean; paymentError: string | null }) {
  const { t } = useLocale()
  const { register, handleSubmit, formState: { errors } } = useForm<GuestPaymentValues>({ resolver: zodResolver(schema), defaultValues: { country: 'United States', arrivalTime: '15:00', request: '', cardNumber: '4242 4242 4242 4242', expiry: '12/30', cvc: '123', terms: true } })

  return <section aria-labelledby="guest-title">
    <p className="eyebrow">{t('Step 2 of 2')}</p>
    <h1 id="guest-title" className="checkout-title">{t('Guest and payment details')}</h1>
    <p className="checkout-lead">{t('No account is required. A reservation-management link is provided after booking.')}</p>
    {paymentError && <div className="alert alert--error" role="alert">{t(paymentError)}</div>}
    <form className="guest-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset><legend>{t('Guest details')}</legend><div className="form-grid">
        <div className="field"><label htmlFor="first-name">{t('First name')}</label><input id="first-name" autoComplete="given-name" {...register('firstName')} />{errors.firstName && <p className="field-error">{t(errors.firstName.message ?? '')}</p>}</div>
        <div className="field"><label htmlFor="last-name">{t('Last name')}</label><input id="last-name" autoComplete="family-name" {...register('lastName')} />{errors.lastName && <p className="field-error">{t(errors.lastName.message ?? '')}</p>}</div>
        <div className="field"><label htmlFor="guest-email">{t('Email')}</label><input id="guest-email" type="email" autoComplete="email" {...register('email')} />{errors.email && <p className="field-error">{t(errors.email.message ?? '')}</p>}</div>
        <div className="field"><label htmlFor="guest-phone">{t('Phone')}</label><input id="guest-phone" type="tel" autoComplete="tel" {...register('phone')} />{errors.phone && <p className="field-error">{t(errors.phone.message ?? '')}</p>}</div>
        <div className="field"><label htmlFor="country">{t('Country')}</label><select id="country" autoComplete="country-name" {...register('country')}>{['United States', 'United Kingdom', 'Italy', 'France', 'Germany', 'Georgia'].map((country) => <option value={country} key={country}>{t(country)}</option>)}</select></div>
        <div className="field"><label htmlFor="arrival">{t('Approximate arrival')}</label><input id="arrival" type="time" {...register('arrivalTime')} />{errors.arrivalTime && <p className="field-error">{t(errors.arrivalTime.message ?? '')}</p>}</div>
        <div className="field field--full"><label htmlFor="request">{t('Special request')} <span>{t('(optional)')}</span></label><textarea id="request" {...register('request')} /></div>
      </div></fieldset>
      <fieldset><legend>{t('Payment')}</legend><div className="test-mode-note"><LockKeyhole size={17} /><span>{t('Card details are encrypted.')}</span></div><div className="form-grid form-grid--payment">
        <div className="field field--full"><label htmlFor="card">{t('Card number')}</label><input id="card" inputMode="numeric" autoComplete="cc-number" {...register('cardNumber')} />{errors.cardNumber && <p className="field-error">{t(errors.cardNumber.message ?? '')}</p>}</div>
        <div className="field"><label htmlFor="expiry">{t('Expiry')}</label><input id="expiry" inputMode="numeric" autoComplete="cc-exp" {...register('expiry')} />{errors.expiry && <p className="field-error">{t(errors.expiry.message ?? '')}</p>}</div>
        <div className="field"><label htmlFor="cvc">CVC</label><input id="cvc" inputMode="numeric" autoComplete="cc-csc" {...register('cvc')} />{errors.cvc && <p className="field-error">{t(errors.cvc.message ?? '')}</p>}</div>
      </div></fieldset>
      <label className="terms-row"><input type="checkbox" {...register('terms')} /><span>{t('I agree to the booking and cancellation terms.')}</span></label>
      {errors.terms && <p className="field-error">{t(errors.terms.message ?? '')}</p>}
      <div className="checkout-actions"><Button type="button" variant="secondary" onClick={onBack}>{t('Back')}</Button><Button type="submit" size="lg" loading={loading}>{t('Pay and reserve')}</Button></div>
    </form>
  </section>
}
