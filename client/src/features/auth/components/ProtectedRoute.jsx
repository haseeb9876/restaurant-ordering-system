import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children, allowedRoles }) {
  const { user, authLoading } = useAuth()
  const location = useLocation()

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

  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${location.pathname}`}
        replace
      />
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
