import { Building2, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/ops/PageHeader'
import { PropertyForm } from '../../components/ops/PropertyForm'
import { PropertyList } from '../../components/ops/PropertyList'
import { Button } from '../../components/ui/Button'
import { EmptyState, ErrorState, LoadingState, SuccessNotice } from '../../components/ui/Feedback'
import { propertyToForm, type ManagedProperty, type PropertyFormValues } from '../../domain/property'
import { useManagedProperties } from '../../hooks/useManagedProperties'

export function PropertiesPage() {
  const { properties, isLoading, queryError, save, saving, changeStatus, changingStatus, remove, removing, refetch } = useManagedProperties()
  const [editing, setEditing] = useState<ManagedProperty | 'new' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const initialValues = useMemo(() => editing && editing !== 'new' ? propertyToForm(editing) : undefined, [editing])

  const saveProperty = async (values: PropertyFormValues) => {
    setError(null)
    try {
      await save(values)
      setEditing(null)
      setNotice(values.id ? 'Property changes saved.' : 'Property created.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the property.')
    }
  }

  const updateStatus = async (property: ManagedProperty, status: ManagedProperty['status']) => {
    if (status === 'archived' && !window.confirm(`Archive ${property.en.name}? It will disappear from public search.`)) return
    setError(null)
    try {
      await changeStatus(property.id, status)
      setNotice(`${property.en.name} is now ${status}.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update the property status.')
    }
  }

  const deleteProperty = async (property: ManagedProperty) => {
    if (!window.confirm(`Permanently delete ${property.en.name}? This cannot be undone.`)) return
    setError(null)
    try {
      await remove(property.id)
      setNotice(`${property.en.name} was deleted.`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete the property.')
    }
  }

  return <>
    <PageHeader
      eyebrow="Inventory"
      title="Properties"
      description="Create, translate, publish and maintain every place shown on Velora."
      actions={<Button icon={<Plus size={17} />} onClick={() => { setError(null); setEditing('new') }}>Add property</Button>}
    />
    {error && <ErrorState message={error} />}
    {isLoading ? <LoadingState label="Loading properties" /> : queryError ? <ErrorState message={queryError instanceof Error ? queryError.message : 'Could not load properties.'} retry={() => void refetch()} /> : properties.length === 0 ? <EmptyState
      icon={<Building2 size={32} />}
      title="No properties yet"
      description="Add the first apartment or hotel. It stays private until you publish it."
      action={<Button icon={<Plus size={17} />} onClick={() => setEditing('new')}>Add first property</Button>}
    /> : <PropertyList
      properties={properties}
      busy={changingStatus || removing}
      onEdit={(property) => { setError(null); setEditing(property) }}
      onStatusChange={(property, status) => void updateStatus(property, status)}
      onDelete={(property) => void deleteProperty(property)}
    />}
    {editing && <div className="property-editor-layer" role="presentation"><button className="property-editor-backdrop" aria-label="Close property editor" onClick={() => setEditing(null)} /><PropertyForm initialValues={initialValues} saving={saving} onCancel={() => setEditing(null)} onSave={saveProperty} /></div>}
    {notice && <SuccessNotice message={notice} onDismiss={() => setNotice(null)} />}
  </>
}
