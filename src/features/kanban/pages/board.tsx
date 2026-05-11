import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal, GripVertical, MessageSquare, Calendar, Trash2, Edit3 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PRIORITY_COLORS } from "@/constants"
import { cn } from "@/lib/utils"
import type { TaskPriority } from "@/types"

interface BoardTask { id: string; title: string; description: string; priority: TaskPriority; assignee: string; comments: number; dueDate: string | null; labels: { name: string; color: string }[] }
interface BoardColumn { id: string; name: string; color: string; tasks: BoardTask[] }

const initialColumns: BoardColumn[] = [
  { id: "backlog", name: "Backlog", color: "#6b7280", tasks: [
    { id: "t1", title: "Research competitor features", description: "", priority: "low", assignee: "RK", comments: 2, dueDate: null, labels: [{ name: "Research", color: "#3b82f6" }] },
    { id: "t2", title: "Design token system", description: "", priority: "medium", assignee: "LP", comments: 0, dueDate: "2026-05-15", labels: [] },
  ]},
  { id: "todo", name: "Todo", color: "#3b82f6", tasks: [
    { id: "t3", title: "Setup CI/CD pipeline", description: "Configure GitHub Actions", priority: "high", assignee: "AJ", comments: 5, dueDate: "2026-05-12", labels: [{ name: "DevOps", color: "#f97316" }] },
    { id: "t4", title: "User onboarding flow", description: "", priority: "medium", assignee: "SM", comments: 1, dueDate: null, labels: [{ name: "Feature", color: "#22c55e" }] },
  ]},
  { id: "progress", name: "In Progress", color: "#f59e0b", tasks: [
    { id: "t5", title: "Dashboard analytics widgets", description: "Build chart components", priority: "high", assignee: "AJ", comments: 8, dueDate: "2026-05-10", labels: [{ name: "Feature", color: "#22c55e" }, { name: "Frontend", color: "#a855f7" }] },
    { id: "t6", title: "API rate limiting", description: "", priority: "urgent", assignee: "RK", comments: 3, dueDate: "2026-05-11", labels: [{ name: "Backend", color: "#ef4444" }] },
  ]},
  { id: "review", name: "In Review", color: "#8b5cf6", tasks: [
    { id: "t7", title: "Auth flow refactor", description: "", priority: "high", assignee: "SM", comments: 12, dueDate: null, labels: [{ name: "Backend", color: "#ef4444" }] },
  ]},
  { id: "done", name: "Done", color: "#22c55e", tasks: [
    { id: "t8", title: "Landing page redesign", description: "", priority: "medium", assignee: "LP", comments: 6, dueDate: null, labels: [{ name: "Design", color: "#ec4899" }] },
    { id: "t9", title: "Database schema migration", description: "", priority: "high", assignee: "RK", comments: 4, dueDate: null, labels: [] },
  ]},
]

