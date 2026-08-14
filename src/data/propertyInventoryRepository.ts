import type { AmenityOption, MediaUploadInput, PropertyMedia } from '../domain/propertyInventory'
import { supabase } from './supabase'

const bucket = 'property-media'

const requireClient = () => {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

const safeFilename = (name: string) => name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '') || 'property-image'

export const listPropertyMedia = async (propertyId: string): Promise<PropertyMedia[]> => {
  const client = requireClient()
  const { data, error } = await client.from('property_media').select('*').eq('property_id', propertyId).order('sort_order').order('created_at')
  if (error) throw new Error(error.message)

  return (data ?? []).map((item) => ({
    id: item.id,
    propertyId: item.property_id,
    storagePath: item.storage_path,
    publicUrl: client.storage.from(bucket).getPublicUrl(item.storage_path).data.publicUrl,
    altEn: item.alt_en,
    altKa: item.alt_ka,
    width: item.width,
    height: item.height,
    focalX: item.focal_x,
    focalY: item.focal_y,
    isCover: item.is_cover,
    sortOrder: item.sort_order,
  }))
}

export const uploadPropertyMedia = async (input: MediaUploadInput): Promise<void> => {
  const client = requireClient()
  const path = `${input.propertyId}/${crypto.randomUUID()}-${safeFilename(input.file.name)}`
  const { error: uploadError } = await client.storage.from(bucket).upload(path, input.file, {
    cacheControl: '31536000',
    contentType: input.file.type,
    upsert: false,
  })
  if (uploadError) throw new Error(uploadError.message)

  const { count } = await client.from('property_media').select('id', { count: 'exact', head: true }).eq('property_id', input.propertyId)
  const { data, error } = await client.from('property_media').insert({
    property_id: input.propertyId,
    storage_path: path,
    alt_en: input.altEn.trim(),
    alt_ka: input.altKa.trim(),
    width: input.width,
    height: input.height,
    is_cover: count === 0,
    sort_order: count ?? 0,
  }).select('id').single()

  if (error || !data) {
    await client.storage.from(bucket).remove([path])
    throw new Error(error?.message ?? 'The image record could not be created.')
  }
}

export const updatePropertyMediaText = async (mediaId: string, altEn: string, altKa: string): Promise<void> => {
  const client = requireClient()
  const { error } = await client.from('property_media').update({ alt_en: altEn.trim(), alt_ka: altKa.trim() }).eq('id', mediaId)
  if (error) throw new Error(error.message)
}

export const setPropertyCover = async (propertyId: string, mediaId: string): Promise<void> => {
  const client = requireClient()
  const { error } = await client.rpc('set_property_cover', { p_property_id: propertyId, p_media_id: mediaId })
  if (error) throw new Error(error.message)
}

export const deletePropertyMedia = async (media: PropertyMedia): Promise<void> => {
  const client = requireClient()
  const { error } = await client.from('property_media').delete().eq('id', media.id)
  if (error) throw new Error(error.message)

  const { error: storageError } = await client.storage.from(bucket).remove([media.storagePath])
  if (storageError) throw new Error(`Image removed from the listing, but storage cleanup failed: ${storageError.message}`)

  if (media.isCover) {
    const { data: next } = await client.from('property_media').select('id').eq('property_id', media.propertyId).order('sort_order').limit(1).maybeSingle()
    if (next) await setPropertyCover(media.propertyId, next.id)
  }
}

export const listPropertyAmenities = async (propertyId: string): Promise<AmenityOption[]> => {
  const client = requireClient()
  const [amenitiesResult, selectedResult] = await Promise.all([
    client.from('amenities').select('*').eq('active', true).order('name_en'),
    client.from('property_amenities').select('amenity_id, included').eq('property_id', propertyId),
  ])
  if (amenitiesResult.error) throw new Error(amenitiesResult.error.message)
  if (selectedResult.error) throw new Error(selectedResult.error.message)

  return (amenitiesResult.data ?? []).map((amenity) => {
    const selected = (selectedResult.data ?? []).find((item) => item.amenity_id === amenity.id)
    return {
      id: amenity.id,
      code: amenity.code,
      nameEn: amenity.name_en,
      nameKa: amenity.name_ka,
      icon: amenity.icon,
      selected: Boolean(selected),
      included: selected?.included ?? true,
    }
  })
}

export const setPropertyAmenity = async (propertyId: string, amenityId: string, selected: boolean, included = true): Promise<void> => {
  const client = requireClient()
  const query = selected
    ? client.from('property_amenities').upsert({ property_id: propertyId, amenity_id: amenityId, included }, { onConflict: 'property_id,amenity_id' })
    : client.from('property_amenities').delete().eq('property_id', propertyId).eq('amenity_id', amenityId)
  const { error } = await query
  if (error) throw new Error(error.message)
}
