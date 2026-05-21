import { Link, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../../auth/context/AuthContext"

function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully.")
  }

  const navLinks = [
    { label: "Dashboard", path: "/admin" },
    { label: "Orders", path: "/admin/orders" },
    { label: "Products", path: "/admin/products" },
    { label: "Customers", path: "/admin/customers" },
    { label: "Settings", path: "/admin/settings" },
    { label: "Kitchen Panel", path: "/kitchen" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-white/10 hidden lg:flex lg:flex-col">
        <div className="p-6 border-b border-white/10">
          <Link
            to="/admin"
            className="text-3xl font-extrabold text-orange-500"
          >
            Foodie<span className="text-white">Hub</span>
          </Link>

          <p className="text-gray-500 text-sm mt-2">
            Admin Panel
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {user && (
            <div className="mb-8 bg-black border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-gray-400">
                Logged in as
              </p>

              <h3 className="font-bold text-orange-500 mt-1">
                {user.fullName}
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                {user.role}
              </p>
            </div>
          )}

          <nav className="space-y-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl font-semibold transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "hover:bg-orange-500"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <Link
              to="/"
              className="block px-4 py-3 rounded-xl hover:bg-white/10 text-gray-400 font-semibold transition"
            >
              Customer Website
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-full font-bold transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-lg">
                Restaurant Admin
              </h1>

              {user && (
                <p className="text-sm text-gray-400">
                  Welcome back, {user.fullName}
                </p>
              )}
            </div>

            <Link
              to="/"
              className="border border-white/10 hover:border-orange-500 px-5 py-2 rounded-full font-semibold transition"
            >
              Visit Website
            </Link>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}

export default AdminLayout
