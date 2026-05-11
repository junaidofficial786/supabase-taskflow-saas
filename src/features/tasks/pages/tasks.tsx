import { motion } from "framer-motion"
import { Calendar, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PRIORITY_COLORS } from "@/constants"

const tasks = [
  { id: "1", title: "Update user dashboard UI", project: "TaskFlow App", priority: "high", status: "In Progress", dueDate: "May 12", assignee: "AJ" },
  { id: "2", title: "Fix authentication flow", project: "TaskFlow App", priority: "urgent", status: "In Review", dueDate: "May 11", assignee: "AJ" },
  { id: "3", title: "Design new landing page", project: "Marketing Site", priority: "medium", status: "Todo", dueDate: "May 15", assignee: "AJ" },
  { id: "4", title: "API rate limiting middleware", project: "API v2", priority: "high", status: "In Progress", dueDate: "May 13", assignee: "AJ" },
  { id: "5", title: "Mobile responsive fixes", project: "TaskFlow App", priority: "low", status: "Todo", dueDate: "May 18", assignee: "AJ" },
  { id: "6", title: "Write unit tests for auth", project: "TaskFlow App", priority: "medium", status: "Done", dueDate: "May 9", assignee: "AJ" },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export function TasksPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">My Tasks</h1><p className="text-muted-foreground mt-1">{tasks.length} tasks assigned to you</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4" />Filter</Button>
        </div>
      </div>
      <Tabs defaultValue="all"><TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="progress">In Progress</TabsTrigger><TabsTrigger value="review">In Review</TabsTrigger><TabsTrigger value="done">Done</TabsTrigger></TabsList></Tabs>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        {tasks.map((task) => (
          <motion.div key={task.id} variants={item}>
            <Card className="hover:shadow-md transition-all cursor-pointer hover:border-primary/30">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${task.priority === "urgent" ? "bg-red-500" : task.priority === "high" ? "bg-orange-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.project}</p>
                </div>
                <Badge variant="outline" className={cn("text-xs hidden sm:flex", PRIORITY_COLORS[task.priority])}>{task.priority}</Badge>
                <Badge variant="secondary" className="text-xs hidden md:flex">{task.status}</Badge>
                <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1"><Calendar className="h-3 w-3" />{task.dueDate}</span>
                <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback></Avatar>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
