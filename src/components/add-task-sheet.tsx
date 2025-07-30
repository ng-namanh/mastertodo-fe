import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import type { Todo } from "@/types/todo"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar, FileText, Save, User, X } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  assignedTo: z.number().nullable(),
  dueDate: z.date(),
  reminderDate: z.date().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
})

type TodoFormData = z.infer<typeof todoSchema>

interface User {
  id: number
  username: string
  email: string
}

interface TodoSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: TodoFormData, isEdit?: boolean) => void
  users: User[]
  editTodo?: Todo | null
}

export function TodoSheet({ isOpen, onClose, onSave, users, editTodo }: TodoSheetProps) {
  const isEditing = !!editTodo

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: null,
      dueDate: new Date(),
      reminderDate: undefined,
      status: "PENDING",
      priority: "MEDIUM",
    },
  })

  useEffect(() => {
    if (isOpen && editTodo) {
      setValue("title", editTodo.title)
      setValue("description", editTodo.description || "")
      setValue("assignedTo", editTodo.assignedTo[0]?.id || null)
      setValue("dueDate", new Date(editTodo.dueDate))
      setValue("reminderDate", editTodo.reminderDate ? new Date(editTodo.reminderDate) : undefined)
      setValue("status", editTodo.status)
      setValue("priority", editTodo.priority)
    } else if (isOpen && !editTodo) {
      reset({
        title: "",
        description: "",
        assignedTo: null,
        dueDate: new Date(),
        reminderDate: undefined,
        status: "PENDING",
        priority: "MEDIUM",
      })
    }
  }, [isOpen, editTodo, setValue, reset])

  const onSubmit = (data: TodoFormData) => {
    onSave(data, isEditing)
    reset()
    onClose()
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleCancel}>
      <SheetContent className="w-[500px] p-0 overflow-y-auto bg-gradient-to-b from-white to-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <SheetHeader>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                {isEditing ? <FileText className="h-4 w-4 text-white" /> : <Save className="h-4 w-4 text-white" />}
              </div>
              <SheetTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isEditing ? "Edit Todo" : "Create New Todo"}
              </SheetTitle>
            </div>
          </SheetHeader>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-slate-600" />
                <Label htmlFor="title" className="text-sm font-semibold text-slate-900">Title *</Label>
              </div>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder="What needs to be done?"
                    className={`${errors.title ? "border-red-300 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"} rounded-lg`}
                  />
                )}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-slate-600" />
                <Label htmlFor="description" className="text-sm font-semibold text-slate-900">Description</Label>
              </div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Add more details..."
                    rows={3}
                    className="border-slate-300 focus:ring-blue-500 rounded-lg resize-none"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || "unassigned"}
                    onValueChange={(value) => field.onChange(value === "unassigned" ? null : Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">No assignment</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.username} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start bg-transparent ${errors.dueDate ? "border-red-500" : ""
                          }`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Reminder Date</Label>
              <Controller
                name="reminderDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Select a date (optional)"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PENDING" id="pending" />
                      <Label htmlFor="pending">Pending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="IN_PROGRESS" id="in-progress" />
                      <Label htmlFor="in-progress">In Progress</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="COMPLETED" id="completed" />
                      <Label htmlFor="completed">Completed</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="HIGH" id="high" />
                      <Label htmlFor="high" className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                        High
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MEDIUM" id="medium" />
                      <Label htmlFor="medium" className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                        Medium
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="LOW" id="low" />
                      <Label htmlFor="low" className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        Low
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-slate-300 hover:bg-slate-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update Todo" : "Create Todo"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
