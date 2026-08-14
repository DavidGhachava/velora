import { describe, expect, it } from 'vitest'
import { filterAndSortProperties, type PropertyFilters } from './usePropertyDirectory'

const filters: PropertyFilters = { query: '', area: 'all', propertyType: 'all', arrival: '', departure: '', maxPriceGel: 1000, minimumRating: 0, minimumRooms: 0, amenities: [] }

describe('property directory filtering and sorting', () => {
  it('sorts published prices first and keeps properties without a price last', () => {
    const results = filterAndSortProperties(filters, 'price-asc', null)
    expect(results[0]?.slug).toBe('solis-residence')
    expect(results[1]?.slug).toBe('white-sails-residential')
    expect(results.at(-1)?.startingRateGel).toBeUndefined()
  })

  it('combines type, price, rating and amenity filters', () => {
    const results = filterAndSortProperties({ ...filters, propertyType: 'Apartment', maxPriceGel: 150, minimumRating: 9, amenities: ['Kitchen'] }, 'rating', null)
    expect(results.map((property) => property.slug)).toEqual(['solis-residence'])
  })

  it('limits dated searches to bookable properties with inventory', () => {
    const results = filterAndSortProperties(filters, 'recommended', new Set(['white-sails-residential']))
    expect(results.map((property) => property.slug)).toEqual(['white-sails-residential'])
  })

  it('sorts property size in both directions', () => {
    const largest = filterAndSortProperties(filters, 'size-desc', null)
    const smallest = filterAndSortProperties(filters, 'size-asc', null)
    expect(largest[0]?.roomCount).toBeGreaterThanOrEqual(largest[1]?.roomCount ?? 0)
    expect(smallest[0]?.roomCount).toBeLessThanOrEqual(smallest[1]?.roomCount ?? Number.POSITIVE_INFINITY)
  })
})
