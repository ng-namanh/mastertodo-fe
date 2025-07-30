import { apiClient, type ApiResponse } from "@/lib/api-client"
import type { Priority, Status, Todo } from "@/types/todo"

export interface CreateTodoRequest {
  title: string
  description?: string
  dueDate: string
  reminderDate?: string
  status?: Status
  priority?: Priority
  starred?: boolean
  assignedTo?: number[]
  subtasks?: { title: string; completed?: boolean }[]
}

export interface UpdateTodoRequest {
  title?: string
  description?: string
  dueDate?: string
  reminderDate?: string
  status?: Status
  priority?: Priority
  starred?: boolean
  assignedTo?: number[]
  subtasks?: { id?: number; title: string; completed?: boolean }[]
}

export interface TodoFilters extends Record<string, unknown> {
  status?: string[]
  priority?: string[]
  assignedTo?: number[]
  starred?: boolean
}

export interface TodoListResponse {
  message: string
  data: {
    todos: Todo[]
    filters?: TodoFilters
  }
  status: number
}

export interface UserResponse {
  message: string
  data: {
    users: Array<{
      id: number
      username: string
      email: string
      createdAt: string
      updatedAt: string
    }>
  }
  status: number
}

export const todoApi = {
  getTodos: async (filters: TodoFilters = {}): Promise<TodoListResponse> => {
    const searchParams = new URLSearchParams()

    if (filters.status && filters.status.length > 0) {
      searchParams.append('status', filters.status.join(','))
    }
    if (filters.priority && filters.priority.length > 0) {
      searchParams.append('priority', filters.priority.join(','))
    }
    if (filters.assignedTo && filters.assignedTo.length > 0) {
      searchParams.append('assignedTo', filters.assignedTo.join(','))
    }
    if (filters.starred !== undefined) {
      searchParams.append('starred', filters.starred.toString())
    }

    const response = await apiClient.get(`todos?${searchParams}`)
    return response.json()
  },

  getMyTodos: async (): Promise<TodoListResponse> => {
    const response = await apiClient.get('my-todos')
    return response.json()
  },

  getTodoById: async (id: number): Promise<ApiResponse<{ todo: Todo }>> => {
    const response = await apiClient.get(`todos/${id}`)
    return response.json()
  },

  createTodo: async (todo: CreateTodoRequest): Promise<ApiResponse<{ todo: Todo }>> => {
    const response = await apiClient.post('todos', { json: todo })
    return response.json()
  },

  updateTodo: async (id: number, updates: UpdateTodoRequest): Promise<ApiResponse<{ todo: Todo }>> => {
    const response = await apiClient.put(`todos/${id}`, { json: updates })
    return response.json()
  },

  deleteTodo: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`todos/${id}`)
    return response.json()
  },

  getUsers: async (): Promise<UserResponse> => {
    const response = await apiClient.get('users')
    return response.json()
  },
}
