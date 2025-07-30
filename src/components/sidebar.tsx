import { Button } from "@/components/ui/button"
import type { Priority, Status } from "@/types/todo"
import {
  AlertCircle,
  ArrowDown,
  CheckCircle,
  Clock,
  Filter,
  Minus,
  Star,
  User,
  Users,
  X,
  Zap
} from "lucide-react"

interface User {
  id: number
  username: string
  email: string
}

interface FilterState {
  status: Status[]
  priority: Priority[]
  assignedTo: number[]
  starred?: boolean
  search: string
}

interface SidebarProps {
  users: User[]
  filters: FilterState
  onFilterChange: (newFilters: Partial<FilterState>) => void
}

export function Sidebar({
  users,
  filters,
  onFilterChange,
}: SidebarProps) {
  const toggleUser = (userId: number) => {
    const newAssignedTo = filters.assignedTo.includes(userId)
      ? filters.assignedTo.filter(id => id !== userId)
      : [...filters.assignedTo, userId]

    onFilterChange({ assignedTo: newAssignedTo })
  }

  const togglePriority = (displayPriority: string) => {
    const backendPriority = displayPriority.toUpperCase() as Priority
    const newPriorities = filters.priority.includes(backendPriority)
      ? filters.priority.filter(p => p !== backendPriority)
      : [...filters.priority, backendPriority]

    onFilterChange({ priority: newPriorities })
  }

  const toggleStatus = (displayStatus: string) => {
    const backendStatus = displayStatus === 'In Progress' ? 'IN_PROGRESS' : displayStatus.toUpperCase() as Status
    const newStatuses = filters.status.includes(backendStatus)
      ? filters.status.filter(s => s !== backendStatus)
      : [...filters.status, backendStatus]

    onFilterChange({ status: newStatuses })
  }

  const toggleStarred = () => {
    onFilterChange({
      starred: filters.starred === true ? undefined : true
    })
  }

  return (
    <div className="w-80 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 h-full overflow-y-auto shadow-sm">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Filters
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Status</h3>
          </div>
          <div className="space-y-2">
            {(['Pending', 'In Progress', 'Completed']).map((displayStatus) => {
              const backendStatus = displayStatus === 'In Progress' ? 'IN_PROGRESS' : displayStatus.toUpperCase() as Status
              const isSelected = filters.status.includes(backendStatus)
              const statusConfig = {
                'Pending': { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', activeBg: 'bg-orange-100' },
                'In Progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', activeBg: 'bg-blue-100' },
                'Completed': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200', activeBg: 'bg-green-100' }
              }[displayStatus]!

              const StatusIcon = statusConfig.icon

              return (
                <button
                  key={displayStatus}
                  onClick={() => toggleStatus(displayStatus)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${isSelected
                    ? `${statusConfig.bg} ${statusConfig.activeBg} shadow-sm`
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`h-4 w-4 ${isSelected ? statusConfig.color : 'text-slate-400'}`} />
                    <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                      {displayStatus}
                    </span>
                  </div>
                  {isSelected && (
                    <div className={`w-2 h-2 rounded-full ${statusConfig.color.replace('text-', 'bg-')}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Priority</h3>
          </div>
          <div className="space-y-2">
            {(['High', 'Medium', 'Low']).map((displayPriority) => {
              const backendPriority = displayPriority.toUpperCase() as Priority
              const isSelected = filters.priority.includes(backendPriority)
              const priorityConfig = {
                'High': { icon: Zap, color: 'text-red-600', bg: 'bg-red-50 border-red-200', activeBg: 'bg-red-100' },
                'Medium': { icon: Minus, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', activeBg: 'bg-yellow-100' },
                'Low': { icon: ArrowDown, color: 'text-green-600', bg: 'bg-green-50 border-green-200', activeBg: 'bg-green-100' }
              }[displayPriority]!

              const PriorityIcon = priorityConfig.icon

              return (
                <button
                  key={displayPriority}
                  onClick={() => togglePriority(displayPriority)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${isSelected
                    ? `${priorityConfig.bg} ${priorityConfig.activeBg} shadow-sm`
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <PriorityIcon className={`h-4 w-4 ${isSelected ? priorityConfig.color : 'text-slate-400'}`} />
                    <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                      {displayPriority}
                    </span>
                  </div>
                  {isSelected && (
                    <div className={`w-2 h-2 rounded-full ${priorityConfig.color.replace('text-', 'bg-')}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Special</h3>
          </div>
          <div className="space-y-2">
            <button
              onClick={toggleStarred}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${filters.starred === true
                ? 'bg-yellow-100 border-yellow-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Star className={`h-4 w-4 ${filters.starred === true ? 'text-yellow-600 fill-current' : 'text-slate-400'}`} />
                <span className={`font-medium ${filters.starred === true ? 'text-slate-900' : 'text-slate-600'}`}>
                  Starred only
                </span>
              </div>
              {filters.starred === true && (
                <div className="w-2 h-2 rounded-full bg-yellow-600" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Assigned Users</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {users.map((user) => {
              const isSelected = filters.assignedTo.includes(user.id)
              return (
                <button
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${isSelected
                    ? 'bg-blue-100 border-blue-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  title={user.email}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500'
                      }`}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className={`font-medium truncate ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                        {user.username}
                      </span>
                      <span className={`text-xs truncate ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                        {user.email}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                  )}
                </button>
              )
            })}
            {users.length === 0 && (
              <div className="text-center py-6">
                <User className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No users found</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={() => onFilterChange({
              status: [],
              priority: [],
              assignedTo: [],
              starred: undefined,
            })}
            className="w-full bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Clear All Filters</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
