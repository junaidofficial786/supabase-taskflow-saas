import { motion } from "framer-motion"
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Plus, FolderKanban, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"

const stats = [
  { title: "Total Tasks", value: "128", change: "+12%", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Completed", value: "84", change: "+8%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "In Progress", value: "32", change: "+3%", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Overdue", value: "12", change: "-2%", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
]

const recentTasks = [
  { title: "Update user dashboard UI", priority: "high", status: "In Progress", assignee: "AJ" },
  { title: "Fix authentication flow", priority: "urgent", status: "In Review", assignee: "SM" },
  { title: "Database migration script", priority: "medium", status: "Todo", assignee: "RK" },
  { title: "API rate limiting", priority: "low", status: "Done", assignee: "LP" },
  { title: "Mobile responsive fixes", priority: "high", status: "In Progress", assignee: "AJ" },
]

const projects = [
  { name: "TaskFlow App", progress: 72, tasks: 45, color: "#6366f1" },
  { name: "Marketing Site", progress: 45, tasks: 28, color: "#8b5cf6" },
  { name: "API v2", progress: 90, tasks: 18, color: "#06b6d4" },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {user?.full_name?.split(" ")[0] ?? "there"} 👋</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
        <Button onClick={() => navigate("/projects")}><Plus className="h-4 w-4" />New Project</Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge variant={stat.change.startsWith("+") ? "success" : "destructive"} className="text-xs">{stat.change}</Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Recent Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${task.priority === "urgent" ? "bg-red-500" : task.priority === "high" ? "bg-orange-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"}`} />
                    <span className="text-sm font-medium flex-1 truncate">{task.title}</span>
                    <Badge variant="secondary" className="text-xs hidden sm:flex">{task.status}</Badge>
                    <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback></Avatar>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><FolderKanban className="h-5 w-5 text-primary" />Projects</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.name} className="space-y-2 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
                        <span className="text-sm font-medium">{project.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{project.tasks} tasks</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/analytics")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><TrendingUp className="h-6 w-6 text-primary" /></div>
            <div><p className="font-semibold">Productivity Up 23%</p><p className="text-sm text-muted-foreground">Compared to last week</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/team")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10"><Users className="h-6 w-6 text-emerald-500" /></div>
            <div><p className="font-semibold">8 Team Members Active</p><p className="text-sm text-muted-foreground">All projects on track</p></div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
