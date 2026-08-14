import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppData } from '../../data/AppDataProvider'
import { useLocale } from '../../i18n/LocaleProvider'
import { SuccessNotice } from '../ui/Feedback'
import { LocaleMenu } from './LocaleMenu'
import { SeoManager } from './SeoManager'

const links = [['Hotels & apartments', '/hotels'], ['Rooms', '/rooms'], ['Manage booking', '/manage']] as const

export function PublicLayout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const enclosed = location.pathname === '/booking'
  const surfaceHeader = location.pathname.startsWith('/manage') || location.pathname.startsWith('/booking/confirmation/')
  const { notice, clearNotice } = useAppData()
  const { currency, t } = useLocale()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
    const update = () => setScrolled(window.scrollY > 28)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return <LazyMotion features={domAnimation}><div className="public-shell"><SeoManager />
    {!enclosed && <header className={`public-header ${scrolled ? 'is-scrolled' : ''} ${surfaceHeader ? 'is-surface' : ''}`}>
      <div className="header-identity">
        <Link to="/" className="brand" aria-label="Velora Batumi" onClick={() => setOpen(false)}><span>V</span> VELORA</Link>
        <Link to="/hotels" className="header-location" aria-label={t('View Batumi properties')}><MapPin size={14} /> Batumi</Link>
      </div>
      <nav className={`public-nav ${open ? 'is-open' : ''}`} aria-label={t('Main navigation')}>
        <div className="mobile-nav-brand"><Link to="/" className="brand brand--light" onClick={() => setOpen(false)}><span>V</span> VELORA</Link><span>Batumi</span></div>
        <div className="desktop-nav-links">{links.map(([label, path]) => <NavLink key={label} to={path} onClick={() => setOpen(false)}>{t(label)}</NavLink>)}</div>
        <div className="mobile-nav-links">
          <NavLink to="/" onClick={() => setOpen(false)}>{t('Home')}</NavLink>
          <NavLink to="/hotels" onClick={() => setOpen(false)}>{t('Hotels & apartments')}</NavLink>
          <NavLink to="/rooms" onClick={() => setOpen(false)}>{t('Rooms')}</NavLink>
          <NavLink to="/availability" onClick={() => setOpen(false)}>{t('Find a stay')}</NavLink>
          <NavLink to="/manage" onClick={() => setOpen(false)}>{t('Manage booking')}</NavLink>
        </div>
        <div className="mobile-nav-bottom"><LocaleMenu inverted /><a href="mailto:stay@velorabatumi.example">{t('Guest support')}</a></div>
      </nav>
      <div className="header-actions"><LocaleMenu /><Link className="header-reserve" to="/availability" onClick={() => setOpen(false)}>{t('Find a stay')}</Link></div>
      <button className="menu-button" aria-label={open ? t('Close navigation') : t('Open navigation')} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </header>}
    <AnimatePresence mode="wait" initial={false}><m.main id="main-content" key={location.pathname} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }} transition={{ duration: .24, ease: [0.22, 1, 0.36, 1] }}><Outlet /></m.main></AnimatePresence>
    {!enclosed && <footer className="public-footer">
      <div className="footer-intro"><Link to="/" className="brand brand--light"><span>V</span> VELORA</Link><p>{t('Hotels, apartments and rooms across Batumi.')}</p><div className="footer-location"><MapPin size={15} /> {t('Batumi, Georgia')}</div></div>
      <div className="footer-column"><p className="eyebrow">{t('Explore')}</p><Link to="/hotels">{t('Hotels & apartments')}</Link><Link to="/rooms">{t('Rooms')}</Link></div>
      <div className="footer-column"><p className="eyebrow">{t('Guest care')}</p><a href="mailto:stay@velorabatumi.example">{t('Email support')}</a><a href="tel:+995422000000">+995 422 00 00 00</a></div>
      <div className="footer-column"><p className="eyebrow">{t('Your booking')}</p><Link to="/manage">{t('Manage reservation')}</Link><Link to="/availability">{t('Check availability')}</Link></div>
      <div className="footer-cta"><div><span>{t('Ready to choose your dates?')}</span><strong>{t('Find your Batumi stay')}</strong></div><Link to="/availability" aria-label={t('Find a stay')}><ArrowRight /></Link></div>
      <div className="footer-bottom"><span>© 2026 Velora</span><span>{currency}</span></div>
    </footer>}
    {notice && <SuccessNotice message={notice} onDismiss={clearNotice} />}
  </div></LazyMotion>
}
