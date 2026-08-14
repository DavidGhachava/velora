import { ArrowLeft, Clock3, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ops/PageHeader'
import { PropertyAmenityManager } from '../../components/ops/PropertyAmenityManager'
import { PropertyMediaManager } from '../../components/ops/PropertyMediaManager'
import { RoomInventoryManager } from '../../components/ops/RoomInventoryManager'
import { ErrorState, LoadingState } from '../../components/ui/Feedback'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useManagedProperties } from '../../hooks/useManagedProperties'

export function PropertyWorkspacePage() {
  const { propertyId } = useParams()
  const { properties, isLoading, queryError, refetch } = useManagedProperties()
  const property = properties.find((item) => item.id === propertyId)

  if (isLoading) return <LoadingState label="Loading property workspace" />
  if (queryError) return <ErrorState message={queryError instanceof Error ? queryError.message : 'Could not load the property.'} retry={() => void refetch()} />
  if (!property) return <ErrorState message="Property not found. It may have been deleted." />

  return <>
    <Link className="back-link" to="/ops/properties"><ArrowLeft size={15} /> All properties</Link>
    <PageHeader eyebrow="Property workspace" title={property.en.name} description="Manage the guest-facing gallery, included features and inventory." actions={<StatusBadge status={property.status} />} />
    <section className="property-workspace-summary">
      <div><MapPin size={17} /><span>Location</span><strong>{property.area}</strong><small>{property.address}</small></div>
      <div><Clock3 size={17} /><span>Arrival</span><strong>{property.checkInTime.slice(0, 5)} → {property.checkOutTime.slice(0, 5)}</strong><small>Check-in and check-out</small></div>
      <div><span className="property-workspace-summary__count">{property.mediaCount}</span><span>Images</span><strong>{property.mediaCount ? 'Gallery ready' : 'Needs photos'}</strong><small>One cover image required</small></div>
      <div><span className="property-workspace-summary__count">{property.roomTypeCount}</span><span>Room types</span><strong>{property.roomTypeCount ? 'Inventory configured' : 'Not configured'}</strong><small>Room setup comes next</small></div>
    </section>
    <PropertyMediaManager propertyId={property.id} />
    <PropertyAmenityManager propertyId={property.id} />
    <RoomInventoryManager propertyId={property.id} />
  </>
}
