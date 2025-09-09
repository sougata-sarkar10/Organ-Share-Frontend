"use client"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children, requiredUserType = null }) {
  const { isAuthenticated, userType, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }

      if (requiredUserType && userType !== requiredUserType) {
        // Redirect to appropriate dashboard if wrong user type
        if (userType === "donor") {
          router.push("/donor/dashboard")
        } else if (userType === "receiver") {
          router.push("/receiver/dashboard")
        }
      }
    }
  }, [isAuthenticated, userType, loading, requiredUserType, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredUserType && userType !== requiredUserType) {
    return null
  }

  return children
}
