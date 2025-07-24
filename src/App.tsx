import { AddTaskSheet } from "@/components/add-task-sheet"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { TaskGrid } from "@/components/task-grid"
import type { Priority, Todo } from "@/types/todo"
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

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Design homepage layout",
    assignedTo: ["Emily Carter", "Liam Walker"],
    dueDate: new Date("2023-06-05"),
    status: "In Progress",
    priority: "High",
    subtasks: { completed: 1, total: 2 },
    starred: true,
  },
  {
    id: "2",
    title: "Conduct user interviews",
    assignedTo: ["Liam Walker"],
    dueDate: new Date("2023-06-12"),
    status: "Pending",
    priority: "Medium",
    subtasks: { completed: 1, total: 2 },
    starred: false,
  },
  {
    id: "3",
    title: "Write unit tests",
    assignedTo: ["Sophie Lee"],
    dueDate: new Date("2023-06-07"),
    status: "In Progress",
    priority: "High",
    subtasks: { completed: 0, total: 2 },
    starred: true,
  },
  {
    id: "4",
    title: "Prepare launch checklist",
    assignedTo: ["Daniel Kim", "Olivia Adams"],
    dueDate: new Date("2023-06-20"),
    status: "Pending",
    priority: "Low",
    subtasks: { completed: 0, total: 1 },
    starred: false,
  },
  {
    id: "5",
    title: "Update privacy policy",
    assignedTo: ["Olivia Adams"],
    dueDate: new Date("2023-06-14"),
    status: "In Progress",
    priority: "Medium",
    subtasks: { completed: 1, total: 2 },
    starred: false,
  },
  {
    id: "6",
    title: "Deploy to staging",
    assignedTo: ["Noah Bennett"],
    dueDate: new Date("2023-06-02"),
    status: "Completed",
    priority: "High",
    subtasks: { completed: 2, total: 2 },
    starred: true,
  },
  {
    id: "7",
    title: "Organize team retro",
    assignedTo: ["Mia Turner", "Olivia Adams"],
    dueDate: new Date("2023-06-10"),
    status: "Pending",
    priority: "Low",
    subtasks: { completed: 0, total: 2 },
    starred: false,
  },
  {
    id: "8",
    title: "Refactor dashboard UI",
    assignedTo: ["Lucas Evans", "Mia Turner", "Olivia Adams"],
    dueDate: new Date("2023-06-18"),
    status: "In Progress",
    priority: "High",
    subtasks: { completed: 1, total: 2 },
    starred: true,
  },
]

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([])
  const [showStarredOnly, setShowStarredOnly] = useState(false)
  const [activeTab, setActiveTab] = useState("All")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "All" || todo.status === activeTab
    const matchesUsers = selectedUsers.length === 0 || selectedUsers.some((user) => todo.assignedTo.includes(user))
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(todo.priority)
    const matchesStarred = !showStarredOnly || todo.starred

    return matchesSearch && matchesTab && matchesUsers && matchesPriority && matchesStarred
  })

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
  }

  const addTodo = (newTodo: Omit<Todo, "id" | "subtasks" | "starred">) => {
    const todo: Todo = {
      ...newTodo,
      id: Date.now().toString(),
      subtasks: { completed: 0, total: 1 },
      starred: false,
    }
    setTodos([...todos, todo])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onAddTask={() => setIsAddTaskOpen(true)} />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          users={users}
          selectedUsers={selectedUsers}
          onUsersChange={setSelectedUsers}
          selectedPriorities={selectedPriorities}
          onPrioritiesChange={setSelectedPriorities}
          showStarredOnly={showStarredOnly}
          onStarredOnlyChange={setShowStarredOnly}
        />

        <TaskGrid
          todos={filteredTodos}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUpdateTodo={updateTodo}
        />
      </div>

      <AddTaskSheet isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} onAddTodo={addTodo} users={users} />
    </div>
  )
}
