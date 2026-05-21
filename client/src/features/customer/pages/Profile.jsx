import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Navbar from "../components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import { useAuth } from "../../auth/context/AuthContext"
import { getMyOrders } from "../../../services/api"

const trackingSteps = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
]

function getStatusClass(status) {
  if (status === "PENDING") return "bg-yellow-500/20 text-yellow-400"
  if (status === "CONFIRMED") return "bg-cyan-500/20 text-cyan-400"
  if (status === "PREPARING") return "bg-blue-500/20 text-blue-400"
  if (status === "READY") return "bg-green-500/20 text-green-400"
  if (status === "OUT_FOR_DELIVERY") return "bg-purple-500/20 text-purple-400"
  if (status === "DELIVERED") return "bg-emerald-500/20 text-emerald-400"
  if (status === "COMPLETED") return "bg-orange-500/20 text-orange-400"
  if (status === "CANCELLED") return "bg-red-500/20 text-red-400"

  return "bg-white/10 text-gray-300"
}

function getPaymentStatusClass(status) {
  if (status === "PAID") return "bg-green-500/20 text-green-400"
  if (status === "FAILED") return "bg-red-500/20 text-red-400"
  if (status === "PENDING") return "bg-yellow-500/20 text-yellow-400"

  return "bg-white/10 text-gray-300"
}

function formatPaymentMethod(method) {
  if (method === "CASH_ON_DELIVERY") return "Cash on Delivery"
  if (method === "JAZZCASH") return "JazzCash"
  if (method === "EASYPAISA") return "Easypaisa"
  if (method === "BANK_TRANSFER") return "Bank Transfer"

  return method || "Not selected"
}

function getStepLabel(status) {
  if (status === "PENDING") return "Order Placed"
  if (status === "CONFIRMED") return "Confirmed"
  if (status === "PREPARING") return "Preparing"
  if (status === "READY") return "Ready"
  if (status === "OUT_FOR_DELIVERY") return "Out for Delivery"
  if (status === "DELIVERED") return "Delivered"
  if (status === "COMPLETED") return "Completed"

  return status.replaceAll("_", " ")
}

function getTrackingStatus(status) {
  if (status === "COMPLETED") {
    return "DELIVERED"
  }

  return status
}

