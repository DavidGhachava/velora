import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LogIn,
  LogOut,
  Printer,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/ops/PageHeader";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAppData } from "../../data/AppDataProvider";
import { getAvailableRooms } from "../../domain/availability";
import { folioBalance } from "../../domain/operations";
import { formatMoney } from "../../domain/money";
import { NotFoundPage } from "../NotFoundPage";

export function ReservationDetailPage() {
  const { reservationId } = useParams();
  const { state, assignRoom, checkIn, settle, checkOut } = useAppData();
  const reservation = state.reservations.find(
    (item) => item.id === reservationId,
  );
  const [selectedRoom, setSelectedRoom] = useState(reservation?.roomId ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "folio" | "activity">("overview");
  const roomType = state.roomTypes.find(
    (item) => item.id === reservation?.roomTypeId,
  );
  const availableRooms = useMemo(
    () =>
      reservation && roomType
        ? getAvailableRooms(
            roomType,
            state.rooms,
            state.reservations.filter((item) => item.id !== reservation.id),
            reservation.checkIn,
            reservation.checkOut,
          )
        : [],
    [reservation, roomType, state],
  );
  if (!reservation || !roomType) return <NotFoundPage />;
  const guest = state.guests.find((item) => item.id === reservation.guestId);
  const room = state.rooms.find((item) => item.id === reservation.roomId);
  const run = async (name: string, action: () => Promise<void>) => {
    setBusy(name);
    setError(null);
    try {
      await action();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The action could not be completed.",
      );
    } finally {
      setBusy(null);
    }
  };
  const balance = folioBalance(reservation);
  return (
    <>
      <Link className="back-link" to="/ops/reservations">
        <ArrowLeft size={15} /> Reservations
      </Link>
      <PageHeader
        eyebrow={reservation.confirmationNumber}
        title={guest?.name ?? "Guest"}
        description={`${reservation.checkIn} → ${reservation.checkOut} · ${roomType.name}`}
        actions={<StatusBadge status={reservation.status} />}
      />
      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}
      <div className="reservation-command">
        <div>
          <span>Room</span>
          <strong>{room?.number ?? "Unassigned"}</strong>
          <small>
            {room
              ? `${room.condition} · ${room.operationalStatus}`
              : "Assignment required"}
          </small>
        </div>
        <div>
          <span>Balance</span>
          <strong>{formatMoney(Math.max(0, balance))}</strong>
          <small>
            {reservation.paid > 0
              ? `${formatMoney(reservation.paid)} paid`
              : "No payment recorded"}
          </small>
        </div>
        <div>
          <span>Arrival</span>
          <strong>{reservation.eta ?? "Not set"}</strong>
          <small>Property time</small>
        </div>
        <div className="reservation-actions">
          {reservation.status === "confirmed" && (
            <Button
              loading={busy === "checkin"}
              icon={<LogIn size={16} />}
              onClick={() => run("checkin", () => checkIn(reservation.id))}
            >
              Check in
            </Button>
          )}
          {reservation.status === "in_house" && balance > 0 && (
            <Button
              loading={busy === "settle"}
              icon={<CreditCard size={16} />}
              onClick={() => run("settle", () => settle(reservation.id))}
            >
              Settle balance
            </Button>
          )}
          {reservation.status === "in_house" && balance <= 0 && (
            <Button
              loading={busy === "checkout"}
              icon={<LogOut size={16} />}
              onClick={() => run("checkout", () => checkOut(reservation.id))}
            >
              Check out
            </Button>
          )}
        </div>
      </div>
      <div className="tab-list" role="tablist" aria-label="Reservation details">
        <button
          role="tab"
          aria-selected={tab === "overview"}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        <button
          role="tab"
          aria-selected={tab === "folio"}
          onClick={() => setTab("folio")}
        >
          Folio
        </button>
        <button
          role="tab"
          aria-selected={tab === "activity"}
          onClick={() => setTab("activity")}
        >
          Activity
        </button>
      </div>
      {tab === "overview" && (
        <div className="ops-grid">
          <section className="card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Stay and room</p>
                <h3>Assignment</h3>
              </div>
            </div>
            <div className="assignment-control">
              <label htmlFor="room-assignment">Physical room</label>
              <select
                id="room-assignment"
                className="input"
                value={selectedRoom}
                onChange={(event) => setSelectedRoom(event.target.value)}
              >
                <option value="">Unassigned</option>
                {availableRooms.map((item) => (
                  <option key={item.id} value={item.id}>
                    Room {item.number} · {item.condition}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                disabled={!selectedRoom || selectedRoom === reservation.roomId}
                loading={busy === "assign"}
                onClick={() =>
                  run("assign", () => assignRoom(reservation.id, selectedRoom))
                }
              >
                Save assignment
              </Button>
            </div>
            <dl className="detail-list">
              <div>
                <dt>Rate plan</dt>
                <dd>Best flexible rate</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{reservation.source}</dd>
              </div>
              <div>
                <dt>Guests</dt>
                <dd>
                  {reservation.adults} adults · {reservation.children} children
                </dd>
              </div>
              <div>
                <dt>Special request</dt>
                <dd>{reservation.specialRequest || "None recorded"}</dd>
              </div>
            </dl>
          </section>
          <section className="card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Guest profile</p>
                <h3>{guest?.name}</h3>
              </div>
              <UserRound size={20} />
            </div>
            <dl className="detail-list">
              <div>
                <dt>Email</dt>
                <dd>{guest?.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{guest?.phone}</dd>
              </div>
              <div>
                <dt>Country</dt>
                <dd>{guest?.country}</dd>
              </div>
              <div>
                <dt>Preferences</dt>
                <dd>{guest?.preferences.join(", ") || "None recorded"}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
      {tab === "folio" && (
        <section className="card folio-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Guest folio</p>
              <h3>{reservation.confirmationNumber}</h3>
            </div>
            <Button
              variant="secondary"
              icon={<Printer size={16} />}
              onClick={() => window.print()}
            >
              Print invoice
            </Button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {reservation.folio.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.description}
                    <br />
                    <small>{item.category.replace("_", " ")}</small>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatMoney(item.unitAmount)}</td>
                  <td>{formatMoney(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3}>Paid</th>
                <td>{formatMoney(reservation.paid)}</td>
              </tr>
              <tr>
                <th colSpan={3}>Balance due</th>
                <td>
                  <strong>{formatMoney(Math.max(0, balance))}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      )}
      {tab === "activity" && (
        <section className="card">
          <ol className="activity-list">
            <li>
              <CheckCircle2 />
              <div>
                <strong>Reservation created</strong>
                <span>
                  {reservation.createdAt} · {reservation.source}
                </span>
              </div>
            </li>
            {reservation.roomId && (
              <li>
                <CheckCircle2 />
                <div>
                  <strong>Room {room?.number} assigned</strong>
                  <span>Assignment protected by overlap validation</span>
                </div>
              </li>
            )}
            <li>
              <CheckCircle2 />
              <div>
                <strong>Payment state</strong>
                <span>
                {formatMoney(reservation.paid)} captured
                </span>
              </div>
            </li>
          </ol>
        </section>
      )}
    </>
  );
}
