import { AlertCircle, CheckCircle2, Inbox } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLocale } from '../../i18n/LocaleProvider'

export function EmptyState({ title, description, action, icon }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) {
  const { t } = useLocale()
  return <div className="empty-state">{icon ?? <Inbox size={30} aria-hidden="true" />}<h3>{t(title)}</h3><p>{t(description)}</p>{action}</div>
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  const { t } = useLocale()
  return <div className="alert alert--error" role="alert"><AlertCircle size={18} /><div><strong>{t('Something needs attention')}</strong><p>{t(message)}</p>{retry && <button className="text-link" onClick={retry}>{t('Try again')}</button>}</div></div>
}

export function SuccessNotice({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useLocale()
  return <div className="toast" role="status"><CheckCircle2 size={18} /><span>{t(message)}</span><button onClick={onDismiss} aria-label={t('Dismiss notification')}>×</button></div>
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  const { t } = useLocale()
  return <div className="loading-state" role="status"><span className="skeleton skeleton--line" /><span className="skeleton skeleton--card" /><span className="sr-only">{t(label)}</span></div>
}
