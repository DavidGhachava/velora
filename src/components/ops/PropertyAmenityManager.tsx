import { Check, CirclePlus, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listPropertyAmenities, setPropertyAmenity } from '../../data/propertyInventoryRepository'
import { supabase } from '../../data/supabase'
import type { AmenityOption } from '../../domain/propertyInventory'
import { ErrorState, LoadingState } from '../ui/Feedback'

export function PropertyAmenityManager({ propertyId }: { propertyId: string }) {
  const queryClient = useQueryClient()
  const queryKey = ['property-amenities', propertyId] as const
  const query = useQuery({ queryKey, queryFn: () => listPropertyAmenities(propertyId) })
  const [error, setError] = useState<string | null>(null)
  const refresh = () => queryClient.invalidateQueries({ queryKey })
  const mutation = useMutation({
    mutationFn: ({ amenity, selected, included }: { amenity: AmenityOption; selected: boolean; included: boolean }) => setPropertyAmenity(propertyId, amenity.id, selected, included),
    onSuccess: refresh,
    onError: (cause) => setError(cause instanceof Error ? cause.message : 'Could not update the amenity.'),
  })

  useEffect(() => {
    const client = supabase
    if (!client) return
    const channel = client.channel(`property-amenities-${propertyId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'property_amenities', filter: `property_id=eq.${propertyId}` }, () => {
      void queryClient.invalidateQueries({ queryKey: ['property-amenities', propertyId] })
    }).subscribe()
    return () => { void client.removeChannel(channel) }
  }, [propertyId, queryClient])

  const update = (amenity: AmenityOption, selected: boolean, included = amenity.included) => {
    setError(null)
    mutation.mutate({ amenity, selected, included })
  }

  return <section className="inventory-section">
    <header className="inventory-section__header"><div><h2>Amenities</h2><p>Show exactly what guests receive and what is available as an optional service.</p></div><span>{query.data?.filter((item) => item.selected).length ?? 0} selected</span></header>
    {error && <ErrorState message={error} />}
    {query.isLoading ? <LoadingState label="Loading amenities" /> : query.error ? <ErrorState message={query.error instanceof Error ? query.error.message : 'Could not load amenities.'} retry={() => void query.refetch()} /> : <div className="amenity-admin-grid">{query.data?.map((amenity) => <article className={amenity.selected ? 'amenity-admin-card is-selected' : 'amenity-admin-card'} key={amenity.id}>
      <button className="amenity-admin-card__select" type="button" disabled={mutation.isPending} onClick={() => update(amenity, !amenity.selected)} aria-pressed={amenity.selected}>
        <span>{amenity.selected ? <Check size={17} /> : <CirclePlus size={17} />}</span><div><strong>{amenity.nameEn}</strong><small lang="ka">{amenity.nameKa}</small></div>
      </button>
      {amenity.selected && <div className="amenity-admin-card__mode" aria-label={`${amenity.nameEn} availability`}><button type="button" className={amenity.included ? 'active' : ''} onClick={() => update(amenity, true, true)}><Check size={13} /> Included</button><button type="button" className={!amenity.included ? 'active' : ''} onClick={() => update(amenity, true, false)}><Sparkles size={13} /> Optional</button></div>}
    </article>)}</div>}
  </section>
}
