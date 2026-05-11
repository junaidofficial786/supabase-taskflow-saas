import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Zap, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error("Please enter your email"); return }
    setIsLoading(true)
    try {
      await authService.resetPassword(email)
      setIsSent(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email")
    } finally { setIsLoading(false) }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Zap className="h-5 w-5" /></div>
          <span className="text-xl font-bold">TaskFlow</span>
        </div>
        {isSent ? (
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-6"><Mail className="h-8 w-8 text-primary" /></div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-6">We sent a password reset link to <span className="font-medium text-foreground">{email}</span></p>
            <Link to="/login"><Button variant="outline" className="w-full"><ArrowLeft className="h-4 w-4" />Back to Sign In</Button></Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
            <p className="text-muted-foreground mb-8">Enter your email and we&apos;ll send you a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input id="forgot-email" type="email" placeholder="alex@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" isLoading={isLoading}>Send Reset Link</Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link to="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" />Back to Sign In</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
