import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Header } from '@/app/(default)/header'

describe('Header', () => {
  afterEach(() => {
    cleanup()
  })

  it('사용자 자리 아이콘만 보여 준다', () => {
    render(<Header />)

    expect(screen.getByRole('img', { name: '사용자' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
