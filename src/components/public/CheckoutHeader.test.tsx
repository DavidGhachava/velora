import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CheckoutHeader } from './CheckoutHeader'

describe('checkout header', () => {
  it('always links the Velora logo to the homepage', () => {
    render(<MemoryRouter><CheckoutHeader step="extras" /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Velora home' })).toHaveAttribute('href', '/')
  })
})
