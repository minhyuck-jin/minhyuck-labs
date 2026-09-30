import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { HomePage } from '@/pages/HomePage'

vi.mock('@/api/sample', () => ({
  fetchSample: vi.fn(() => Promise.reject(new Error('test env'))),
}))

describe('HomePage', () => {
  it('renders the app title', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { name: 'minhyuck-labs web' }),
    ).toBeInTheDocument()
  })
})
