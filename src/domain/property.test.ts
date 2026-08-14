import { describe, expect, it } from 'vitest'
import { emptyPropertyForm, propertyFormSchema } from './property'

const validProperty = {
  ...emptyPropertyForm,
  slug: 'black-sea-apartment',
  address: '5 New Boulevard, Batumi',
  area: 'New Boulevard',
  nameEn: 'Black Sea Apartment',
  shortDescriptionEn: 'A practical apartment near Batumi beach.',
  descriptionEn: 'A bright apartment with a kitchen, reliable Wi-Fi and simple self check-in near Batumi beach.',
  nameKa: 'შავი ზღვის აპარტამენტი',
  shortDescriptionKa: 'პრაქტიკული აპარტამენტი ბათუმის სანაპიროსთან ახლოს.',
  descriptionKa: 'ნათელი აპარტამენტი სამზარეულოთი, სტაბილური ინტერნეტით და მარტივი რეგისტრაციით ბათუმის სანაპიროსთან.',
}

describe('propertyFormSchema', () => {
  it('accepts a complete bilingual property', () => {
    expect(propertyFormSchema.safeParse(validProperty).success).toBe(true)
  })

  it('rejects unsafe URL slugs', () => {
    const result = propertyFormSchema.safeParse({ ...validProperty, slug: 'Black Sea Apartment' })
    expect(result.success).toBe(false)
  })

  it('accepts blank coordinates and validates entered coordinates', () => {
    expect(propertyFormSchema.safeParse(validProperty).success).toBe(true)
    expect(propertyFormSchema.safeParse({ ...validProperty, latitude: '120' }).success).toBe(false)
    expect(propertyFormSchema.safeParse({ ...validProperty, longitude: '41.63' }).success).toBe(true)
  })

  it('requires both English and Georgian guest-facing content', () => {
    expect(propertyFormSchema.safeParse({ ...validProperty, nameKa: '' }).success).toBe(false)
    expect(propertyFormSchema.safeParse({ ...validProperty, descriptionEn: 'Too short' }).success).toBe(false)
  })
})
