import { type ApiResponse, apiClient } from "@/lib/api-client"
import type { LoginCredentials } from "@/types/auth"

export interface LoginResponse {
  user: {
    id: number
    username: string
    email: string
    createdAt: string
    updatedAt: string
  }
  token: string
}

export interface RegisterResponse {
  user: {
    id: number
    username: string
    email: string
    createdAt: string
    updatedAt: string
  }
  token: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('login', { json: credentials })
    return response.json()
  },

  register: async (userData: RegisterData): Promise<ApiResponse<RegisterResponse>> => {
    const response = await apiClient.post('register', { json: userData })
    return response.json()
  },

  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post('logout')
    return response.json()
  },
}
