import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { roomTypes as fallbackRoomTypes } from '../data/seed'
import { listPublicCatalog, staticPublicCatalog } from '../data/publicCatalogRepository'
import { useLocale } from '../i18n/LocaleProvider'
import { supabase } from '../data/supabase'

export function usePublicCatalog() {
  const { language } = useLocale()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['public-catalog', language],
    queryFn: () => listPublicCatalog(language),
    initialData: { ...staticPublicCatalog, roomTypes: fallbackRoomTypes.filter((room) => Boolean(room.propertySlug)) },
    staleTime: 60_000,
    refetchOnMount: 'always',
  })

  useEffect(() => {
    if (!supabase) return
    const channel = supabase.channel('public-catalog').on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['public-catalog'] })
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'property_translations' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['public-catalog'] })
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'property_media' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['public-catalog'] })
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'room_types' }, () => {
      void queryClient.invalidateQueries({ queryKey: ['public-catalog'] })
    }).subscribe()
    return () => { void supabase?.removeChannel(channel) }
  }, [queryClient])

  return query
}
