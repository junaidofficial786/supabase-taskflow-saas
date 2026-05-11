import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return }
    setIsLoading(true)
    try {
      await authService.signUp({ email, password, full_name: name })
      toast.success("Account created! Please check your email.")
      navigate("/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed")
    } finally { setIsLoading(false) }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/5">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Zap className="h-7 w-7" /></div>
              <span className="text-2xl font-bold">TaskFlow</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">Start building <span className="gradient-text">amazing products</span></h2>
            <p className="text-lg text-muted-foreground max-w-md">Join thousands of teams using TaskFlow to ship faster and collaborate better.</p>
          </motion.div>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Zap className="h-5 w-5" /></div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Get started with TaskFlow in seconds</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Full Name</Label>
              <Input id="reg-name" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input id="reg-email" type="email" placeholder="alex@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="button" variant="ghost" size="icon-sm" className="absolute right-1 top-1" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {password && <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full transition-all duration-300 rounded-full ${password.length >= 8 ? "w-full bg-emerald-500" : password.length >= 6 ? "w-2/3 bg-amber-500" : "w-1/3 bg-red-500"}`} /></div>}
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>Create Account <ArrowRight className="h-4 w-4" /></Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}<Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
