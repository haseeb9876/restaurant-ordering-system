import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")

    try {
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
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

    setUser(loggedInUser)
    return loggedInUser

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