function PaymentDetails({ order }) {
  return (
    <div className="bg-black border border-white/10 rounded-2xl p-5">
      <h3 className="font-bold mb-4">Payment Details</h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Payment Method</p>
          <p className="font-bold mt-2">
            {formatPaymentMethod(order.paymentMethod)}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Payment Status</p>
          <p
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${getPaymentStatusClass(
              order.paymentStatus
            )}`}
          >
            {order.paymentStatus || "PENDING"}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Transaction ID</p>
          <p className="font-bold mt-2 break-words">
            {order.transactionId || "Not provided"}
          </p>
        </div>
      </div>

      {order.paymentMethod !== "CASH_ON_DELIVERY" && (
        <p className="text-gray-400 text-sm mt-4">
          Your payment will be verified by the restaurant admin. If payment is
          already sent, please keep your transaction ID safe.
        </p>
      )}
    </div>
  )
}

function OrderTimeline({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
        <p className="text-red-400 font-bold">
          This order has been cancelled.
        </p>
      </div>
    )
  }

  const normalizedStatus = getTrackingStatus(status)
  const currentStepIndex = trackingSteps.indexOf(normalizedStatus)

  return (
    <div className="bg-black border border-white/10 rounded-2xl p-5">
      <h3 className="font-bold mb-5">Order Tracking</h3>

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
        {trackingSteps.map((step, index) => {
          const isActive = index <= currentStepIndex

          return (
            <div
              key={step}
              className={`rounded-2xl p-4 border transition ${
                isActive
                  ? "bg-orange-500/10 border-orange-500/40"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mb-3 ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                {index + 1}
              </div>

              <p
                className={`font-bold ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {getStepLabel(step)}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {isActive ? "Updated" : "Waiting"}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState("")

  const latestOrder = orders[0]

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user) {
        setLoadingOrders(false)
        return
      }

      try {
        setError("")

        const data = await getMyOrders()
        setOrders(data)
      } catch (error) {
        const message = error.message || "Failed to load your orders."
        setError(message)
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchMyOrders()

    const interval = setInterval(() => {
      fetchMyOrders()
    }, 5000)

    return () => clearInterval(interval)
  }, [user])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully.")
    navigate("/")
  }

  if (!user) {
    navigate("/login?redirect=/profile")
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Customer Account
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              My Profile
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 h-fit">
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl font-extrabold mb-6">
                {user.fullName.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-2xl font-bold">{user.fullName}</h2>

              <p className="text-gray-400 mt-2">{user.email}</p>

              <p className="inline-block mt-4 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-bold">
                {user.role}
              </p>

              <div className="mt-8 bg-black border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Total Orders</p>

                <p className="text-3xl font-extrabold text-orange-500 mt-2">
                  {orders.length}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-full font-bold transition"
              >
                Logout
              </button>
            </div>

            <div className="lg:col-span-2 space-y-8">
              {loadingOrders && (
                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                  <p className="text-gray-400">Loading your orders...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {!loadingOrders && (
                <>
                  <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Latest Order
                    </h2>

                    {latestOrder ? (
                      <div className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="bg-black border border-white/10 rounded-2xl p-5">
                            <p className="text-gray-400 text-sm">Order ID</p>

                            <p className="text-orange-500 font-bold mt-2">
                              {latestOrder.orderNumber}
                            </p>
                          </div>

                          <div className="bg-black border border-white/10 rounded-2xl p-5">
                            <p className="text-gray-400 text-sm">Status</p>

                            <p
                              className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${getStatusClass(
                                latestOrder.status
                              )}`}
                            >
                              {getStepLabel(latestOrder.status)}
                            </p>
                          </div>

                          <div className="bg-black border border-white/10 rounded-2xl p-5">
                            <p className="text-gray-400 text-sm">Total</p>

                            <p className="font-bold mt-2">
                              Rs. {latestOrder.total}
                            </p>
                          </div>

                          <div className="bg-black border border-white/10 rounded-2xl p-5">
                            <p className="text-gray-400 text-sm">
                              Created At
                            </p>

                            <p className="font-bold mt-2">
                              {new Date(latestOrder.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <PaymentDetails order={latestOrder} />

                        <OrderTimeline status={latestOrder.status} />

                        <div className="bg-black border border-white/10 rounded-2xl p-5">
                          <h3 className="font-bold mb-4">Items</h3>

                          <div className="space-y-3">
                            {latestOrder.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between gap-4 text-gray-300"
                              >
                                <span>
                                  {item.product.name} × {item.quantity}
                                </span>

                                <span>
                                  Rs. {item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-black border border-white/10 rounded-2xl p-8 text-center">
                        <p className="text-gray-400 mb-6">
                          You have no recent orders yet.
                        </p>

                        <Link
                          to="/"
                          className="inline-block bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition"
                        >
                          Start Ordering
                        </Link>
                      </div>
                    )}
                  </section>

                  <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Order History
                    </h2>

                    {orders.length === 0 ? (
                      <div className="bg-black border border-white/10 rounded-2xl p-8 text-center">
                        <p className="text-gray-400">
                          Your order history will appear here after placing
                          orders.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-black border border-white/10 rounded-2xl p-5"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                              <div>
                                <p className="text-orange-500 font-bold">
                                  {order.orderNumber}
                                </p>

                                <p className="text-gray-400 text-sm mt-1">
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>

                                <p className="text-gray-400 text-sm mt-2">
                                  {formatPaymentMethod(order.paymentMethod)} •{" "}
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${getPaymentStatusClass(
                                      order.paymentStatus
                                    )}`}
                                  >
                                    {order.paymentStatus || "PENDING"}
                                  </span>
                                </p>

                                {order.transactionId && (
                                  <p className="text-gray-500 text-sm mt-2 break-words">
                                    Transaction ID: {order.transactionId}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusClass(
                                    order.status
                                  )}`}
                                >
                                  {getStepLabel(order.status)}
                                </span>

                                <span className="font-bold">
                                  Rs. {order.total}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between gap-4 text-gray-300 text-sm"
                                >
                                  <span>
                                    {item.product.name} × {item.quantity}
                                  </span>

                                  <span>
                                    Rs. {item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
