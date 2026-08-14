import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RoomRefinePanel, type RoomRefineFilters } from './RoomRefinePanel'

const filters: RoomRefineFilters = { sort: 'recommended', minRate: 10000, maxRate: 80000, minSize: 0, bed: 'all', accessibleOnly: false, amenities: [] }

describe('room refine panel', () => {
  it('exposes sorting, size, bed, amenity and accessibility controls', async () => {
    const user = userEvent.setup()
    const update = vi.fn()
    const toggleAmenity = vi.fn()
    render(<RoomRefinePanel filters={filters} activeCount={0} update={update} toggleAmenity={toggleAmenity} clear={vi.fn()} />)

    await user.selectOptions(screen.getByLabelText('Sort results'), 'price-asc')
    await user.selectOptions(screen.getByLabelText('Minimum room size'), '40')
    await user.selectOptions(screen.getByLabelText('Bed type'), 'king')
    await user.click(screen.getByLabelText('Kitchen'))
    await user.click(screen.getByLabelText('Accessible room option'))

    expect(update).toHaveBeenCalledWith('sort', 'price-asc')
    expect(update).toHaveBeenCalledWith('minSize', 40)
    expect(update).toHaveBeenCalledWith('bed', 'king')
    expect(toggleAmenity).toHaveBeenCalledWith('Kitchen')
    expect(update).toHaveBeenCalledWith('accessibleOnly', true)
  })
})
