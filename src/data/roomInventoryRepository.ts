import type { ManagedRoomType, PhysicalRoom, RoomTypeFormValues } from '../domain/roomInventory'
import { supabase } from './supabase'

const requireClient = () => {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

export const listRoomInventory = async (propertyId: string): Promise<{ roomTypes: ManagedRoomType[]; rooms: PhysicalRoom[] }> => {
  const client = requireClient()
  const [typesResult, translationsResult, roomsResult] = await Promise.all([
    client.from('room_types').select('*').eq('property_id', propertyId).order('display_order').order('created_at'),
    client.from('room_type_translations').select('*'),
    client.from('rooms').select('*').eq('property_id', propertyId).order('number'),
  ])
  if (typesResult.error) throw new Error(typesResult.error.message)
  if (translationsResult.error) throw new Error(translationsResult.error.message)
  if (roomsResult.error) throw new Error(roomsResult.error.message)

  const rooms: PhysicalRoom[] = (roomsResult.data ?? []).map((room) => ({
    id: room.id,
    propertyId: room.property_id,
    roomTypeId: room.room_type_id,
    number: room.number,
    floor: room.floor,
    occupancyStatus: room.occupancy_status as PhysicalRoom['occupancyStatus'],
    conditionStatus: room.condition_status as PhysicalRoom['conditionStatus'],
    privacyStatus: room.privacy_status as PhysicalRoom['privacyStatus'],
    active: room.active,
  }))

  const roomTypes: ManagedRoomType[] = (typesResult.data ?? []).map((roomType) => {
    const en = (translationsResult.data ?? []).find((translation) => translation.room_type_id === roomType.id && translation.locale === 'en')
    const ka = (translationsResult.data ?? []).find((translation) => translation.room_type_id === roomType.id && translation.locale === 'ka')
    return {
      id: roomType.id,
      propertyId: roomType.property_id,
      code: roomType.code,
      slug: roomType.slug,
      maxGuests: roomType.max_guests,
      sizeM2: roomType.size_m2,
      bedType: roomType.bed_type,
      accessible: roomType.accessible,
      active: roomType.active,
      baseRateMinor: roomType.base_rate_minor,
      nameEn: en?.name ?? '',
      descriptionEn: en?.description ?? '',
      nameKa: ka?.name ?? '',
      descriptionKa: ka?.description ?? '',
      roomCount: rooms.filter((room) => room.roomTypeId === roomType.id && room.active).length,
    }
  })

  return { roomTypes, rooms }
}

export const saveRoomType = async (values: RoomTypeFormValues): Promise<string> => {
  const client = requireClient()
  const { data, error } = await client.rpc('manage_room_type', {
    p_property_id: values.propertyId,
    p_code: values.code,
    p_slug: values.slug,
    p_max_guests: values.maxGuests,
    p_bed_type: values.bedType,
    p_accessible: values.accessible,
    p_active: values.active,
    p_base_rate_minor: Math.round(Number(values.baseRateGel) * 100),
    p_name_en: values.nameEn,
    p_description_en: values.descriptionEn,
    p_name_ka: values.nameKa,
    p_description_ka: values.descriptionKa,
    ...(values.sizeM2 ? { p_size_m2: Number(values.sizeM2) } : {}),
    ...(values.id ? { p_id: values.id } : {}),
  })
  if (error?.code === '23505') throw new Error('That room code or URL slug is already in use.')
  if (error) throw new Error(error.message)
  if (!data) throw new Error('The room type could not be saved.')
  return data
}

export const deleteRoomType = async (roomTypeId: string): Promise<void> => {
  const client = requireClient()
  const { error } = await client.from('room_types').delete().eq('id', roomTypeId)
  if (error?.code === '23503') throw new Error('This room type has physical rooms or reservations. Deactivate it instead.')
  if (error) throw new Error(error.message)
}

export const createPhysicalRoom = async (propertyId: string, roomTypeId: string, number: string, floor: number | null): Promise<void> => {
  const client = requireClient()
  const { error } = await client.from('rooms').insert({ property_id: propertyId, room_type_id: roomTypeId, number: number.trim(), floor })
  if (error?.code === '23505') throw new Error(`Room ${number.trim()} already exists at this property.`)
  if (error) throw new Error(error.message)
}

export const setPhysicalRoomActive = async (roomId: string, active: boolean): Promise<void> => {
  const client = requireClient()
  const { error } = await client.from('rooms').update({ active, updated_at: new Date().toISOString() }).eq('id', roomId)
  if (error) throw new Error(error.message)
}
