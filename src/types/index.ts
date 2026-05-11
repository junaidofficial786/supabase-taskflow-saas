/* ===== Core Entity Types ===== */

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export type MemberRole = "owner" | "admin" | "member"

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: MemberRole
  created_at: string
  user?: User
  organization?: Organization
}

export interface Project {
  id: string
  organization_id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  created_at: string
  updated_at: string
}

export interface Column {
  id: string
  project_id: string
  name: string
  position: number
  color: string | null
  created_at: string
  tasks?: Task[]
}

export type TaskPriority = "urgent" | "high" | "medium" | "low" | "none"
export type TaskLabel = {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  column_id: string
  project_id: string
  title: string
  description: string | null
  priority: TaskPriority
  position: number
  due_date: string | null
  assignee_id: string | null
  creator_id: string
  labels: TaskLabel[]
  created_at: string
  updated_at: string
  assignee?: User
  creator?: User
  comment_count?: number
  attachment_count?: number
}

export interface TaskComment {
  id: string
  task_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: User
}

export interface TaskActivity {
  id: string
  task_id: string
  user_id: string
  action: string
  metadata: Record<string, unknown>
  created_at: string
  user?: User
}

export type NotificationType =
  | "task_assigned"
  | "task_commented"
  | "task_updated"
  | "task_due"
  | "member_added"
  | "project_created"

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data: Record<string, unknown>
  created_at: string
}

/* ===== Auth Types ===== */

export interface AuthState {
  user: User | null
  session: import("@supabase/supabase-js").Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  full_name: string
}

/* ===== UI Types ===== */

export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export interface BreadcrumbItem {
  title: string
  href?: string
}

export type Theme = "light" | "dark" | "system"

/* ===== Analytics Types ===== */

export interface AnalyticsStats {
  total_tasks: number
  completed_tasks: number
  pending_tasks: number
  overdue_tasks: number
  completion_rate: number
}

export interface ProductivityData {
  date: string
  completed: number
  created: number
}

export interface TeamActivity {
  user_id: string
  user_name: string
  avatar_url: string | null
  tasks_completed: number
  comments_made: number
}
