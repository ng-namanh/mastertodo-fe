export type Priority = "High" | "Medium" | "Low"
export type Status = "Pending" | "In Progress" | "Completed"

export interface Todo {
  id: string
  title: string
  description?: string
  assignedTo: string[]
  dueDate: Date
  reminderDate?: Date
  status: Status
  priority: Priority
  subtasks: { completed: number; total: number }
  starred: boolean
}
