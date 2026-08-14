import { describe, expect, it } from 'vitest'
import { newRoomTypeForm, roomTypeFormSchema } from './roomInventory'

const validRoomType = {
  ...newRoomTypeForm('00000000-0000-4000-8000-000000000001'),
  code: 'SEA-STUDIO',
  slug: 'sea-view-studio',
  baseRateGel: '145.50',
  nameEn: 'Sea-view studio',
  descriptionEn: 'A bright studio with a private balcony and a practical kitchen for short or long stays.',
  nameKa: 'სტუდიო ზღვის ხედით',
  descriptionKa: 'ნათელი სტუდიო პირადი აივნით და პრაქტიკული სამზარეულოთი მოკლე ან ხანგრძლივი ვიზიტისთვის.',
}

describe('roomTypeFormSchema', () => {
  it('accepts bilingual room inventory with an exact GEL rate', () => {
    expect(roomTypeFormSchema.safeParse(validRoomType).success).toBe(true)
  })

  it('rejects invalid slugs and free inventory', () => {
    expect(roomTypeFormSchema.safeParse({ ...validRoomType, slug: 'Sea View' }).success).toBe(false)
    expect(roomTypeFormSchema.safeParse({ ...validRoomType, baseRateGel: '0' }).success).toBe(false)
  })
})
