import { z } from 'zod'

const positiveOptionalNumber = z.string().refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) > 0), 'Enter a positive number.')
const positiveMoney = z.string().refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0 && Number(value) <= 100000, 'Enter a valid nightly rate.')

export const roomTypeFormSchema = z.object({
  id: z.string().uuid().optional(),
  propertyId: z.string().uuid(),
  code: z.string().trim().min(2).max(20).regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers and hyphens.'),
  slug: z.string().trim().min(3).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  maxGuests: z.number().int().min(1).max(20),
  sizeM2: positiveOptionalNumber,
  bedType: z.string().trim().min(2).max(80),
  accessible: z.boolean(),
  active: z.boolean(),
  baseRateGel: positiveMoney,
  nameEn: z.string().trim().min(2).max(120),
  descriptionEn: z.string().trim().min(30).max(2000),
  nameKa: z.string().trim().min(2).max(120),
  descriptionKa: z.string().trim().min(30).max(2000),
})

export type RoomTypeFormValues = z.infer<typeof roomTypeFormSchema>

export interface ManagedRoomType {
  id: string
  propertyId: string
  code: string
  slug: string
  maxGuests: number
  sizeM2: number | null
  bedType: string
  accessible: boolean
  active: boolean
  baseRateMinor: number
  nameEn: string
  descriptionEn: string
  nameKa: string
  descriptionKa: string
  roomCount: number
}

export interface PhysicalRoom {
  id: string
  propertyId: string
  roomTypeId: string
  number: string
  floor: number | null
  occupancyStatus: 'vacant' | 'occupied'
  conditionStatus: 'dirty' | 'cleaning' | 'clean' | 'inspected'
  privacyStatus: 'none' | 'dnd'
  active: boolean
}

export const newRoomTypeForm = (propertyId: string): RoomTypeFormValues => ({
  propertyId,
  code: '',
  slug: '',
  maxGuests: 2,
  sizeM2: '',
  bedType: 'Queen bed',
  accessible: false,
  active: true,
  baseRateGel: '',
  nameEn: '',
  descriptionEn: '',
  nameKa: '',
  descriptionKa: '',
})

export const roomTypeToForm = (roomType: ManagedRoomType): RoomTypeFormValues => ({
  id: roomType.id,
  propertyId: roomType.propertyId,
  code: roomType.code,
  slug: roomType.slug,
  maxGuests: roomType.maxGuests,
  sizeM2: roomType.sizeM2?.toString() ?? '',
  bedType: roomType.bedType,
  accessible: roomType.accessible,
  active: roomType.active,
  baseRateGel: (roomType.baseRateMinor / 100).toFixed(2),
  nameEn: roomType.nameEn,
  descriptionEn: roomType.descriptionEn,
  nameKa: roomType.nameKa,
  descriptionKa: roomType.descriptionKa,
})
