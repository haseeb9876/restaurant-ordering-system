import { useEffect, useState } from "react"
import { getOrders, updateOrderStatus } from "../../../services/api"
import AdminLayout from "../layouts/AdminLayout"

const orderStatuses = [
  "PENDING",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
]

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

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

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId)
      const updatedOrder = await updateOrderStatus(orderId, status)

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      )
    } catch (error) {
      setError(error.message)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <AdminLayout>
      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Admin Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Manage Orders
            </h1>
          </div>

          {loading && (
            <p className="text-gray-400">
              Loading orders...
            </p>
          )}

          {error && (
            <p className="text-red-400 mb-6">
              {error}
            </p>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 text-center">
              <p className="text-gray-400">
                No orders found yet.
              </p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-5 mb-5">
                    <div>
                      <h2 className="text-2xl font-bold text-orange-500">
                        {order.orderNumber}
                      </h2>

                      <p className="text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        disabled={updatingOrderId === order.id}
                        className="bg-black border border-white/10 rounded-full px-4 py-2 outline-none focus:border-orange-500"
                      >
                        {orderStatuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-black"
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                      {updatingOrderId === order.id && (
                        <span className="text-sm text-gray-400">
                          Updating...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-bold mb-3">Customer</h3>

                      <div className="space-y-2 text-gray-400">
                        <p>{order.customerName}</p>
                        <p>{order.customerPhone}</p>
                        <p>{order.customerEmail}</p>
                        <p>{order.address}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">Items</h3>

                      <div className="space-y-2 text-gray-400">
                        {order.items.map((item) => (
                          <p key={item.id}>
                            {item.product.name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">Payment Summary</h3>

                      <div className="space-y-2 text-gray-400">
                        <p>Subtotal: Rs. {order.subtotal}</p>
                        <p>Delivery: Rs. {order.deliveryFee}</p>
                        <p className="text-orange-500 font-bold">
                          Total: Rs. {order.total}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  )
}

export default AdminOrders
