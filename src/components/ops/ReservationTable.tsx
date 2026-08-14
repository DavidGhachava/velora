import { format, parseISO } from 'date-fns'
import { Link } from 'react-router-dom'
import type { Guest, Reservation, Room, RoomType } from '../../domain/types'
import { formatMoney } from '../../domain/money'
import { StatusBadge } from '../ui/StatusBadge'

export function ReservationTable({ reservations, guests, rooms, roomTypes }: { reservations: Reservation[]; guests: Guest[]; rooms: Room[]; roomTypes: RoomType[] }) {
  return <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Guest</th><th>Stay</th><th>Room</th><th>Source</th><th>Status</th><th>Balance</th></tr></thead><tbody>{reservations.map((reservation) => { const guest = guests.find((item) => item.id === reservation.guestId); const room = rooms.find((item) => item.id === reservation.roomId); const type = roomTypes.find((item) => item.id === reservation.roomTypeId); return <tr key={reservation.id}><td className="table-primary"><Link className="table-link" to={`/ops/reservations/${reservation.id}`}>{guest?.name ?? 'Unknown guest'}</Link><span>{reservation.confirmationNumber}</span></td><td>{format(parseISO(reservation.checkIn), 'd MMM')} → {format(parseISO(reservation.checkOut), 'd MMM')}</td><td>{room?.number ?? 'Unassigned'}<br /><small>{type?.name}</small></td><td>{reservation.source}</td><td><StatusBadge status={reservation.status} /></td><td>{formatMoney(Math.max(0, reservation.total - reservation.paid))}</td></tr>})}</tbody></table></div>
}
