export interface PropertyMedia {
  id: string
  propertyId: string
  storagePath: string
  publicUrl: string
  altEn: string
  altKa: string
  width: number | null
  height: number | null
  focalX: number
  focalY: number
  isCover: boolean
  sortOrder: number
}

export interface AmenityOption {
  id: string
  code: string
  nameEn: string
  nameKa: string
  icon: string
  included: boolean
  selected: boolean
}

export interface MediaUploadInput {
  propertyId: string
  file: File
  altEn: string
  altKa: string
  width: number
  height: number
}
