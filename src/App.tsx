import { RouterProvider } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { router } from "@/routes"
import { useAuth } from "@/hooks/use-auth"

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuth()
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthInitializer>
          <RouterProvider router={router} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                borderRadius: "12px",
              },
            }}
          />
        </AuthInitializer>
      </QueryProvider>
    </ThemeProvider>
  )
}
