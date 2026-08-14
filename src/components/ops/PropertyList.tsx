import { Archive, BedDouble, Edit3, Eye, Image, MapPin, Pause, Play, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ManagedProperty } from '../../domain/property'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/StatusBadge'

interface PropertyListProps {
  properties: ManagedProperty[]
  busy: boolean
  onEdit: (property: ManagedProperty) => void
  onStatusChange: (property: ManagedProperty, status: ManagedProperty['status']) => void
  onDelete: (property: ManagedProperty) => void
}

export function PropertyList({ properties, busy, onEdit, onStatusChange, onDelete }: PropertyListProps) {
  return <div className="property-list">{properties.map((property) => (
    <article className="property-list-card" key={property.id}>
      <div className="property-list-card__identity">
        <div className="property-list-card__mark">{property.en.name.slice(0, 1).toUpperCase() || 'V'}</div>
        <div><div className="property-list-card__title"><h3>{property.en.name || 'Untitled property'}</h3><StatusBadge status={property.status} /></div><p><MapPin size={14} /> {property.area} · {property.address}</p></div>
      </div>
      <dl className="property-list-card__facts">
        <div><dt><Image size={15} /> Gallery</dt><dd>{property.mediaCount}</dd></div>
        <div><dt><BedDouble size={15} /> Room types</dt><dd>{property.roomTypeCount}</dd></div>
        <div><dt>Type</dt><dd>{property.propertyType}</dd></div>
      </dl>
      <div className="property-list-card__actions">
        {property.status === 'published' && <Link className="button button--quiet button--sm" to={`/hotels/${property.slug}`} target="_blank"><Eye size={15} /><span>View</span></Link>}
        <Button size="sm" variant="secondary" icon={<Edit3 size={15} />} onClick={() => onEdit(property)}>Edit</Button>
        {property.status === 'published'
          ? <Button size="sm" variant="quiet" disabled={busy} icon={<Pause size={15} />} onClick={() => onStatusChange(property, 'paused')}>Pause</Button>
          : property.status !== 'archived' && <Button size="sm" variant="quiet" disabled={busy} icon={<Play size={15} />} onClick={() => onStatusChange(property, 'published')}>Publish</Button>}
        {property.status !== 'archived'
          ? <Button size="sm" variant="quiet" disabled={busy} icon={<Archive size={15} />} onClick={() => onStatusChange(property, 'archived')}>Archive</Button>
          : <Button size="sm" variant="danger" disabled={busy} icon={<Trash2 size={15} />} onClick={() => onDelete(property)}>Delete</Button>}
      </div>
    </article>
  ))}</div>
}
