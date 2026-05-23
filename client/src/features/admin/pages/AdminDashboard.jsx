import PageLoader from "../../../components/loaders/PageLoader"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getOrders } from "../../../services/api"
import AdminLayout from "../layouts/AdminLayout"

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`
}

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

function getPaymentClass(status) {
  if (status === "PAID") return "bg-green-500/20 text-green-400"
  if (status === "FAILED") return "bg-red-500/20 text-red-400"
  return "bg-yellow-500/20 text-yellow-400"
}

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchOrders = async () => {
    try {
      setError("")
      const response = await getOrders()
      setOrders(response.data || [])
    } catch (error) {
      setError(error.message || "Failed to load dashboard.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()

    const interval = setInterval(() => {
      fetchOrders()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const analytics = useMemo(() => {
    const today = new Date().toDateString()

    const validOrders = orders.filter(
      (order) => order.status !== "CANCELLED"
    )

    const todayOrders = orders.filter(
      (order) => new Date(order.createdAt).toDateString() === today
    )

    const todayValidOrders = todayOrders.filter(
      (order) => order.status !== "CANCELLED"
    )

    const totalRevenue = validOrders.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    )

    const todayRevenue = todayValidOrders.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    )

    const paidRevenue = validOrders
      .filter((order) => order.paymentStatus === "PAID")
      .reduce((total, order) => total + Number(order.total || 0), 0)

    const pendingOrders = orders.filter(
      (order) => order.status === "PENDING"
    ).length

    const activeKitchenOrders = orders.filter((order) =>
      ["CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].includes(
        order.status
      )
    ).length

    const completedOrders = orders.filter((order) =>
      ["DELIVERED", "COMPLETED"].includes(order.status)
    ).length

    const cancelledOrders = orders.filter(
      (order) => order.status === "CANCELLED"
    ).length

    const pendingPayments = orders.filter(
      (order) => order.paymentStatus === "PENDING"
    ).length

    const averageOrderValue =
      validOrders.length > 0
        ? Math.round(totalRevenue / validOrders.length)
        : 0

    const topProductsMap = new Map()

    validOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const productId = item.product?.id || item.productId
        const productName = item.product?.name || "Unknown Product"
        const quantity = Number(item.quantity || 0)
        const revenue = Number(item.price || 0) * quantity

        const existingProduct = topProductsMap.get(productId) || {
          id: productId,
          name: productName,
          quantity: 0,
          revenue: 0,
        }

        existingProduct.quantity += quantity
        existingProduct.revenue += revenue

        topProductsMap.set(productId, existingProduct)
      })
    })

    const topProducts = Array.from(topProductsMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalRevenue,
      todayRevenue,
      paidRevenue,
      pendingOrders,
      activeKitchenOrders,
      completedOrders,
      cancelledOrders,
      pendingPayments,
      averageOrderValue,
      topProducts,
    }
  }, [orders])

  return (
    <AdminLayout>
      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-orange-500 font-semibold mb-3">
                Admin Dashboard
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold">
                Business Analytics
              </h1>

              <p className="text-gray-400 mt-3">
                Live restaurant performance, revenue, orders, payments, and top products.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/orders"
                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition"
              >
                Orders
              </Link>

              <Link
                to="/admin/products"
                className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-bold transition"
              >
                Products
              </Link>

              <Link
                to="/kitchen"
                className="border border-white/10 hover:border-green-500 hover:text-green-400 px-6 py-3 rounded-full font-bold transition"
              >
                Kitchen
              </Link>
            </div>
          </div>

          {loading && (
            <PageLoader
              title="Loading Dashboard"
              subtitle="Preparing restaurant analytics"
            />
          )}

          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Total Revenue</p>
                  <h2 className="text-4xl font-extrabold text-orange-500">
                    {formatCurrency(analytics.totalRevenue)}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Today Revenue</p>
                  <h2 className="text-4xl font-extrabold text-green-400">
                    {formatCurrency(analytics.todayRevenue)}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Today Orders</p>
                  <h2 className="text-4xl font-extrabold text-blue-400">
                    {analytics.todayOrders}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Average Order</p>
                  <h2 className="text-4xl font-extrabold text-purple-400">
                    {formatCurrency(analytics.averageOrderValue)}
                  </h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Total Orders</p>
                  <h2 className="text-4xl font-extrabold">
                    {analytics.totalOrders}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Pending Orders</p>
                  <h2 className="text-4xl font-extrabold text-yellow-400">
                    {analytics.pendingOrders}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Kitchen Active</p>
                  <h2 className="text-4xl font-extrabold text-cyan-400">
                    {analytics.activeKitchenOrders}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">Pending Payments</p>
                  <h2 className="text-4xl font-extrabold text-red-400">
                    {analytics.pendingPayments}
                  </h2>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Order Health
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between bg-black border border-white/10 rounded-2xl p-5">
                      <span className="text-gray-300">Completed / Delivered</span>
                      <span className="font-extrabold text-green-400">
                        {analytics.completedOrders}
                      </span>
                    </div>

                    <div className="flex justify-between bg-black border border-white/10 rounded-2xl p-5">
                      <span className="text-gray-300">Cancelled Orders</span>
                      <span className="font-extrabold text-red-400">
                        {analytics.cancelledOrders}
                      </span>
                    </div>

                    <div className="flex justify-between bg-black border border-white/10 rounded-2xl p-5">
                      <span className="text-gray-300">Paid Revenue</span>
                      <span className="font-extrabold text-emerald-400">
                        {formatCurrency(analytics.paidRevenue)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Top Selling Products
                  </h2>

                  {analytics.topProducts.length === 0 ? (
                    <p className="text-gray-400">No product sales yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {analytics.topProducts.map((product, index) => (
                        <div
                          key={product.id}
                          className="bg-black border border-white/10 rounded-2xl p-5"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-orange-500 font-bold">
                                #{index + 1} {product.name}
                              </p>

                              <p className="text-gray-400 text-sm mt-1">
                                Sold Quantity: {product.quantity}
                              </p>
                            </div>

                            <p className="text-green-400 font-extrabold">
                              {formatCurrency(product.revenue)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Recent Orders</h2>

                  <Link
                    to="/admin/orders"
                    className="text-orange-500 hover:underline font-semibold"
                  >
                    View All
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4">📦</div>

                    <p className="text-2xl font-black text-white mb-2">
                      No Orders Yet
                    </p>

                    <p className="text-gray-400">
                      Customer orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 6).map((order) => (
                      <div
                        key={order.id}
                        className="bg-black border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div>
                          <p className="text-orange-500 font-bold">
                            {order.orderNumber}
                          </p>

                          <p className="text-gray-300 mt-1">
                            {order.customerName} • {order.customerPhone}
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 md:justify-end">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status.replaceAll("_", " ")}
                          </span>

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${getPaymentClass(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>

                          <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </AdminLayout>
  )
}

export default AdminDashboard
