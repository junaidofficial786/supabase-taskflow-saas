import { useState } from "react"
import { motion } from "framer-motion"
import { User, Lock, Palette, Building2, Camera } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTheme } from "@/providers/theme-provider"
import { useAuthStore } from "@/store/auth.store"
import { toast } from "sonner"

export function SettingsPage() {
  const { user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState(user?.full_name ?? "")
  const [email] = useState(user?.email ?? "")

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground mt-1">Manage your account and preferences</p></div>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList><TabsTrigger value="profile"><User className="h-4 w-4 mr-1.5" />Profile</TabsTrigger><TabsTrigger value="security"><Lock className="h-4 w-4 mr-1.5" />Security</TabsTrigger><TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-1.5" />Appearance</TabsTrigger><TabsTrigger value="organization"><Building2 className="h-4 w-4 mr-1.5" />Organization</TabsTrigger></TabsList>
        <TabsContent value="profile"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card><CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal information</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group"><Avatar className="h-20 w-20"><AvatarFallback className="text-xl">{name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera className="h-5 w-5 text-white" /></div>
                </div>
                <div><p className="font-medium">{name}</p><p className="text-sm text-muted-foreground">{email}</p></div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={email} disabled /></div>
              </div>
              <Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
            </CardContent></Card>
        </motion.div></TabsContent>
        <TabsContent value="security"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card><CardHeader><CardTitle>Password</CardTitle><CardDescription>Change your password</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" placeholder="••••••••" /></div>
              <Button onClick={() => toast.success("Password updated!")}>Update Password</Button>
            </CardContent></Card>
        </motion.div></TabsContent>
        <TabsContent value="appearance"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card><CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Customize the look and feel</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button key={t} onClick={() => setTheme(t)} className={`p-4 rounded-xl border-2 transition-all text-center capitalize ${theme === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <div className={`h-8 w-8 rounded-lg mx-auto mb-2 ${t === "dark" ? "bg-zinc-800" : t === "light" ? "bg-white border border-border" : "bg-gradient-to-br from-white to-zinc-800"}`} />
                      <span className="text-sm font-medium">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between"><div><p className="font-medium">Compact Mode</p><p className="text-sm text-muted-foreground">Reduce spacing in the UI</p></div><Switch /></div>
              <div className="flex items-center justify-between"><div><p className="font-medium">Animations</p><p className="text-sm text-muted-foreground">Enable motion and transitions</p></div><Switch defaultChecked /></div>
            </CardContent></Card>
        </motion.div></TabsContent>
        <TabsContent value="organization"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card><CardHeader><CardTitle>Organization</CardTitle><CardDescription>Manage your workspace settings</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Organization Name</Label><Input defaultValue="Acme Inc" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input defaultValue="acme-inc" /></div>
              <Button onClick={() => toast.success("Organization updated!")}>Save Changes</Button>
            </CardContent></Card>
        </motion.div></TabsContent>
      </Tabs>
    </div>
  )
}
