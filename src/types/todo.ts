export type Priority = "HIGH" | "MEDIUM" | "LOW"
export type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED"

export interface Subtask {
  id: number
  title: string
  completed: boolean
  todoId: number
}

export interface Todo {
  id: number
  title: string
  description?: string
  dueDate: string
  reminderDate?: string
  status: Status
  priority: Priority
  starred: boolean
  creatorId: number
  assignedTo: Array<{
    id: number
    username: string
    email: string
  }>
  subtasks: Subtask[]
  createdAt: string
  updatedAt: string
}
