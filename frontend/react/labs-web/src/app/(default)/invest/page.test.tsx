import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import InvestPage from '@/app/(default)/invest/page'

describe('InvestPage', () => {
  it('renders the invest title', () => {
    render(<InvestPage />)

    expect(screen.getByRole('heading', { name: '투자' })).toBeInTheDocument()
  })
})
