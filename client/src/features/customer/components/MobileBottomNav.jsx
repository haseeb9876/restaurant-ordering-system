import { Link, useLocation } from "react-router-dom"
import { useCart } from "../../cart/context/CartContext"
import { useAuth } from "../../auth/context/AuthContext"

function MobileBottomNav() {
  const location = useLocation()

  const { cartItems, openCart } = useCart()
  const { user } = useAuth()

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }

    return location.pathname.startsWith(path)
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-[999] px-4 pb-4">
      <div className="bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl shadow-black/50">
        <div className="grid grid-cols-4 items-center">

          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-4 transition ${
              isActive("/")
                ? "text-orange-500"
                : "text-gray-400"
            }`}
          >
            <span className="text-2xl">🏠</span>

            <span className="text-xs font-bold mt-1">
              Home
            </span>
          </Link>

          <button
            onClick={() => {
              window.location.href = "/#menu"
            }}
            className="flex flex-col items-center justify-center py-4 text-gray-400"
          >
            <span className="text-2xl">🍕</span>

            <span className="text-xs font-bold mt-1">
              Menu
            </span>
          </button>

          <button
            onClick={openCart}
            className="relative flex flex-col items-center justify-center py-4 text-gray-400"
          >
            <span className="text-2xl">🛒</span>

            {totalCartItems > 0 && (
              <span className="absolute top-2 right-8 bg-orange-500 text-white text-[10px] min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-extrabold px-1">
                {totalCartItems}
              </span>
            )}

            <span className="text-xs font-bold mt-1">
              Cart
            </span>
          </button>

          <Link
            to={user ? "/profile" : "/login"}
            className={`flex flex-col items-center justify-center py-4 transition ${
              isActive("/profile") ||
              isActive("/login")
                ? "text-orange-500"
                : "text-gray-400"
            }`}
          >
            <span className="text-2xl">
              {user ? "👤" : "🔐"}
            </span>

            <span className="text-xs font-bold mt-1">
              {user ? "Profile" : "Login"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MobileBottomNav
