import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"

import Navbar from "../../customer/components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import { verifyEmailOtp } from "../../../services/api"

function VerifyOtp() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVerifyOtp = async () => {
    setError("")

    if (!email) {
      const message = "Email is missing."

      setError(message)
      toast.error(message)

      return
    }

    if (!otp.trim()) {
      const message = "OTP is required."

      setError(message)
      toast.error(message)

      return
    }

    try {
      setIsSubmitting(true)

      await verifyEmailOtp({
        email,
        otp,
      })

      toast.success("Email verified successfully.")

      navigate("/login")
    } catch (error) {
      const message =
        error.message || "Failed to verify OTP."

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
              Email Verification
            </p>

            <h1 className="text-4xl font-extrabold">
              Verify OTP
            </h1>

            <p className="text-gray-400 mt-4 break-all">
              Verification code sent to:
              <br />
              <span className="text-orange-400">
                {email}
              </span>
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
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value)
              }
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 text-center tracking-[10px] text-2xl font-bold"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition"
            >
              {isSubmitting
                ? "Verifying..."
                : "Verify Email"}
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Already verified?{" "}
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

export default VerifyOtp
