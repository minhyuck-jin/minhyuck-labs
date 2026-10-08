import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Sidebar } from '@/app/(default)/sidebar'

vi.mock('@/app/assets/images/logoHorizontal.png', () => ({
  default: { src: '/logoHorizontal.png', width: 1289, height: 239 },
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/app/(default)/admin/api/menu', () => ({
  fetchMenuList: vi.fn(() =>
    Promise.resolve({
      menuList: [
        {
          menuId: 1,
          parentMenuId: null,
          menuName: '가계부',
          menuPath: '/budget',
          sortOrder: 1,
          subMenuList: [],
        },
        {
          menuId: 2,
          parentMenuId: null,
          menuName: '설정',
          menuPath: null,
          sortOrder: 2,
          subMenuList: [
            {
              menuId: 3,
              parentMenuId: 2,
              menuName: '메뉴 관리',
              menuPath: '/menus',
              sortOrder: 1,
              subMenuList: [],
            },
          ],
        },
      ],
      totalCount: 2,
    }),
  ),
}))

describe('Sidebar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders menus from the menu list API', async () => {
    render(<Sidebar />)

    expect(await screen.findByRole('link', { name: '가계부' })).toHaveAttribute(
      'href',
      '/budget',
    )
    expect(screen.getByRole('link', { name: 'minhyuck-labs' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/')
    expect(
      screen.queryByRole('link', { name: /메뉴 관리/ }),
    ).not.toBeInTheDocument()
  })

  it('opens a group menu on click', async () => {
    render(<Sidebar />)

    fireEvent.click(await screen.findByRole('button', { name: '설정' }))

    expect(screen.getByRole('link', { name: /메뉴 관리/ })).toBeInTheDocument()
  })

  it('filters menus by the search keyword', async () => {
    render(<Sidebar />)
    await screen.findByRole('link', { name: '가계부' })

    fireEvent.change(screen.getByRole('searchbox', { name: '메뉴 검색' }), {
      target: { value: '관리' },
    })

    expect(
      screen.queryByRole('link', { name: '가계부' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /메뉴 관리/ })).toBeInTheDocument()
  })

  it('hides and shows the sidebar', async () => {
    render(<Sidebar />)
    await screen.findByRole('link', { name: '가계부' })

    fireEvent.click(screen.getByRole('button', { name: '사이드바 닫기' }))

    expect(
      screen.queryByRole('navigation', { name: '메뉴' }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '사이드바 열기' }))

    expect(screen.getByRole('navigation', { name: '메뉴' })).toBeInTheDocument()
  })
})
