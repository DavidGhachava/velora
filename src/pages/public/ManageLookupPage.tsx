import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useAppData } from '../../data/AppDataProvider'
import { useLocale } from '../../i18n/LocaleProvider'

export function ManageLookupPage() {
  const navigate = useNavigate()
  const { state } = useAppData()
  const { t } = useLocale()
  const [confirmation, setConfirmation] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    const normalizedConfirmation = confirmation.trim().toUpperCase()
    const normalizedEmail = email.trim().toLowerCase()
    const reservation = state.reservations.find((item) => {
      const guest = state.guests.find((candidate) => candidate.id === item.guestId)
      return item.confirmationNumber.toUpperCase() === normalizedConfirmation && guest?.email.toLowerCase() === normalizedEmail
    })
    if (!reservation) {
      setError(t('We could not find a reservation with those details.'))
      return
    }
    navigate(`/manage/${reservation.id}`)
  }

  return <section className="manage-page manage-lookup">
    <div className="manage-heading"><div><p className="eyebrow">Velora Batumi</p><h1>{t('Manage booking')}</h1><p>{t('Enter the confirmation number and email used for the reservation.')}</p></div></div>
    <form className="manage-panel" onSubmit={submit}>
      {error && <div className="alert alert--error" role="alert">{error}</div>}
      <div className="field"><label htmlFor="lookup-confirmation">{t('Confirmation number')}</label><input id="lookup-confirmation" autoComplete="off" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="VLR-2608-XXXXXXXX" required /></div>
      <div className="field"><label htmlFor="lookup-email">{t('Email')}</label><input id="lookup-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
      <Button type="submit">{t('Find reservation')}</Button>
    </form>
  </section>
}
