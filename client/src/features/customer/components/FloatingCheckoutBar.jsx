import { Link } from "react-router-dom"
import { useCart } from "../../cart/context/CartContext"

function FloatingCheckoutBar() {
  const { cartItems } = useCart()

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  if (cartItems.length === 0) {
    return null
  }

  return (
    <div className="md:hidden fixed bottom-28 left-4 right-4 z-[998]">
      <Link
        to="/checkout"
        className="flex items-center justify-between bg-orange-500 hover:bg-orange-600 transition text-white rounded-2xl px-5 py-4 shadow-2xl shadow-orange-500/30"
      >
        <div>
          <p className="text-xs font-semibold opacity-90">
            {totalItems} item{totalItems > 1 ? "s" : ""} in cart
          </p>

          <p className="font-black text-lg">
            Rs. {subtotal.toLocaleString("en-PK")}
          </p>
        </div>

        <div className="font-black text-sm">
          Checkout →
        </div>
      </Link>
    </div>
  )
}

export default FloatingCheckoutBar
