import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: unknown) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status
          if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
            return false
          }
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 2
      },
    },
  },
})

export const queryKeys = {
  auth: {
    user: () => ["auth", "user"] as const,
    profile: () => ["auth", "profile"] as const,
  },
  todos: {
    all: () => ["todos"] as const,
    lists: () => [...queryKeys.todos.all(), "list"] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.todos.lists(), filters] as const,
    details: () => [...queryKeys.todos.all(), "detail"] as const,
    detail: (id: number) => [...queryKeys.todos.details(), id] as const,
  },
  users: {
    all: () => ["users"] as const,
  },
} as const
