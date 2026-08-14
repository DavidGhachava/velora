import type { RoomType } from '../domain/types'
import type { Language } from '../i18n/LocaleProvider'
import { batumiHotels, type BatumiHotel } from './batumiHotels'
import type { Database } from './database.types'
import { supabase } from './supabase'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type PropertyTranslationRow = Database['public']['Tables']['property_translations']['Row']
type PropertyMediaRow = Database['public']['Tables']['property_media']['Row']
type RoomTypeRow = Database['public']['Tables']['room_types']['Row']
type RoomTranslationRow = Database['public']['Tables']['room_type_translations']['Row']
type RoomMediaRow = Database['public']['Tables']['room_type_media']['Row']
type AmenityRow = Database['public']['Tables']['amenities']['Row']
type PropertyAmenityRow = Database['public']['Tables']['property_amenities']['Row']
type RoomAmenityRow = Database['public']['Tables']['room_type_amenities']['Row']

export interface PublicCatalog {
  properties: BatumiHotel[]
  roomTypes: RoomType[]
}

const smallImage = (url: string) => url.replace('-1280.webp', '-640.webp').replace('-1200.webp', '-640.webp').replace('-1600.webp', '-640.webp')

const mediaUrl = (media: Pick<PropertyMediaRow | RoomMediaRow, 'source_url' | 'storage_path'>): string => {
  if (media.source_url) return media.source_url
  if (!media.storage_path || !supabase) return ''
  return supabase.storage.from('property-media').getPublicUrl(media.storage_path).data.publicUrl
}

const translationFor = <Row extends { locale: string }>(rows: Row[], language: Language) =>
  rows.find((row) => row.locale === language) ?? rows.find((row) => row.locale === 'en')

export const staticPublicCatalog: PublicCatalog = {
  properties: batumiHotels,
  roomTypes: [],
}

