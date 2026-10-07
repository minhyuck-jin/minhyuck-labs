import type { MenuListResponseDto } from '@/app/(default)/admin/types/menu'
import { fetchPostApi } from '@/app/shared/api/apiClient'

/** 메뉴 목록 조회 */
export async function fetchMenuList(): Promise<MenuListResponseDto> {
  return fetchPostApi<MenuListResponseDto>(
    process.env.NEXT_PUBLIC_LABS_API_PATH + '/menus/search',
    {},
  )
}
