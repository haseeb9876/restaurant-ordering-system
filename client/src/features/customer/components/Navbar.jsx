import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useCart } from "../../cart/context/CartContext"
import { useAuth } from "../../auth/context/AuthContext"
import { getPublicSettings } from "../../../services/api"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [branding, setBranding] = useState({
    restaurantName: "Restaurant",
    logoUrl: "",
  })

  const { cartItems, openCart } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const settings = await getPublicSettings()

        setBranding({
          restaurantName:
            settings.restaurantName || "Restaurant",

          logoUrl: settings.logoUrl || "",
        })
      } catch {
        setBranding({
          restaurantName: "Restaurant",
          logoUrl: "",
        })
      }
    }

    fetchBranding()
  }, [])

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const goHomeTop = () => {
    setIsMenuOpen(false)
    window.location.href = "/"
  }

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully.")
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/85 backdrop-blur-md border-b border-white/10 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

        <button
          type="button"
          onClick={goHomeTop}
          className="flex items-center gap-4 shrink-0"
        >
          {branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.restaurantName}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-orange-500 shadow-lg shadow-orange-500/20"
            />
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-orange-500/20">
              R
            </div>
          )}

          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-400 font-bold">
              Premium Restaurant
            </p>

            <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight">
              {branding.restaurantName}
            </h1>
          </div>
        </button>

        <ul className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-300">
          <li>
            <button
              onClick={goHomeTop}
              className="hover:text-orange-500 transition"
            >
              Home
            </button>
          </li>

          <li>
            <a
              href="/#menu"
              className="hover:text-orange-500 transition"
            >
              Menu
            </a>
          </li>

          <li>
            <a
              href="/#about"
              className="hover:text-orange-500 transition"
            >
              About
            </a>
          </li>

          <li>
            <a
              href="/#contact"
              className="hover:text-orange-500 transition"
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-4">

          {(user?.role === "ADMIN" ||
            user?.role === "STAFF") && (
            <Link
              to="/kitchen"
              className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-black px-5 py-2 rounded-full font-semibold transition"
            >
              Kitchen
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Admin Panel
            </Link>
          )}

          <button
            onClick={openCart}
            className="relative border border-white/10 hover:border-orange-500 px-4 py-2 rounded-full font-semibold transition"
          >
            🛒 Cart

            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {totalCartItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">

              <Link
                to="/profile"
                className="text-sm text-gray-300 hover:text-orange-500"
              >
                Hi,{" "}
                <span className="text-orange-500 font-bold">
                  {user.fullName}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="border border-white/10 hover:border-red-500 hover:text-red-400 px-5 py-2 rounded-full font-semibold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="border border-white/10 hover:border-orange-500 px-5 py-2 rounded-full font-semibold transition"
            >
              Login
            </Link>
          )}

          <button
            onClick={openCart}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition"
          >
            Order Now
          </button>
        </div>

        <button
          onClick={() =>
            setIsMenuOpen(!isMenuOpen)
          }
          className="lg:hidden text-4xl text-white"
        >
          {isMenuOpen ? "×" : "☰"}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-white/10 px-6 py-6 space-y-5 text-gray-300">

          <button
            onClick={goHomeTop}
            className="block hover:text-orange-500"
          >
            Home
          </button>

          <a
            href="/#menu"
            onClick={closeMobileMenu}
            className="block hover:text-orange-500"
          >
            Menu
          </a>

          <a
            href="/#about"
            onClick={closeMobileMenu}
            className="block hover:text-orange-500"
          >
            About
          </a>

          <a
            href="/#contact"
            onClick={closeMobileMenu}
            className="block hover:text-orange-500"
          >
            Contact
          </a>

          {(user?.role === "ADMIN" ||
            user?.role === "STAFF") && (
            <Link
              to="/kitchen"
              onClick={closeMobileMenu}
              className="block text-green-400"
            >
              Kitchen
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={closeMobileMenu}
              className="block text-orange-500"
            >
              Admin Panel
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="block hover:text-orange-500"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="block hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="block hover:text-orange-500"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => {
              openCart()
              closeMobileMenu()
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-full font-semibold transition w-full"
          >
            🛒 Open Cart ({totalCartItems})
          </button>
        </div>
      )}
    </header>
  )
}

export default Navbar
