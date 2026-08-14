import { RoomCard } from '../../components/public/RoomCard'
import { StaySearch } from '../../components/public/StaySearch'
import { ResponsiveImage } from '../../components/ui/ResponsiveImage'
import { useAppData } from '../../data/AppDataProvider'
import { heroImages } from '../../data/seed'
import { useLocale } from '../../i18n/LocaleProvider'

export function RoomsPage() {
  const { state } = useAppData()
  const { t } = useLocale()
  return <><section className="page-hero"><ResponsiveImage src={heroImages.suite} sizes="100vw" fetchPriority="high" alt="Velora suite opening toward the sea" /><div><p className="eyebrow">Velora Batumi</p><h1>{t('Rooms and residences')}</h1></div></section><section className="section section--tight"><div className="content-container"><StaySearch className="search-panel--page" /></div></section><section className="section"><div className="content-container room-grid">{state.roomTypes.map((room) => <RoomCard key={room.id} room={room} />)}</div></section></>
}
