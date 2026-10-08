import type { ReactNode } from 'react'

import { Header } from '@/app/(default)/header'
import { Sidebar } from '@/app/(default)/sidebar'

/** 기본 화면 틀 */
export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="default-layout">
      <Sidebar />
      <div className="default-layout-body">
        <Header />
        <div className="default-layout-content">{children}</div>
      </div>
    </div>
  )
}
