import type { ApiResponse, ResponseError } from '@/shared/types/apiResponse'

/** Raw JSON 응답 (GET) */
export async function fetchRawJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  // 응답 상태가 정상(2xx)이 아닌 경우
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

/** 표준(공통) API 응답 (GET) */
export async function fetchGetApi<T>(url: string): Promise<T> {
  return fetchEnvelope<T>('GET', url)
}

/** 표준(공통) API 응답 (POST) */
export async function fetchPostApi<T>(url: string, requestBody: unknown): Promise<T> {
  return fetchEnvelope<T>('POST', url, requestBody)
}

async function fetchEnvelope<T>(
  method: 'GET' | 'POST',
  url: string,
  requestBody?: unknown,
): Promise<T> {
  const init: RequestInit =
    'POST' === method
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      : { method: 'GET' }

  const response = await fetch(url, init)

  let responseBody: ApiResponse<T>
  try {
    responseBody = (await response.json()) as ApiResponse<T>
  } catch {
    throw new Error(`Invalid JSON response: ${response.status}`)
  }

  // 응답 JSON이 공통 ApiResponse 형식(data·error)이 아닌 경우
  if (!isApiResponse(responseBody)) {
    throw new Error(`Unexpected response shape: ${response.status}`)
  }

  // 서버가 error 필드로 오류를 내려준 경우
  if (responseBody.error) {
    throw new ApiRequestError(response.status, responseBody.error)
  }

  // 응답 상태가 정상(2xx)이 아니고 error 필드도 없는 경우
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return responseBody.data as T
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return 'data' in record && 'error' in record
}

/** 서버가 내려준 오류 코드·메시지를 담는 예외 */
export class ApiRequestError extends Error {
  readonly code: string
  readonly httpStatus: number

  constructor(httpStatus: number, error: ResponseError) {
    super(error.message)
    this.name = 'ApiRequestError'
    this.code = error.code
    this.httpStatus = httpStatus
  }
}
