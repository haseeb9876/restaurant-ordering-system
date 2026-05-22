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

const paymentStatuses = ["PENDING", "PAID", "FAILED"]

const paymentMethods = [
  "CASH_ON_DELIVERY",
  "JAZZCASH",
  "EASYPAISA",
  "BANK_TRANSFER",
]

const dateRanges = [
  { value: "TODAY", label: "Today" },
  { value: "YESTERDAY", label: "Yesterday" },
  { value: "LAST_7_DAYS", label: "Last 7 Days" },
  { value: "ALL", label: "All Orders" },
]

const pageSizes = [10, 20, 50, 100]

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`
}

function formatLabel(value) {
  if (!value) return "Not selected"
  return value.replaceAll("_", " ")
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

function getPaymentStatusClass(status) {
  if (status === "PAID") return "bg-green-500/20 text-green-400"
  if (status === "FAILED") return "bg-red-500/20 text-red-400"
  if (status === "PENDING") return "bg-yellow-500/20 text-yellow-400"

  return "bg-white/10 text-gray-300"
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState({
    totalOrders: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 20,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [updatingPaymentOrderId, setUpdatingPaymentOrderId] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [dateRangeFilter, setDateRangeFilter] = useState("TODAY")
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const fetchOrders = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true)

      setError("")

      const result = await getOrders({
        range: dateRangeFilter,
        status: orderStatusFilter,
        paymentStatus: paymentStatusFilter,
        paymentMethod: paymentMethodFilter,
        search: searchTerm,
        page,
        limit,
      })

      setOrders(result.data || [])

      setMeta({
        totalOrders: result.totalOrders || 0,
        totalPages: result.totalPages || 1,
        currentPage: result.currentPage || 1,
        pageSize: result.pageSize || limit,
      })
    } catch (error) {
      const message = error.message || "Failed to load orders."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [
    dateRangeFilter,
    orderStatusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    page,
    limit,
  ])

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1)
      fetchOrders()
    }, 500)

    return () => clearTimeout(delay)
  }, [searchTerm])

  useEffect(() => {
    const shouldAutoRefresh =
      dateRangeFilter === "TODAY" ||
      ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].includes(
        orderStatusFilter
      )

    if (!shouldAutoRefresh) return undefined

    const interval = setInterval(() => {
      fetchOrders({ silent: true })
    }, 5000)

    return () => clearInterval(interval)
  }, [
    dateRangeFilter,
    orderStatusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    searchTerm,
    page,
    limit,
  ])

  const stats = useMemo(() => {
    const totalOrders = meta.totalOrders

    const pendingOrders = orders.filter(
      (order) => order.status === "PENDING"
    ).length

    const activeOrders = orders.filter((order) =>
      ["CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].includes(
        order.status
      )
    ).length

    const completedOrders = orders.filter((order) =>
      ["DELIVERED", "COMPLETED"].includes(order.status)
    ).length

    const pendingPayments = orders.filter(
      (order) => order.paymentStatus === "PENDING"
    ).length

    return {
      totalOrders,
      pendingOrders,
      activeOrders,
      completedOrders,
      pendingPayments,
    }
  }, [orders, meta.totalOrders])

  const hasActiveFilters =
    searchTerm ||
    dateRangeFilter !== "TODAY" ||
    orderStatusFilter !== "ALL" ||
    paymentStatusFilter !== "ALL" ||
    paymentMethodFilter !== "ALL"

  const clearFilters = () => {
    setSearchTerm("")
    setDateRangeFilter("TODAY")
    setOrderStatusFilter("ALL")
    setPaymentStatusFilter("ALL")
    setPaymentMethodFilter("ALL")
    setPage(1)
    setLimit(20)
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId)
      setError("")

      const updatedOrder = await updateOrderStatus(orderId, status)

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      )

      toast.success(`Order marked as ${formatLabel(status).toLowerCase()}.`)
    } catch (error) {
      const message = error.message || "Failed to update order status."
      setError(message)
      toast.error(message)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    const confirmed = window.confirm(
      `Are you sure you want to mark this payment as ${paymentStatus}?`
    )

    if (!confirmed) return

    try {
      setUpdatingPaymentOrderId(orderId)
      setError("")

      const updatedOrder = await updatePaymentStatus(orderId, paymentStatus)

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      )

      toast.success(`Payment marked as ${paymentStatus.toLowerCase()}.`)
    } catch (error) {
      const message = error.message || "Failed to update payment status."
      setError(message)
      toast.error(message)
    } finally {
      setUpdatingPaymentOrderId(null)
    }
  }

  const goToPage = (nextPage) => {
    const safePage = Math.min(Math.max(nextPage, 1), meta.totalPages || 1)
    setPage(safePage)
  }

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
                Manage Orders
              </h1>

              <p className="text-gray-400 mt-3 max-w-3xl">
                Default view shows today’s orders only. Use filters and pagination
                to keep the admin panel fast even after thousands of orders.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchOrders()}
              className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-bold transition w-fit"
            >
              Refresh Orders
            </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-2">Matching Orders</p>
              <h2 className="text-3xl font-extrabold">{stats.totalOrders}</h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-2">Pending On Page</p>
              <h2 className="text-3xl font-extrabold text-yellow-400">
                {stats.pendingOrders}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-2">Kitchen Active</p>
              <h2 className="text-3xl font-extrabold text-cyan-400">
                {stats.activeOrders}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-2">Completed On Page</p>
              <h2 className="text-3xl font-extrabold text-green-400">
                {stats.completedOrders}
              </h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-2">Pending Payment</p>
              <h2 className="text-3xl font-extrabold text-red-400">
                {stats.pendingPayments}
              </h2>
            </div>
          </div>

          <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 mb-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-6 gap-4">
              <div className="xl:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Search Orders
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Order no, name, phone, email, address"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Date Range
                </label>

                <select
                  value={dateRangeFilter}
                  onChange={(event) => {
                    setDateRangeFilter(event.target.value)
                    setPage(1)
                  }}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  {dateRanges.map((range) => (
                    <option
                      key={range.value}
                      value={range.value}
                      className="bg-black"
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Order Status
                </label>

                <select
                  value={orderStatusFilter}
                  onChange={(event) => {
                    setOrderStatusFilter(event.target.value)
                    setPage(1)
                  }}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="ALL" className="bg-black">
                    All Statuses
                  </option>

                  {orderStatuses.map((status) => (
                    <option key={status} value={status} className="bg-black">
                      {formatLabel(status)}
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
                  onChange={(event) => {
                    setPaymentStatusFilter(event.target.value)
                    setPage(1)
                  }}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="ALL" className="bg-black">
                    All Payments
                  </option>

                  {paymentStatuses.map((status) => (
                    <option key={status} value={status} className="bg-black">
                      {formatLabel(status)}
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
                  onChange={(event) => {
                    setPaymentMethodFilter(event.target.value)
                    setPage(1)
                  }}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="ALL" className="bg-black">
                    All Methods
                  </option>

                  {paymentMethods.map((method) => (
                    <option key={method} value={method} className="bg-black">
                      {formatLabel(method)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <p className="text-gray-400 text-sm">
                Showing{" "}
                <span className="text-orange-500 font-bold">
                  {orders.length}
                </span>{" "}
                of{" "}
                <span className="text-white font-bold">
                  {meta.totalOrders}
                </span>{" "}
                matching orders
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={limit}
                  onChange={(event) => {
                    setLimit(Number(event.target.value))
                    setPage(1)
                  }}
                  className="bg-black border border-white/10 rounded-full px-4 py-2 outline-none focus:border-orange-500"
                >
                  {pageSizes.map((size) => (
                    <option key={size} value={size} className="bg-black">
                      {size} per page
                    </option>
                  ))}
                </select>

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
            </div>
          </section>

          {loading && <p className="text-gray-400">Loading orders...</p>}

          {error && <p className="text-red-400 mb-6">{error}</p>}

          {!loading && !error && orders.length === 0 && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">No orders found</h2>
              <p className="text-gray-400">
                Try another date range or wait for new customer orders.
              </p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6"
                >
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h2 className="text-2xl font-extrabold text-orange-500">
                          {order.orderNumber}
                        </h2>

                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {formatLabel(order.status)}
                        </span>

                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold ${getPaymentStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {formatLabel(order.paymentStatus)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-gray-300">
                        <p>
                          <span className="text-gray-500">Customer:</span>{" "}
                          {order.customerName}
                        </p>

                        <p>
                          <span className="text-gray-500">Phone:</span>{" "}
                          {order.customerPhone}
                        </p>

                        <p className="break-all">
                          <span className="text-gray-500">Email:</span>{" "}
                          {order.customerEmail}
                        </p>

                        <p>
                          <span className="text-gray-500">Payment:</span>{" "}
                          {formatLabel(order.paymentMethod)}
                        </p>

                        <p className="md:col-span-2">
                          <span className="text-gray-500">Address:</span>{" "}
                          {order.address}
                        </p>

                        {order.transactionId && (
                          <p className="md:col-span-2">
                            <span className="text-gray-500">
                              Transaction ID:
                            </span>{" "}
                            {order.transactionId}
                          </p>
                        )}

                        {order.notes && (
                          <p className="md:col-span-2">
                            <span className="text-gray-500">Notes:</span>{" "}
                            {order.notes}
                          </p>
                        )}

                        <p className="md:col-span-2 text-gray-500 text-sm">
                          Created: {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-[260px] space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Update Order Status
                        </label>

                        <select
                          value={order.status}
                          disabled={updatingOrderId === order.id}
                          onChange={(event) =>
                            handleStatusChange(order.id, event.target.value)
                          }
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 disabled:opacity-60"
                        >
                          {orderStatuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-black"
                            >
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Update Payment Status
                        </label>

                        <select
                          value={order.paymentStatus}
                          disabled={updatingPaymentOrderId === order.id}
                          onChange={(event) =>
                            handlePaymentStatusChange(
                              order.id,
                              event.target.value
                            )
                          }
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 disabled:opacity-60"
                        >
                          {paymentStatuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-black"
                            >
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <h3 className="text-lg font-bold mb-4">Order Items</h3>

                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-black border border-white/10 rounded-2xl p-4"
                        >
                          <div>
                            <p className="font-bold">
                              {item.product?.name || "Deleted Product"}
                              {item.variantName && (
                                <span className="text-orange-400">
                                  {" "}
                                  ({item.variantName})
                                </span>
                              )}
                            </p>

                            <p className="text-gray-400 text-sm">
                              Quantity: {item.quantity} ×{" "}
                              {formatCurrency(item.price)}
                            </p>
                          </div>

                          <p className="font-extrabold text-orange-500">
                            {formatCurrency(
                              Number(item.price || 0) *
                                Number(item.quantity || 0)
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <div className="bg-black border border-white/10 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm">Subtotal</p>
                      <p className="text-xl font-extrabold">
                        {formatCurrency(order.subtotal)}
                      </p>
                    </div>

                    <div className="bg-black border border-white/10 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm">Delivery Fee</p>
                      <p className="text-xl font-extrabold">
                        {formatCurrency(order.deliveryFee)}
                      </p>
                    </div>

                    <div className="bg-black border border-orange-500/40 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm">Total</p>
                      <p className="text-2xl font-extrabold text-orange-500">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-950 border border-white/10 rounded-[2rem] p-5">
                <p className="text-gray-400">
                  Page{" "}
                  <span className="text-white font-bold">
                    {meta.currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-white font-bold">
                    {meta.totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={meta.currentPage <= 1}
                    onClick={() => goToPage(meta.currentPage - 1)}
                    className="border border-white/10 hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 rounded-full font-bold transition"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={meta.currentPage >= meta.totalPages}
                    onClick={() => goToPage(meta.currentPage + 1)}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed px-5 py-2 rounded-full font-bold transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  )
}

export default AdminOrders
