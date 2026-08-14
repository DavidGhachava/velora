alter table public.property_media
  alter column storage_path drop not null,
  add column source_url text;

alter table public.property_media
  add constraint property_media_has_one_source check (
    (storage_path is not null)::integer + (source_url is not null)::integer = 1
  );

create unique index property_media_source_url_unique
  on public.property_media (source_url) where source_url is not null;

alter table public.room_type_media
  alter column storage_path drop not null,
  add column source_url text;

alter table public.room_type_media
  add constraint room_type_media_has_one_source check (
    (storage_path is not null)::integer + (source_url is not null)::integer = 1
  );

create unique index room_type_media_source_url_unique
  on public.room_type_media (source_url) where source_url is not null;

insert into public.properties (
  slug, property_type, status, address, area, display_order, check_in_time, check_out_time
) values
  ('white-sails-residential', 'aparthotel', 'published', '5 Lech and Maria Kaczynski Street, Batumi', 'New Boulevard', 10, '15:00', '12:00'),
  ('solis-residence', 'apartment', 'published', '61 Sherif Khimshiashvili Street, Batumi', 'New Boulevard', 20, '15:00', '12:00'),
  ('rooms-batumi', 'hotel', 'published', '10 Gogebashvili Street, Batumi', 'Old Batumi', 30, '15:00', '12:00'),
  ('le-meridien-batumi', 'hotel', 'published', 'Ninoshvili / Zhgenti Street, Batumi', 'Batumi Boulevard', 40, '15:00', '12:00'),
  ('hilton-batumi', 'hotel', 'published', 'Rustaveli Street, Batumi', 'Seaside Boulevard', 50, '15:00', '12:00'),
  ('radisson-blu-batumi', 'hotel', 'published', '1 Ninoshvili Street, Batumi', 'Europe Square', 60, '15:00', '12:00'),
  ('wyndham-batumi', 'hotel', 'published', 'Memed Abashidze Avenue, Batumi', 'Old City', 70, '15:00', '12:00'),
  ('courtyard-batumi', 'hotel', 'published', '5 Sherif Khimshiashvili Street, Batumi', 'New Boulevard', 80, '15:00', '12:00'),
  ('ibis-styles-batumi', 'hotel', 'published', '5B Lech and Maria Kaczynski Street, Batumi', 'New Boulevard', 90, '15:00', '12:00')
on conflict (slug) do update set
  property_type = excluded.property_type,
  address = excluded.address,
  area = excluded.area,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.property_translations (property_id, locale, name, short_description, description)
