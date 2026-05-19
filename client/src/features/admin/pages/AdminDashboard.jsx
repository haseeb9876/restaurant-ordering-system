import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOrders } from "../../../services/api"
import AdminLayout from "../layouts/AdminLayout"

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const totalOrders = orders.length

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length

  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length

  const totalRevenue = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((total, order) => total + order.total, 0)

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
                Business Overview
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/orders"
                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition"
              >
                Manage Orders
              </Link>

              <Link
                to="/admin/products"
                className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-bold transition"
              >
                Manage Products
              </Link>

              <Link
                to="/kitchen"
                className="border border-white/10 hover:border-green-500 hover:text-green-400 px-6 py-3 rounded-full font-bold transition"
              >
                Kitchen Panel
              </Link>
            </div>
          </div>

          {loading && (
            <p className="text-gray-400">
              Loading dashboard...
            </p>
          )}

          {error && (
            <p className="text-red-400">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="grid md:grid-cols-4 gap-6 mb-10">
                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">
                    Total Orders
                  </p>

                  <h2 className="text-4xl font-extrabold text-orange-500">
                    {totalOrders}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">
                    Pending Orders
                  </p>

                  <h2 className="text-4xl font-extrabold text-yellow-400">
                    {pendingOrders}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">
                    Completed Orders
                  </p>

                  <h2 className="text-4xl font-extrabold text-green-400">
                    {completedOrders}
                  </h2>
                </div>

                <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                  <p className="text-gray-400 mb-3">
                    Revenue
                  </p>

                  <h2 className="text-4xl font-extrabold text-orange-500">
                    Rs. {totalRevenue}
                  </h2>
                </div>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Recent Orders
                </h2>

                {orders.length === 0 ? (
                  <p className="text-gray-400">
                    No orders yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-black border border-white/10 rounded-2xl p-5"
                      >
                        <div>
                          <h3 className="font-bold text-orange-500">
                            {order.orderNumber}
                          </h3>

                          <p className="text-gray-400 text-sm mt-1">
                            {order.customerName} •{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-gray-300">
                            Rs. {order.total}
                          </span>

                          <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold">
                            {order.status}
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
