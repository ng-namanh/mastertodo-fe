import type { TodoFilters } from "@/api/todo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { useTodos } from "@/hooks/use-todos"
import type { Priority, Status, Todo } from "@/types/todo"
import { AlertCircle, CheckCircle, Clock, Edit, LogOut, Plus, Search, Star } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { TodoSheet } from "./add-task-sheet"
import { Sidebar } from "./sidebar"

interface FilterState {
  status: Status[]
  priority: Priority[]
  assignedTo: number[]
  starred?: boolean
  search: string
}

interface TodoFormData {
  title: string
  description?: string
  assignedTo: number | null
  dueDate: Date
  reminderDate?: Date
  status: Status
  priority: Priority
}

export function TodoApp() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    assignedTo: [],
    search: "",
  })

  const apiFilters: TodoFilters = useMemo(() => {
    const result: TodoFilters = {}

    if (filters.status.length > 0) {
      result.status = filters.status
    }
    if (filters.priority.length > 0) {
      result.priority = filters.priority
    }
    if (filters.assignedTo.length > 0) {
      result.assignedTo = filters.assignedTo
    }
    if (filters.starred === true) {
      result.starred = true
    }

    return result
  }, [filters])

  const { todos, error, users, createTodo, updateTodo, deleteTodo } = useTodos(apiFilters)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate('/login')
    } catch (error) {
      console.error("Failed to logout:", error)
      toast.error("Failed to logout")
    }
  }

  const handleCheckboxChange = async (todoId: number, checked: boolean) => {
    try {
      const todo = todos.find((t: Todo) => t.id === todoId)
      if (todo) {
        const newStatus: Status = checked ? 'COMPLETED' : 'PENDING'
        await updateTodo(todoId, {
          title: todo.title,
          description: todo.description,
          assignedTo: todo.assignedTo.map(u => u.id),
          dueDate: todo.dueDate,
          reminderDate: todo.reminderDate,
          status: newStatus,
          priority: todo.priority,
          starred: todo.starred
        })

        const statusText = checked ? 'completed' : 'reopened'
        toast.success(`Todo ${statusText} successfully`, {
          description: `"${todo.title}" has been ${statusText}`,
          icon: checked ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />
        })
      }
    } catch (error) {
      toast.error("Failed to update todo", {
        description: "Please try again later"
      })
      console.error("Failed to update todo:", error)
    }
  }

  const handleDeleteTodo = async (todoId: number) => {
    try {
      const todo = todos.find((t: Todo) => t.id === todoId)
      const todoTitle = todo?.title || "Unknown todo"

      await deleteTodo(todoId)
      toast.success("Todo deleted successfully", {
        description: `"${todoTitle}" has been removed`,
        icon: <AlertCircle className="h-4 w-4" />
      })
    } catch (error) {
      toast.error("Failed to delete todo", {
        description: "Please try again later"
      })
      console.error("Failed to delete todo:", error)
    }
  }

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleOpenCreateSheet = () => {
    setEditingTodo(null)
    setIsSheetOpen(true)
  }

  const handleOpenEditSheet = (todo: Todo) => {
    setEditingTodo(todo)
    setIsSheetOpen(true)
  }

  const handleSaveTodo = async (data: TodoFormData, isEdit?: boolean) => {
    try {
      if (isEdit && editingTodo) {
        await updateTodo(editingTodo.id, {
          title: data.title,
          description: data.description,
          assignedTo: data.assignedTo ? [data.assignedTo] : editingTodo.assignedTo.map(u => u.id),
          dueDate: data.dueDate.toISOString(),
          reminderDate: data.reminderDate?.toISOString(),
          status: data.status,
          priority: data.priority,
        })
        toast.success("Todo updated successfully", {
          description: `"${data.title}" has been updated`,
          icon: <Edit className="h-4 w-4" />
        })
      } else {
        await createTodo({
          title: data.title,
          description: data.description || "",
          assignedTo: data.assignedTo ? [data.assignedTo] : [1],
          dueDate: data.dueDate.toISOString(),
          reminderDate: data.reminderDate?.toISOString(),
          status: data.status,
          priority: data.priority,
        })
        toast.success("Todo created successfully", {
          description: `"${data.title}" has been added to your list`,
          icon: <Plus className="h-4 w-4" />
        })
      }
      setIsSheetOpen(false)
      setEditingTodo(null)
    } catch (error) {
      const action = isEdit ? "update" : "create"
      toast.error(`Failed to ${action} todo`, {
        description: "Please check your input and try again"
      })
      console.error("Failed to save todo:", error)
    }
  }

  const filteredTodos = todos.filter((todo: Todo) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower)
    }
    return true
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500'
      case 'MEDIUM': return 'bg-yellow-500'
      case 'LOW': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4" />
      case 'PENDING': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen">
        <Sidebar
          users={users || []}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b border-slate-200">
            <div className="px-8 py-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      TodoMaster
                    </h1>
                  </div>
                  {user && (
                    <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-full">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Welcome, {user.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleOpenCreateSheet}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Todo
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="px-8 py-4 bg-white border-b border-slate-200">
            <div className="max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search todos..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50">
            {error && (
              <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-700 font-medium">{error.message}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Your Todos
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
                        <span className="text-lg font-bold text-blue-600">{filteredTodos.length}</span>
                        <span className="text-sm text-slate-600 ml-1">Total</span>
                      </div>
                      <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
                        <span className="text-lg font-bold text-green-600">
                          {filteredTodos.filter((t: Todo) => t.status === 'COMPLETED').length}
                        </span>
                        <span className="text-sm text-slate-600 ml-1">Done</span>
                      </div>
                      <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
                        <span className="text-lg font-bold text-orange-600">
                          {filteredTodos.filter((t: Todo) => t.status !== 'COMPLETED').length}
                        </span>
                        <span className="text-sm text-slate-600 ml-1">Pending</span>
                      </div>
                    </div>
                  </div>
                </div>

                {filteredTodos.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-lg mb-2">No todos found</p>
                    <p className="text-slate-400 text-sm mb-6">Create your first todo to get started</p>
                    <Button
                      onClick={handleOpenCreateSheet}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Todo
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTodos.map((todo: Todo) => (
                      <div
                        key={todo.id}
                        className={`group relative rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-200 hover:border-slate-300 ${todo.status === 'COMPLETED'
                            ? 'bg-slate-100 border-slate-300'
                            : 'bg-white border-slate-200'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <Checkbox
                              checked={todo.status === 'COMPLETED'}
                              onCheckedChange={(checked) => handleCheckboxChange(todo.id, checked as boolean)}
                              className="mt-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-lg font-semibold truncate pr-2 transition-all duration-200 ${todo.status === 'COMPLETED'
                                  ? 'text-slate-500 line-through'
                                  : 'text-slate-900'
                                }`}>
                                {todo.title}
                              </h3>
                              {todo.description && (
                                <p className={`text-sm mt-1 line-clamp-2 transition-all duration-200 ${todo.status === 'COMPLETED'
                                    ? 'text-slate-400'
                                    : 'text-slate-600'
                                  }`}>
                                  {todo.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenEditSheet(todo)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-100 rounded-lg flex-shrink-0"
                          >
                            <Edit className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(todo.priority)} ${todo.status === 'COMPLETED' ? 'opacity-50' : ''
                            }`}></div>
                          <span className={`text-sm font-medium transition-all duration-200 ${todo.status === 'COMPLETED' ? 'text-slate-400' : 'text-slate-700'
                            }`}>
                            {todo.priority}
                          </span>
                          {todo.starred && (
                            <Star className={`h-4 w-4 fill-current transition-all duration-200 ${todo.status === 'COMPLETED' ? 'text-yellow-400' : 'text-yellow-500'
                              }`} />
                          )}
                        </div>

                        {todo.assignedTo && todo.assignedTo.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`text-xs font-medium transition-all duration-200 ${todo.status === 'COMPLETED' ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                Assigned to:
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {todo.assignedTo.map((user: { id: number; username: string; email: string }) => (
                                <div
                                  key={user.id}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 ${todo.status === 'COMPLETED' ? 'bg-slate-200' : 'bg-slate-100'
                                    }`}
                                >
                                  <div className={`w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium ${todo.status === 'COMPLETED' ? 'opacity-60' : ''
                                    }`}>
                                    {user.username?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className={`text-xs truncate transition-all duration-200 ${todo.status === 'COMPLETED' ? 'text-slate-500' : 'text-slate-700'
                                    }`}>
                                    {user.username}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-medium transition-all duration-200 ${getStatusColor(todo.status)} ${todo.status === 'COMPLETED' ? 'opacity-75' : ''
                            }`}>
                            {getStatusIcon(todo.status)}
                            <span>{todo.status.replace('_', ' ')}</span>
                          </div>
                          <div className={`text-xs transition-all duration-200 ${todo.status === 'COMPLETED' ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${todo.status === 'COMPLETED'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TodoSheet
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false)
          setEditingTodo(null)
        }}
        onSave={handleSaveTodo}
        users={users || []}
        editTodo={editingTodo}
      />
    </div>
  )
}
