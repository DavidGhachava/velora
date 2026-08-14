import { Link } from 'react-router-dom'
import { useLocale } from '../../i18n/LocaleProvider'
import { LocaleMenu } from '../layout/LocaleMenu'

export function CheckoutHeader({ step }: { step: 'extras' | 'details' }) {
  const { t } = useLocale()
  return <header className="checkout-header"><Link to="/" className="brand" aria-label="Velora home"><span>V</span> VELORA</Link><div className="checkout-progress"><span className="is-done">{t('Stay')}</span><span className={step === 'extras' ? 'is-current' : 'is-done'}>{t('Extras')}</span><span className={step === 'details' ? 'is-current' : ''}>{t('Details & payment')}</span></div><div className="checkout-header__tools"><LocaleMenu /><span className="secure-label">{t('Secure checkout')}</span></div></header>
}
