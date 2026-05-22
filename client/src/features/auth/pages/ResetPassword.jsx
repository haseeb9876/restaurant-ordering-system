import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"

import Navbar from "../../customer/components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import { resetPassword } from "../../../services/api"

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const email = searchParams.get("email") || ""

  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleResetPassword = async () => {
    setError("")

    if (!email || !formData.otp || !formData.newPassword || !formData.confirmPassword) {
      const message = "Please fill all fields."
      setError(message)
      toast.error(message)
      return
    }

    if (formData.newPassword.length < 6) {
      const message = "Password must be at least 6 characters long."
      setError(message)
      toast.error(message)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      const message = "Passwords do not match."
      setError(message)
      toast.error(message)
      return
    }

    try {
      setIsSubmitting(true)

      await resetPassword({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      })

      toast.success("Password reset successfully.")
      navigate("/login")
    } catch (error) {
      const message = error.message || "Failed to reset password."
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
              Reset Password
            </p>

            <h1 className="text-4xl font-extrabold">
              Create New Password
            </h1>

            <p className="text-gray-400 mt-4 break-all">
              Reset OTP sent to:
              <br />
              <span className="text-orange-400">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 text-center tracking-[10px] text-2xl font-bold"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
            />

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-orange-500 hover:text-orange-400">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default ResetPassword
