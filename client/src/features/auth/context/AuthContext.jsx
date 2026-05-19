import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

const VALID_ROLES = ["customer", "admin", "staff"]

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

  useEffect(() => {
    const validUser = validateUser(user)

    if (validUser) {
      localStorage.setItem("user", JSON.stringify(validUser))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const register = (userData) => {
    const newUser = {
      id: Date.now(),
      fullName: userData.fullName,
      email: userData.email,
      role: "customer",
    }

    setUser(newUser)
  }

  const login = (userData) => {
    let role = "customer"
    let fullName = "Customer User"

    if (userData.email === "admin@foodiehub.com") {
      role = "admin"
      fullName = "Admin User"
    }

    if (userData.email === "staff@foodiehub.com") {
      role = "staff"
      fullName = "Kitchen Staff"
    }

    const loggedInUser = {
      id: Date.now(),
      fullName,
      email: userData.email,
      role,
    }

    const validUser = validateUser(loggedInUser)

    setUser(validUser)

    return validUser
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
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
