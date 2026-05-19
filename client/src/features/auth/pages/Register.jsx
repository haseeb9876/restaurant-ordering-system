import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import Navbar from "../../../components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import { useAuth } from "../context/AuthContext"


function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const redirectPath = searchParams.get("redirect") || "/"

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRegister = () => {
    setError("")

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill all fields.")
      return
    }

    register(formData)
    navigate(redirectPath)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-md mx-auto bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
          <div className="text-center mb-8">
            <p className="text-orange-500 font-semibold mb-3">
              Join FoodieHub
            </p>

            <h1 className="text-4xl font-extrabold">Create Account</h1>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form className="space-y-5">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
            />

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
              onClick={handleRegister}
              className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-xl font-bold transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${redirectPath}`}
              className="text-orange-500 hover:text-orange-400"
            >
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Register
