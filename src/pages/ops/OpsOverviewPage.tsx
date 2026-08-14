import { AlertTriangle, ArrowRight, BedDouble, CircleDollarSign, DoorOpen, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/ops/PageHeader'
import { ReservationTable } from '../../components/ops/ReservationTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { formatMoney } from '../../domain/money'
import { useOperationsData } from '../../hooks/useOperationsData'

export function OpsOverviewPage() {
  const { state, isLoading, error } = useOperationsData()
  const today = new Date().toISOString().slice(0, 10)
  const arrivals = state.reservations.filter((item) => item.checkIn === today && item.status === 'confirmed')
  const departures = state.reservations.filter((item) => item.checkOut === today && item.status === 'in_house')
  const inHouse = state.reservations.filter((item) => item.status === 'in_house')
  const dirty = state.rooms.filter((room) => room.condition === 'dirty' || room.condition === 'cleaning')
  const activeRooms = state.rooms.filter((room) => room.operationalStatus === 'active')
  const occupiedRooms = activeRooms.filter((room) => room.occupancy === 'occupied')
  const occupancy = activeRooms.length ? Math.round(occupiedRooms.length / activeRooms.length * 100) : 0
  const roomRevenue = state.reservations.filter((item) => item.status !== 'cancelled').reduce((total, item) => total + item.total, 0)
  const unassigned = state.reservations.find((item) => item.status === 'confirmed' && !item.roomId)
  const balanceDue = state.reservations.find((item) => item.total > item.paid && item.status !== 'cancelled')
  const exceptions = [
    ...(unassigned ? [{ icon: AlertTriangle, label: 'Unassigned arrival', detail: `${state.guests.find((guest) => guest.id === unassigned.guestId)?.name ?? 'Guest'} · ${unassigned.checkIn}`, href: `/ops/reservations/${unassigned.id}`, tone: 'danger' }] : []),
    ...(dirty.length ? [{ icon: Sparkles, label: 'Rooms need service', detail: `${dirty.length} rooms are dirty or being cleaned`, href: '/ops/housekeeping', tone: 'warning' }] : []),
    ...(balanceDue ? [{ icon: CircleDollarSign, label: 'Balance due', detail: `${formatMoney(balanceDue.total - balanceDue.paid)} · ${state.guests.find((guest) => guest.id === balanceDue.guestId)?.name ?? 'Guest'}`, href: `/ops/reservations/${balanceDue.id}`, tone: 'warning' }] : []),
  ]

  if (isLoading) return <div className="app-loading" role="status">Loading today’s operations…</div>
  if (error) return <div className="alert alert--error" role="alert">{error}</div>

  return <>
    <PageHeader eyebrow="Front desk" title="Today" description="Live arrivals, departures, room readiness and balances." />
    {exceptions.length > 0 && <section className="exception-strip" aria-label="Priority exceptions">{exceptions.map(({ icon: Icon, label, detail, href, tone }) => <Link key={label} to={href} className={`exception exception--${tone}`}><Icon size={18} /><div><strong>{label}</strong><span>{detail}</span></div><ArrowRight size={16} /></Link>)}</section>}
    <section className="kpi-grid" aria-label="Today’s key metrics">
      <div className="kpi-card"><p><Users size={15} /> Arrivals</p><strong>{arrivals.length}</strong><span>Expected today</span></div>
      <div className="kpi-card"><p><DoorOpen size={15} /> Departures</p><strong>{departures.length}</strong><span>Due today</span></div>
      <div className="kpi-card"><p><BedDouble size={15} /> Occupancy</p><strong>{occupancy}%</strong><span>{occupiedRooms.length} of {activeRooms.length} units</span></div>
      <div className="kpi-card"><p><CircleDollarSign size={15} /> Booked revenue</p><strong>{formatMoney(roomRevenue)}</strong><span>Active reservation value</span></div>
    </section>
    <section className="ops-grid">
      <div className="card"><div className="card-header"><div><p className="eyebrow">Arrivals</p><h3>Expected today</h3></div><Link className="text-link" to="/ops/reservations">View all</Link></div>{arrivals.length ? <ReservationTable reservations={arrivals} guests={state.guests} rooms={state.rooms} roomTypes={state.roomTypes} /> : <p className="help-text">No arrivals today.</p>}</div>
      <div className="ops-stack">
        <div className="card"><div className="card-header"><div><p className="eyebrow">Room readiness</p><h3>{dirty.length} rooms need attention</h3></div><Link className="text-link" to="/ops/housekeeping">Open board</Link></div><div className="condition-summary">{(['dirty', 'cleaning', 'clean', 'inspected'] as const).map((condition) => <div key={condition}><StatusBadge status={condition} /><strong>{state.rooms.filter((room) => room.condition === condition).length}</strong></div>)}</div></div>
        <div className="card"><div className="card-header"><div><p className="eyebrow">In house</p><h3>{inHouse.length} current stays</h3></div></div>{inHouse.length ? inHouse.map((reservation) => { const guest = state.guests.find((item) => item.id === reservation.guestId); const room = state.rooms.find((item) => item.id === reservation.roomId); return <Link className="compact-row" key={reservation.id} to={`/ops/reservations/${reservation.id}`}><span className="room-number">{room?.number}</span><div><strong>{guest?.name}</strong><span>Departing {reservation.checkOut}</span></div><StatusBadge status={reservation.status} /></Link> }) : <p className="help-text">No guests are currently checked in.</p>}</div>
      </div>
    </section>
  </>
}

