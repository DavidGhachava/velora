import { z } from 'zod'

export const propertyTypes = ['hotel', 'apartment', 'aparthotel'] as const
export const propertyStatuses = ['draft', 'published', 'paused', 'archived'] as const

const optionalCoordinate = (minimum: number, maximum: number) => z.string().refine(
  (value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= minimum && Number(value) <= maximum),
  `Enter a value from ${minimum} to ${maximum}.`,
)

export const propertyFormSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(3, 'Use at least 3 characters.').max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.'),
  propertyType: z.enum(propertyTypes),
  status: z.enum(propertyStatuses),
  address: z.string().trim().min(5, 'Enter the street address.'),
  area: z.string().trim().min(2, 'Enter the Batumi area.'),
  latitude: optionalCoordinate(-90, 90),
  longitude: optionalCoordinate(-180, 180),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM.'),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM.'),
  contactEmail: z.union([z.literal(''), z.string().trim().email('Enter a valid email.')]),
  contactPhone: z.string().trim().max(30),
  nameEn: z.string().trim().min(2, 'Enter the English name.'),
  shortDescriptionEn: z.string().trim().min(20, 'Write at least 20 characters.').max(180),
  descriptionEn: z.string().trim().min(40, 'Write at least 40 characters.').max(3000),
  policiesEn: z.string().trim().max(2000),
  nameKa: z.string().trim().min(2, 'Enter the Georgian name.'),
  shortDescriptionKa: z.string().trim().min(20, 'Write at least 20 characters.').max(180),
  descriptionKa: z.string().trim().min(40, 'Write at least 40 characters.').max(3000),
  policiesKa: z.string().trim().max(2000),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>

export interface PropertyTranslation {
  name: string
  shortDescription: string
  description: string
  policies: string
}

export interface ManagedProperty {
  id: string
  slug: string
  propertyType: (typeof propertyTypes)[number]
  status: (typeof propertyStatuses)[number]
  address: string
  area: string
  latitude: number | null
  longitude: number | null
  checkInTime: string
  checkOutTime: string
  contactEmail: string
  contactPhone: string
  updatedAt: string
  mediaCount: number
  roomTypeCount: number
  en: PropertyTranslation
  ka: PropertyTranslation
}

export const emptyPropertyForm: PropertyFormValues = {
  slug: '',
  propertyType: 'apartment',
  status: 'draft',
  address: '',
  area: '',
  latitude: '',
  longitude: '',
  checkInTime: '15:00',
  checkOutTime: '12:00',
  contactEmail: '',
  contactPhone: '',
  nameEn: '',
  shortDescriptionEn: '',
  descriptionEn: '',
  policiesEn: '',
  nameKa: '',
  shortDescriptionKa: '',
  descriptionKa: '',
  policiesKa: '',
}

export const propertyToForm = (property: ManagedProperty): PropertyFormValues => ({
  id: property.id,
  slug: property.slug,
  propertyType: property.propertyType,
  status: property.status,
  address: property.address,
  area: property.area,
  latitude: property.latitude?.toString() ?? '',
  longitude: property.longitude?.toString() ?? '',
  checkInTime: property.checkInTime.slice(0, 5),
  checkOutTime: property.checkOutTime.slice(0, 5),
  contactEmail: property.contactEmail,
  contactPhone: property.contactPhone,
  nameEn: property.en.name,
  shortDescriptionEn: property.en.shortDescription,
  descriptionEn: property.en.description,
  policiesEn: property.en.policies,
  nameKa: property.ka.name,
  shortDescriptionKa: property.ka.shortDescription,
  descriptionKa: property.ka.description,
  policiesKa: property.ka.policies,
})
