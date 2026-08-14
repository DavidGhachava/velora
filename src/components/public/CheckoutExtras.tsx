import { Car, Coffee, Minus, Plus, Sailboat, Sparkles } from 'lucide-react'
import type { Extra } from '../../domain/types'
import { formatMoney } from '../../domain/money'
import { useLocale } from '../../i18n/LocaleProvider'
import { Button } from '../ui/Button'
import { ResponsiveImage } from '../ui/ResponsiveImage'

const icons = { car: Car, coffee: Coffee, sparkles: Sparkles, sailboat: Sailboat }

export function CheckoutExtras({ extras, selected, onChange, onContinue }: { extras: Extra[]; selected: Record<string, number>; onChange: (id: string, quantity: number) => void; onContinue: () => void }) {
  const { t } = useLocale()
  return <section aria-labelledby="extras-title"><div className="checkout-step-heading"><div><p className="eyebrow">{t('Step 1 of 2')}</p><h1 id="extras-title" className="checkout-title">{t('Optional extras')}</h1></div><button className="text-link extras-skip" type="button" onClick={onContinue}>{t('Skip extras')}</button></div><p className="checkout-lead">{t('Select any extras you want to add to the reservation.')}</p><div className="extras-list">{extras.map((extra) => {
    const Icon = icons[extra.icon as keyof typeof icons] ?? Sparkles
    const qty = selected[extra.id] ?? 0
    return <article className={`extra-card ${qty > 0 ? 'is-selected' : ''}`} key={extra.id}><div className="extra-card__media"><ResponsiveImage src={extra.image} sizes="(max-width: 767px) 96px, 132px" loading="lazy" alt={extra.imageAlt} /><span><Icon size={17} aria-hidden="true" /></span></div><div><h3>{t(extra.name)}</h3><p>{t(extra.description)}</p><strong>{formatMoney(extra.price)} / {t(extra.unit)}</strong></div><div className="quantity-control" aria-label={`${t(extra.name)} ${t('quantity')}`}><button type="button" onClick={() => onChange(extra.id, Math.max(0, qty - 1))} disabled={qty === 0} aria-label={`${t('Remove')} ${t(extra.name)}`}><Minus /></button><span aria-live="polite">{qty}</span><button type="button" onClick={() => onChange(extra.id, qty + 1)} aria-label={`${t('Add')} ${t(extra.name)}`}><Plus /></button></div></article>
  })}</div><div className="checkout-actions"><Button type="button" variant="secondary" onClick={onContinue}>{t('Continue without extras')}</Button><Button type="button" onClick={onContinue}>{t('Continue')}</Button></div></section>
}
