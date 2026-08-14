import { describe, expect, it } from 'vitest'
import { extras } from './seed'

describe('optional extras catalogue', () => {
  it('provides optimized imagery and useful alternative text for every extra', () => {
    for (const extra of extras) {
      expect(extra.image).toMatch(/^\/images\/velora\/.+-1600\.webp$|^\/images\/velora\/.+-2560\.webp$/)
      expect(extra.imageAlt.length).toBeGreaterThan(15)
      expect(extra.name.length).toBeGreaterThan(0)
      expect(extra.price).toBeGreaterThan(0)
    }
  })
})
