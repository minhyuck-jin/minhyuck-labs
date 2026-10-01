import { fetchRawJson } from '@/shared/api/apiClient'

export type SampleResponse = {
  status: string
}

export async function fetchSample(): Promise<SampleResponse> {
  return fetchRawJson<SampleResponse>(import.meta.env.VITE_LABS_API_PATH + '/actuator/health')
}
