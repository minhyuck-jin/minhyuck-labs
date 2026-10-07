/** 메뉴 */
export type MenuDto = {
  menuId: number
  parentMenuId: number | null
  menuName: string
  menuPath: string | null
  sortOrder: number
  subMenuList: MenuDto[]
}

/** 메뉴 목록 응답 */
export type MenuListResponseDto = {
  menuList: MenuDto[]
  totalCount: number
}