export const listPublicCatalog = async (language: Language): Promise<PublicCatalog> => {
  if (!supabase) return staticPublicCatalog

  const [
    propertiesResult,
    propertyTranslationsResult,
    propertyMediaResult,
    roomTypesResult,
    roomTranslationsResult,
    roomMediaResult,
    amenitiesResult,
    propertyAmenitiesResult,
    roomAmenitiesResult,
  ] = await Promise.all([
    supabase.from('properties').select('*').eq('status', 'published').order('display_order'),
    supabase.from('property_translations').select('*'),
    supabase.from('property_media').select('*').order('sort_order'),
    supabase.from('room_types').select('*').eq('active', true).order('display_order'),
    supabase.from('room_type_translations').select('*'),
    supabase.from('room_type_media').select('*').order('sort_order'),
    supabase.from('amenities').select('*').eq('active', true),
    supabase.from('property_amenities').select('*'),
    supabase.from('room_type_amenities').select('*'),
  ])

  const results = [propertiesResult, propertyTranslationsResult, propertyMediaResult, roomTypesResult, roomTranslationsResult, roomMediaResult, amenitiesResult, propertyAmenitiesResult, roomAmenitiesResult]
  const failed = results.find((result) => result.error)
  if (failed?.error) throw new Error(failed.error.message)

  const properties = (propertiesResult.data as PropertyRow[]).map((property) => {
    const fallback = batumiHotels.find((hotel) => hotel.slug === property.slug)
    const translation = translationFor((propertyTranslationsResult.data as PropertyTranslationRow[]).filter((row) => row.property_id === property.id), language)
    const media = (propertyMediaResult.data as PropertyMediaRow[]).filter((row) => row.property_id === property.id)
    const cover = media.find((item) => item.is_cover) ?? media[0]
    const image = cover ? mediaUrl(cover) : fallback?.image ?? '/images/velora/residence-1600.webp'
    const amenityIds = new Set((propertyAmenitiesResult.data as PropertyAmenityRow[]).filter((item) => item.property_id === property.id && item.included).map((item) => item.amenity_id))
    const includedAmenities = (amenitiesResult.data as AmenityRow[]).filter((item) => amenityIds.has(item.id)).map((item) => language === 'ka' ? item.name_ka : item.name_en)
    const bookable = (roomTypesResult.data as RoomTypeRow[]).some((roomType) => roomType.property_id === property.id)
    const propertyType: BatumiHotel['propertyType'] = property.property_type === 'hotel' ? 'Hotel' : 'Apartment'

    return {
      slug: property.slug,
      name: translation?.name ?? fallback?.name ?? property.slug,
      brand: fallback?.brand ?? 'Velora partner',
      area: property.area,
      address: property.address,
      category: fallback?.category ?? (propertyType === 'Apartment' ? 'Apartment' : 'Hotel'),
      summary: translation?.short_description ?? fallback?.summary ?? '',
      highlights: fallback?.highlights ?? includedAmenities.slice(0, 3),
      practical: translation?.policies ? [translation.policies] : fallback?.practical ?? [],
      propertyType,
      includedAmenities,
      availableAmenities: fallback?.availableAmenities ?? [],
      startingRateGel: (roomTypesResult.data as RoomTypeRow[]).filter((roomType) => roomType.property_id === property.id).reduce<number | undefined>((lowest, roomType) => lowest === undefined || roomType.base_rate_minor < lowest ? roomType.base_rate_minor : lowest, undefined),
      rateContext: fallback?.rateContext,
      bookable,
      gallery: media.map((item, index) => {
        const url = mediaUrl(item)
        return { image: url, imageSmall: smallImage(url), alt: language === 'ka' ? item.alt_ka : item.alt_en, label: index === 0 ? 'Property exterior' : 'Property photo' }
      }),
      reviews: fallback?.reviews,
      roomCount: fallback?.roomCount ?? (roomTypesResult.data as RoomTypeRow[]).filter((roomType) => roomType.property_id === property.id).length,
      checkIn: property.check_in_time.slice(0, 5),
      checkOut: property.check_out_time.slice(0, 5),
      officialUrl: fallback?.officialUrl ?? '',
      image,
      imageSmall: smallImage(image),
      imageAlt: cover ? (language === 'ka' ? cover.alt_ka : cover.alt_en) : fallback?.imageAlt ?? '',
      imageSourceName: fallback?.imageSourceName ?? '',
      imageSourceUrl: fallback?.imageSourceUrl ?? '',
    }
  })

  const propertyById = new Map((propertiesResult.data as PropertyRow[]).map((property) => [property.id, property]))
  const propertyNameById = new Map((propertiesResult.data as PropertyRow[]).map((property) => {
    const translation = translationFor((propertyTranslationsResult.data as PropertyTranslationRow[]).filter((row) => row.property_id === property.id), language)
    return [property.id, translation?.name ?? property.slug]
  }))
  const roomTypes = (roomTypesResult.data as RoomTypeRow[]).map((roomType) => {
    const translation = translationFor((roomTranslationsResult.data as RoomTranslationRow[]).filter((row) => row.room_type_id === roomType.id), language)
    const media = (roomMediaResult.data as RoomMediaRow[]).filter((item) => item.room_type_id === roomType.id)
    const cover = media.find((item) => item.is_cover) ?? media[0]
    const amenityIds = new Set((roomAmenitiesResult.data as RoomAmenityRow[]).filter((item) => item.room_type_id === roomType.id && item.included).map((item) => item.amenity_id))
    const amenities = (amenitiesResult.data as AmenityRow[]).filter((item) => amenityIds.has(item.id)).map((item) => language === 'ka' ? item.name_ka : item.name_en)
    const property = propertyById.get(roomType.property_id)
    const gallery = media.map(mediaUrl).filter(Boolean)
    const image = cover ? mediaUrl(cover) : '/images/velora/suite-1600.webp'

    return {
      id: roomType.id,
      propertySlug: property?.slug,
      propertyName: propertyNameById.get(roomType.property_id),
      slug: roomType.slug,
      name: translation?.name ?? roomType.code,
      tagline: translation?.name ?? roomType.code,
      description: translation?.description ?? '',
      sizeM2: roomType.size_m2 ?? 0,
      bed: roomType.bed_type,
      maxGuests: roomType.max_guests,
      baseRate: roomType.base_rate_minor,
      roomIds: [],
      amenities,
      accessible: roomType.accessible,
      image,
      gallery: gallery.length ? gallery : [image],
    }
  })

  return { properties, roomTypes }
}
