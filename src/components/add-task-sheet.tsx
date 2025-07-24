import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import type { Priority, Status, Todo } from "@/types/todo"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { useState } from "react"

interface AddTaskSheetProps {
  isOpen: boolean
  onClose: () => void
  onAddTodo: (todo: Omit<Todo, "id" | "subtasks" | "starred">) => void
  users: string[]
}

export function AddTaskSheet({ isOpen, onClose, onAddTodo, users }: AddTaskSheetProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: [] as string[],
    dueDate: undefined as Date | undefined,
    reminderDate: undefined as Date | undefined,
    status: "Pending" as Status,
    priority: "Medium" as Priority,
  })

  const handleSubmit = () => {
    if (!newTask.title.trim()) return

    onAddTodo({
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate || new Date(),
      reminderDate: newTask.reminderDate,
      status: newTask.status,
      priority: newTask.priority,
    })

    // Reset form
    setNewTask({
      title: "",
      description: "",
      assignedTo: [],
      dueDate: undefined,
      reminderDate: undefined,
      status: "Pending",
      priority: "Medium",
    })

    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Add New To-Do</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>

          <div>
            <Label>Assigned To</Label>
            <Select
              value={newTask.assignedTo[0] || ""}
              onValueChange={(value) => setNewTask({ ...newTask, assignedTo: [value] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Enter user name" />
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
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  {newTask.dueDate ? format(newTask.dueDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={newTask.dueDate}
                  onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Reminder Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  {newTask.reminderDate ? format(newTask.reminderDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={newTask.reminderDate}
                  onSelect={(date) => setNewTask({ ...newTask, reminderDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <RadioGroup
                value={newTask.status}
                onValueChange={(value) => setNewTask({ ...newTask, status: value as Status })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Pending" id="pending" />
                  <Label htmlFor="pending">Pending</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Priority</Label>
              <RadioGroup
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value as Priority })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-black text-white hover:bg-gray-800">
            Add To-Do
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
