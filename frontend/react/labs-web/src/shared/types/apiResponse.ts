/** Api 응답 Error Type */
export type ResponseError = {
  code: string
  message: string
}

/** Api 응답 Type */
export type ApiResponse<T> = {
  data: T | null
  error: ResponseError | null
}
