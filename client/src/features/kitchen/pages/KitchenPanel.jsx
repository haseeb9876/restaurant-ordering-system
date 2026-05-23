import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import {
  getOrders,
  getPublicSettings,
  updateOrderStatus,
} from "../../../services/api"
import { useAuth } from "../../auth/context/AuthContext"

const activeKitchenStatuses = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
]

function getStatusClass(status) {
  if (status === "PENDING") {
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  }

  if (status === "CONFIRMED") {
    return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  }

  if (status === "PREPARING") {
    return "bg-blue-500/20 text-blue-400 border-blue-500/30"
  }

  if (status === "READY") {
    return "bg-green-500/20 text-green-400 border-green-500/30"
  }

  return "bg-white/10 text-gray-300 border-white/10"
}

function formatOrderStatus(status) {
  return status.replaceAll("_", " ")
}

function getOrderAge(createdAt) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
  )

  if (minutes < 1) return "Just now"
  if (minutes === 1) return "1 min ago"

  return `${minutes} mins ago`
}

function playNewOrderSound() {
  try {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 880
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.25, audioContext.currentTime + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch {
    // Browser may block sound until first user interaction.
  }
}

function KitchenPanel() {
  const { user, logout } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [settings, setSettings] = useState(null)
  const [newOrderIds, setNewOrderIds] = useState([])
  const knownOrderIdsRef = useRef(new Set())
  const firstLoadRef = useRef(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings()
        setSettings(data)
      } catch (error) {
        console.error("Failed to load restaurant settings:", error.message)
      }
    }

    fetchSettings()
  }, [])

  const restaurantName = settings?.restaurantName || "Restaurant"
  const logoUrl = settings?.logoUrl || ""

  const fetchOrders = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true)
      }

      setError("")

      const result = await getOrders({
        range: "TODAY",
        status: "ALL",
        paymentStatus: "ALL",
        paymentMethod: "ALL",
        search: "",
        page: 1,
        limit: 100,
      })

      const allOrders = result.data || []

      const kitchenOrders = allOrders.filter((order) =>
        activeKitchenStatuses.includes(order.status)
      )

      const incomingOrderIds = kitchenOrders.map((order) => order.id)
      const newIds = incomingOrderIds.filter(
        (id) => !knownOrderIdsRef.current.has(id)
      )

      if (!firstLoadRef.current && newIds.length > 0) {
        setNewOrderIds(newIds)
        playNewOrderSound()
        toast.success(`${newIds.length} new kitchen order received!`)

        setTimeout(() => {
          setNewOrderIds([])
        }, 10000)
      }

      knownOrderIdsRef.current = new Set(incomingOrderIds)
      firstLoadRef.current = false

      setOrders(kitchenOrders)
    } catch (error) {
      const message = error.message || "Failed to load kitchen orders."
      setError(message)

      if (!silent) {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()

    const interval = setInterval(() => {
      fetchOrders({ silent: true })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const analytics = useMemo(() => {
    return {
      pending: orders.filter((order) => order.status === "PENDING").length,

      confirmed: orders.filter((order) => order.status === "CONFIRMED").length,

      preparing: orders.filter((order) => order.status === "PREPARING").length,

      ready: orders.filter((order) => order.status === "READY").length,

      totalItems: orders.reduce((total, order) => {
        return (
          total +
          order.items.reduce(
            (itemTotal, item) => itemTotal + item.quantity,
            0
          )
        )
      }, 0),
    }
  }, [orders])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully.")
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId)
      setError("")

      await updateOrderStatus(orderId, status)

      toast.success(
        `Order marked as ${formatOrderStatus(status).toLowerCase()}.`
      )

      await fetchOrders({ silent: true })
    } catch (error) {
      const message = error.message || "Failed to update order status."

      setError(message)
      toast.error(message)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const renderBrand = () => (
    <div className="flex items-center gap-4">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={restaurantName}
          className="h-14 w-14 rounded-2xl object-cover border border-white/10"
        />
      )}

      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 leading-tight">
          {restaurantName}
        </h1>

        <p className="text-gray-400 mt-1 text-sm md:text-base">
          Kitchen Operations Panel
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <Link to="/">{renderBrand()}</Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-5 md:px-6 py-3 rounded-2xl font-bold transition text-sm md:text-base"
              >
                Admin Panel
              </Link>
            )}

            <Link
              to="/"
              className="border border-white/10 hover:border-orange-500 px-5 md:px-6 py-3 rounded-2xl font-bold transition text-sm md:text-base"
            >
              Customer Website
            </Link>

            <button
              onClick={handleLogout}
              className="border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-5 md:px-6 py-3 rounded-2xl font-bold transition text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3 text-lg">
              Restaurant Kitchen
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Live Orders Queue
            </h1>

            <p className="text-gray-400 mt-4 text-lg max-w-3xl">
              Confirm new orders, prepare food, and mark orders ready for
              delivery in real time. The queue refreshes automatically every 5
              seconds and alerts staff when new orders arrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-10">
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <p className="text-gray-400 mb-3">Pending Orders</p>
              <h2 className="text-5xl font-extrabold text-yellow-400">
                {analytics.pending}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <p className="text-gray-400 mb-3">Confirmed Orders</p>
              <h2 className="text-5xl font-extrabold text-cyan-400">
                {analytics.confirmed}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <p className="text-gray-400 mb-3">Preparing Orders</p>
              <h2 className="text-5xl font-extrabold text-blue-400">
                {analytics.preparing}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <p className="text-gray-400 mb-3">Ready Orders</p>
              <h2 className="text-5xl font-extrabold text-green-400">
                {analytics.ready}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <p className="text-gray-400 mb-3">Total Items</p>
              <h2 className="text-5xl font-extrabold text-orange-500">
                {analytics.totalItems}
              </h2>
            </div>
          </div>

          {loading && (
            <p className="text-gray-400 text-lg">Loading kitchen orders...</p>
          )}

          {error && <p className="text-red-400 mb-6 text-lg">{error}</p>}

          {!loading && orders.length === 0 && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-12 text-center">
              <p className="text-gray-400 text-2xl">
                No active kitchen orders.
              </p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="grid xl:grid-cols-2 gap-8">
              {orders.map((order) => {
                const isNewOrder = newOrderIds.includes(order.id)
                const isUrgent =
                  order.status === "PENDING" &&
                  Date.now() - new Date(order.createdAt).getTime() > 10 * 60 * 1000

                return (
                <div
                  key={order.id}
                  className={`bg-zinc-950 rounded-[2.5rem] p-7 md:p-8 transition ${
                    isNewOrder
                      ? "border-2 border-orange-500 shadow-2xl shadow-orange-500/20"
                      : isUrgent
                        ? "border-2 border-red-500/70 shadow-2xl shadow-red-500/10"
                        : "border border-white/10"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-7">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-orange-500">
                        {order.orderNumber}
                      </h2>

                      <p className="text-gray-300 mt-3 text-lg">
                        {order.customerName}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className="bg-black border border-white/10 px-4 py-2 rounded-full text-sm font-bold">
                          {order.items.length} Items
                        </span>

                        <span className="bg-black border border-white/10 px-4 py-2 rounded-full text-sm font-bold">
                          Rs. {order.total}
                        </span>

                        <span className="bg-black border border-white/10 px-4 py-2 rounded-full text-sm font-bold">
                          {order.estimatedTime || 30} min
                        </span>

                        <span className={`border px-4 py-2 rounded-full text-sm font-bold ${
                          isUrgent
                            ? "bg-red-500/20 border-red-500/40 text-red-300"
                            : "bg-black border-white/10 text-gray-300"
                        }`}>
                          {getOrderAge(order.createdAt)}
                        </span>

                        {isNewOrder && (
                          <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                            NEW ORDER
                          </span>
                        )}

                        {isUrgent && (
                          <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                            URGENT
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex px-5 py-3 rounded-2xl border text-sm font-bold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {formatOrderStatus(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-black border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-bold text-xl">
                            {item.productName || item.product?.name}
                            {item.variantName && (
                              <span className="text-orange-400">
                                {" "}
                                ({item.variantName})
                              </span>
                            )}
                          </h3>

                          <p className="text-gray-400 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="text-orange-500 font-bold text-xl">
                          × {item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, "CONFIRMED")
                        }
                        disabled={updatingOrderId === order.id}
                        className="flex-1 min-w-[180px] bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg transition"
                      >
                        Confirm Order
                      </button>
                    )}

                    {order.status === "CONFIRMED" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, "PREPARING")
                        }
                        disabled={updatingOrderId === order.id}
                        className="flex-1 min-w-[180px] bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg transition"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === "PREPARING" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "READY")}
                        disabled={updatingOrderId === order.id}
                        className="flex-1 min-w-[180px] bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg transition"
                      >
                        Mark Ready
                      </button>
                    )}

                    {order.status === "READY" && (
                      <p className="text-green-400 font-bold">
                        Ready for delivery/admin completion.
                      </p>
                    )}
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default KitchenPanel