select p.id, v.locale, v.name, v.summary, v.description
from (values
  ('white-sails-residential', 'en', 'White Sails Residential Hotel', 'Seaside apartments with kitchens, balconies and pools.', 'A practical aparthotel near the Black Sea with equipped studios and one-bedroom apartments.'),
  ('white-sails-residential', 'ka', 'White Sails Residential Hotel', 'ზღვისპირა აპარტამენტები სამზარეულოთი, აივნითა და აუზით.', 'აპარტჰოტელი შავ ზღვასთან, აღჭურვილი სტუდიოებითა და ერთსაძინებლიანი აპარტამენტებით.'),
  ('solis-residence', 'en', 'Solis Residence Aparthotel', 'Modern apartments near Batumi Beach.', 'Studios and apartments with kitchens, private balconies and sea-view options near New Boulevard.'),
  ('solis-residence', 'ka', 'Solis Residence Aparthotel', 'თანამედროვე აპარტამენტები ბათუმის სანაპიროსთან.', 'სტუდიოები და აპარტამენტები სამზარეულოთი, პირადი აივნითა და ზღვის ხედის არჩევანით.'),
  ('rooms-batumi', 'en', 'Rooms Batumi', 'Design hotel with sea and Old Town views.', 'A central Batumi hotel with balconies, terraces and rooms for couples and families.'),
  ('rooms-batumi', 'ka', 'Rooms Batumi', 'დიზაინ სასტუმრო ზღვისა და ძველი ბათუმის ხედებით.', 'ცენტრალური სასტუმრო აივნებითა და ნომრებით წყვილებისა და ოჯახებისთვის.'),
  ('le-meridien-batumi', 'en', 'Le Méridien Batumi', 'Five-star hotel near Batumi Boulevard.', 'A full-service city hotel with a pool, spa and family facilities close to the boulevard.'),
  ('le-meridien-batumi', 'ka', 'Le Méridien Batumi', 'ხუთვარსკვლავიანი სასტუმრო ბათუმის ბულვართან.', 'სასტუმრო აუზით, სპათი და საოჯახო სივრცეებით ბულვართან ახლოს.'),
  ('hilton-batumi', 'en', 'Hilton Batumi', 'Waterfront hotel on Batumi Seaside Boulevard.', 'A city resort beside the Black Sea, beach and central Batumi.'),
  ('hilton-batumi', 'ka', 'Hilton Batumi', 'სასტუმრო ბათუმის ზღვისპირა ბულვარზე.', 'ქალაქის სასტუმრო შავ ზღვასთან, სანაპიროსა და ცენტრალურ ბათუმთან.'),
  ('radisson-blu-batumi', 'en', 'Radisson Blu Hotel, Batumi', 'Central hotel with panoramic city and sea views.', 'Rooms and suites near the beach with indoor and outdoor pools, a spa and restaurants.'),
  ('radisson-blu-batumi', 'ka', 'Radisson Blu Hotel, Batumi', 'ცენტრალური სასტუმრო ქალაქისა და ზღვის ხედებით.', 'ნომრები და სუიტები სანაპიროსთან, აუზებით, სპათი და რესტორნებით.'),
  ('wyndham-batumi', 'en', 'Wyndham Batumi', 'City-centre hotel in Old Batumi.', 'A central hotel with sea and mountain views, spa, indoor pool and rooftop restaurant.'),
  ('wyndham-batumi', 'ka', 'Wyndham Batumi', 'სასტუმრო ძველი ბათუმის ცენტრში.', 'ცენტრალური სასტუმრო ზღვისა და მთის ხედებით, სპათი და შიდა აუზით.'),
  ('courtyard-batumi', 'en', 'Courtyard by Marriott Batumi', 'Hotel for business and leisure near New Boulevard.', 'A modern stay with workspaces, indoor pool, spa, fitness centre and restaurant.'),
  ('courtyard-batumi', 'ka', 'Courtyard by Marriott Batumi', 'სასტუმრო საქმიანი და დასასვენებელი ვიზიტებისთვის.', 'თანამედროვე სასტუმრო სამუშაო სივრცეებით, აუზით, სპათი და ფიტნესით.'),
  ('ibis-styles-batumi', 'en', 'ibis Styles Batumi', 'Modern value hotel near New Boulevard.', 'A four-star stay opposite the seaside park with sea-view rooms and outdoor pool access.'),
  ('ibis-styles-batumi', 'ka', 'ibis Styles Batumi', 'თანამედროვე სასტუმრო ახალ ბულვართან.', 'ოთხვარსკვლავიანი სასტუმრო ზღვისპირა პარკთან, ზღვის ხედის ნომრებითა და აუზით.')
) as v(slug, locale, name, summary, description)
join public.properties p on p.slug = v.slug
on conflict (property_id, locale) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description;

insert into public.property_media (
  property_id, source_url, alt_en, alt_ka, width, height, is_cover, sort_order
)
select p.id, v.source_url, v.alt_en, v.alt_ka, 1280, 800, v.is_cover, v.sort_order
from (values
  ('white-sails-residential', '/images/hotels/white-sails-residential-1280.webp', 'White Sails towers and landscaped courtyard in Batumi', 'White Sails-ის კოშკები და ეზო ბათუმში', true, 0),
  ('white-sails-residential', '/images/hotels/white-sails-room-1-1200.webp', 'Twin studio with kitchenette', 'სტუდიო ორი საწოლითა და სამზარეულოთი', false, 1),
  ('white-sails-residential', '/images/hotels/white-sails-room-2-1200.webp', 'Apartment interior with balcony', 'აპარტამენტის ინტერიერი აივნით', false, 2),
  ('white-sails-residential', '/images/hotels/white-sails-room-3-1200.webp', 'Studio kitchen and dining area', 'სტუდიოს სამზარეულო და სასადილო', false, 3),
  ('solis-residence', '/images/hotels/solis-residence-1280.webp', 'Solis Residence room with Black Sea view', 'Solis Residence-ის ნომერი ზღვის ხედით', true, 0),
  ('solis-residence', '/images/hotels/solis-residence-room-1-1200.webp', 'Sea-view bedroom and balcony', 'საძინებელი და აივანი ზღვის ხედით', false, 1),
  ('solis-residence', '/images/hotels/solis-residence-room-2-1200.webp', 'Bright double bedroom', 'ნათელი ორადგილიანი საძინებელი', false, 2),
  ('solis-residence', '/images/hotels/solis-residence-room-3-1200.webp', 'Studio living and dining area', 'სტუდიოს მისაღები და სასადილო', false, 3),
  ('rooms-batumi', '/images/hotels/rooms-batumi-1280.webp', 'Rooms Batumi exterior', 'Rooms Batumi-ის ექსტერიერი', true, 0),
  ('le-meridien-batumi', '/images/hotels/le-meridien-batumi-1280.webp', 'Le Méridien Batumi exterior', 'Le Méridien Batumi-ის ექსტერიერი', true, 0),
  ('hilton-batumi', '/images/hotels/hilton-batumi-1280.webp', 'Hilton Batumi beside the boulevard', 'Hilton Batumi ბულვართან', true, 0),
  ('radisson-blu-batumi', '/images/hotels/radisson-blu-batumi-1280.webp', 'Radisson Blu Batumi exterior', 'Radisson Blu Batumi-ის ექსტერიერი', true, 0),
  ('wyndham-batumi', '/images/hotels/wyndham-batumi-1280.webp', 'Wyndham Batumi in the city centre', 'Wyndham Batumi ქალაქის ცენტრში', true, 0),
  ('courtyard-batumi', '/images/hotels/courtyard-batumi-1280.webp', 'Courtyard Batumi entrance', 'Courtyard Batumi-ის შესასვლელი', true, 0),
  ('ibis-styles-batumi', '/images/hotels/ibis-styles-batumi-1280.webp', 'ibis Styles Batumi exterior', 'ibis Styles Batumi-ის ექსტერიერი', true, 0)
) as v(slug, source_url, alt_en, alt_ka, is_cover, sort_order)
join public.properties p on p.slug = v.slug
on conflict (source_url) where source_url is not null do update set
  alt_en = excluded.alt_en,
  alt_ka = excluded.alt_ka,
  is_cover = excluded.is_cover,
  sort_order = excluded.sort_order;

