import { motion } from "framer-motion"
import { Users, Mail, Shield, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const members = [
  { name: "Alex Johnson", email: "alex@taskflow.app", role: "owner", tasks: 24, status: "online" },
  { name: "Sarah Miller", email: "sarah@taskflow.app", role: "admin", tasks: 18, status: "online" },
  { name: "Ryan Kim", email: "ryan@taskflow.app", role: "member", tasks: 15, status: "offline" },
  { name: "Lisa Park", email: "lisa@taskflow.app", role: "member", tasks: 12, status: "online" },
  { name: "Mike Chen", email: "mike@taskflow.app", role: "member", tasks: 9, status: "away" },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export function TeamPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Team</h1><p className="text-muted-foreground mt-1">{members.length} members in your workspace</p></div>
        <Button><Users className="h-4 w-4" />Invite Member</Button>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {members.map((m) => (
          <motion.div key={m.email} variants={item}>
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-11 w-11"><AvatarFallback>{m.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${m.status === "online" ? "bg-emerald-500" : m.status === "away" ? "bg-amber-500" : "bg-zinc-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</p>
                </div>
                <Badge variant={m.role === "owner" ? "default" : m.role === "admin" ? "secondary" : "outline"} className="text-xs capitalize hidden sm:flex"><Shield className="h-3 w-3 mr-1" />{m.role}</Badge>
                <span className="text-xs text-muted-foreground hidden md:block">{m.tasks} tasks</span>
                <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
