import type { ManagedProperty, PropertyFormValues, PropertyTranslation } from '../domain/property'
import { propertyStatuses, propertyTypes } from '../domain/property'
import type { Database } from './database.types'
import { supabase } from './supabase'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type TranslationRow = Database['public']['Tables']['property_translations']['Row']

const requireClient = () => {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

const throwDataError = (message: string, code?: string) => {
  if (code === '23505') throw new Error('That URL slug is already used by another property.')
  throw new Error(message)
}

const translationFrom = (rows: TranslationRow[], locale: 'en' | 'ka'): PropertyTranslation => {
  const translation = rows.find((row) => row.locale === locale)
  return {
    name: translation?.name ?? '',
    shortDescription: translation?.short_description ?? '',
    description: translation?.description ?? '',
    policies: translation?.policies ?? '',
  }
}

const mapProperty = (
  row: PropertyRow,
  translations: TranslationRow[],
  mediaCount: number,
  roomTypeCount: number,
): ManagedProperty => {
  if (!propertyTypes.includes(row.property_type as (typeof propertyTypes)[number])) throw new Error('Unsupported property type.')
  if (!propertyStatuses.includes(row.status as (typeof propertyStatuses)[number])) throw new Error('Unsupported property status.')

  return {
    id: row.id,
    slug: row.slug,
    propertyType: row.property_type as ManagedProperty['propertyType'],
    status: row.status as ManagedProperty['status'],
    address: row.address,
    area: row.area,
    latitude: row.latitude,
    longitude: row.longitude,
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
    contactEmail: row.contact_email ?? '',
    contactPhone: row.contact_phone ?? '',
    updatedAt: row.updated_at,
    mediaCount,
    roomTypeCount,
    en: translationFrom(translations, 'en'),
    ka: translationFrom(translations, 'ka'),
  }
}

export const listManagedProperties = async (): Promise<ManagedProperty[]> => {
  const client = requireClient()
  const [propertiesResult, translationsResult, mediaResult, roomTypesResult] = await Promise.all([
    client.from('properties').select('*').order('display_order').order('created_at'),
    client.from('property_translations').select('*'),
    client.from('property_media').select('property_id'),
    client.from('room_types').select('property_id'),
  ])

  const failure = [propertiesResult, translationsResult, mediaResult, roomTypesResult].find((result) => result.error)
  if (failure?.error) throwDataError(failure.error.message, failure.error.code)

  return (propertiesResult.data ?? []).map((property) => mapProperty(
    property,
    (translationsResult.data ?? []).filter((translation) => translation.property_id === property.id),
    (mediaResult.data ?? []).filter((media) => media.property_id === property.id).length,
    (roomTypesResult.data ?? []).filter((roomType) => roomType.property_id === property.id).length,
  ))
}

export const saveManagedProperty = async (values: PropertyFormValues): Promise<string> => {
  const client = requireClient()
  const { data, error } = await client.rpc('manage_property', {
    p_slug: values.slug,
    p_property_type: values.propertyType,
    p_status: values.status,
    p_address: values.address,
    p_area: values.area,
    p_check_in_time: values.checkInTime,
    p_check_out_time: values.checkOutTime,
    p_name_en: values.nameEn,
    p_short_description_en: values.shortDescriptionEn,
    p_description_en: values.descriptionEn,
    p_name_ka: values.nameKa,
    p_short_description_ka: values.shortDescriptionKa,
    p_description_ka: values.descriptionKa,
    ...(values.policiesEn ? { p_policies_en: values.policiesEn } : {}),
    ...(values.policiesKa ? { p_policies_ka: values.policiesKa } : {}),
    ...(values.latitude ? { p_latitude: Number(values.latitude) } : {}),
    ...(values.longitude ? { p_longitude: Number(values.longitude) } : {}),
    ...(values.contactEmail ? { p_contact_email: values.contactEmail } : {}),
    ...(values.contactPhone ? { p_contact_phone: values.contactPhone } : {}),
    ...(values.id ? { p_id: values.id } : {}),
  })

  if (error) throwDataError(error.message, error.code)
  if (!data) throw new Error('The property could not be saved.')
  return data
}

export const setPropertyStatus = async (propertyId: string, status: ManagedProperty['status']): Promise<void> => {
  const client = requireClient()
  const { error } = await client.from('properties').update({ status, updated_at: new Date().toISOString() }).eq('id', propertyId)
  if (error) throwDataError(error.message, error.code)
}

export const deleteManagedProperty = async (propertyId: string): Promise<void> => {
  const client = requireClient()
  const { error } = await client.from('properties').delete().eq('id', propertyId)
  if (error?.code === '23503') throw new Error('This property has rooms or reservations. Archive it instead.')
  if (error) throwDataError(error.message, error.code)
}