insert into public.room_types (
  property_id, code, slug, max_guests, size_m2, bed_type, base_rate_minor, display_order
)
select p.id, v.code, v.room_slug, v.max_guests, v.size_m2, v.bed_type, v.base_rate_minor, v.display_order
from (values
  ('white-sails-residential', 'STUDIO', 'white-sails-standard-studio', 2, 28.00, 'Double or twin beds', 15000, 10),
  ('white-sails-residential', 'SUITE', 'white-sails-suite', 4, 48.00, 'Queen bed and sofa bed', 23000, 20),
  ('solis-residence', 'STUDIO', 'solis-superior-studio', 3, 35.00, 'Queen bed', 13000, 10),
  ('solis-residence', 'ONE_BED', 'solis-sea-view-apartment', 3, 40.00, 'Queen bed and sofa bed', 19000, 20)
) as v(property_slug, code, room_slug, max_guests, size_m2, bed_type, base_rate_minor, display_order)
join public.properties p on p.slug = v.property_slug
on conflict (slug) do update set
  max_guests = excluded.max_guests,
  size_m2 = excluded.size_m2,
  bed_type = excluded.bed_type,
  base_rate_minor = excluded.base_rate_minor,
  active = true,
  updated_at = now();

insert into public.room_type_translations (room_type_id, locale, name, description)
select rt.id, v.locale, v.name, v.description
from (values
  ('white-sails-standard-studio', 'en', 'Standard Studio', 'Studio for two guests with a kitchenette, microwave, private bathroom and balcony.'),
  ('white-sails-standard-studio', 'ka', 'სტანდარტული სტუდიო', 'სტუდიო ორი სტუმრისთვის, სამზარეულოთი, მიკროტალღური ღუმელითა და აივნით.'),
  ('white-sails-suite', 'en', 'One-bedroom Suite', 'One-bedroom apartment with a living area, equipped kitchenette and private balcony.'),
  ('white-sails-suite', 'ka', 'ერთსაძინებლიანი სუიტა', 'ერთსაძინებლიანი აპარტამენტი მისაღებით, სამზარეულოთი და პირადი აივნით.'),
  ('solis-superior-studio', 'en', 'Superior Studio', 'Studio for up to three guests with a queen bed, kitchen and private balcony.'),
  ('solis-superior-studio', 'ka', 'გაუმჯობესებული სტუდიო', 'სტუდიო სამ სტუმრამდე, ორმაგი საწოლით, სამზარეულოთი და პირადი აივნით.'),
  ('solis-sea-view-apartment', 'en', 'Sea-view Apartment', 'One-bedroom apartment for up to three guests with a kitchen and private balcony.'),
  ('solis-sea-view-apartment', 'ka', 'აპარტამენტი ზღვის ხედით', 'ერთსაძინებლიანი აპარტამენტი სამ სტუმრამდე, სამზარეულოთი და პირადი აივნით.')
) as v(room_slug, locale, name, description)
join public.room_types rt on rt.slug = v.room_slug
on conflict (room_type_id, locale) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.room_type_media (room_type_id, source_url, alt_en, alt_ka, is_cover, sort_order)
select rt.id, v.source_url, v.alt_en, v.alt_ka, v.is_cover, v.sort_order
from (values
  ('white-sails-standard-studio', '/images/hotels/white-sails-room-1-1200.webp', 'White Sails standard studio', 'White Sails-ის სტანდარტული სტუდიო', true, 0),
  ('white-sails-standard-studio', '/images/hotels/white-sails-room-3-1200.webp', 'White Sails studio kitchenette', 'White Sails-ის სტუდიოს სამზარეულო', false, 1),
  ('white-sails-suite', '/images/hotels/white-sails-room-2-1200.webp', 'White Sails one-bedroom suite', 'White Sails-ის ერთსაძინებლიანი სუიტა', true, 0),
  ('white-sails-suite', '/images/hotels/white-sails-room-4-1200.webp', 'White Sails property exterior', 'White Sails-ის ექსტერიერი', false, 1),
  ('solis-superior-studio', '/images/hotels/solis-residence-room-1-1200.webp', 'Solis superior studio', 'Solis-ის გაუმჯობესებული სტუდიო', true, 0),
  ('solis-superior-studio', '/images/hotels/solis-residence-room-3-1200.webp', 'Solis studio living area', 'Solis-ის სტუდიოს მისაღები', false, 1),
  ('solis-sea-view-apartment', '/images/hotels/solis-residence-room-2-1200.webp', 'Solis sea-view apartment', 'Solis-ის აპარტამენტი ზღვის ხედით', true, 0),
  ('solis-sea-view-apartment', '/images/hotels/solis-residence-room-4-1200.webp', 'Solis private balcony', 'Solis-ის პირადი აივანი', false, 1)
) as v(room_slug, source_url, alt_en, alt_ka, is_cover, sort_order)
join public.room_types rt on rt.slug = v.room_slug
on conflict (source_url) where source_url is not null do update set
  alt_en = excluded.alt_en,
  alt_ka = excluded.alt_ka,
  is_cover = excluded.is_cover,
  sort_order = excluded.sort_order;

