import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Priority, Status, Todo } from "@/types/todo"
import { format } from "date-fns"
import { Calendar, Star } from "lucide-react"
import { useState } from "react"
import { EditableTaskForm } from "./editable-task-form"

interface TodoCardProps {
  todo: Todo
  onUpdate: (todo: Todo) => void
}

export function TodoCard({ todo, onUpdate }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Progress":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const toggleStar = () => {
    onUpdate({ ...todo, starred: !todo.starred })
  }

  const handleSave = (updatedTodo: Todo) => {
    onUpdate(updatedTodo)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {isEditing ? (
          <EditableTaskForm todo={todo} onSave={handleSave} onCancel={handleCancel} />
        ) : (
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-1">
                <Checkbox />
                <h3
                  className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {todo.title}
                </h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleStar} className="h-8 w-8 p-0">
                  <Star className={`h-4 w-4 ${todo.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                </Button>
              </div>
            </div>

            {todo.description && <p className="text-sm text-gray-600 mb-3">{todo.description}</p>}

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Assigned to:</span>
                <div className="flex gap-1">
                  {todo.assignedTo.map((user) => (
                    <Badge key={user} variant="secondary" className="text-xs">
                      {user}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{format(todo.dueDate, "MMM d, yyyy")}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>
                  Subtasks: {todo.subtasks.completed}/{todo.subtasks.total}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <Badge className={getStatusColor(todo.status)}>{todo.status}</Badge>
                <Badge className={getPriorityColor(todo.priority)}>{todo.priority}</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
