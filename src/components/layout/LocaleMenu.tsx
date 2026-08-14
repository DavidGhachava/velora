import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown, Languages, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useLocale, type Currency, type Language } from '../../i18n/LocaleProvider'

export function LocaleMenu({ inverted = false }: { inverted?: boolean }) {
  const { language, currency, setLanguage, setCurrency, t } = useLocale()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const root = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    const closeWithKeyboard = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', closeWithKeyboard)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', closeWithKeyboard)
    }
  }, [])

  const chooseLanguage = (next: Language) => setLanguage(next)
  const chooseCurrency = (next: Currency) => setCurrency(next)

  return <div className={`locale-menu${inverted ? ' locale-menu--inverted' : ''}`} ref={root}>
    <button className="locale-menu__trigger" type="button" aria-expanded={open} aria-controls={menuId} aria-label={t('Open language and currency settings')} onClick={() => setOpen((current) => !current)}>
      <Languages size={16} /><span>{language.toUpperCase()} · {currency}</span><ChevronDown size={14} className={open ? 'is-open' : ''} />
    </button>
    <AnimatePresence>
      {open && <m.div id={menuId} className="locale-menu__panel" role="dialog" aria-label={t('Language and currency')} initial={reduceMotion ? false : { opacity: 0, y: -8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: .98 }} transition={{ duration: .18, ease: [0.22, 1, 0.36, 1] }}>
        <div className="locale-menu__top"><strong>{t('Language and currency')}</strong><button type="button" onClick={() => setOpen(false)} aria-label={t('Close settings')}><X size={16} /></button></div>
        <fieldset><legend>{t('Language')}</legend>{([['en', 'English'], ['ka', 'Georgian']] as const).map(([value, label]) => <button type="button" key={value} className={language === value ? 'is-selected' : ''} onClick={() => chooseLanguage(value)}><span>{t(label)}</span>{language === value && <Check size={15} />}</button>)}</fieldset>
        <fieldset><legend>{t('Currency')}</legend>{(['GEL', 'USD'] as const).map((value) => <button type="button" key={value} className={currency === value ? 'is-selected' : ''} onClick={() => chooseCurrency(value)}><span>{value}</span>{currency === value && <Check size={15} />}</button>)}</fieldset>
      </m.div>}
    </AnimatePresence>
  </div>
}
