import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleProvider'

export function NotFoundPage() { const { t } = useLocale(); return <main className="not-found"><p className="eyebrow">404</p><h1>{t('Page not found')}</h1><p>{t('The requested page does not exist.')}</p><Link className="button button--primary button--md" to="/">{t('Return home')}</Link></main> }
