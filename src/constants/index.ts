export const APP_NAME = "TaskFlow"
export const APP_DESCRIPTION = "Modern task management for teams"

export const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-red-500/15 text-red-400 border-red-500/20",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  low: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  none: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
}

export const PRIORITY_LABELS: Record<string, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "No Priority",
}

export const LABEL_COLORS = [
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Yellow", color: "#eab308" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Purple", color: "#a855f7" },
  { name: "Pink", color: "#ec4899" },
  { name: "Teal", color: "#14b8a6" },
]

export const PROJECT_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
  "#3b82f6", "#6366f1",
]

export const DEFAULT_COLUMNS = [
  { name: "Backlog", color: "#6b7280" },
  { name: "Todo", color: "#3b82f6" },
  { name: "In Progress", color: "#f59e0b" },
  { name: "In Review", color: "#8b5cf6" },
  { name: "Done", color: "#22c55e" },
]

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  PROJECT: "/projects/:id",
  BOARD: "/projects/:id/board",
  TASKS: "/tasks",
  TEAM: "/team",
  ANALYTICS: "/analytics",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
} as const
