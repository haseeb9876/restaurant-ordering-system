import { createContext, useContext, useEffect, useState } from "react"
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../../../services/api"

const AuthContext = createContext()

const VALID_ROLES = ["CUSTOMER", "ADMIN", "STAFF"]

function validateUser(user) {
  if (!user) {
    return null
  }

  if (
    typeof user !== "object" ||
    !user.email ||
    !user.fullName ||
    !VALID_ROLES.includes(user.role)
  ) {
    return null
  }

  return user
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")

    try {
      const parsedUser = savedUser ? JSON.parse(savedUser) : null
      return validateUser(parsedUser)
    } catch {
      return null
    }
  })

  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        localStorage.removeItem("user")
        setUser(null)
        setAuthLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        const validUser = validateUser(currentUser)

        if (validUser) {
          localStorage.setItem("user", JSON.stringify(validUser))
          setUser(validUser)
        } else {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
        }
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    restoreUser()
  }, [])

  const register = async (userData) => {
    return registerUser(userData)
  }

  const login = async (userData) => {
    const authData = await loginUser(userData)
    const validUser = validateUser(authData.user)

    if (!validUser) {
      throw new Error("Invalid user data received from server.")
    }

    localStorage.setItem("token", authData.token)
    localStorage.setItem("user", JSON.stringify(validUser))
    setUser(validUser)

    return validUser
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
