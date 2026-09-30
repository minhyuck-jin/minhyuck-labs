export type SampleResponse = {
  status: string
}

export async function fetchSample(): Promise<SampleResponse> {
  const url = import.meta.env.VITE_LABS_API_PATH + '/actuator/health'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Health request failed: ${response.status}`)
  }

  return (await response.json()) as SampleResponse
}
