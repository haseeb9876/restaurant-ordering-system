import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import Navbar from "../../customer/components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import { forgotPassword } from "../../../services/api"

function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleForgotPassword = async () => {
    setError("")

    if (!email.trim()) {
      const message = "Email is required."

      setError(message)
      toast.error(message)

      return
    }

    try {
      setIsSubmitting(true)

      await forgotPassword({
        email,
      })

      toast.success(
        "If an account exists, a reset OTP has been sent."
      )

      navigate(
        `/reset-password?email=${encodeURIComponent(
          email
        )}`
      )
    } catch (error) {
      const message =
        error.message ||
        "Failed to process forgot password request."

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
              Password Recovery
            </p>

            <h1 className="text-4xl font-extrabold">
              Forgot Password
            </h1>

            <p className="text-gray-400 mt-4">
              Enter your email address to receive a password reset OTP.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
            />

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition"
            >
              {isSubmitting
                ? "Sending OTP..."
                : "Send Reset OTP"}
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
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

export default ForgotPassword
