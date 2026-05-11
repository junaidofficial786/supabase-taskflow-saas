import { motion } from "framer-motion"
import { CheckCircle2, MessageSquare, UserPlus, FolderPlus, CheckCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"

const demoNotifications = [
  { id: "1", type: "task_assigned", title: "New task assigned", message: "Sarah assigned you to 'Fix login bug'", read: false, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), icon: CheckCircle2, color: "text-blue-500" },
  { id: "2", type: "task_commented", title: "New comment", message: "Ryan commented on 'Dashboard analytics'", read: false, created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), icon: MessageSquare, color: "text-purple-500" },
  { id: "3", type: "member_added", title: "New team member", message: "Lisa Park joined the workspace", read: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), icon: UserPlus, color: "text-emerald-500" },
  { id: "4", type: "project_created", title: "New project", message: "Alex created 'Mobile App' project", read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), icon: FolderPlus, color: "text-amber-500" },
  { id: "5", type: "task_updated", title: "Task completed", message: "Ryan completed 'Database migration'", read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), icon: CheckCircle2, color: "text-emerald-500" },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }

export function NotificationsPage() {
  const unread = demoNotifications.filter(n => !n.read).length

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground mt-1">{unread} unread notifications</p></div>
        <Button variant="outline" size="sm"><CheckCheck className="h-4 w-4" />Mark all read</Button>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        {demoNotifications.map((n) => (
          <motion.div key={n.id} variants={item}>
            <Card className={`transition-all hover:shadow-md cursor-pointer ${!n.read ? "border-primary/20 bg-primary/[0.02]" : ""}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.read ? "bg-muted" : "bg-primary/10"}`}>
                  <n.icon className={`h-5 w-5 ${n.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <Badge className="h-2 w-2 p-0 rounded-full" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(n.created_at)}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
