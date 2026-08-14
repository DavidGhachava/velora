import { Download, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/ops/PageHeader'
import { ReservationTable } from '../../components/ops/ReservationTable'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Feedback'
import { useAppData } from '../../data/AppDataProvider'

export function ReservationsPage() {
  const { state } = useAppData()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('search') ?? '')
  const [status, setStatus] = useState('all')
  const filtered = useMemo(() => state.reservations.filter((reservation) => {
    const guest = state.guests.find((item) => item.id === reservation.guestId)
    const matchesQuery = `${guest?.name} ${reservation.confirmationNumber}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === 'all' || reservation.status === status)
  }), [query, state, status])
  const exportCsv = () => {
    const rows = ['confirmation,guest,arrival,departure,status,source,total', ...filtered.map((reservation) => `${reservation.confirmationNumber},${state.guests.find((guest) => guest.id === reservation.guestId)?.name},${reservation.checkIn},${reservation.checkOut},${reservation.status},${reservation.source},${reservation.total / 100}`)]
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'velora-reservations.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return <><PageHeader eyebrow="Front office" title="Reservations" description={`${state.reservations.length} stays across direct and channel sources.`} actions={<><Button variant="secondary" icon={<Download size={16} />} onClick={exportCsv}>Export</Button><Link className="button button--primary button--md" to="/availability"><Plus size={16} /> New reservation</Link></>} /><section className="card"><div className="toolbar"><label className="search-input"><Search size={16} /><span className="sr-only">Search reservations</span><input className="input" placeholder="Guest or confirmation" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label><span className="sr-only">Filter by status</span><select className="input" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="in_house">In house</option><option value="checked_out">Checked out</option><option value="cancelled">Cancelled</option></select></label>{(query || status !== 'all') && <button className="text-link" onClick={() => { setQuery(''); setStatus('all') }}>Clear filters</button>}</div>{filtered.length ? <ReservationTable reservations={filtered} guests={state.guests} rooms={state.rooms} roomTypes={state.roomTypes} /> : <EmptyState title="No reservations match" description="Clear your search or status filter to see all stays." />}</section></>
}
