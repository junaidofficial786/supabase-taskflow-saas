import { usePermissions } from "@/hooks/use-permissions"
import type { MemberRole } from "@/types"

interface PermissionGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredRole?: MemberRole
}

export function PermissionGate({
  children,
  fallback = null,
  requiredRole = "member",
}: PermissionGateProps) {
  const { hasPermission } = usePermissions()

  if (!hasPermission(requiredRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
