import {
  Check,
  CookingPot,
  Dumbbell,
  Microwave,
  ParkingCircle,
  PawPrint,
  Shirt,
  Sparkles,
  Tv,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import { useLocale } from '../../i18n/LocaleProvider'

const amenityIcons: Array<[RegExp, LucideIcon]> = [
  [/wi-?fi|internet/i, Wifi],
  [/kitchen|cooking/i, CookingPot],
  [/microwave/i, Microwave],
  [/washing|laundry/i, Shirt],
  [/air condition|climate/i, Wind],
  [/tv/i, Tv],
  [/pool|sea|beach/i, Waves],
  [/parking/i, ParkingCircle],
  [/pet/i, PawPrint],
  [/fitness|gym/i, Dumbbell],
  [/spa|wellness/i, Sparkles],
]

const getIcon = (amenity: string): LucideIcon =>
  amenityIcons.find(([pattern]) => pattern.test(amenity))?.[1] ?? Check

export function AmenityGrid({ amenities, compact = false }: { amenities: string[]; compact?: boolean }) {
  const { t } = useLocale()
  return <ul className={`amenity-list${compact ? ' amenity-list--compact' : ''}`}>
    {amenities.map((amenity) => {
      const Icon = getIcon(amenity)
      return <li key={amenity}><span><Icon size={18} aria-hidden="true" /></span>{t(amenity)}</li>
    })}
  </ul>
}
