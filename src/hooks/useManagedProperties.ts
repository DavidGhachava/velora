import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ManagedProperty, PropertyFormValues } from '../domain/property'
import { deleteManagedProperty, listManagedProperties, saveManagedProperty, setPropertyStatus } from '../data/propertyRepository'

const propertiesKey = ['managed-properties'] as const

export const useManagedProperties = () => {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: propertiesKey, queryFn: listManagedProperties })
  const refresh = () => queryClient.invalidateQueries({ queryKey: propertiesKey })

  const saveMutation = useMutation({
    mutationFn: saveManagedProperty,
    onSuccess: refresh,
  })
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ManagedProperty['status'] }) => setPropertyStatus(id, status),
    onSuccess: refresh,
  })
  const deleteMutation = useMutation({
    mutationFn: deleteManagedProperty,
    onSuccess: refresh,
  })

  return {
    properties: query.data ?? [],
    isLoading: query.isLoading,
    queryError: query.error,
    save: (values: PropertyFormValues) => saveMutation.mutateAsync(values),
    saving: saveMutation.isPending,
    changeStatus: (id: string, status: ManagedProperty['status']) => statusMutation.mutateAsync({ id, status }),
    changingStatus: statusMutation.isPending,
    remove: (id: string) => deleteMutation.mutateAsync(id),
    removing: deleteMutation.isPending,
    refetch: query.refetch,
  }
}
