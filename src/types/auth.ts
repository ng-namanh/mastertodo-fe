export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}
