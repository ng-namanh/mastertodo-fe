import { authApi, type LoginResponse, type RegisterResponse } from "@/api/authentication"
import { queryKeys } from "@/lib/query-client"
import type { LoginCredentials, RegisterData, User } from "@/types/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Get current user query
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        return JSON.parse(savedUser) as User
      }

      // Try to get user from API if token exists
      const token = localStorage.getItem("authToken")
      if (token) {
        const response = await authApi.getProfile()
        return response.data
      }

      return null
    },
    staleTime: Number.POSITIVE_INFINITY, // User data doesn't change often
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response: { data: LoginResponse }) => {
      const { user, token, refreshToken } = response.data

      // Store tokens and user data
      localStorage.setItem("authToken", token)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Update query cache
      queryClient.setQueryData(queryKeys.auth.user(), user)

      // Navigate to dashboard
      navigate("/dashboard", { replace: true })
    },
    onError: (error) => {
      console.error("Login failed:", error)
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response: { data: RegisterResponse }) => {
      const { user, token, refreshToken } = response.data

      // Store tokens and user data
      localStorage.setItem("authToken", token)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Update query cache
      queryClient.setQueryData(queryKeys.auth.user(), user)

      // Navigate to dashboard
      navigate("/dashboard", { replace: true })
    },
    onError: (error) => {
      console.error("Registration failed:", error)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear storage
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("currentUser")

      // Clear query cache
      queryClient.clear()

      // Navigate to home
      navigate("/", { replace: true })
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      // Still clear local data even if API call fails
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("currentUser")
      queryClient.clear()
      navigate("/", { replace: true })
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      const updatedUser = response.data

      // Update local storage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update query cache
      queryClient.setQueryData(queryKeys.auth.user(), updatedUser)
    },
    onError: (error) => {
      console.error("Profile update failed:", error)
    },
  })

  return {
    // Data
    user,
    isLoading,
    error,
    isAuthenticated: !!user,

    // Actions
    login: (credentials: LoginCredentials) => loginMutation.mutate(credentials),
    register: (userData: RegisterData) => registerMutation.mutate(userData),
    logout: () => logoutMutation.mutate(),
    updateProfile: (userData: Partial<User>) => updateProfileMutation.mutate(userData),

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,

    // Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    updateProfileError: updateProfileMutation.error,
  }
}
