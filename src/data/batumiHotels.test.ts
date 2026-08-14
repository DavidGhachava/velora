import { describe, expect, it } from 'vitest'
import { batumiHotels } from './batumiHotels'

const expectedOfficialHosts: Record<string, string> = {
  'white-sails-residential': 'wsr.ge',
  'solis-residence': 'solisresidence.ge',
  'rooms-batumi': 'www.marriott.com',
  'le-meridien-batumi': 'www.marriott.com',
  'hilton-batumi': 'www.hilton.com',
  'radisson-blu-batumi': 'www.radissonhotels.com',
  'wyndham-batumi': 'www.wyndhamhotels.com',
  'courtyard-batumi': 'www.marriott.com',
  'ibis-styles-batumi': 'all.accor.com',
}

describe('Batumi hotel directory', () => {
  it('maps every property to its expected official booking host', () => {
    for (const hotel of batumiHotels) {
      expect(new URL(hotel.officialUrl).hostname, hotel.name).toBe(expectedOfficialHosts[hotel.slug])
    }
  })

  it('uses responsive, locally optimized property photography', () => {
    for (const hotel of batumiHotels) {
      expect(hotel.image).toBe(`/images/hotels/${hotel.slug}-1280.webp`)
      expect(hotel.imageSmall).toBe(`/images/hotels/${hotel.slug}-640.webp`)
      expect(hotel.imageAlt.length).toBeGreaterThan(20)
      expect(new URL(hotel.imageSourceUrl).protocol).toBe('https:')
    }
  })

  it('shows transparent GEL starting rates for apartment stays', () => {
    const apartments = batumiHotels.filter((hotel) => hotel.propertyType === 'Apartment')
    expect(apartments.length).toBeGreaterThanOrEqual(2)
    for (const apartment of apartments) {
      expect(apartment.startingRateGel).toBeGreaterThan(0)
      expect(apartment.includedAmenities?.length).toBeGreaterThanOrEqual(5)
      expect(apartment.rateContext).toBeTruthy()
      expect(apartment.gallery?.length).toBeGreaterThanOrEqual(4)
      expect(apartment.reviews?.score).toBeGreaterThan(0)
      expect(apartment.reviews?.score).toBeLessThanOrEqual(10)
      expect(apartment.reviews?.count).toBeGreaterThan(0)
      expect(apartment.reviews?.categories.length).toBeGreaterThanOrEqual(4)
      expect(apartment.reviews?.feedback.length).toBeGreaterThanOrEqual(3)
      expect(new URL(apartment.reviews?.sourceUrl ?? '').protocol).toBe('https:')
      for (const photo of apartment.gallery ?? []) {
        expect(photo.image).toMatch(/^\/images\/hotels\/.+-1200\.webp$/)
        expect(photo.imageSmall).toMatch(/^\/images\/hotels\/.+-640\.webp$/)
        expect(photo.alt.length).toBeGreaterThan(20)
      }
    }
  })

  it('provides a complete gallery for every apartment property', () => {
    const apartments = batumiHotels.filter((hotel) => hotel.propertyType === 'Apartment')
    expect(apartments).toHaveLength(2)
    expect(apartments.every((apartment) => (apartment.gallery?.length ?? 0) >= 4)).toBe(true)
  })
})
