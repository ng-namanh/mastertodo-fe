import { LoginScreen } from "@/components/auth/login-screen"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { RegisterScreen } from "@/components/auth/register-screen"
import { WelcomeScreen } from "@/components/auth/welcome-screen"
import { ErrorBoundary } from "@/components/error-boundary"
import { TodoApp } from "@/components/todo-app"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { queryClient } from "@/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import type React from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import { Toaster } from "sonner"

function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
          <Toaster
            position="top-right"
            expand={true}
            richColors={true}
            closeButton={true}
            toastOptions={{
              style: {
                background: 'white',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              },
            }}
          />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function WelcomeRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <WelcomeScreen />
}

function LoginRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <LoginScreen />
}

function RegisterRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <RegisterScreen />
}

function DashboardRoute() {
  return (
    <ProtectedRoute>
      <TodoApp />
    </ProtectedRoute>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthWrapper>
        <WelcomeRoute />
      </AuthWrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: (
      <AuthWrapper>
        <LoginRoute />
      </AuthWrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/register",
    element: (
      <AuthWrapper>
        <RegisterRoute />
      </AuthWrapper>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthWrapper>
        <DashboardRoute />
      </AuthWrapper>
    ),
    errorElement: <ErrorBoundary />,
    loader: async () => {
      return null
    },
  },
  {
    path: "*",
    element: (
      <AuthWrapper>
        <Navigate to="/" replace />
      </AuthWrapper>
    ),
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
