import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('exposes a text label instead of relying on color', () => {
    render(<StatusBadge status="in_house" />)
    expect(screen.getByText('in house')).toBeInTheDocument()
  })
})
