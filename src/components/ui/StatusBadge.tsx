import { Check, CircleAlert, Clock3, DoorOpen, KeyRound, Sparkles, Wrench } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLocale } from '../../i18n/LocaleProvider'

const iconMap: Record<string, ReactNode> = {
  confirmed: <Check size={13} />,
  in_house: <KeyRound size={13} />,
  checked_out: <DoorOpen size={13} />,
  cancelled: <CircleAlert size={13} />,
  dirty: <CircleAlert size={13} />,
  cleaning: <Clock3 size={13} />,
  clean: <Sparkles size={13} />,
  inspected: <Check size={13} />,
  out_of_service: <Wrench size={13} />,
  failed: <CircleAlert size={13} />,
  conflict: <CircleAlert size={13} />,
  acknowledged: <Check size={13} />,
}

export function StatusBadge({ status }: { status: string }) {
  const { t } = useLocale()
  const label = status.replaceAll('_', ' ')
  return <span className={`status status--${status}`}>{iconMap[status]}<span>{t(label)}</span></span>
}
