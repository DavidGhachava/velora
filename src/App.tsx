import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { NotFoundPage } from './pages/NotFoundPage'
import { useLocale } from './i18n/LocaleProvider'

const HomePage = lazy(() => import('./pages/public/HomePage').then((module) => ({ default: module.HomePage })))
const HotelsPage = lazy(() => import('./pages/public/HotelsPage').then((module) => ({ default: module.HotelsPage })))
const HotelDetailPage = lazy(() => import('./pages/public/HotelDetailPage').then((module) => ({ default: module.HotelDetailPage })))
const RoomsPage = lazy(() => import('./pages/public/RoomsPage').then((module) => ({ default: module.RoomsPage })))
const RoomDetailPage = lazy(() => import('./pages/public/RoomDetailPage').then((module) => ({ default: module.RoomDetailPage })))
const SearchPage = lazy(() => import('./pages/public/SearchPage').then((module) => ({ default: module.SearchPage })))
const CheckoutPage = lazy(() => import('./pages/public/CheckoutPage').then((module) => ({ default: module.CheckoutPage })))
const ConfirmationPage = lazy(() => import('./pages/public/ConfirmationPage').then((module) => ({ default: module.ConfirmationPage })))
const ManagePage = lazy(() => import('./pages/public/ManagePage').then((module) => ({ default: module.ManagePage })))
const SignInPage = lazy(() => import('./pages/ops/SignInPage').then((module) => ({ default: module.SignInPage })))
const OpsOverviewPage = lazy(() => import('./pages/ops/OpsOverviewPage').then((module) => ({ default: module.OpsOverviewPage })))
const PropertiesPage = lazy(() => import('./pages/ops/PropertiesPage').then((module) => ({ default: module.PropertiesPage })))
const PropertyWorkspacePage = lazy(() => import('./pages/ops/PropertyWorkspacePage').then((module) => ({ default: module.PropertyWorkspacePage })))
const ReservationsPage = lazy(() => import('./pages/ops/ReservationsPage').then((module) => ({ default: module.ReservationsPage })))
const ReservationDetailPage = lazy(() => import('./pages/ops/ReservationDetailPage').then((module) => ({ default: module.ReservationDetailPage })))
const TimelinePage = lazy(() => import('./pages/ops/TimelinePage').then((module) => ({ default: module.TimelinePage })))
const HousekeepingPage = lazy(() => import('./pages/ops/HousekeepingPage').then((module) => ({ default: module.HousekeepingPage })))
const ServicesPage = lazy(() => import('./pages/ops/ServicesPage').then((module) => ({ default: module.ServicesPage })))
const AnalyticsPage = lazy(() => import('./pages/ops/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })))
const ChannelsPage = lazy(() => import('./pages/ops/ChannelsPage').then((module) => ({ default: module.ChannelsPage })))

export function App() {
  const { t } = useLocale()
  return (
    <Suspense fallback={<div className="app-loading" role="status">{t('Preparing this view…')}</div>}><Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:slug" element={<HotelDetailPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:slug" element={<RoomDetailPage />} />
        <Route path="/availability" element={<SearchPage />} />
        <Route path="/booking" element={<CheckoutPage />} />
        <Route path="/booking/confirmation/:reservationId" element={<ConfirmationPage />} />
        <Route path="/manage/:reservationId" element={<ManagePage />} />
      </Route>
      <Route path="/ops/sign-in" element={<SignInPage />} />
      <Route path="/ops" element={<AdminLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OpsOverviewPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/:propertyId" element={<PropertyWorkspacePage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="reservations/:reservationId" element={<ReservationDetailPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="housekeeping" element={<HousekeepingPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="channels" element={<ChannelsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes></Suspense>
  )
}
