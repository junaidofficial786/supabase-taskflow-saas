import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error("Please fill in all fields"); return }
    setIsLoading(true)
    try {
      console.log("Starting sign in with email:", email)
      
      // Using supabase client directly to rule out service layer issues
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Supabase sign in error:", error)
        throw error
      }

      console.log("Supabase response received:", !!data.session)
      
      setIsLoading(false)
      
      if (data.session) {
        useAuthStore.getState().setSession(data.session)
        if (data.user) {
          useAuthStore.getState().setUser({
            id: data.user.id,
            email: data.user.email ?? "",
            full_name: (data.user.user_metadata?.full_name as string) ?? "User",
            avatar_url: null,
            created_at: data.user.created_at,
            updated_at: new Date().toISOString(),
          })
        }
      }
      
      toast.success("Welcome back!")
      console.log("Navigating...")
      navigate("/dashboard", { replace: true })
    } catch (err) {
      console.error("Login component error:", err)
      setIsLoading(false)
      toast.error(err instanceof Error ? err.message : "Invalid credentials")
    }
  }



  const handleDemoLogin = () => {
    useAuthStore.getState().setUser({
      id: "demo-user-id", email: "demo@taskflow.app", full_name: "Alex Johnson",
      avatar_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    })
    useAuthStore.getState().setSession({ user: { id: "demo-user-id" } } as never)
    useAuthStore.getState().setLoading(false)
    toast.success("Welcome to the demo!")
    navigate("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/5">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Zap className="h-7 w-7" />
              </div>
              <span className="text-2xl font-bold">TaskFlow</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Manage tasks with <span className="gradient-text">clarity and speed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              The modern project management platform built for teams that ship fast.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-12 space-y-3">
            {[
              { title: "Design System Updates", status: "In Progress", color: "bg-amber-500" },
              { title: "API Integration", status: "In Review", color: "bg-purple-500" },
              { title: "Landing Page v2", status: "Done", color: "bg-emerald-500" },
            ].map((task, i) => (
              <motion.div key={task.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }} className="glass rounded-xl p-4 max-w-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{task.title}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${task.color}`} />
                    <span className="text-xs text-muted-foreground">{task.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      {/* Right - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[400px]">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Zap className="h-5 w-5" /></div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="alex@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="button" variant="ghost" size="icon-sm" className="absolute right-1 top-1" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>Sign In <ArrowRight className="h-4 w-4" /></Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleDemoLogin}><Zap className="h-4 w-4" />Try Demo (No Account Needed)</Button>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}<Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
