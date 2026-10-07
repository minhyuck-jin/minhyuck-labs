'use client'

import { AllCommunityModule, themeQuartz } from 'ag-grid-community'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useEffect, useState } from 'react'

import { fetchRawJson } from '@/app/shared/api/apiClient'

type DemoStatus = 'loading' | 'up' | 'error'

type SampleRow = {
  name: string
  quantity: number
}

const columnDefs: ColDef<SampleRow>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'quantity', headerName: 'Quantity' },
]

const rowList: SampleRow[] = [
  { name: 'Notebook', quantity: 2 },
  { name: 'Pen', quantity: 5 },
  { name: 'Eraser', quantity: 1 },
]

/** 홈 화면 */
export default function Home() {
  const [status, setStatus] = useState<DemoStatus>('loading')
  const [detail, setDetail] = useState('')

  useEffect(() => {
    async function fetchHealth() {
      try {
        const body = await fetchRawJson<{ status: string }>(
          process.env.NEXT_PUBLIC_LABS_API_PATH + '/actuator/health',
        )

        // 헬스 상태가 UP인 경우
        if ('UP' === body.status) {
          setStatus('up')
          setDetail('labs-api actuator health is UP')
          return
        }

        setStatus('error')
        setDetail(`Unexpected status: ${body.status}`)
      } catch (error: unknown) {
        setStatus('error')
        setDetail(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    void fetchHealth()
  }, [])

  return (
    <main className="page">
      <h1>minhyuck-labs web</h1>
      <p className="text-muted">
        Dev server (3000) proxies <code>/labs-api</code> to labs-api (8080).
        Start backend with <code>./gradlew bootRun</code> first.
      </p>
      <section className="panel" aria-live="polite">
        {status === 'loading' && <p>Checking backend health…</p>}
        {status === 'up' && <p className="text-success">{detail}</p>}
        {status === 'error' && <p className="text-error">{detail}</p>}
      </section>
      <div className="grid-sample">
        <AgGridReact<SampleRow>
          modules={[AllCommunityModule]}
          theme={themeQuartz}
          rowData={rowList}
          columnDefs={columnDefs}
        />
      </div>
    </main>
  )
}
