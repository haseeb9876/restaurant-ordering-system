import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../components/CartSidebar"
import { useCart } from "../context/CartContext"

function OrderSuccess() {
  const { latestOrder } = useCart()

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center bg-zinc-950 border border-white/10 rounded-[2rem] p-10">
          <div className="text-7xl mb-6">✅</div>

          <p className="text-orange-500 font-semibold mb-3">
            Order Confirmed
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
            Thank You For Your Order!
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Your order has been received successfully. Our kitchen team will
            start preparing it soon.
          </p>

          {latestOrder ? (
            <div className="bg-black border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Order ID</span>
                <span className="font-bold text-orange-500">
                  {latestOrder.orderId}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Customer</span>
                <span className="font-bold">
                  {latestOrder.customer.fullName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Total</span>
                <span className="font-bold">Rs. {latestOrder.total}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Status</span>
                <span className="font-bold text-yellow-400">
                  {latestOrder.status}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Created At</span>
                <span className="font-bold">{latestOrder.createdAt}</span>
              </div>
            </div>
          ) : (
            <div className="bg-black border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-gray-400">
                No recent order found. Please place an order first.
              </p>
            </div>
          )}

          <div className="bg-black border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">Order Status</h2>

            <div className="space-y-3 text-gray-300">
              <p>🟠 Pending confirmation</p>
              <p>👨‍🍳 Preparing soon</p>
              <p>🚚 Delivery will be arranged</p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-bold transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}

export default OrderSuccess
