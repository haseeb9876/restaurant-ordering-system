import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../components/CartSidebar"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

function Profile() {
  const { user, logout } = useAuth()
  const { latestOrder } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Customer Account
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              My Profile
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl font-extrabold mb-6">
                {user.fullName.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-2xl font-bold">{user.fullName}</h2>

              <p className="text-gray-400 mt-2">{user.email}</p>

              <p className="inline-block mt-4 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-bold">
                {user.role}
              </p>

              <button
                onClick={handleLogout}
                className="mt-8 w-full border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-full font-bold transition"
              >
                Logout
              </button>
            </div>

            <div className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
              <h2 className="text-2xl font-bold mb-6">Latest Order</h2>

              {latestOrder ? (
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
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
                      <p className="text-gray-400 text-sm">Total</p>
                      <p className="font-bold mt-2">
                        Rs. {latestOrder.total}
                      </p>
                    </div>

                    <div className="bg-black border border-white/10 rounded-2xl p-5">
                      <p className="text-gray-400 text-sm">Created At</p>
                      <p className="font-bold mt-2">
                        {latestOrder.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 rounded-2xl p-5">
                    <h3 className="font-bold mb-4">Items</h3>

                    <div className="space-y-3">
                      {latestOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-4 text-gray-300"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>

                          <span>Rs. {item.price * item.quantity}</span>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
