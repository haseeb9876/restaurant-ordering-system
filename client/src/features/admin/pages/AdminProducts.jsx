import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../../services/api"
import AdminLayout from "../layouts/AdminLayout"

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL")

  const fetchProducts = async () => {
    try {
      setError("")
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      const message = error.message || "Failed to load products."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category?.name)
          .filter(Boolean)
      ),
    ]
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        [product.name, product.description, product.category?.name]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch)
          )

      const matchesCategory =
        categoryFilter === "ALL" ||
        product.category?.name === categoryFilter

      const matchesAvailability =
        availabilityFilter === "ALL" ||
        (availabilityFilter === "AVAILABLE" && product.isAvailable) ||
        (availabilityFilter === "UNAVAILABLE" && !product.isAvailable)

      return matchesSearch && matchesCategory && matchesAvailability
    })
  }, [products, searchTerm, categoryFilter, availabilityFilter])

  const hasActiveFilters =
    searchTerm ||
    categoryFilter !== "ALL" ||
    availabilityFilter !== "ALL"

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("ALL")
    setAvailabilityFilter("ALL")
  }

  const handleToggleAvailability = async (product) => {
    try {
      setUpdatingId(product.id)
      setError("")

      const updatedProduct = await updateProduct(product.id, {
        isAvailable: !product.isAvailable,
      })

      setProducts((prevProducts) =>
        prevProducts.map((currentProduct) =>
          currentProduct.id === product.id ? updatedProduct : currentProduct
        )
      )

      toast.success(
        updatedProduct.isAvailable
          ? "Product marked as available."
          : "Product marked as unavailable."
      )
    } catch (error) {
      const message = error.message || "Failed to update product."
      setError(message)
      toast.error(message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (!confirmDelete) return

    try {
      setDeletingId(productId)
      setError("")

      await deleteProduct(productId)

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      )

      toast.success("Product deleted successfully.")
    } catch (error) {
      const message = error.message || "Failed to delete product."
      setError(message)
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-orange-500 font-semibold mb-3">
                Admin Dashboard
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold">
                Manage Products
              </h1>

              <p className="text-gray-400 mt-3">
                Search, filter, edit, delete, and control product availability.
              </p>
            </div>

            <Link
              to="/admin/products/new"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition w-fit"
            >
              Add Product
            </Link>
          </div>

          <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Search Products
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, description, category"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="ALL" className="bg-black">
                    All Categories
                  </option>

                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-black">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Availability
                </label>

                <select
                  value={availabilityFilter}
                  onChange={(event) =>
                    setAvailabilityFilter(event.target.value)
                  }
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="ALL" className="bg-black">
                    All Products
                  </option>
                  <option value="AVAILABLE" className="bg-black">
                    Available
                  </option>
                  <option value="UNAVAILABLE" className="bg-black">
                    Unavailable
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-gray-400 text-sm">
                Showing{" "}
                <span className="text-orange-500 font-bold">
                  {filteredProducts.length}
                </span>{" "}
                of{" "}
                <span className="text-white font-bold">{products.length}</span>{" "}
                products
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="border border-white/10 hover:border-orange-500 px-5 py-2 rounded-full font-bold transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </section>

          {loading && <p className="text-gray-400">Loading products...</p>}

          {error && <p className="text-red-400 mb-6">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 text-center">
              <p className="text-gray-400">No products found.</p>
            </div>
          )}

          {!loading && products.length > 0 && filteredProducts.length === 0 && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 text-center">
              <p className="text-gray-400">
                No products match your current filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
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
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                        {product.category?.name}
                      </span>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold ${
                          product.isAvailable
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold mt-4">
                      {product.name}
                    </h2>

                    <p className="text-gray-400 text-sm mt-3">
                      {product.description}
                    </p>

                    <p className="text-orange-500 text-2xl font-extrabold mt-6">
                      Rs. {product.price}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-center border border-white/10 hover:border-orange-500 px-4 py-3 rounded-full font-bold transition"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(product)}
                        disabled={updatingId === product.id}
                        className="border border-white/10 hover:border-orange-500 px-4 py-3 rounded-full font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {updatingId === product.id
                          ? "Updating..."
                          : product.isAvailable
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deletingId === product.id}
                        className="col-span-2 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-full font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
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
    </AdminLayout>
  )
}

export default AdminProducts
