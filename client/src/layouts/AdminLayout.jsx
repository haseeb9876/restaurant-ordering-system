import { Link } from "react-router-dom"

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-white/10 p-6 hidden lg:block">
        <Link to="/admin" className="text-3xl font-extrabold text-orange-500">
          Foodie<span className="text-white">Hub</span>
        </Link>

        <p className="text-gray-500 text-sm mt-2 mb-10">Admin Panel</p>

        <nav className="space-y-3">
          <Link
            to="/admin"
            className="block px-4 py-3 rounded-xl hover:bg-orange-500 font-semibold transition"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/orders"
            className="block px-4 py-3 rounded-xl hover:bg-orange-500 font-semibold transition"
          >
            Orders
          </Link>

          <Link
            to="/admin/products"
            className="block px-4 py-3 rounded-xl hover:bg-orange-500 font-semibold transition"
          >
            Products
          </Link>

          <Link
            to="/kitchen"
            className="block px-4 py-3 rounded-xl hover:bg-orange-500 font-semibold transition"
          >
            Kitchen Panel
          </Link>

          <Link
            to="/"
            className="block px-4 py-3 rounded-xl hover:bg-white/10 text-gray-400 font-semibold transition"
          >
            Customer Website
          </Link>
        </nav>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-lg">Restaurant Admin</h1>

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
