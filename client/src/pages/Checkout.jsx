import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../components/CartSidebar"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { createOrder } from "../services/api"

function Checkout() {
  const { cartItems, clearCart, saveLatestOrder } = useCart()
  const { user } = useAuth()

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: "",
    email: user?.email || "",
    address: "",
    notes: "",
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/checkout")
    }
  }, [user, navigate])

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const deliveryFee = cartItems.length > 0 ? 150 : 0
  const total = subtotal + deliveryFee

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePlaceOrder = async () => {
    setError("")

    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add food items before checkout.")
      return
    }

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.address
    ) {
      setError("Please fill all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      const orderPayload = {
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        address: formData.address,
        notes: formData.notes,
        subtotal,
        deliveryFee,
        total,
        items: cartItems,
      }

      const createdOrder = await createOrder(orderPayload)

      const latestOrderData = {
        orderId: createdOrder.orderNumber,
        customer: {
          fullName: createdOrder.customerName,
          phone: createdOrder.customerPhone,
          email: createdOrder.customerEmail,
          address: createdOrder.address,
          notes: createdOrder.notes,
        },
        items: createdOrder.items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: createdOrder.subtotal,
        deliveryFee: createdOrder.deliveryFee,
        total: createdOrder.total,
        status: createdOrder.status,
        createdAt: new Date(createdOrder.createdAt).toLocaleString(),
      }

      saveLatestOrder(latestOrderData)
      clearCart()
      navigate("/order-success")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-28 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">Checkout</p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Complete Your Order
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <form className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-[2rem] p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Customer Details</h2>

              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 md:col-span-2"
                />

                <textarea
                  name="address"
                  placeholder="Delivery Address *"
                  rows="4"
                  value={formData.address}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 md:col-span-2"
                ></textarea>

                <textarea
                  name="notes"
                  placeholder="Order Notes (optional)"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 md:col-span-2"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-4 rounded-full font-bold transition"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>

            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 md:p-8 h-fit">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.length === 0 ? (
                  <p className="text-gray-400">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>

                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-orange-500 font-bold">
                        Rs. {item.price * item.quantity}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-5 space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>

                <div className="flex justify-between text-xl font-extrabold text-orange-500 pt-3">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Checkout