export function BoardPage() {
  const [columns, setColumns] = useState<BoardColumn[]>(initialColumns)
  const [addingTaskCol, setAddingTaskCol] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null)
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; fromCol: string } | null>(null)

  const addTask = useCallback((colId: string) => {
    if (!newTaskTitle.trim()) return
    const task: BoardTask = { id: crypto.randomUUID(), title: newTaskTitle, description: "", priority: "none", assignee: "AJ", comments: 0, dueDate: null, labels: [] }
    setColumns(cols => cols.map(c => c.id === colId ? { ...c, tasks: [...c.tasks, task] } : c))
    setNewTaskTitle(""); setAddingTaskCol(null)
  }, [newTaskTitle])

  const deleteTask = useCallback((colId: string, taskId: string) => {
    setColumns(cols => cols.map(c => c.id === colId ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } : c))
  }, [])

  const handleDragStart = (taskId: string, fromCol: string) => { setDraggedTask({ taskId, fromCol }) }
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move" }
  const handleDrop = (toCol: string) => {
    if (!draggedTask || draggedTask.fromCol === toCol) { setDraggedTask(null); return }
    setColumns(cols => {
      const fromColumn = cols.find(c => c.id === draggedTask.fromCol)
      const task = fromColumn?.tasks.find(t => t.id === draggedTask.taskId)
      if (!task) return cols
      return cols.map(c => {
        if (c.id === draggedTask.fromCol) return { ...c, tasks: c.tasks.filter(t => t.id !== draggedTask.taskId) }
        if (c.id === toCol) return { ...c, tasks: [...c.tasks, task] }
        return c
      })
    })
    setDraggedTask(null)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">T</div>
          <div><h1 className="text-lg font-semibold">TaskFlow App</h1><p className="text-xs text-muted-foreground">5 columns · {columns.reduce((a, c) => a + c.tasks.length, 0)} tasks</p></div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex gap-4 p-6 min-h-full" style={{ minWidth: "fit-content" }}>
          {columns.map((col) => (
            <div key={col.id} className="w-[300px] shrink-0 flex flex-col" onDragOver={handleDragOver} onDrop={() => handleDrop(col.id)}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <h3 className="text-sm font-semibold">{col.name}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{col.tasks.length}</span>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => setAddingTaskCol(col.id)}><Plus className="h-4 w-4" /></Button>
              </div>
              {/* Tasks */}
              <div className="flex-1 space-y-2 min-h-[100px] rounded-xl bg-muted/30 p-2">
                {col.tasks.map((task) => (
                  <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card
                      className="p-3 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
                      draggable
                      onDragStart={() => handleDragStart(task.id, col.id)}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                        <div className="flex-1 min-w-0">
                          {task.labels.length > 0 && <div className="flex gap-1 mb-2 flex-wrap">{task.labels.map(l => <div key={l.name} className="h-1.5 w-8 rounded-full" style={{ backgroundColor: l.color }} />)}</div>}
                          <p className="text-sm font-medium leading-tight">{task.title}</p>
                          <div className="flex items-center gap-3 mt-3 text-muted-foreground">
                            {task.priority !== "none" && <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", PRIORITY_COLORS[task.priority])}>{task.priority}</Badge>}
                            {task.dueDate && <span className="text-[11px] flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(task.dueDate).toLocaleDateString("en", { month: "short", day: "numeric" })}</span>}
                            {task.comments > 0 && <span className="text-[11px] flex items-center gap-1"><MessageSquare className="h-3 w-3" />{task.comments}</span>}
                            <Avatar className="h-5 w-5 ml-auto"><AvatarFallback className="text-[8px]">{task.assignee}</AvatarFallback></Avatar>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="h-3 w-3" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit3 className="h-3 w-3" />Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteTask(col.id, task.id)}><Trash2 className="h-3 w-3" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {/* Add Task Inline */}
                {addingTaskCol === col.id && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-2">
                    <Input autoFocus placeholder="Task title..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addTask(col.id); if (e.key === "Escape") setAddingTaskCol(null) }} className="mb-2 h-8 text-sm" />
                    <div className="flex gap-2"><Button size="sm" onClick={() => addTask(col.id)}>Add</Button><Button size="sm" variant="ghost" onClick={() => setAddingTaskCol(null)}>Cancel</Button></div>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/* Task Detail Modal */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{selectedTask?.title}</DialogTitle></DialogHeader>
          {selectedTask && (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-xs text-muted-foreground">Priority</Label><Badge variant="outline" className={cn(PRIORITY_COLORS[selectedTask.priority])}>{selectedTask.priority || "None"}</Badge></div>
                <div className="space-y-2"><Label className="text-xs text-muted-foreground">Assignee</Label><div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{selectedTask.assignee}</AvatarFallback></Avatar><span className="text-sm">{selectedTask.assignee}</span></div></div>
                {selectedTask.dueDate && <div className="space-y-2"><Label className="text-xs text-muted-foreground">Due Date</Label><span className="text-sm">{new Date(selectedTask.dueDate).toLocaleDateString()}</span></div>}
                {selectedTask.labels.length > 0 && <div className="space-y-2"><Label className="text-xs text-muted-foreground">Labels</Label><div className="flex gap-1">{selectedTask.labels.map(l => <Badge key={l.name} style={{ backgroundColor: l.color + "20", color: l.color, borderColor: l.color + "40" }} variant="outline" className="text-xs">{l.name}</Badge>)}</div></div>}
              </div>
              <div className="space-y-2"><Label className="text-xs text-muted-foreground">Description</Label><Textarea placeholder="Add a description..." defaultValue={selectedTask.description} className="min-h-[100px]" /></div>
              <div className="space-y-3"><Label className="text-xs text-muted-foreground">Comments ({selectedTask.comments})</Label><div className="flex gap-2"><Input placeholder="Write a comment..." className="flex-1" /><Button size="sm">Send</Button></div></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
