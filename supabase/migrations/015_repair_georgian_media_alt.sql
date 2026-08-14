update public.property_media pm
set alt_ka = case p.slug
  when 'white-sails-residential' then 'White Sails-ის აპარტამენტი ბათუმში'
  when 'solis-residence' then 'Solis Residence-ის აპარტამენტი ბათუმში'
  when 'rooms-batumi' then 'Rooms Batumi-ის სასტუმრო ბათუმში'
  when 'le-meridien-batumi' then 'Le Méridien-ის სასტუმრო ბათუმში'
  when 'hilton-batumi' then 'Hilton-ის სასტუმრო ბათუმში'
  when 'radisson-blu-batumi' then 'Radisson Blu-ს სასტუმრო ბათუმში'
  when 'wyndham-batumi' then 'Wyndham-ის სასტუმრო ბათუმში'
  when 'courtyard-batumi' then 'Courtyard-ის სასტუმრო ბათუმში'
  else 'ibis Styles-ის სასტუმრო ბათუმში'
end
from public.properties p
where p.id = pm.property_id;

update public.room_type_media rtm
set alt_ka = rtt.name || ' — ნომრის ფოტო'
from public.room_type_translations rtt
where rtt.room_type_id = rtm.room_type_id and rtt.locale = 'ka';
