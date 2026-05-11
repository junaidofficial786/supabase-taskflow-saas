import { motion } from "framer-motion"
import { TrendingUp, Users, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const productivityData = [
  { date: "Mon", completed: 12, created: 8 }, { date: "Tue", completed: 18, created: 14 },
  { date: "Wed", completed: 15, created: 11 }, { date: "Thu", completed: 22, created: 16 },
  { date: "Fri", completed: 20, created: 9 }, { date: "Sat", completed: 8, created: 4 },
  { date: "Sun", completed: 5, created: 3 },
]

const teamData = [
  { name: "Alex", tasks: 24 }, { name: "Sarah", tasks: 18 },
  { name: "Ryan", tasks: 15 }, { name: "Lisa", tasks: 12 }, { name: "Mike", tasks: 9 },
]

const statusData = [
  { name: "Completed", value: 84, color: "#22c55e" }, { name: "In Progress", value: 32, color: "#f59e0b" },
  { name: "Overdue", value: 12, color: "#ef4444" },
]

const stats = [
  { title: "Tasks Completed", value: "84", sub: "this week", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Productivity", value: "+23%", sub: "vs last week", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Active Members", value: "8", sub: "online now", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Avg. Completion", value: "2.4d", sub: "per task", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
]

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }

export function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-muted-foreground mt-1">Track your team&apos;s productivity and progress</p></div>
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div key={s.title} variants={item}>
            <Card><CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.title} · {s.sub}</p>
            </CardContent></Card>
          </motion.div>
        ))}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Productivity</CardTitle></CardHeader>
            <CardContent><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs><linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#cGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="created" stroke="#8b5cf6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer></div></CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Team Activity</CardTitle></CardHeader>
            <CardContent><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="tasks" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer></div></CardContent></Card>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card><CardHeader><CardTitle className="text-lg">Task Distribution</CardTitle></CardHeader>
            <CardContent><div className="h-[200px]"><ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer></div>
            <div className="flex justify-center gap-4 mt-2">{statusData.map(s => <div key={s.name} className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-xs text-muted-foreground">{s.name}</span></div>)}</div></CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="lg:col-span-2">
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />Overdue Tasks</CardTitle></CardHeader>
            <CardContent><div className="space-y-3">
              {[{ title: "Fix login bug", days: 3, assignee: "AJ" }, { title: "Update docs", days: 1, assignee: "SM" }, { title: "Deploy staging", days: 5, assignee: "RK" }].map(t => (
                <div key={t.title} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium flex-1">{t.title}</span>
                  <Badge variant="destructive" className="text-xs">{t.days}d overdue</Badge>
                </div>
              ))}
            </div></CardContent></Card>
        </motion.div>
      </div>
    </div>
  )
}
