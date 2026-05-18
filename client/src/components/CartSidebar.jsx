import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

function CartSidebar() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <>
      {isCartOpen && (
        <div
          onClick={closeCart}
          className="fixed inset-0 bg-black/60 z-[60]"
        ></div>
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-zinc-950 text-white z-[70] shadow-2xl border-l border-white/10 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto h-[calc(100vh-220px)]">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center mt-20">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold">{item.name}</h3>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mt-1">
                    Rs. {item.price}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-orange-500 font-bold"
                      >
                        -
                      </button>

                      <span className="font-bold">{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-orange-500 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-orange-500 font-bold">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/10 bg-black">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Subtotal</span>
            <span className="text-2xl font-extrabold text-orange-500">
              Rs. {subtotal}
            </span>
          </div>

          <Link
            to="/checkout"
            onClick={closeCart}
            className="block text-center w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-full font-bold transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </aside>
    </>
  )
}

export default CartSidebar
