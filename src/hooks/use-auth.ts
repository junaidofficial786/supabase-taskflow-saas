import { useEffect } from "react"
import { useAuthStore } from "@/store/auth.store"
import { supabase } from "@/lib/supabase"
import type { User } from "@/types"

export function useAuth() {
  const { user, session, isLoading, isAuthenticated, setUser, setSession, setLoading, reset } =
    useAuthStore()

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        console.log("Initializing auth...")
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        console.log("Initial session check complete:", !!currentSession)
        
        if (currentSession) {
          setSession(currentSession)
          
          // Fetch profile in background
          const fetchProfile = async () => {
            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", currentSession.user.id)
                .single()
              
              if (profile) {
                setUser(profile as User)
              } else {
                const meta = currentSession.user.user_metadata
                setUser({
                  id: currentSession.user.id,
                  email: currentSession.user.email ?? "",
                  full_name: (meta?.full_name as string) ?? "User",
                  avatar_url: null,
                  created_at: currentSession.user.created_at,
                  updated_at: new Date().toISOString(),
                })
              }
            } catch (err) {
              console.error("Initial profile fetch error:", err)
            }
          }
          fetchProfile()
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
      } finally {
        console.log("Setting loading to false")
        setLoading(false)
      }
    }


    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === "SIGNED_IN" && newSession) {
          setSession(newSession)
          
          // Fetch profile in background without blocking the listener
          const fetchProfile = async () => {
            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", newSession.user.id)
                .single()

              if (profile) {
                setUser(profile as User)
              } else {
                const meta = newSession.user.user_metadata
                setUser({
                  id: newSession.user.id,
                  email: newSession.user.email ?? "",
                  full_name: (meta?.full_name as string) ?? "User",
                  avatar_url: null,
                  created_at: newSession.user.created_at,
                  updated_at: new Date().toISOString(),
                })
              }
            } catch (err) {
              console.error("Background profile fetch error:", err)
            }
          }
          
          fetchProfile()
        } else if (event === "SIGNED_OUT") {
          reset()
        }
      }
    )


    return () => subscription.unsubscribe()
  }, [setUser, setSession, setLoading, reset])

  return { user, session, isLoading, isAuthenticated }
}
