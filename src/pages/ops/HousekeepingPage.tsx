import { Check, Clock3, Play, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ops/PageHeader'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Feedback'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useOperationsData } from '../../hooks/useOperationsData'
import type { RoomCondition } from '../../domain/types'

export function HousekeepingPage() {
  const { state, setRoomCondition } = useOperationsData()
  const [filter, setFilter] = useState<'all' | RoomCondition>('all')
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const actionable = useMemo(() => state.rooms.filter((room) => filter === 'all' ? room.condition !== 'inspected' : room.condition === filter), [filter, state.rooms])
  const transition = async (roomId: string, condition: RoomCondition) => { setBusy(roomId); setError(null); try { await setRoomCondition(roomId, condition) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update room.') } finally { setBusy(null) } }
  const nextAction = (condition: RoomCondition): { label: string; next: RoomCondition; icon: typeof Play } => {
    if (condition === 'dirty') return { label: 'Start cleaning', next: 'cleaning', icon: Play }
    if (condition === 'cleaning') return { label: 'Mark clean', next: 'clean', icon: Check }
    if (condition === 'clean') return { label: 'Approve inspection', next: 'inspected', icon: ShieldCheck }
    return { label: 'Start service', next: 'cleaning', icon: Play }
  }
  return <><PageHeader eyebrow="Rooms" title="Housekeeping" description="Live room condition, occupancy and service work for Tuesday 11 August." /><section className="kpi-grid housekeeping-kpis">{(['dirty', 'cleaning', 'clean', 'inspected'] as const).map((condition) => <button key={condition} className={filter === condition ? 'kpi-card is-selected' : 'kpi-card'} onClick={() => setFilter(condition)}><p><StatusBadge status={condition} /></p><strong>{state.rooms.filter((room) => room.condition === condition).length}</strong><span>{condition === 'clean' ? 'Awaiting inspection' : condition === 'dirty' ? 'Needs service' : condition}</span></button>)}</section><div className="toolbar housekeeping-toolbar"><Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>All actionable rooms</Button><span>{actionable.length} rooms shown</span></div>{error && <div className="alert alert--error" role="alert">{error}</div>}<section className="housekeeping-board">{actionable.length ? actionable.map((room) => { const type = state.roomTypes.find((item) => item.id === room.roomTypeId); const task = state.housekeeping.find((item) => item.roomId === room.id); const action = nextAction(room.condition); const Icon = action.icon; return <article className="housekeeping-card" key={room.id}><header><div><p className="eyebrow">Room {room.number}</p><h3>{type?.name}</h3></div><StatusBadge status={room.condition} /></header><div className="room-state-line"><span>Occupancy <strong>{room.occupancy}</strong></span><span>Privacy <strong>{room.privacy === 'dnd' ? 'Do not disturb' : 'Clear'}</strong></span><span>Sale <strong>{room.operationalStatus.replaceAll('_', ' ')}</strong></span></div>{task ? <div className="task-detail"><Clock3 size={16} /><div><strong>{task.serviceType.replace('_', ' ')} · {task.priority}</strong><span>{task.assignee} · due {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{task.note && <span>{task.note}</span>}</div></div> : <p className="help-text">No open task. Condition can still be updated.</p>}<Button loading={busy === room.id} icon={<Icon size={16} />} onClick={() => transition(room.id, action.next)}>{action.label}</Button>{room.condition === 'clean' && <Button variant="quiet" size="sm" onClick={() => transition(room.id, 'cleaning')}>Reject inspection</Button>}</article> }) : <EmptyState title="No rooms in this state" description="Choose another condition or return to all actionable rooms." action={<Button variant="secondary" onClick={() => setFilter('all')}>Show all</Button>} />}</section></>
}
