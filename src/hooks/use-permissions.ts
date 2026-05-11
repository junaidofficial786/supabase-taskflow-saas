import { useAuthStore } from "@/store/auth.store"
import type { MemberRole } from "@/types"

export function usePermissions() {
  const { user } = useAuthStore()
  
  // In a real app, we would fetch the user's role in the current organization
  // For demo purposes, we'll assume the demo user is an 'owner'
  const role: MemberRole = user?.id === "demo-user-id" ? "owner" : "member"

  const hasPermission = (requiredRole: MemberRole) => {
    const roles: MemberRole[] = ["member", "admin", "owner"]
    return roles.indexOf(role) >= roles.indexOf(requiredRole)
  }

  const isOwner = role === "owner"
  const isAdmin = role === "admin" || role === "owner"
  const isMember = true

  return { role, hasPermission, isOwner, isAdmin, isMember }
}
