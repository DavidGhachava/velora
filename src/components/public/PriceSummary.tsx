import { differenceInCalendarDays, parseISO } from 'date-fns'
import { calculateTax, formatMoney } from '../../domain/money'
import type { Extra, RoomType } from '../../domain/types'
import { useLocale } from '../../i18n/LocaleProvider'

export function PriceSummary({ room, checkIn, checkOut, guests, extras = {}, catalog = [], extraTotalOverride }: { room: RoomType; checkIn: string; checkOut: string; guests: number; extras?: Record<string, number>; catalog?: Extra[]; extraTotalOverride?: number }) {
  const { currency, t } = useLocale()
  const nights = Math.max(1, differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)))
  const roomSubtotal = nights * room.baseRate
  const extrasTotal = extraTotalOverride ?? catalog.reduce((total, extra) => total + (extras[extra.id] ?? 0) * extra.price * (extra.unit === 'person' ? guests : extra.unit === 'night' ? nights : 1), 0)
  const tax = calculateTax(roomSubtotal + extrasTotal)
  const total = roomSubtotal + extrasTotal + tax
  return <aside className="price-summary" aria-label={t('Stay price summary')}><div><p className="eyebrow">{t('Your stay')}</p><h3>{t(room.name)}</h3><p>{checkIn} → {checkOut}<br />{nights} {t('nights')} · {guests} {t('guests')}</p></div><dl><div><dt>{formatMoney(room.baseRate)} × {nights} {t('nights')}</dt><dd>{formatMoney(roomSubtotal)}</dd></div>{extrasTotal > 0 && <div><dt>{t('Selected extras')}</dt><dd>{formatMoney(extrasTotal)}</dd></div>}<div><dt>{t('Taxes and fees')}</dt><dd>{formatMoney(tax)}</dd></div><div className="price-total"><dt>{t('Total')}</dt><dd>{formatMoney(total)}</dd></div></dl><p className="help-text">{currency} · {t('Taxes included in the total. Flexible cancellation until 7 days before arrival.')}</p></aside>
}
