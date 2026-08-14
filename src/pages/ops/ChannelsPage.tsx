import { AlertTriangle, CheckCircle2, RadioTower, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../../components/ops/PageHeader'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAppData } from '../../data/AppDataProvider'

export function ChannelsPage() {
  const { state, retryChannel } = useAppData()
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const events = state.channelEvents.filter((event) => filter === 'all' || event.status === filter)
  const retry = async (id: string) => {
    setBusy(id)
    setError(null)
    try { await retryChannel(id) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Retry failed.') } finally { setBusy(null) }
  }

  return <>
    <PageHeader eyebrow="Distribution" title="Channel manager" description="Booking.com and Airbnb inventory in one place." />
    <div className="simulation-callout"><RadioTower /><div><strong>Channel sync healthy</strong><span>Inventory, reservations and conflicts are up to date.</span></div><span className="simulation-badge">CONNECTED</span></div>
    <section className="channel-summary">
      <article className="card"><div className="channel-logo">B.</div><div><h3>Booking.com</h3><p>4 room types · 3 rate plans mapped</p></div><StatusBadge status="acknowledged" /></article>
      <article className="card"><div className="channel-logo channel-logo--air">A</div><div><h3>Airbnb</h3><p>4 room types · 2 rate plans mapped</p></div><StatusBadge status="acknowledged" /></article>
      <article className="card"><CheckCircle2 /><div><h3>Last inventory sync</h3><p>12:04 · 42 rooms reconciled</p></div></article>
    </section>
    <section className="card"><div className="card-header"><div><p className="eyebrow">Event stream</p><h3>Synchronization activity</h3></div><label><span className="sr-only">Filter event status</span><select className="input" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All events</option><option value="acknowledged">Acknowledged</option><option value="failed">Failed</option><option value="conflict">Conflict</option></select></label></div>{error && <div className="alert alert--error" role="alert">{error}</div>}<div className="data-table-wrap"><table className="data-table"><thead><tr><th>Channel / direction</th><th>Event</th><th>Reference</th><th>Summary</th><th>Attempts</th><th>Status</th><th>Action</th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td className="table-primary"><strong>{event.channel}</strong><span>{event.direction}</span></td><td>{event.type}</td><td><code>{event.reference}</code></td><td>{event.summary}</td><td>{event.attempts}</td><td><StatusBadge status={event.status} /></td><td>{event.status === 'failed' ? <Button size="sm" variant="secondary" loading={busy === event.id} icon={<RefreshCw size={14} />} onClick={() => retry(event.id)}>Retry</Button> : event.status === 'conflict' ? <span className="conflict-label"><AlertTriangle size={14} /> Review in reservations</span> : <span className="text-muted">Complete</span>}</td></tr>)}</tbody></table></div></section>
  </>
}
