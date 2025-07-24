import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Plus, Search } from "lucide-react"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddTask: () => void
}

export function Header({ searchQuery, onSearchChange, onAddTask }: HeaderProps) {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Menu className="h-5 w-5 text-gray-500" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-80"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add New To-Do
          </Button>
        </div>
      </div>
    </div>
  )
}
