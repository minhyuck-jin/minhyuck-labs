import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import BudgetPage from '@/app/(default)/budget/page'

describe('BudgetPage', () => {
  it('renders the budget title', () => {
    render(<BudgetPage />)

    expect(screen.getByRole('heading', { name: '가계부' })).toBeInTheDocument()
  })
})
