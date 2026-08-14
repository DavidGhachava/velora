import { BarChart3, BedDouble, Building2, CalendarDays, ChevronRight, ClipboardCheck, ConciergeBell, Hotel, LayoutDashboard, Menu, RefreshCw, Search, UsersRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

const nav = [
  { label: 'Today', path: '/ops/overview', icon: LayoutDashboard },
  { label: 'Properties', path: '/ops/properties', icon: Building2 },
  { label: 'Timeline', path: '/ops/timeline', icon: CalendarDays },
  { label: 'Reservations', path: '/ops/reservations', icon: UsersRound },
  { label: 'Housekeeping', path: '/ops/housekeeping', icon: ClipboardCheck },
  { label: 'Services', path: '/ops/services', icon: ConciergeBell },
  { label: 'Analytics', path: '/ops/analytics', icon: BarChart3 },
  { label: 'Channels', path: '/ops/channels', icon: RefreshCw },
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const [globalQuery, setGlobalQuery] = useState('')
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  if (loading) return <div className="app-loading" role="status">Authenticating staff session…</div>
  if (!user) return <Navigate to="/ops/sign-in" replace />
  return (
    <div className="ops-shell">
      <aside className={`ops-sidebar ${open ? 'is-open' : ''}`}>
        <div className="ops-brand-row"><Link className="brand brand--light" to="/ops/overview"><span>V</span> VELORA <small>OPS</small></Link><button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></div>
        <div className="property-switch"><Hotel size={18} /><div><strong>Velora Batumi</strong><span>Live property portfolio</span></div><ChevronRight size={16} /></div>
        <nav aria-label="Operations navigation">{nav.map(({ label, path, icon: Icon }) => <NavLink key={label} to={path} onClick={() => setOpen(false)}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
        <div className="sidebar-bottom"><Link to="/"><BedDouble size={17} /> Guest website</Link></div>
      </aside>
      <div className="ops-main">
        <header className="ops-topbar">
          <button className="ops-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button>
          <form className="ops-global-search" onSubmit={(event) => { event.preventDefault(); if (globalQuery.trim()) navigate(`/ops/reservations?search=${encodeURIComponent(globalQuery.trim())}`) }}><label className="sr-only" htmlFor="ops-global-query">Find guest or reservation</label><input id="ops-global-query" value={globalQuery} onChange={(event) => setGlobalQuery(event.target.value)} placeholder="Find guest or confirmation" /><button type="submit" aria-label="Search reservations"><Search size={15} /></button></form>
          <div><strong>{new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Tbilisi' }).format(new Date())}</strong><span>Property time · {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tbilisi' }).format(new Date())}</span></div>
          <div className="demo-banner">All systems operational</div>
          <button className="user-chip" onClick={() => void signOut()} title="Sign out"><span>{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><strong>{user.name}</strong><small>{user.role} · Sign out</small></div></button>
        </header>
        <main id="main-content" className="ops-content"><Outlet /></main>
      </div>
    </div>
  )
}
