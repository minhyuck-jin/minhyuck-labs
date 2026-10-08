import { LuUser } from 'react-icons/lu'

/** 기본 화면 헤더 */
export function Header() {
  return (
    <header className="header">
      <span className="header-user" role="img" aria-label="사용자">
        <LuUser aria-hidden />
      </span>
    </header>
  )
}
