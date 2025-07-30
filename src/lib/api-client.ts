import { tokenUtils } from "@/config/token"
import ky from "ky"

const BASE_API_URL = "https://api.namanh.id.vn"

export const apiClient = ky.create({
  prefixUrl: BASE_API_URL,
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ["get", "put", "head", "delete", "options", "trace"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = tokenUtils.getAccessToken()
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`)
        }

        if (request.method !== "GET") {
          request.headers.set("Content-Type", "application/json")
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Handle error responses with new format
        if (!response.ok) {
          let errorData: ApiError
          try {
            errorData = await response.json()
          } catch {
            errorData = {
              error: "Network Error",
              message: `HTTP ${response.status}: ${response.statusText}`,
              status: response.status,
            }
          }

          throw new ApiClientError(
            errorData.message || errorData.error,
            errorData.status,
            errorData.error
          )
        }
        return response
      },
    ],
  },
})

export interface ApiResponse<T = unknown> {
  message: string
  data: T
  status: number
}

export interface ApiError {
  error: string
  message: string
  status: number
}

export class ApiClientError extends Error {
  status?: number
  code?: string

  constructor(
    message: string,
    status?: number,
    code?: string,
  ) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.code = code
  }
}
