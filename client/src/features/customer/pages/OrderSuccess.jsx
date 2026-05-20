import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import { useCart } from "../../cart/context/CartContext"

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

function OrderSuccess() {
  const { latestOrder } = useCart()

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-zinc-950 border border-white/10 rounded-[2rem] p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="text-7xl mb-6">✅</div>

            <p className="text-orange-500 font-semibold mb-3">
              Order Confirmed
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
              Your Order Has Been Placed
            </h1>

            <p className="text-gray-300 text-lg">
              Our kitchen team has received your order. You can track live
              status updates from your profile.
            </p>
          </div>

          {latestOrder ? (
            <>
              <div className="grid md:grid-cols-2 gap-5 mb-8">
                <div className="bg-black border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm">Order ID</p>
                  <p className="text-orange-500 font-bold mt-2">
                    {latestOrder.orderId}
                  </p>
                </div>

                <div className="bg-black border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-yellow-400 font-bold mt-2">
                    {latestOrder.status}
                  </p>
                </div>

                <div className="bg-black border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm">Customer</p>
                  <p className="font-bold mt-2">
                    {latestOrder.customer.fullName}
                  </p>
                </div>

                <div className="bg-black border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="font-bold mt-2">
                    Rs. {latestOrder.total}
                  </p>
                </div>
              </div>

              <div className="bg-black border border-white/10 rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold mb-5">
                  Payment Details
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Payment Method</p>
                    <p className="font-bold mt-2">
                      {formatPaymentMethod(latestOrder.paymentMethod)}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Payment Status</p>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${getPaymentStatusClass(
                        latestOrder.paymentStatus
                      )}`}
                    >
                      {latestOrder.paymentStatus || "PENDING"}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Transaction ID</p>
                    <p className="font-bold mt-2 break-words">
                      {latestOrder.transactionId || "Not provided"}
                    </p>
                  </div>
                </div>

                {latestOrder.paymentMethod !== "CASH_ON_DELIVERY" && (
                  <p className="text-gray-400 text-sm mt-4">
                    Your payment will be verified by the restaurant admin. If
                    payment is already sent, please keep your transaction ID
                    safe.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-black border border-white/10 rounded-2xl p-6 mb-8 text-center">
              <p className="text-gray-400">
                No recent order found.
              </p>
            </div>
          )}

          <div className="bg-black border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-5">
              What Happens Next?
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-3">📩</div>
                <h3 className="font-bold">Order Received</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Your order is now visible to the restaurant team.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-3">👨‍🍳</div>
                <h3 className="font-bold">Preparing</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Kitchen staff will start preparing your food.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-bold">Ready</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Your food will be ready for pickup or delivery.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-bold">Completed</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Order is completed after delivery or handover.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/profile"
              className="text-center bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-bold transition"
            >
              Track My Order
            </Link>

            <Link
              to="/"
              className="text-center border border-white/10 hover:border-orange-500 px-8 py-4 rounded-full font-bold transition"
            >
              Continue Ordering
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderSuccess
