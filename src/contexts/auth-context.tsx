import { authApi } from "@/api/authentication"
import { tokenUtils } from "@/config/token"
import type { User } from "@/types/auth"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenUtils.getAccessToken()
        if (token) {
          const savedUser = localStorage.getItem("currentUser")
          if (savedUser) {
            const userData = JSON.parse(savedUser)
            setUser(userData)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        tokenUtils.removeTokens()
        localStorage.removeItem("currentUser")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })

      console.log("Login response:", response)

      if (response.data?.token) {
        tokenUtils.setTokens({
          accessToken: response.data.token,
          refreshToken: ''
        })
      }

      const userData: User = {
        id: response.data?.user.id.toString() || '',
        name: response.data?.user.username || '',
        email: response.data?.user.email || '',
      }

      setUser(userData)
      localStorage.setItem("currentUser", JSON.stringify(userData))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      setUser(null)
      tokenUtils.removeTokens()
      localStorage.removeItem("currentUser")
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authApi.register({ username, email, password })

      if (response.data?.token) {
        tokenUtils.setTokens({
          accessToken: response.data.token,
          refreshToken: ''
        })
      }

      const userData: User = {
        id: response.data?.user.id.toString() || '',
        name: response.data?.user.username || '',
        email: response.data?.user.email || '',
      }

      setUser(userData)
      localStorage.setItem("currentUser", JSON.stringify(userData))
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    isLoading,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading TodoMaster...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
