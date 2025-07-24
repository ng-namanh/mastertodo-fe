import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Todo } from "@/types/todo"
import { format } from "date-fns"
import { Calendar, Star } from "lucide-react"
import { useState } from "react"

const users = [
  "Emily Carter",
  "Liam Walker",
  "Sophie Lee",
  "Daniel Kim",
  "Olivia Adams",
  "Noah Bennett",
  "Mia Turner",
  "Lucas Evans",
]

interface EditableTaskFormProps {
  todo: Todo
  onSave: (todo: Todo) => void
  onCancel: () => void
}

export function EditableTaskForm({ todo, onSave, onCancel }: EditableTaskFormProps) {
  const [editForm, setEditForm] = useState<Todo>({ ...todo })

  const updateField = (field: keyof Todo, value: any) => {
    setEditForm({ ...editForm, [field]: value })
  }

  const toggleStar = () => {
    updateField("starred", !editForm.starred)
  }

  const handleSave = () => {
    onSave(editForm)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between mb-3">
        <Input
          value={editForm.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="font-medium"
          placeholder="Task title"
        />
        <Button variant="ghost" size="sm" onClick={toggleStar}>
          <Star className={`h-4 w-4 ${editForm.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
        </Button>
      </div>

      <Textarea
        value={editForm.description || ""}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder="Description"
        className="min-h-[60px]"
      />

      <div>
        <Label className="text-xs text-gray-500">Assigned to:</Label>
        <Select value={editForm.assignedTo[0] || ""} onValueChange={(value) => updateField("assignedTo", [value])}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-gray-500">Due Date:</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start mt-1 bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              {editForm.dueDate ? format(editForm.dueDate, "MMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={editForm.dueDate}
              onSelect={(date) => updateField("dueDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-gray-500">Status:</Label>
          <Select value={editForm.status} onValueChange={(value) => updateField("status", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-500">Priority:</Label>
          <Select value={editForm.priority} onValueChange={(value) => updateField("priority", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSave} size="sm" className="flex-1">
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm" className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
