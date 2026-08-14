update public.property_translations pt
set short_description = v.short_description, description = v.description
from (values
  ('white-sails-residential', 'ზღვისპირა აპარტამენტები სამზარეულოთი, აივნითა და აუზით.', 'აპარტჰოტელი შავ ზღვასთან, აღჭურვილი სტუდიოებითა და ერთსაძინებლიანი აპარტამენტებით.'),
  ('solis-residence', 'თანამედროვე აპარტამენტები ბათუმის სანაპიროსთან.', 'სტუდიოები და აპარტამენტები სამზარეულოთი, პირადი აივნითა და ზღვის ხედის არჩევანით.'),
  ('rooms-batumi', 'დიზაინ სასტუმრო ზღვისა და ძველი ბათუმის ხედებით.', 'ცენტრალური სასტუმრო აივნებითა და ნომრებით წყვილებისა და ოჯახებისთვის.'),
  ('le-meridien-batumi', 'ხუთვარსკვლავიანი სასტუმრო ბათუმის ბულვართან.', 'სასტუმრო აუზით, სპათი და საოჯახო სივრცეებით ბულვართან ახლოს.'),
  ('hilton-batumi', 'სასტუმრო ბათუმის ზღვისპირა ბულვარზე.', 'ქალაქის სასტუმრო შავ ზღვასთან, სანაპიროსა და ცენტრალურ ბათუმთან.'),
  ('radisson-blu-batumi', 'ცენტრალური სასტუმრო ქალაქისა და ზღვის ხედებით.', 'ნომრები და სუიტები სანაპიროსთან, აუზებით, სპათი და რესტორნებით.'),
  ('wyndham-batumi', 'სასტუმრო ძველი ბათუმის ცენტრში.', 'ცენტრალური სასტუმრო ზღვისა და მთის ხედებით, სპათი და შიდა აუზით.'),
  ('courtyard-batumi', 'სასტუმრო საქმიანი და დასასვენებელი ვიზიტებისთვის.', 'თანამედროვე სასტუმრო სამუშაო სივრცეებით, აუზით, სპათი და ფიტნესით.'),
  ('ibis-styles-batumi', 'თანამედროვე სასტუმრო ახალ ბულვართან.', 'ოთხვარსკვლავიანი სასტუმრო ზღვისპირა პარკთან, ზღვის ხედის ნომრებითა და აუზით.')
) as v(slug, short_description, description)
join public.properties p on p.slug = v.slug
where pt.property_id = p.id and pt.locale = 'ka';

update public.room_type_translations rtt
set name = v.name, description = v.description
from (values
  ('white-sails-standard-studio', 'სტანდარტული სტუდიო', 'სტუდიო ორი სტუმრისთვის, სამზარეულოთი, მიკროტალღური ღუმელითა და აივნით.'),
  ('white-sails-suite', 'ერთსაძინებლიანი სუიტა', 'ერთსაძინებლიანი აპარტამენტი მისაღებით, სამზარეულოთი და პირადი აივნით.'),
  ('solis-superior-studio', 'გაუმჯობესებული სტუდიო', 'სტუდიო სამ სტუმრამდე, ორმაგი საწოლით, სამზარეულოთი და პირადი აივნით.'),
  ('solis-sea-view-apartment', 'აპარტამენტი ზღვის ხედით', 'ერთსაძინებლიანი აპარტამენტი სამ სტუმრამდე, სამზარეულოთი და პირადი აივნით.')
) as v(slug, name, description)
join public.room_types rt on rt.slug = v.slug
where rtt.room_type_id = rt.id and rtt.locale = 'ka';

update public.amenities a
set name_ka = v.name_ka
from (values
  ('wifi', 'უფასო Wi-Fi'), ('air_conditioning', 'კონდიციონერი'),
  ('kitchen', 'სამზარეულო'), ('microwave', 'მიკროტალღური ღუმელი'),
  ('washing_machine', 'სარეცხი მანქანა'), ('refrigerator', 'მაცივარი'),
  ('balcony', 'პირადი აივანი'), ('sea_view', 'ზღვის ხედი'),
  ('parking', 'პარკინგი'), ('pool', 'საცურაო აუზი'),
  ('elevator', 'ლიფტი'), ('accessible', 'ადაპტირებული გარემო'),
  ('breakfast', 'საუზმე'), ('pets', 'შინაური ცხოველები დაშვებულია'),
  ('gym', 'ფიტნეს ცენტრი'), ('spa', 'სპა და ველნესი')
) as v(code, name_ka)
where a.code = v.code;

update public.catalog_items ci
set name_ka = v.name_ka, description_ka = v.description_ka
from (values
  ('extra-transfer', 'აეროპორტის ტრანსფერი', 'პირადი ტრანსფერი ბათუმის საერთაშორისო აეროპორტიდან.'),
  ('extra-breakfast', 'საუზმე', 'ყოველდღიური საუზმე ერთი სტუმრისთვის.'),
  ('extra-spa', '60-წუთიანი სპა პროცედურა', 'ერთი სპა პროცედურა ერთი სტუმრისთვის.'),
  ('extra-sail', 'ორსაათიანი ნავით გასეირნება', 'პირადი გასეირნება შავ ზღვაზე.')
) as v(sku, name_ka, description_ka)
where ci.sku = v.sku;
