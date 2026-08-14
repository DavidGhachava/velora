import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale } from '../../i18n/LocaleProvider'

const routeMetadata = (path: string, language: 'en' | 'ka') => {
  if (language === 'ka') {
    if (path === '/') return ['Velora ბათუმი — სასტუმროებისა და აპარტამენტების დაჯავშნა', 'იპოვეთ და დაჯავშნეთ სასტუმროები, აპარტამენტები და ნომრები ბათუმში.'] as const
    if (path === '/hotels') return ['სასტუმროები და აპარტამენტები ბათუმში — Velora', 'გაფილტრეთ ბათუმის სასტუმროები და აპარტამენტები ფასის, უბნის, შეფასებისა და კეთილმოწყობის მიხედვით.'] as const
    if (path === '/availability') return ['ხელმისაწვდომი საცხოვრებელი ბათუმში — Velora', 'შეამოწმეთ ხელმისაწვდომობა და დაჯავშნეთ სასტუმროს ნომერი ან აპარტამენტი ბათუმში.'] as const
    if (path === '/booking') return ['დაცული დაჯავშნა — Velora ბათუმი', 'შეავსეთ სტუმრის მონაცემები, აირჩიეთ დამატებები და უსაფრთხოდ გადაიხადეთ.'] as const
    if (path.startsWith('/manage/')) return ['ჯავშნის მართვა — Velora ბათუმი', 'ნახეთ და მართეთ თქვენი Velora ბათუმის ჯავშანი.'] as const
    return ['Velora ბათუმი', 'დაჯავშნეთ სასტუმროები, აპარტამენტები და ნომრები ბათუმში.'] as const
  }
  if (path === '/') return ['Velora Batumi — Book hotels and apartments', 'Find and book hotels, apartments and rooms in Batumi with prices in GEL or USD.'] as const
  if (path === '/hotels') return ['Batumi hotels and apartments — Velora', 'Browse and filter Batumi hotels and apartments by price, area, rating and amenities.'] as const
  if (path.startsWith('/hotels/')) return ['Property details — Velora Batumi', 'View property photos, rooms, amenities, guest ratings and available prices in Batumi.'] as const
  if (path === '/rooms') return ['Rooms and apartments in Batumi — Velora', 'Compare available Batumi rooms and apartments by size, amenities and nightly price.'] as const
  if (path.startsWith('/rooms/')) return ['Room details — Velora Batumi', 'View room photos, included amenities, policies and complete booking prices.'] as const
  if (path === '/availability') return ['Available stays in Batumi — Velora', 'Check real availability and reserve a Batumi hotel room or apartment online.'] as const
  if (path === '/booking') return ['Secure booking — Velora Batumi', 'Complete guest details, extras and secure payment for your Batumi reservation.'] as const
  if (path.startsWith('/manage/')) return ['Manage reservation — Velora Batumi', 'Review and manage your Velora Batumi reservation.'] as const
  return ['Velora Batumi', 'Book hotels, apartments and rooms in Batumi.'] as const
}

export function SeoManager() {
  const { pathname } = useLocation()
  const { language } = useLocale()
  useEffect(() => {
    const [title, description] = routeMetadata(pathname, language)
    document.title = title
    const setContent = (selector: string, content: string) => document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
    setContent('meta[name="description"]', description)
    setContent('meta[property="og:title"]', title)
    setContent('meta[property="og:description"]', description)
    setContent('meta[property="og:url"]', window.location.href)
    setContent('meta[property="og:locale"]', language === 'ka' ? 'ka_GE' : 'en_US')
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = `${window.location.origin}${pathname}`
  }, [language, pathname])
  return null
}
