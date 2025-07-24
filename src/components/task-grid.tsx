import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Todo } from "@/types/todo"
import { Filter, Grid3X3, List, Search } from "lucide-react"
import { TodoCard } from "./todo-card"

interface TaskGridProps {
  todos: Todo[]
  viewMode: "list" | "grid"
  onViewModeChange: (mode: "list" | "grid") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onUpdateTodo: (todo: Todo) => void
}

export function TaskGrid({
  todos,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onUpdateTodo,
}: TaskGridProps) {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            className="pl-10 w-80"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-3" : "grid-cols-1"}`}>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onUpdate={onUpdateTodo} />
        ))}
      </div>
    </div>
  )
}
