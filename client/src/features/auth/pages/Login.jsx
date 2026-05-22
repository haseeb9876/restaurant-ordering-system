import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"

import Navbar from "../../customer/components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import { useAuth } from "../context/AuthContext"
import { validateLoginForm } from "../../../utils/validation"

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const redirectPath = searchParams.get("redirect")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleLogin = async () => {
    setError("")

    const validation = validateLoginForm(formData)

    if (!validation.isValid) {
      setError(validation.message)
      toast.error(validation.message)
      return
    }

    try {
      setIsSubmitting(true)

      const loggedInUser = await login(validation.data)

      toast.success("Login successful.")

      if (redirectPath) {
        navigate(redirectPath)
        return
      }

      if (loggedInUser.role === "ADMIN") {
        navigate("/admin")
        return
      }

      if (loggedInUser.role === "STAFF") {
        navigate("/kitchen")
        return
      }

      navigate("/")
    } catch (error) {
      const message = error.message || "Login failed. Please try again."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-md mx-auto bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
          <div className="text-center mb-8">
            <p className="text-orange-500 font-semibold mb-3">
              Welcome Back
            </p>

            <h1 className="text-4xl font-extrabold">Login</h1>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
            />

            <button
              type="button"
              onClick={handleLogin}
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-400"
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-400"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login
