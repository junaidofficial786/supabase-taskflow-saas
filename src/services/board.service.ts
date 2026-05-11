import { supabase } from "@/lib/supabase"
import type { Column, Task, Project } from "@/types"

export const boardService = {
  // ===== Projects =====
  async getProjects(orgId: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as Project[]
  },

  async getProject(projectId: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()
    if (error) throw error
    return data as Project
  },

  async createProject(project: Partial<Project>) {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single()
    if (error) throw error
    return data as Project
  },

  // ===== Columns =====
  async getColumns(projectId: string) {
    const { data, error } = await supabase
      .from("columns")
      .select(`*, tasks(*, assignee:profiles!tasks_assignee_id_fkey(*))`)
      .eq("project_id", projectId)
      .order("position")
      .order("position", { referencedTable: "tasks" })
    if (error) throw error
    return data as (Column & { tasks: Task[] })[]
  },

  async createColumn(column: Partial<Column>) {
    const { data, error } = await supabase
      .from("columns")
      .insert(column)
      .select()
      .single()
    if (error) throw error
    return data as Column
  },

  async updateColumn(id: string, updates: Partial<Column>) {
    const { data, error } = await supabase
      .from("columns")
      .update(updates)
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return data as Column
  },

  async deleteColumn(id: string) {
    const { error } = await supabase.from("columns").delete().eq("id", id)
    if (error) throw error
  },

  // ===== Tasks =====
  async createTask(task: Partial<Task>) {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select(`*, assignee:profiles!tasks_assignee_id_fkey(*)`)
      .single()
    if (error) throw error
    return data as Task
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select(`*, assignee:profiles!tasks_assignee_id_fkey(*)`)
      .single()
    if (error) throw error
    return data as Task
  },

  async deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (error) throw error
  },

  async moveTask(taskId: string, newColumnId: string, newPosition: number) {
    const { data, error } = await supabase
      .from("tasks")
      .update({ column_id: newColumnId, position: newPosition })
      .eq("id", taskId)
      .select()
      .single()
    if (error) throw error
    return data as Task
  },

  async reorderTasks(tasks: { id: string; position: number; column_id: string }[]) {
    const promises = tasks.map((t) =>
      supabase
        .from("tasks")
        .update({ position: t.position, column_id: t.column_id })
        .eq("id", t.id)
    )
    await Promise.all(promises)
  },

  // ===== Comments =====
  async getComments(taskId: string) {
    const { data, error } = await supabase
      .from("task_comments")
      .select(`*, user:profiles(*)`)
      .eq("task_id", taskId)
      .order("created_at", { ascending: true })
    if (error) throw error
    return data
  },

  async addComment(taskId: string, userId: string, content: string) {
    const { data, error } = await supabase
      .from("task_comments")
      .insert({ task_id: taskId, user_id: userId, content })
      .select(`*, user:profiles(*)`)
      .single()
    if (error) throw error
    return data
  },

  // ===== Activities =====
  async getActivities(taskId: string) {
    const { data, error } = await supabase
      .from("task_activities")
      .select(`*, user:profiles(*)`)
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })
      .limit(50)
    if (error) throw error
    return data
  },

  async addActivity(taskId: string, userId: string, action: string, metadata: Record<string, unknown> = {}) {
    const { error } = await supabase
      .from("task_activities")
      .insert({ task_id: taskId, user_id: userId, action, metadata })
    if (error) throw error
  },
}
