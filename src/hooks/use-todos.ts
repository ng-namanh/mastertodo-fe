import { todoApi, type TodoFilters } from "@/api/todo"
import { queryKeys } from "@/lib/query-client"
import type { Todo } from "@/types/todo"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export function useTodos(filters: TodoFilters = {}) {
  const queryClient = useQueryClient()

  const {
    data: todosResponse,
    isLoading,
    error,
    refetch: refetchTodos,
  } = useQuery({
    queryKey: queryKeys.todos.list(filters),
    queryFn: () => todoApi.getTodos(filters),
    select: (data) => data.data.todos,
  })

  const { data: usersResponse } = useQuery({
    queryKey: ["users"],
    queryFn: () => todoApi.getUsers(),
    select: (data) => data.data.users,
    staleTime: 10 * 60 * 1000,
  })

  const createTodoMutation = useMutation({
    mutationFn: todoApi.createTodo,
    onSuccess: (response) => {
      if (response.data?.todo) {
        queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() })
      }
    },
    onError: (error) => {
      console.error("Failed to create todo:", error)
    },
  })

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Parameters<typeof todoApi.updateTodo>[1] }) =>
      todoApi.updateTodo(id, updates),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() })
    },
  })

  const deleteTodoMutation = useMutation({
    mutationFn: todoApi.deleteTodo,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() })
    },
  })

  const createTodo = useCallback(
    async (todoData: Parameters<typeof todoApi.createTodo>[0]) => {
      return createTodoMutation.mutateAsync(todoData)
    },
    [createTodoMutation]
  )

  const updateTodo = useCallback(
    async (id: number, updates: Parameters<typeof todoApi.updateTodo>[1]) => {
      return updateTodoMutation.mutateAsync({ id, updates })
    },
    [updateTodoMutation]
  )

  const toggleStarred = useCallback(
    async (id: number) => {
      const todo = todosResponse?.find(t => t.id === id)
      if (!todo) return

      return updateTodo(id, { starred: !todo.starred })
    },
    [todosResponse, updateTodo]
  )

  const updateStatus = useCallback(
    async (id: number, status: Todo['status']) => {
      return updateTodo(id, { status })
    },
    [updateTodo]
  )

  const deleteTodo = useCallback(
    async (id: number) => {
      return deleteTodoMutation.mutateAsync(id)
    },
    [deleteTodoMutation]
  )

  const fetchUsers = useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: ["users"] })
  }, [queryClient])

  const fetchTodos = useCallback(async (newFilters?: TodoFilters) => {
    const filtersToUse = newFilters || filters
    await queryClient.refetchQueries({ queryKey: queryKeys.todos.list(filtersToUse) })
  }, [queryClient, filters])

  return {
    todos: todosResponse || [],
    users: usersResponse || [],
    isLoading,
    error: error as Error | null,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    fetchTodos,
    fetchUsers,
    createTodo,
    updateTodo,
    toggleStarred,
    updateStatus,
    deleteTodo,
    refetchTodos,
  }
}
