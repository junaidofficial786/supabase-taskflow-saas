import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import { AppLayout } from "@/layouts/app-layout"
import { ProtectedRoute } from "@/routes/protected-route"
import { PageLoader } from "@/components/shared/page-loader"

// Lazy loaded pages
const LandingPage = lazy(() => import("@/features/landing/pages/landing").then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import("@/features/auth/pages/login").then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import("@/features/auth/pages/register").then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/forgot-password").then(m => ({ default: m.ForgotPasswordPage })))
const DashboardPage = lazy(() => import("@/features/dashboard/pages/dashboard").then(m => ({ default: m.DashboardPage })))
const ProjectsPage = lazy(() => import("@/features/kanban/pages/projects").then(m => ({ default: m.ProjectsPage })))
const BoardPage = lazy(() => import("@/features/kanban/pages/board").then(m => ({ default: m.BoardPage })))
const TasksPage = lazy(() => import("@/features/tasks/pages/tasks").then(m => ({ default: m.TasksPage })))
const TeamPage = lazy(() => import("@/features/team/pages/team").then(m => ({ default: m.TeamPage })))
const AnalyticsPage = lazy(() => import("@/features/analytics/pages/analytics").then(m => ({ default: m.AnalyticsPage })))
const NotificationsPage = lazy(() => import("@/features/notifications/pages/notifications").then(m => ({ default: m.NotificationsPage })))
const SettingsPage = lazy(() => import("@/features/settings/pages/settings").then(m => ({ default: m.SettingsPage })))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
  },
  {
    path: "/login",
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },
  {
    path: "/register",
    element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
  },
  {
    path: "/forgot-password",
    element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: "/projects", element: <SuspenseWrapper><ProjectsPage /></SuspenseWrapper> },
      { path: "/projects/:id/board", element: <SuspenseWrapper><BoardPage /></SuspenseWrapper> },
      { path: "/tasks", element: <SuspenseWrapper><TasksPage /></SuspenseWrapper> },
      { path: "/team", element: <SuspenseWrapper><TeamPage /></SuspenseWrapper> },
      { path: "/analytics", element: <SuspenseWrapper><AnalyticsPage /></SuspenseWrapper> },
      { path: "/notifications", element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper> },
      { path: "/settings", element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])
