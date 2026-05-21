import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import {
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../../services/api"
import AdminLayout from "../layouts/AdminLayout"

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
]

const paymentStatuses = [
  "PENDING",
  "PAID",
  "FAILED",
]

const paymentMethods = [
  "CASH_ON_DELIVERY",
  "JAZZCASH",
  "EASYPAISA",
  "BANK_TRANSFER",
]

function getStatusClass(status) {
  if (status === "PENDING") {
    return "bg-yellow-500/20 text-yellow-400"
  }

  if (status === "CONFIRMED") {
    return "bg-cyan-500/20 text-cyan-400"
  }

  if (status === "PREPARING") {
    return "bg-blue-500/20 text-blue-400"
  }

  if (status === "READY") {
    return "bg-green-500/20 text-green-400"
  }

  if (status === "OUT_FOR_DELIVERY") {
    return "bg-purple-500/20 text-purple-400"
  }

  if (status === "DELIVERED") {
    return "bg-emerald-500/20 text-emerald-400"
  }

  if (status === "COMPLETED") {
    return "bg-orange-500/20 text-orange-400"
  }

  if (status === "CANCELLED") {
    return "bg-red-500/20 text-red-400"
  }

  return "bg-white/10 text-gray-300"
}

function getPaymentStatusClass(status) {
  if (status === "PAID") {
    return "bg-green-500/20 text-green-400"
  }

  if (status === "FAILED") {
    return "bg-red-500/20 text-red-400"
  }

  if (status === "PENDING") {
    return "bg-yellow-500/20 text-yellow-400"
  }

  return "bg-white/10 text-gray-300"
}

function getPaymentLabel(method) {
  if (method === "CASH_ON_DELIVERY") {
    return "Cash on Delivery"
  }

  if (method === "JAZZCASH") {
    return "JazzCash"
  }

  if (method === "EASYPAISA") {
    return "Easypaisa"
  }

  if (method === "BANK_TRANSFER") {
    return "Bank Transfer"
  }

  return method || "Not selected"
}

