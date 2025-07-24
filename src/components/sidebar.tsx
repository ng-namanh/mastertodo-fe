import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Priority } from "@/types/todo"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  users: string[]
  selectedUsers: string[]
  onUsersChange: (users: string[]) => void
  selectedPriorities: Priority[]
  onPrioritiesChange: (priorities: Priority[]) => void
  showStarredOnly: boolean
  onStarredOnlyChange: (show: boolean) => void
}

export function Sidebar({
  activeTab,
  onTabChange,
  users,
  selectedUsers,
  onUsersChange,
  selectedPriorities,
  onPrioritiesChange,
  showStarredOnly,
  onStarredOnlyChange,
}: SidebarProps) {
  const toggleUser = (user: string) => {
    onUsersChange(selectedUsers.includes(user) ? selectedUsers.filter((u) => u !== user) : [...selectedUsers, user])
  }

  const togglePriority = (priority: Priority) => {
    onPrioritiesChange(
      selectedPriorities.includes(priority)
        ? selectedPriorities.filter((p) => p !== priority)
        : [...selectedPriorities, priority],
    )
  }

  return (
    <div className="w-80 bg-white border-r p-6">
      <h1 className="text-2xl font-semibold mb-6">Todo List</h1>

      <Tabs value={activeTab} onValueChange={onTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="In Progress">In Progress</TabsTrigger>
          <TabsTrigger value="Completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Assigned Users</h3>
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <Button
                key={user}
                variant={selectedUsers.includes(user) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleUser(user)}
              >
                {user}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="starred"
            checked={showStarredOnly}
            onCheckedChange={(checked) => onStarredOnlyChange(checked as boolean)}
          />
          <Label htmlFor="starred">Show starred only</Label>
        </div>

        <div>
          <h3 className="font-medium mb-3">Priority</h3>
          <div className="flex gap-2">
            {(["High", "Medium", "Low"] as Priority[]).map((priority) => (
              <Button
                key={priority}
                variant={selectedPriorities.includes(priority) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePriority(priority)}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${priority === "High" ? "bg-red-500" : priority === "Medium" ? "bg-yellow-500" : "bg-gray-500"
                    }`}
                />
                {priority}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
