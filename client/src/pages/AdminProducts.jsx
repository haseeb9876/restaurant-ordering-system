import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { deleteProduct, getProducts } from "../services/api"
import Navbar from "../components/Navbar"
import CartSidebar from "../components/CartSidebar"

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (!confirmDelete) {
      return
    }

    try {
      setDeletingId(productId)
      await deleteProduct(productId)

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      )
    } catch (error) {
      setError(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-orange-500 font-semibold mb-3">
                Admin Dashboard
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold">
                Manage Products
              </h1>
            </div>

            <Link
              to="/admin/products/new"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition w-fit"
            >
              Add Product
            </Link>
          </div>

          {loading && <p className="text-gray-400">Loading products...</p>}

          {error && <p className="text-red-400 mb-6">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 text-center">
              <p className="text-gray-400">No products found.</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <span className="text-sm bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                      {product.category.name}
                    </span>

                    <h2 className="text-2xl font-bold mt-4">
                      {product.name}
                    </h2>

                    <p className="text-gray-400 text-sm mt-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-6">
                      <p className="text-orange-500 text-2xl font-extrabold">
                        Rs. {product.price}
                      </p>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          product.isAvailable
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="flex-1 text-center border border-white/10 hover:border-orange-500 py-2 rounded-full font-semibold transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deletingId === product.id}
                        className="flex-1 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed py-2 rounded-full font-semibold transition"
                      >
                        {deletingId === product.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminProducts
