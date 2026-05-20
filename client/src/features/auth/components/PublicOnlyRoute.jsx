import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PublicOnlyRoute({ children }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-400 font-semibold">
            Checking secure session...
          </p>
        </div>
      </div>
    )
  }

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />
    }

    if (user.role === "STAFF") {
      return <Navigate to="/kitchen" replace />
    }

    return <Navigate to="/" replace />
  }

  return children
}

export default PublicOnlyRoute
