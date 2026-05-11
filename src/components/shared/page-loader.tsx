import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageLoaderProps {
  className?: string
  text?: string
}

export function PageLoader({ className, text = "Loading..." }: PageLoaderProps) {
  return (
    <div className={cn("flex h-full min-h-[400px] items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
