import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../cart/context/CartContext"
import { useAuth } from "../../auth/context/AuthContext"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { cartItems, openCart } = useCart()
  const { user, logout } = useAuth()

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-orange-500">
          Foodie<span className="text-white">Hub</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <li>
            <Link to="/" className="hover:text-orange-500">
              Home
            </Link>
          </li>

          <li>
            <a href="/#menu" className="hover:text-orange-500">
              Menu
            </a>
          </li>

          <li>
            <a href="/#about" className="hover:text-orange-500">
              About
            </a>
          </li>

          <li>
            <a href="/#contact" className="hover:text-orange-500">
              Contact
            </a>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {(user?.role === "ADMIN" || user?.role === "STAFF") && (
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
                onClick={logout}
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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-3xl"
        >
          {isMenuOpen ? "×" : "☰"}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-6">
          <ul className="space-y-5 text-gray-300 font-medium">
            <li>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block hover:text-orange-500"
              >
                Home
              </Link>
            </li>

            <li>
              <a
                href="/#menu"
                onClick={closeMobileMenu}
                className="block hover:text-orange-500"
              >
                Menu
              </a>
            </li>

            <li>
              <a
                href="/#about"
                onClick={closeMobileMenu}
                className="block hover:text-orange-500"
              >
                About
              </a>
            </li>

            <li>
              <a
                href="/#contact"
                onClick={closeMobileMenu}
                className="block hover:text-orange-500"
              >
                Contact
              </a>
            </li>

            {(user?.role === "ADMIN" ||
              user?.role === "STAFF") && (
              <li>
                <Link
                  to="/kitchen"
                  onClick={closeMobileMenu}
                  className="block text-green-400 hover:text-green-300"
                >
                  Kitchen Panel
                </Link>
              </li>
            )}

            {user?.role === "ADMIN" && (
              <li>
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="block text-orange-500 hover:text-orange-400"
                >
                  Admin Panel
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={() => {
                  openCart()
                  closeMobileMenu()
                }}
                className="relative w-full text-left hover:text-orange-500"
              >
                🛒 Cart

                {totalCartItems > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="block hover:text-orange-500"
                  >
                    Profile: {user.fullName}
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block hover:text-orange-500"
                >
                  Login
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={() => {
                  openCart()
                  closeMobileMenu()
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-full font-semibold transition"
              >
                Order Now
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar
