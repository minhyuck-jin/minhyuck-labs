import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Home from '@/app/(default)/page'

vi.mock('@/app/shared/api/apiClient', () => ({
  fetchRawJson: vi.fn(() => Promise.reject(new Error('test env'))),
}))

describe('Home', () => {
  afterEach(async () => {
    cleanup()
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  it('renders the app title and a sample row', async () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', { name: 'minhyuck-labs web' }),
    ).toBeInTheDocument()
    expect(await screen.findByText('Notebook')).toBeInTheDocument()
  })
})