insert into public.rooms (property_id, room_type_id, number, floor)
select rt.property_id, rt.id, v.number, v.floor
from (values
  ('white-sails-standard-studio', 'WS-101', 1), ('white-sails-standard-studio', 'WS-102', 1),
  ('white-sails-standard-studio', 'WS-103', 1), ('white-sails-standard-studio', 'WS-104', 1),
  ('white-sails-standard-studio', 'WS-105', 1), ('white-sails-standard-studio', 'WS-106', 1),
  ('white-sails-suite', 'WS-201', 2), ('white-sails-suite', 'WS-202', 2),
  ('white-sails-suite', 'WS-203', 2), ('white-sails-suite', 'WS-204', 2),
  ('solis-superior-studio', 'SL-101', 1), ('solis-superior-studio', 'SL-102', 1),
  ('solis-superior-studio', 'SL-103', 1), ('solis-superior-studio', 'SL-104', 1),
  ('solis-superior-studio', 'SL-105', 1), ('solis-superior-studio', 'SL-106', 1),
  ('solis-sea-view-apartment', 'SL-201', 2), ('solis-sea-view-apartment', 'SL-202', 2),
  ('solis-sea-view-apartment', 'SL-203', 2), ('solis-sea-view-apartment', 'SL-204', 2)
) as v(room_slug, number, floor)
join public.room_types rt on rt.slug = v.room_slug
on conflict (property_id, number) do update set room_type_id = excluded.room_type_id, active = true;

insert into public.room_type_amenities (room_type_id, amenity_id, included)
select rt.id, a.id, true
from public.room_types rt
join public.properties p on p.id = rt.property_id
cross join public.amenities a
where p.slug in ('white-sails-residential', 'solis-residence')
  and a.code in ('wifi', 'air_conditioning', 'kitchen', 'microwave', 'washing_machine', 'balcony')
on conflict (room_type_id, amenity_id) do update set included = true;

insert into public.property_amenities (property_id, amenity_id, included)
select p.id, a.id, true
from public.properties p
cross join public.amenities a
where p.slug in ('white-sails-residential', 'solis-residence')
  and a.code in ('wifi', 'air_conditioning', 'kitchen', 'microwave', 'washing_machine', 'balcony')
on conflict (property_id, amenity_id) do update set included = true;
