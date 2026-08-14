export interface BatumiHotel {
  slug: string
  name: string
  brand: string
  area: string
  address: string
  category: string
  summary: string
  highlights: string[]
  practical: string[]
  propertyType?: 'Hotel' | 'Apartment'
  includedAmenities?: string[]
  availableAmenities?: string[]
  startingRateGel?: number
  rateContext?: string
  bookable?: boolean
  gallery?: Array<{
    image: string
    imageLarge?: string
    imageSmall: string
    alt: string
    label: string
  }>
  reviews?: {
    score: number
    count: number
    label: string
    sourceName: string
    sourceUrl: string
    categories: Array<{ label: string; score: number }>
    feedback: Array<{ author: string; country: string; score: number; text: string }>
  }
  roomCount: number
  checkIn: string
  checkOut: string
  officialUrl: string
  image: string
  imageSmall: string
  imageAlt: string
  imageSourceName: string
  imageSourceUrl: string
}

export const hotelDataVerifiedAt = '13 August 2026'

export const batumiHotels: BatumiHotel[] = [
  {
    slug: 'white-sails-residential',
    name: 'White Sails Residential Hotel',
    brand: 'White Sails',
    area: 'New Boulevard',
    address: '5 Lech and Maria Kaczynski Street, Batumi',
    category: 'Value apartment',
    propertyType: 'Apartment',
    bookable: true,
    summary: 'Seaside aparthotel with kitchenettes, private balconies, outdoor pools and 24-hour reception.',
    highlights: ['Kitchenette in apartments', 'Outdoor pool and gardens', 'Steps from the Black Sea'],
    practical: ['Starting price is a published guide, not a live quote', 'Room equipment varies by category; confirm it before payment'],
    includedAmenities: ['Complimentary Wi-Fi', 'Air conditioning', 'Kitchenette', 'Microwave', 'Washing machine', 'Private balcony'],
    availableAmenities: ['Breakfast', 'Private parking', 'Bicycle rental', 'Pet-friendly rooms', 'Spa and wellness'],
    startingRateGel: 15000,
    rateContext: 'Published starting rate; dates and room type change the final price',
    gallery: [
      { image: '/images/hotels/white-sails-room-1-1200.webp', imageSmall: '/images/hotels/white-sails-room-1-640.webp', alt: 'White Sails twin studio with kitchenette and microwave', label: 'Twin studio' },
      { image: '/images/hotels/white-sails-room-2-1200.webp', imageSmall: '/images/hotels/white-sails-room-2-640.webp', alt: 'White Sails apartment with twin beds and private balcony', label: 'Apartment interior' },
      { image: '/images/hotels/white-sails-room-3-1200.webp', imageSmall: '/images/hotels/white-sails-room-3-640.webp', alt: 'White Sails room with compact kitchen and dining table', label: 'Kitchenette' },
      { image: '/images/hotels/white-sails-room-4-1200.webp', imageSmall: '/images/hotels/white-sails-room-4-640.webp', alt: 'White Sails residential towers and landscaped courtyard', label: 'Property exterior' },
    ],
    reviews: {
      score: 7.8, count: 604, label: 'Good', sourceName: 'Booking.com',
      sourceUrl: 'https://www.booking.com/hotel/ge/white-sails-residential.html',
      categories: [{ label: 'Location', score: 8.4 }, { label: 'Staff', score: 8.0 }, { label: 'Facilities', score: 8.0 }, { label: 'Comfort', score: 7.8 }],
      feedback: [
        { author: 'Andrei', country: 'Israel', score: 9, text: 'Clean accommodation close to the beach and nearby attractions.' },
        { author: 'Djallel', country: 'Saint Kitts and Nevis', score: 9, text: 'A clean room, convenient location and helpful reception team.' },
        { author: 'Karinevarosian', country: 'Armenia', score: 9, text: 'The administration team was helpful and polite throughout the stay.' },
      ],
    },
    roomCount: 280,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://wsr.ge/',
    image: '/images/hotels/white-sails-residential-1280.webp',
    imageSmall: '/images/hotels/white-sails-residential-640.webp',
    imageAlt: 'White Sails Residential Hotel towers and landscaped courtyard in Batumi',
    imageSourceName: 'Batumi Residence',
    imageSourceUrl: 'https://www.batumiresidence.com/en/projects/88',
  },
  {
    slug: 'solis-residence',
    name: 'Solis Residence Aparthotel',
    brand: 'Solis Residence',
    area: 'New Boulevard',
    address: '61 Sherif Khimshiashvili Street, Batumi',
    category: 'Seaside apartment',
    propertyType: 'Apartment',
    bookable: true,
    summary: 'Modern studios and apartments near Batumi Beach with kitchens, balconies and sea-view options.',
    highlights: ['3-minute walk to the beach', 'Kitchen in every apartment', 'Private balconies'],
    practical: ['Rates change by date and apartment type', 'Housekeeping is available on request'],
    includedAmenities: ['Free Wi-Fi', 'Air conditioning', 'Kitchen', 'Microwave', 'Refrigerator', 'Washing machine', 'Private balcony'],
    availableAmenities: ['Fitness centre', 'Pet-friendly stays', 'Concierge', 'Airport transfer', 'Parking nearby'],
    startingRateGel: 13000,
    rateContext: 'Recent public starting rate; your dates determine the final total',
    gallery: [
      { image: '/images/hotels/solis-residence-room-1-1200.webp', imageLarge: '/images/hotels/solis-residence-room-1-1600.webp', imageSmall: '/images/hotels/solis-residence-room-1-640.webp', alt: 'Solis Residence bedroom opening onto a balcony with a Black Sea view', label: 'Sea-view bedroom' },
      { image: '/images/hotels/solis-residence-room-2-1200.webp', imageLarge: '/images/hotels/solis-residence-room-2-1600.webp', imageSmall: '/images/hotels/solis-residence-room-2-640.webp', alt: 'Solis Residence bright double bedroom with modern furnishings', label: 'Double bedroom' },
      { image: '/images/hotels/solis-residence-room-3-1200.webp', imageLarge: '/images/hotels/solis-residence-room-3-1600.webp', imageSmall: '/images/hotels/solis-residence-room-3-640.webp', alt: 'Solis Residence studio with dining table and lounge seating', label: 'Studio living area' },
      { image: '/images/hotels/solis-residence-room-4-1200.webp', imageLarge: '/images/hotels/solis-residence-room-4-1600.webp', imageSmall: '/images/hotels/solis-residence-room-4-640.webp', alt: 'Solis Residence balcony overlooking New Boulevard and the Black Sea', label: 'Private balcony' },
    ],
    reviews: {
      score: 9.5, count: 126, label: 'Exceptional', sourceName: 'Booking.com',
      sourceUrl: 'https://www.booking.com/hotel/ge/solis-residence-aparthotel.en-gb.html',
      categories: [{ label: 'Location', score: 9.6 }, { label: 'Comfort', score: 9.6 }, { label: 'Cleanliness', score: 9.5 }, { label: 'Value', score: 9.5 }],
      feedback: [
        { author: 'Ria', country: 'United Arab Emirates', score: 10, text: 'Easy check-in and a clean apartment in a convenient location.' },
        { author: 'Irakli', country: 'Georgia', score: 10, text: 'Comfortable rooms with beach and boulevard views matching the photos.' },
        { author: 'Deepak', country: 'Netherlands', score: 9, text: 'A strong location, a pleasant balcony view and a comfortable bed.' },
      ],
    },
    roomCount: 100,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://solisresidence.ge/',
    image: '/images/hotels/solis-residence-1280.webp',
    imageSmall: '/images/hotels/solis-residence-640.webp',
    imageAlt: 'Solis Residence bedroom with a private balcony and Black Sea view',
    imageSourceName: 'Solis Residence property gallery',
    imageSourceUrl: 'https://www.hotels.com/ho3774259328/',
  },
  {
    slug: 'rooms-batumi',
    name: 'Rooms Batumi',
    brand: 'Design Hotels · Marriott Bonvoy',
    area: 'Old Batumi',
    address: '10 Gogebashvili Street, Batumi',
    category: 'Design-led',
    summary: 'Design hotel with balconies and sea or Old Town views at 10 Gogebashvili Street.',
    highlights: ['Sea and Old Town views', 'Balconies or terraces', 'Family bunk room option'],
    practical: ['Accessible rooms can be selected during official booking', 'Direct reservations handled by Marriott'],
    roomCount: 123,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://www.marriott.com/en-us/hotels/busrh-rooms-batumi-a-member-of-design-hotels/overview/',
    image: '/images/hotels/rooms-batumi-1280.webp',
    imageSmall: '/images/hotels/rooms-batumi-640.webp',
    imageAlt: 'The vine-covered façade of Rooms Batumi',
    imageSourceName: 'Marriott International',
    imageSourceUrl: 'https://www.marriott.com/en-us/hotels/busrh-rooms-batumi-a-member-of-design-hotels/photos/',
  },
  {
    slug: 'le-meridien-batumi',
    name: 'Le Méridien Batumi',
    brand: 'Marriott Bonvoy',
    area: 'Batumi Boulevard',
    address: 'Ninoshvili / Zhgenti Street, Batumi',
    category: 'Five-star',
    summary: 'Five-star hotel near Batumi Boulevard with pool, spa and family facilities.',
    highlights: ['Central boulevard location', 'Spa and pool facilities', 'Family-friendly amenities'],
    practical: ['Official availability and rates provided by Marriott', 'Direct hotel phone: +995 422 299090'],
    roomCount: 105,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://www.marriott.com/en-us/hotels/busmd-le-meridien-batumi/overview/',
    image: '/images/hotels/le-meridien-batumi-1280.webp',
    imageSmall: '/images/hotels/le-meridien-batumi-640.webp',
    imageAlt: 'Le Méridien Batumi tower rising above the boulevard',
    imageSourceName: 'Visit Batumi',
    imageSourceUrl: 'https://visitbatumi.com/en/blog/brenduli-sastumroebi-bat-umshi-341',
  },
  {
    slug: 'hilton-batumi',
    name: 'Hilton Batumi',
    brand: 'Hilton',
    area: 'Seaside Boulevard',
    address: 'Rustaveli Street, Batumi',
    category: 'Waterfront',
    summary: 'Waterfront hotel on Batumi Seaside Boulevard, close to the beach and city centre.',
    highlights: ['On Batumi Seaside Boulevard', 'Black Sea setting', 'Full-service city resort'],
    practical: ['Live rates and room inventory are available on Hilton’s official site', 'Direct booking remains with Hilton'],
    roomCount: 247,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://www.hilton.com/en/hotels/busbthi-hilton-batumi/',
    image: '/images/hotels/hilton-batumi-1280.webp',
    imageSmall: '/images/hotels/hilton-batumi-640.webp',
    imageAlt: 'Hilton Batumi twin towers beside the seaside boulevard',
    imageSourceName: 'HotelsCombined',
    imageSourceUrl: 'https://www.hotelscombined.com/Hotel/Hilton_Batumi.htm',
  },
  {
    slug: 'radisson-blu-batumi',
    name: 'Radisson Blu Hotel, Batumi',
    brand: 'Radisson Hotels',
    area: 'Europe Square',
    address: '1 Ninoshvili Street, Batumi',
    category: 'Panoramic views',
    summary: '168-room hotel near the beach with sea views, indoor and outdoor pools, spa and restaurants.',
    highlights: ['168 rooms and suites', 'Indoor and outdoor pools', 'Spa and two restaurants'],
    practical: ['Check-in 15:00 · check-out 12:00', 'Approximately 0.18 km from Batumi Boulevard'],
    roomCount: 168,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-batumi',
    image: '/images/hotels/radisson-blu-batumi-1280.webp',
    imageSmall: '/images/hotels/radisson-blu-batumi-640.webp',
    imageAlt: 'Radisson Blu Hotel Batumi illuminated at night',
    imageSourceName: 'GoBatumi',
    imageSourceUrl: 'https://gobatumi.com/ka/catalog/redison-blu',
  },
  {
    slug: 'wyndham-batumi',
    name: 'Wyndham Batumi',
    brand: 'Wyndham Hotels & Resorts',
    area: 'Old City',
    address: 'Memed Abashidze Avenue, Batumi',
    category: 'City centre',
    summary: '146-room city-centre hotel with sea and mountain views, spa, indoor pool and rooftop restaurant.',
    highlights: ['146 rooms', 'Spa and heated indoor pool', 'Walkable Old City location'],
    practical: ['Standard rooms start at approximately 28 m²', 'Official rates supplied by Wyndham'],
    roomCount: 146,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://www.wyndhamhotels.com/wyndham/batumi-georgia/wyndham-batumi/overview',
    image: '/images/hotels/wyndham-batumi-1280.webp',
    imageSmall: '/images/hotels/wyndham-batumi-640.webp',
    imageAlt: 'Aerial view of Wyndham Batumi in the Old City',
    imageSourceName: 'Wyndham Hotels & Resorts',
    imageSourceUrl: 'https://www.wyndhamhotels.com/wyndham/batumi-georgia/wyndham-batumi/photos',
  },
  {
    slug: 'courtyard-batumi',
    name: 'Courtyard by Marriott Batumi',
    brand: 'Marriott Bonvoy',
    area: 'New Boulevard',
    address: '5 Sherif Khimshiashvili Street, Batumi',
    category: 'Business and leisure',
    summary: 'New Boulevard hotel with workspaces, indoor pool, spa, fitness centre and restaurant.',
    highlights: ['Indoor pool and spa', '24-hour fitness centre', 'Six kilometres from Batumi Airport'],
    practical: ['Accessible parking and room types available', 'Official availability provided by Marriott'],
    roomCount: 150,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://www.marriott.com/en-us/hotels/buscy-courtyard-batumi/overview/',
    image: '/images/hotels/courtyard-batumi-1280.webp',
    imageSmall: '/images/hotels/courtyard-batumi-640.webp',
    imageAlt: 'The entrance façade of Courtyard by Marriott Batumi',
    imageSourceName: 'Marriott International',
    imageSourceUrl: 'https://www.marriott.com/en-us/hotels/buscy-courtyard-batumi/photos/',
  },
  {
    slug: 'ibis-styles-batumi',
    name: 'ibis Styles Batumi',
    brand: 'ALL · Accor',
    area: 'New Boulevard',
    address: '5B Lech and Maria Kaczynski Street, Batumi',
    category: 'Design value',
    summary: 'Four-star hotel opposite the seaside park with sea-view rooms and outdoor pool access.',
    highlights: ['Outdoor resort pool access', 'Wheelchair-accessible rooms', 'Under 10 minutes from the airport by car'],
    practical: ['Check-in 15:00 · check-out 12:00', 'Breakfast and parking may carry additional charges'],
    roomCount: 121,
    checkIn: '15:00',
    checkOut: '12:00',
    officialUrl: 'https://all.accor.com/hotel/B6Z8/index.en.shtml',
    image: '/images/hotels/ibis-styles-batumi-1280.webp',
    imageSmall: '/images/hotels/ibis-styles-batumi-640.webp',
    imageAlt: 'The striped tower and entrance of ibis Styles Batumi',
    imageSourceName: 'Visit Ajara',
    imageSourceUrl: 'https://visitajara.com/en/hotels/1223',
  },
]

export const getBatumiHotel = (slug: string | undefined) => batumiHotels.find((hotel) => hotel.slug === slug)
