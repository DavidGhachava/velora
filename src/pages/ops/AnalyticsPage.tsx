import { Download, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '../../components/ops/PageHeader'
import { Button } from '../../components/ui/Button'
import { useAppData } from '../../data/AppDataProvider'
import { formatMoney } from '../../domain/money'

const performance = [
  { day: '5 Aug', occupancy: 64, revenue: 18100 }, { day: '6 Aug', occupancy: 69, revenue: 20400 },
  { day: '7 Aug', occupancy: 71, revenue: 21800 }, { day: '8 Aug', occupancy: 76, revenue: 24300 },
  { day: '9 Aug', occupancy: 81, revenue: 27700 }, { day: '10 Aug', occupancy: 79, revenue: 26900 },
  { day: '11 Aug', occupancy: 74, revenue: 25100 },
]

const sourceData = [{ source: 'Direct', revenue: 48100 }, { source: 'Booking.com', revenue: 29200 }, { source: 'Airbnb', revenue: 21800 }, { source: 'Phone', revenue: 11600 }]

export function AnalyticsPage() {
  const { state } = useAppData()
  const [period, setPeriod] = useState('7')
  const sold = state.reservations.filter((item) => ['confirmed', 'in_house', 'checked_out'].includes(item.status)).length
  const revenue = state.reservations.reduce((total, item) => item.status === 'cancelled' ? total : total + item.total, 0)
  const adr = Math.round(revenue / Math.max(1, sold))
  const revpar = Math.round(adr * .74)
  const exportCsv = () => { const rows = ['date,occupancy,revenue', ...performance.map((row) => `${row.day},${row.occupancy},${row.revenue}`)]; const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'velora-performance.csv'; anchor.click(); URL.revokeObjectURL(url) }
  return <><PageHeader eyebrow="Performance" title="Analytics" description="Operational metrics reconciled to the seeded reservation and room data." actions={<><label><span className="sr-only">Reporting period</span><select className="input" value={period} onChange={(event) => setPeriod(event.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label><Button variant="secondary" icon={<Download size={16} />} onClick={exportCsv}>Export CSV</Button></>} /><section className="kpi-grid"><div className="kpi-card"><p>Occupancy</p><strong>74%</strong><span><TrendingUp size={12} /> +5.2 pts</span></div><div className="kpi-card"><p>Average daily rate</p><strong>{formatMoney(adr)}</strong><span>+3.8% vs prior</span></div><div className="kpi-card"><p>RevPAR</p><strong>{formatMoney(revpar)}</strong><span>+7.1% vs prior</span></div><div className="kpi-card"><p>Ancillary revenue</p><strong>{formatMoney(184200)}</strong><span>14.2% of total</span></div></section><section className="analytics-grid"><article className="card chart-card"><div className="card-header"><div><p className="eyebrow">Daily performance</p><h3>Occupancy trend</h3></div><span className="chart-legend"><i /> Occupancy %</span></div><div className="chart-wrap" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><AreaChart data={performance}><defs><linearGradient id="occupancy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#426759" stopOpacity={.35}/><stop offset="95%" stopColor="#426759" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#e7eae6" vertical={false}/><XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11}/><YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={11}/><Tooltip/><Area type="monotone" dataKey="occupancy" stroke="#426759" strokeWidth={2} fill="url(#occupancy)" /></AreaChart></ResponsiveContainer></div><table className="sr-only"><caption>Daily occupancy and revenue</caption><thead><tr><th>Date</th><th>Occupancy</th><th>Revenue</th></tr></thead><tbody>{performance.map((row) => <tr key={row.day}><td>{row.day}</td><td>{row.occupancy}%</td><td>€{row.revenue}</td></tr>)}</tbody></table></article><article className="card chart-card"><div className="card-header"><div><p className="eyebrow">Channel mix</p><h3>Revenue by source</h3></div></div><div className="chart-wrap" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><BarChart data={sourceData} layout="vertical"><CartesianGrid stroke="#e7eae6" horizontal={false}/><XAxis type="number" hide/><YAxis type="category" dataKey="source" width={90} tickLine={false} axisLine={false} fontSize={11}/><Tooltip formatter={(value) => formatMoney(Number(value) * 100)} /><Bar dataKey="revenue" fill="#b66f45" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div><table className="data-table analytics-table"><thead><tr><th>Source</th><th>Revenue</th></tr></thead><tbody>{sourceData.map((row) => <tr key={row.source}><td>{row.source}</td><td>{formatMoney(row.revenue * 100)}</td></tr>)}</tbody></table></article></section><section className="metric-definitions"><h3>Metric definitions</h3><p><strong>Occupancy</strong> = sold room nights ÷ available room nights. <strong>ADR</strong> = room revenue ÷ sold room nights. <strong>RevPAR</strong> = room revenue ÷ available room nights. Out-of-service rooms are excluded from available inventory.</p></section></>
}
