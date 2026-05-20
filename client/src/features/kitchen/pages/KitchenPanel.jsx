import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { getOrders, updateOrderStatus } from "../../../services/api"
import { useAuth } from "../../auth/context/AuthContext"

function KitchenPanel() {
  const { user, logout } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  const fetchOrders = async () => {
    try {
      const data = await getOrders()

      const kitchenOrders = data.filter(
        (order) =>
          order.status === "PENDING" ||
          order.status === "PREPARING" ||
          order.status === "READY"
      )

      setOrders(kitchenOrders)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()

    const interval = setInterval(() => {
      fetchOrders()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully.")
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId)
      setError("")

      await updateOrderStatus(orderId, status)

      toast.success(`Order marked as ${status.toLowerCase()}.`)
      fetchOrders()
    } catch (error) {
      const message = error.message || "Failed to update order status."
      setError(message)
      toast.error(message)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link to="/" className="text-2xl font-bold text-orange-500">
            Foodie<span className="text-white">Hub</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
              >
                Admin Panel
              </Link>
            )}

            <Link
              to="/"
              className="border border-white/10 hover:border-orange-500 px-5 py-2 rounded-full font-semibold transition"
            >
              Customer Website
            </Link>

            {user && (
              <span className="text-sm text-gray-300">
                Hi,{" "}
                <span className="text-orange-500 font-bold">
                  {user.fullName}
                </span>
              </span>
            )}

            <button
              onClick={handleLogout}
              className="border border-white/10 hover:border-red-500 hover:text-red-400 px-5 py-2 rounded-full font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Restaurant Kitchen
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Live Orders Queue
            </h1>
          </div>

          {loading && (
            <p className="text-gray-400">
              Loading kitchen orders...
            </p>
          )}

          {error && (
            <p className="text-red-400 mb-6">
              {error}
            </p>
          )}

          {!loading && orders.length === 0 && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-10 text-center">
              <p className="text-gray-400 text-xl">
                No active kitchen orders.
              </p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-orange-500">
                        {order.orderNumber}
                      </h2>

                      <p className="text-gray-400 mt-1">
                        {order.customerName}
                      </p>
                    </div>

                    <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between bg-black border border-white/10 rounded-xl p-4"
                      >
                        <span className="font-semibold">
                          {item.product.name}
                        </span>

                        <span className="text-orange-500 font-bold">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        handleStatusChange(order.id, "PREPARING")
                      }
                      disabled={updatingOrderId === order.id}
                      className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-black px-4 py-2 rounded-full font-bold transition"
                    >
                      Preparing
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(order.id, "READY")
                      }
                      disabled={updatingOrderId === order.id}
                      className="bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-black px-4 py-2 rounded-full font-bold transition"
                    >
                      Ready
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(order.id, "COMPLETED")
                      }
                      disabled={updatingOrderId === order.id}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 rounded-full font-bold transition"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default KitchenPanel
