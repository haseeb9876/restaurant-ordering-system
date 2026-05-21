import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../../auth/context/AuthContext"
import { getPublicSettings } from "../../../services/api"

function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings()
        setSettings(data)
      } catch (error) {
        console.error("Failed to load restaurant settings:", error.message)
      }
    }

    fetchSettings()
  }, [])

  const restaurantName = settings?.restaurantName || "Restaurant"
  const logoUrl = settings?.logoUrl || ""

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

  const renderBrand = () => (
    <div className="flex items-center gap-3">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={restaurantName}
          className="h-11 w-11 rounded-2xl object-cover border border-white/10"
        />
      )}

      <span className="text-2xl font-extrabold text-orange-500 leading-tight">
        {restaurantName}
      </span>
    </div>
  )

  const renderNavLinks = (isMobile = false) => (
    <nav className="space-y-3">
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path

        return (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => {
              if (isMobile) {
                setIsMobileMenuOpen(false)
              }
            }}
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
        onClick={() => {
          if (isMobile) {
            setIsMobileMenuOpen(false)
          }
        }}
        className="block px-4 py-3 rounded-xl hover:bg-white/10 text-gray-400 font-semibold transition"
      >
        Customer Website
      </Link>
    </nav>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-white/10 hidden lg:flex lg:flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/admin">
            {renderBrand()}
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

          {renderNavLinks()}
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
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-lg">
                {restaurantName} Admin
              </h1>

              {user && (
                <p className="text-sm text-gray-400">
                  Welcome back, {user.fullName}
                </p>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/"
                className="border border-white/10 hover:border-orange-500 px-5 py-2 rounded-full font-semibold transition"
              >
                Visit Website
              </Link>

              <button
                onClick={handleLogout}
                className="lg:hidden border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
              >
                Logout
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="lg:hidden border border-white/10 hover:border-orange-500 px-4 py-2 rounded-full font-bold transition"
            >
              {isMobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden mt-5 bg-zinc-950 border border-white/10 rounded-2xl p-5">
              <div className="mb-5">
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {renderBrand()}
                </Link>
              </div>

              {user && (
                <div className="mb-5 bg-black border border-white/10 rounded-2xl p-4">
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

              {renderNavLinks(true)}

              <button
                onClick={handleLogout}
                className="mt-5 w-full border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-full font-bold transition"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {children}
      </div>
    </div>
  )
}

export default AdminLayout
