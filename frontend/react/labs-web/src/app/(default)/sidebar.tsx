'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  LuChevronDown,
  LuChevronRight,
  LuFolder,
  LuHouse,
  LuMenu,
  LuPanelLeftClose,
  LuSearch,
  LuTrendingUp,
  LuWallet,
} from 'react-icons/lu'

import { fetchMenuList } from '@/app/(default)/admin/api/menu'
import type { MenuDto } from '@/app/(default)/admin/types/menu'
import logo from '@/app/assets/images/logoHorizontal.png'

/** 메뉴 주소 링크 */
function MenuLink({
  href,
  className,
  children,
}: {
  href: string
  className: string
  children: ReactNode
}) {
  const pathname = usePathname()
  const isCurrent = pathname === href

  return (
    <Link
      href={href}
      className={className}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}

const menuIconByPath: Record<string, typeof LuFolder> = {
  '/budget': LuWallet,
  '/invest': LuTrendingUp,
}

/** 메뉴 앞 아이콘 */
function MenuMark({ menuPath }: { menuPath: string | null }) {
  const Icon = (menuPath && menuIconByPath[menuPath]) || LuFolder

  return <Icon className="sidebar-menu-icon" aria-hidden />
}

/** 기본 화면 사이드바 */
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [menuList, setMenuList] = useState<MenuDto[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [keyword, setKeyword] = useState('')
  const [openMenuIdList, setOpenMenuIdList] = useState<number[]>([])

  useEffect(() => {
    const media = window.matchMedia?.('(min-width: 768px)')
    if (!media) {
      return
    }

    const frame = requestAnimationFrame(() => {
      setIsOpen(media.matches)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    async function fetchSidebarMenuList() {
      try {
        const responseDto = await fetchMenuList()
        setMenuList(responseDto.menuList)
      } catch {
        setErrorMessage('메뉴를 불러오지 못했습니다.')
      }
    }

    void fetchSidebarMenuList()
  }, [])

  if (!isOpen) {
    return (
      <button
        type="button"
        className="sidebar-open-button"
        aria-label="사이드바 열기"
        onClick={() => setIsOpen(true)}
      >
        <LuMenu aria-hidden />
      </button>
    )
  }

  const trimmedKeyword = keyword.trim()
  const visibleMenuList =
    '' === trimmedKeyword
      ? menuList
      : menuList.flatMap((menu) => {
          // 상위 메뉴명이 검색어를 포함하는 경우
          if (menu.menuName.includes(trimmedKeyword)) {
            return [menu]
          }

          const subMenuList = menu.subMenuList.filter((subMenu) =>
            subMenu.menuName.includes(trimmedKeyword),
          )

          return 0 < subMenuList.length ? [{ ...menu, subMenuList }] : []
        })

  const toggleMenu = (menuId: number) => {
    setOpenMenuIdList((prevMenuIdList) =>
      prevMenuIdList.includes(menuId)
        ? prevMenuIdList.filter((openMenuId) => openMenuId !== menuId)
        : [...prevMenuIdList, menuId],
    )
  }

  return (
    <>
      <div
        className="sidebar-backdrop"
        aria-hidden
        onClick={() => setIsOpen(false)}
      />
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <Image src={logo} alt="minhyuck-labs" />
          </Link>
          <button
            type="button"
            className="sidebar-icon-button"
            aria-label="사이드바 닫기"
            onClick={() => setIsOpen(false)}
          >
            <LuPanelLeftClose aria-hidden />
          </button>
        </div>
        <label className="sidebar-search">
          <LuSearch aria-hidden />
          <input
            type="search"
            placeholder="메뉴 검색"
            aria-label="메뉴 검색"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>
        <hr className="sidebar-divider" />
        <nav className="sidebar-nav" aria-label="메뉴">
          {errorMessage && <p className="sidebar-message">{errorMessage}</p>}
          <MenuLink className="sidebar-menu sidebar-home" href="/">
            <span className="sidebar-menu-body">
              <LuHouse className="sidebar-menu-icon" aria-hidden />
              홈
            </span>
          </MenuLink>
          <ul className="sidebar-menu-list">
            {visibleMenuList.map((menu) => {
              // 화면 경로가 있는 메뉴인 경우
              if (menu.menuPath) {
                return (
                  <li key={menu.menuId}>
                    <MenuLink className="sidebar-menu" href={menu.menuPath}>
                      <span className="sidebar-menu-body">
                        <MenuMark menuPath={menu.menuPath} />
                        {menu.menuName}
                      </span>
                    </MenuLink>
                  </li>
                )
              }

              const isMenuOpen =
                '' !== trimmedKeyword || openMenuIdList.includes(menu.menuId)

              return (
                <li key={menu.menuId}>
                  <button
                    type="button"
                    className="sidebar-menu"
                    aria-expanded={isMenuOpen}
                    onClick={() => toggleMenu(menu.menuId)}
                  >
                    <span className="sidebar-menu-body">
                      <MenuMark menuPath={null} />
                      <span>{menu.menuName}</span>
                    </span>
                    {isMenuOpen ? (
                      <LuChevronDown aria-hidden />
                    ) : (
                      <LuChevronRight aria-hidden />
                    )}
                  </button>
                  {isMenuOpen && (
                    <ul className="sidebar-sub-menu-list">
                      {menu.subMenuList.map((subMenu) => (
                        <li key={subMenu.menuId}>
                          {subMenu.menuPath ? (
                            <MenuLink
                              className="sidebar-sub-menu"
                              href={subMenu.menuPath}
                            >
                              <span className="sidebar-tree-line" aria-hidden>
                                └
                              </span>
                              {subMenu.menuName}
                            </MenuLink>
                          ) : (
                            <span className="sidebar-sub-menu">
                              <span className="sidebar-tree-line" aria-hidden>
                                └
                              </span>
                              {subMenu.menuName}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