function formatOrderStatus(status) {
  if (status === "OUT_FOR_DELIVERY") {
    return "Out For Delivery"
  }

  return status.replaceAll("_", " ")
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [updatingPaymentOrderId, setUpdatingPaymentOrderId] =
    useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] =
    useState("ALL")

  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState("ALL")

  const [paymentMethodFilter, setPaymentMethodFilter] =
    useState("ALL")

  const fetchOrders = async () => {
    try {
      setError("")

      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      const message =
        error.message || "Failed to load orders."

      setError(message)
      toast.error(message)
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

  const filteredOrders = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          order.orderNumber,
          order.customerName,
          order.customerPhone,
          order.customerEmail,
          order.address,
          order.transactionId,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(normalizedSearch)
          )

      const matchesOrderStatus =
        orderStatusFilter === "ALL" ||
        order.status === orderStatusFilter

      const matchesPaymentStatus =
        paymentStatusFilter === "ALL" ||
        order.paymentStatus === paymentStatusFilter

      const matchesPaymentMethod =
        paymentMethodFilter === "ALL" ||
        order.paymentMethod === paymentMethodFilter

      return (
        matchesSearch &&
        matchesOrderStatus &&
        matchesPaymentStatus &&
        matchesPaymentMethod
      )
    })
  }, [
    orders,
    searchTerm,
    orderStatusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
  ])

  const hasActiveFilters =
    searchTerm ||
    orderStatusFilter !== "ALL" ||
    paymentStatusFilter !== "ALL" ||
    paymentMethodFilter !== "ALL"

  const clearFilters = () => {
    setSearchTerm("")
    setOrderStatusFilter("ALL")
    setPaymentStatusFilter("ALL")
    setPaymentMethodFilter("ALL")
  }

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrderId(orderId)
      setError("")

      const updatedOrder = await updateOrderStatus(
        orderId,
        status
      )

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      )

      toast.success(
        `Order marked as ${formatOrderStatus(
          status
        ).toLowerCase()}.`
      )
    } catch (error) {
      const message =
        error.message ||
        "Failed to update order status."

      setError(message)
      toast.error(message)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handlePaymentStatusChange = async (
    orderId,
    paymentStatus
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to mark this payment as ${paymentStatus}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setUpdatingPaymentOrderId(orderId)
      setError("")

      const updatedOrder =
        await updatePaymentStatus(
          orderId,
          paymentStatus
        )

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order
        )
      )

      toast.success(
        `Payment marked as ${paymentStatus.toLowerCase()}.`
      )
    } catch (error) {
      const message =
        error.message ||
        "Failed to update payment status."

      setError(message)
      toast.error(message)
    } finally {
      setUpdatingPaymentOrderId(null)
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

            <p className="text-gray-400 mt-3 max-w-3xl">
              Manage order preparation status and
              securely verify customer payments.
              Use filters to quickly find important
              orders.
            </p>
          </div>

          <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 mb-8">
            <div className="grid lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Search Orders
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Order, customer, phone, email, transaction ID"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Order Status
                </label>

                <select
                  value={orderStatusFilter}
                  onChange={(event) =>
                    setOrderStatusFilter(
                      event.target.value
                    )
                  }
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option
                    value="ALL"
                    className="bg-black"
                  >
                    All Orders
                  </option>

                  {orderStatuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-black"
                    >
                      {formatOrderStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Payment Status
                </label>

                <select
                  value={paymentStatusFilter}
                  onChange={(event) =>
                    setPaymentStatusFilter(
                      event.target.value
                    )
                  }
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option
                    value="ALL"
                    className="bg-black"
                  >
                    All Payments
                  </option>

                  {paymentStatuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-black"
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Payment Method
                </label>

                <select
                  value={paymentMethodFilter}
                  onChange={(event) =>
                    setPaymentMethodFilter(
                      event.target.value
                    )
                  }
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option
                    value="ALL"
                    className="bg-black"
                  >
                    All Methods
                  </option>

                  {paymentMethods.map((method) => (
                    <option
                      key={method}
                      value={method}
                      className="bg-black"
                    >
                      {getPaymentLabel(method)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-gray-400 text-sm">
                Showing{" "}
                <span className="text-orange-500 font-bold">
                  {filteredOrders.length}
                </span>{" "}
                of{" "}
                <span className="text-white font-bold">
                  {orders.length}
                </span>{" "}
                orders
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="border border-white/10 hover:border-orange-500 px-5 py-2 rounded-full font-bold transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </section>

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

          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 text-center">
                <p className="text-gray-400">
                  No orders found yet.
                </p>
              </div>
            )}

          {!loading &&
            orders.length > 0 &&
            filteredOrders.length === 0 && (
              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 text-center">
                <p className="text-gray-400">
                  No orders match your current
                  filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition"
                >
                  Clear Filters
                </button>
              </div>
            )}

          {!loading &&
            filteredOrders.length > 0 && (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 border-b border-white/10 pb-5 mb-5">
                      <div>
                        <h2 className="text-2xl font-bold text-orange-500">
                          {order.orderNumber}
                        </h2>

                        <p className="text-gray-400 mt-1">
                          {new Date(
                            order.createdAt
                          ).toLocaleString()}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusClass(
                              order.status
                            )}`}
                          >
                            Order:{" "}
                            {formatOrderStatus(
                              order.status
                            )}
                          </span>

                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getPaymentStatusClass(
                              order.paymentStatus
                            )}`}
                          >
                            Payment:{" "}
                            {order.paymentStatus ||
                              "PENDING"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div>
                          <p className="text-gray-400 text-xs mb-2">
                            Order Status
                          </p>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value
                              )
                            }
                            disabled={
                              updatingOrderId ===
                              order.id
                            }
                            className="bg-black border border-white/10 rounded-full px-4 py-2 outline-none focus:border-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {orderStatuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                  className="bg-black"
                                >
                                  {formatOrderStatus(
                                    status
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs mb-2">
                            Payment Verification
                          </p>

                          <select
                            value={
                              order.paymentStatus ||
                              "PENDING"
                            }
                            onChange={(e) =>
                              handlePaymentStatusChange(
                                order.id,
                                e.target.value
                              )
                            }
                            disabled={
                              updatingPaymentOrderId ===
                              order.id
                            }
                            className="bg-black border border-white/10 rounded-full px-4 py-2 outline-none focus:border-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {paymentStatuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                  className="bg-black"
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {(updatingOrderId ===
                          order.id ||
                          updatingPaymentOrderId ===
                            order.id) && (
                          <span className="text-sm text-gray-400">
                            Updating...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                      <div>
                        <h3 className="font-bold mb-3">
                          Customer
                        </h3>

                        <div className="space-y-2 text-gray-400">
                          <p>{order.customerName}</p>
                          <p>{order.customerPhone}</p>
                          <p>{order.customerEmail}</p>
                          <p>{order.address}</p>

                          {order.notes && (
                            <p className="text-gray-500">
                              Notes: {order.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold mb-3">
                          Items
                        </h3>

                        <div className="space-y-2 text-gray-400">
                          {order.items.map((item) => (
                            <p key={item.id}>
                              {item.product.name} ×{" "}
                              {item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold mb-3">
                          Payment
                        </h3>

                        <div className="space-y-2 text-gray-400">
                          <p>
                            Method:{" "}
                            {getPaymentLabel(
                              order.paymentMethod
                            )}
                          </p>

                          <p>
                            Status:{" "}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${getPaymentStatusClass(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus ||
                                "PENDING"}
                            </span>
                          </p>

                          {order.paymentMethod !==
                            "CASH_ON_DELIVERY" &&
                            !order.transactionId && (
                              <p className="text-red-400 text-sm">
                                Warning: No transaction
                                ID provided.
                              </p>
                            )}

                          {order.transactionId && (
                            <p className="break-all">
                              Ref:{" "}
                              {order.transactionId}
                            </p>
                          )}

                          {order.paymentProof && (
                            <a
                              href={order.paymentProof}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block text-orange-500 hover:underline"
                            >
                              View Payment Proof
                            </a>
                          )}

                          {order.estimatedTime && (
                            <p>
                              ETA:{" "}
                              {order.estimatedTime} min
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold mb-3">
                          Summary
                        </h3>

                        <div className="space-y-2 text-gray-400">
                          <p>
                            Subtotal: Rs.{" "}
                            {order.subtotal}
                          </p>

                          <p>
                            Delivery: Rs.{" "}
                            {order.deliveryFee}
                          </p>

                          <p className="text-orange-500 font-bold">
                            Total: Rs. {order.total}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 bg-black border border-white/10 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm">
                        Security note: Verify payment
                        manually from JazzCash,
                        Easypaisa, or bank app before
                        marking payment as PAID.
                        Never mark payment as PAID by
                        only trusting the transaction
                        ID text.
                      </p>
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
