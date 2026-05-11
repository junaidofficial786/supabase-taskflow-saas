import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, FolderKanban, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { EmptyState } from "@/components/shared/empty-state"
import { useNavigate } from "react-router-dom"
import { PROJECT_COLORS } from "@/constants"

interface DemoProject { id: string; name: string; description: string; color: string; tasks: number; progress: number }

const initialProjects: DemoProject[] = [
  { id: "1", name: "TaskFlow App", description: "Main product development", color: "#6366f1", tasks: 45, progress: 72 },
  { id: "2", name: "Marketing Site", description: "Landing page redesign", color: "#8b5cf6", tasks: 28, progress: 45 },
  { id: "3", name: "API v2", description: "REST API overhaul", color: "#06b6d4", tasks: 18, progress: 90 },
  { id: "4", name: "Mobile App", description: "React Native app", color: "#f43f5e", tasks: 32, progress: 25 },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<DemoProject[]>(initialProjects)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newColor, setNewColor] = useState(PROJECT_COLORS[0]!)

  const handleCreate = () => {
    if (!newName.trim()) return
    setProjects([...projects, { id: crypto.randomUUID(), name: newName, description: newDesc, color: newColor, tasks: 0, progress: 0 }])
    setNewName(""); setNewDesc(""); setIsCreateOpen(false)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Projects</h1><p className="text-muted-foreground mt-1">Manage all your team projects</p></div>
        <Button onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4" />New Project</Button>
      </div>
      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to get started with task management." action={<Button onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4" />Create Project</Button>} />
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/30 group" onClick={() => navigate(`/projects/${project.id}/board`)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: project.color }}>{project.name[0]}</div>
                      <div><h3 className="font-semibold group-hover:text-primary transition-colors">{project.name}</h3><p className="text-xs text-muted-foreground">{project.description}</p></div>
                    </div>
                    <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{project.tasks} tasks</span><span className="font-medium">{project.progress}%</span></div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center gap-1 mt-4">
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2"><Label>Project Name</Label><Input placeholder="My Project" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Description</Label><Input placeholder="A brief description..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} /></div>
            <div className="space-y-2"><Label>Color</Label><div className="flex gap-2 flex-wrap">{PROJECT_COLORS.slice(0, 8).map((c) => (<button key={c} className={`h-8 w-8 rounded-lg transition-transform ${newColor === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "hover:scale-110"}`} style={{ backgroundColor: c }} onClick={() => setNewColor(c)} />))}</div></div>
            <Button className="w-full" onClick={handleCreate}>Create Project</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
