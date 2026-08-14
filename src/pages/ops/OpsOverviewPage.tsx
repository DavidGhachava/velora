import { AlertTriangle, ArrowRight, BedDouble, CircleDollarSign, DoorOpen, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/ops/PageHeader'
import { ReservationTable } from '../../components/ops/ReservationTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAppData } from '../../data/AppDataProvider'
import { formatMoney } from '../../domain/money'

export function OpsOverviewPage() {
  const { state } = useAppData()
  const arrivals = state.reservations.filter((item) => item.checkIn === '2026-08-11' && item.status === 'confirmed')
  const departures = state.reservations.filter((item) => item.checkOut === '2026-08-11' && item.status === 'in_house')
  const inHouse = state.reservations.filter((item) => item.status === 'in_house')
  const dirty = state.rooms.filter((room) => room.condition === 'dirty' || room.condition === 'cleaning')
  const roomRevenue = state.reservations.filter((item) => item.status !== 'cancelled').reduce((total, item) => total + item.total, 0)
  const exceptions = [
    { icon: AlertTriangle, label: 'Unassigned arrival', detail: 'Elias Weber arrives at 14:00', href: '/ops/reservations/res-1004', tone: 'danger' },
    { icon: Sparkles, label: 'VIP room not ready', detail: 'Room 109 · inspection due 13:00', href: '/ops/housekeeping', tone: 'warning' },
    { icon: CircleDollarSign, label: 'Balance due', detail: `${formatMoney(state.reservations.find((item) => item.id === 'res-1002')!.total)} · Noah Bennett`, href: '/ops/reservations/res-1002', tone: 'warning' },
  ]
  return <><PageHeader eyebrow="Front desk" title="Good afternoon, Alex." description="Here is what needs attention at Velora Batumi today." /><section className="exception-strip" aria-label="Priority exceptions">{exceptions.map(({ icon: Icon, label, detail, href, tone }) => <Link key={label} to={href} className={`exception exception--${tone}`}><Icon size={18} /><div><strong>{label}</strong><span>{detail}</span></div><ArrowRight size={16} /></Link>)}</section><section className="kpi-grid" aria-label="Today’s key metrics"><div className="kpi-card"><p><Users size={15} /> Arrivals</p><strong>{arrivals.length + 2}</strong><span>1 needs attention</span></div><div className="kpi-card"><p><DoorOpen size={15} /> Departures</p><strong>{departures.length + 3}</strong><span>3 completed</span></div><div className="kpi-card"><p><BedDouble size={15} /> Occupancy</p><strong>74%</strong><span>31 of 42 rooms</span></div><div className="kpi-card"><p><CircleDollarSign size={15} /> Room revenue</p><strong>{formatMoney(roomRevenue)}</strong><span>+8.4% vs last week</span></div></section><section className="ops-grid"><div className="card"><div className="card-header"><div><p className="eyebrow">Arrivals</p><h3>Expected today</h3></div><Link className="text-link" to="/ops/reservations">View all</Link></div><ReservationTable reservations={arrivals} guests={state.guests} rooms={state.rooms} roomTypes={state.roomTypes} /></div><div className="ops-stack"><div className="card"><div className="card-header"><div><p className="eyebrow">Room readiness</p><h3>{dirty.length} rooms need attention</h3></div><Link className="text-link" to="/ops/housekeeping">Open board</Link></div><div className="condition-summary">{(['dirty', 'cleaning', 'clean', 'inspected'] as const).map((condition) => <div key={condition}><StatusBadge status={condition} /><strong>{state.rooms.filter((room) => room.condition === condition).length}</strong></div>)}</div></div><div className="card"><div className="card-header"><div><p className="eyebrow">In house</p><h3>{inHouse.length} current stays</h3></div></div>{inHouse.map((reservation) => { const guest = state.guests.find((item) => item.id === reservation.guestId); const room = state.rooms.find((item) => item.id === reservation.roomId); return <Link className="compact-row" key={reservation.id} to={`/ops/reservations/${reservation.id}`}><span className="room-number">{room?.number}</span><div><strong>{guest?.name}</strong><span>Departing {reservation.checkOut}</span></div><StatusBadge status={reservation.status} /></Link>})}</div></div></section></>
}
