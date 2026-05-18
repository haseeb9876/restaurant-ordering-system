import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
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
    const loggedInUser = {
      id: Date.now(),
      fullName: "Customer User",
      email: userData.email,
      role: "customer",
    }

    setUser(loggedInUser)
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
