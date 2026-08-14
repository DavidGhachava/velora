import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { defaultStayDates } from '../../domain/bookingDates'
import { useLocale } from '../../i18n/LocaleProvider'
import { Button } from '../ui/Button'

const searchSchema = z.object({
  checkIn: z.string().min(1, 'Choose an arrival date.'),
  checkOut: z.string().min(1, 'Choose a departure date.'),
  guests: z.number().int().min(1).max(5),
}).refine((value) => value.checkOut > value.checkIn, { path: ['checkOut'], message: 'Departure must be after arrival.' })

type SearchValues = z.infer<typeof searchSchema>
const showDatePicker = (event: MouseEvent<HTMLInputElement>) => event.currentTarget.showPicker?.()

export function StaySearch({ className = '', defaults, propertySlug }: { className?: string; defaults?: Partial<SearchValues>; propertySlug?: string }) {
  const navigate = useNavigate()
  const { t } = useLocale()
  const dates = defaultStayDates()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { checkIn: defaults?.checkIn ?? dates.checkIn, checkOut: defaults?.checkOut ?? dates.checkOut, guests: defaults?.guests ?? 2 },
  })
  const onSubmit = (values: SearchValues) => {
    const params = new URLSearchParams({ checkIn: values.checkIn, checkOut: values.checkOut, guests: String(values.guests) })
    if (propertySlug) params.set('property', propertySlug)
    navigate(`/availability?${params.toString()}`)
  }
  return <form className={`search-panel ${className}`} onSubmit={handleSubmit(onSubmit)} aria-label={t('Search room availability')}>
    <div className="field"><label htmlFor="search-checkin">{t('Arrival')}</label><input id="search-checkin" className="date-picker-input" type="date" min={dates.minimumArrival} onClick={showDatePicker} {...register('checkIn')} />{errors.checkIn && <p className="field-error">{t(errors.checkIn.message ?? '')}</p>}</div>
    <div className="field"><label htmlFor="search-checkout">{t('Departure')}</label><input id="search-checkout" className="date-picker-input" type="date" min={dates.minimumDeparture} onClick={showDatePicker} {...register('checkOut')} />{errors.checkOut && <p className="field-error">{t(errors.checkOut.message ?? '')}</p>}</div>
    <div className="field"><label htmlFor="search-guests">{t('Guests')}</label><select id="search-guests" {...register('guests', { valueAsNumber: true })}>{[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} {t(count === 1 ? 'guest' : 'guests')}</option>)}</select></div>
    <Button type="submit" size="lg" loading={isSubmitting} icon={<Search size={18} />}>{t('View stays')}</Button>
  </form>
}
