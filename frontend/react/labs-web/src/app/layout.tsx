import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@/app/shared/styles/global.css'

export const metadata: Metadata = {
  title: 'minhyuck-labs web',
}

/** 앱 루트 틀 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
