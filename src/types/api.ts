interface ErrorDetail {
  statusCode: number
  path: string
  method: string
  timestamp: string
  error: string
  stack: string
}

interface BaseResponse {
  success: boolean
  timestamp: string
}

export interface ResponseSuccess<T> extends BaseResponse {
  success: true
  message: string
  data: T
  error: null
}

export interface ResponseError extends BaseResponse {
  success: false
  message: string
  data: null
  error: ErrorDetail
}