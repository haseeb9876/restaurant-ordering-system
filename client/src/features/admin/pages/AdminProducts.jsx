import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import {
  createCategory,
  deleteCategory,
  deleteProduct,
  getCategories,
  getProducts,
  updateCategory,
  updateProduct,
} from "../../../services/api"
import AdminLayout from "../layouts/AdminLayout"

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingCategoryName, setEditingCategoryName] = useState("")
  const [categoryActionId, setCategoryActionId] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL")
  const [inventoryFilter, setInventoryFilter] = useState("ALL")

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

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategoriesList(data)
    } catch (error) {
      toast.error(error.message || "Failed to load categories.")
    }
  }

  const refreshPageData = async () => {
    setLoading(true)
    await Promise.all([fetchProducts(), fetchCategories()])
  }

  useEffect(() => {
    refreshPageData()
  }, [])

  const categories = useMemo(() => {
    const apiCategoryNames = categoriesList
      .map((category) => category.name)
      .filter(Boolean)

    const productCategoryNames = products
      .map((product) => product.category?.name)
      .filter(Boolean)

    return [...new Set([...apiCategoryNames, ...productCategoryNames])]
  }, [categoriesList, products])

  const inventoryStats = useMemo(() => {
    const tracked = products.filter((product) => product.trackInventory)

    const lowStock = tracked.filter(
      (product) =>
        product.stockQuantity > 0 &&
        product.stockQuantity <= product.lowStockThreshold
    )

    const outOfStock = tracked.filter(
      (product) => product.stockQuantity === 0
    )

    return {
      tracked: tracked.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
    }
  }, [products])

  const categoryProductCounts = useMemo(() => {
    return products.reduce((counts, product) => {
      const categoryId = product.category?.id

      if (!categoryId) return counts

      return {
        ...counts,
        [categoryId]: (counts[categoryId] || 0) + 1,
      }
    }, {})
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

      const isLowStock =
        product.trackInventory &&
        product.stockQuantity > 0 &&
        product.stockQuantity <= product.lowStockThreshold

      const isOutOfStock =
        product.trackInventory && product.stockQuantity === 0

      const matchesInventory =
        inventoryFilter === "ALL" ||
        (inventoryFilter === "TRACKED" && product.trackInventory) ||
        (inventoryFilter === "LOW_STOCK" && isLowStock) ||
        (inventoryFilter === "OUT_OF_STOCK" && isOutOfStock) ||
        (inventoryFilter === "NOT_TRACKED" && !product.trackInventory)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesInventory
      )
    })
  }, [
    products,
    searchTerm,
    categoryFilter,
    availabilityFilter,
    inventoryFilter,
  ])

  const hasActiveFilters =
    searchTerm ||
    categoryFilter !== "ALL" ||
    availabilityFilter !== "ALL" ||
    inventoryFilter !== "ALL"

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("ALL")
    setAvailabilityFilter("ALL")
    setInventoryFilter("ALL")
  }

  const handleCreateCategory = async (event) => {
    event.preventDefault()

    const trimmedName = newCategoryName.trim()

    if (!trimmedName) {
      toast.error("Category name is required.")
      return
    }

    try {
      setCategoryLoading(true)
      await createCategory(trimmedName)
      setNewCategoryName("")
      await fetchCategories()
      toast.success("Category added successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to add category.")
    } finally {
      setCategoryLoading(false)
    }
  }

  const startEditCategory = (category) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  const cancelEditCategory = () => {
    setEditingCategoryId(null)
    setEditingCategoryName("")
  }

  const handleUpdateCategory = async (categoryId) => {
    const trimmedName = editingCategoryName.trim()

    if (!trimmedName) {
      toast.error("Category name is required.")
      return
    }

    try {
      setCategoryActionId(categoryId)
      await updateCategory(categoryId, trimmedName)
      cancelEditCategory()
      await refreshPageData()
      toast.success("Category updated successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to update category.")
    } finally {
      setCategoryActionId(null)
    }
  }

  const handleDeleteCategory = async (category) => {
    const productCount = categoryProductCounts[category.id] || 0

    if (productCount > 0) {
      toast.error("This category has products. Move or delete products first.")
      return
    }

    const confirmDelete = window.confirm(
      `Delete category "${category.name}"? This is only allowed when the category is empty.`
    )

    if (!confirmDelete) return

    try {
      setCategoryActionId(category.id)
      await deleteCategory(category.id)
      await fetchCategories()
      toast.success("Category deleted successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to delete category.")
    } finally {
      setCategoryActionId(null)
    }
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
      "Delete this product? If it exists in previous orders, it will be archived instead."
    )

    if (!confirmDelete) return

    try {
      setDeletingId(productId)
      setError("")

      const result = await deleteProduct(productId)

      if (result.data) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? result.data : product
          )
        )

        toast.success(result.message || "Product archived successfully.")
      } else {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        )

        toast.success(result.message || "Product deleted successfully.")
      }

      await fetchCategories()
    } catch (error) {
      const message = error.message || "Failed to delete product."
      setError(message)
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  const getInventoryBadge = (product) => {
    if (!product.trackInventory) {
      return (
        <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-400 font-bold">
          Stock Not Tracked
        </span>
      )
    }

    if (product.stockQuantity === 0) {
      return (
        <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold">
          Out of Stock
        </span>
      )
    }

    if (product.stockQuantity <= product.lowStockThreshold) {
      return (
        <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-bold">
          Low Stock
        </span>
      )
    }

    return (
      <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold">
        Stock OK
      </span>
    )
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
                Search, filter, edit, archive, monitor inventory, and manage
                menu categories.
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
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
              <div>
                <p className="text-orange-500 font-semibold mb-2">
                  Category Management
                </p>

                <h2 className="text-2xl font-extrabold">
                  Add, Edit, or Delete Empty Categories
                </h2>

                <p className="text-gray-400 text-sm mt-2">
                  Categories with products are protected and cannot be deleted.
                </p>
              </div>

              <form
                onSubmit={handleCreateCategory}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(event) =>
                    setNewCategoryName(event.target.value)
                  }
                  placeholder="New category name"
                  className="bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 min-w-[240px]"
                />

                <button
                  type="submit"
                  disabled={categoryLoading}
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {categoryLoading ? "Adding..." : "Add Category"}
                </button>
              </form>
            </div>

            {categoriesList.length === 0 ? (
              <p className="text-gray-400">No categories found.</p>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {categoriesList.map((category) => {
                  const productCount =
                    categoryProductCounts[category.id] || 0

                  const isEditing = editingCategoryId === category.id

                  return (
                    <div
                      key={category.id}
                      className="bg-black border border-white/10 rounded-2xl p-4"
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(event) =>
                              setEditingCategoryName(event.target.value)
                            }
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                          />

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateCategory(category.id)
                              }
                              disabled={categoryActionId === category.id}
                              className="flex-1 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {categoryActionId === category.id
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditCategory}
                              className="flex-1 border border-white/10 hover:border-orange-500 px-4 py-2 rounded-xl font-bold transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-lg">
                                {category.name}
                              </h3>

                              <p className="text-sm text-gray-400 mt-1">
                                {productCount} product
                                {productCount === 1 ? "" : "s"}
                              </p>
                            </div>

                            <span
                              className={`text-xs px-3 py-1 rounded-full font-bold ${
                                productCount > 0
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {productCount > 0 ? "Protected" : "Empty"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-5">
                            <button
                              type="button"
                              onClick={() => startEditCategory(category)}
                              className="border border-white/10 hover:border-orange-500 px-4 py-2 rounded-xl font-bold transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(category)}
                              disabled={
                                productCount > 0 ||
                                categoryActionId === category.id
                              }
                              className="border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {categoryActionId === category.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <button
              type="button"
              onClick={() => setInventoryFilter("TRACKED")}
              className="text-left bg-zinc-950 border border-white/10 hover:border-orange-500 rounded-2xl p-5 transition"
            >
              <p className="text-gray-400 text-sm mb-2">Tracked Products</p>
              <h2 className="text-3xl font-extrabold text-orange-500">
                {inventoryStats.tracked}
              </h2>
            </button>

            <button
              type="button"
              onClick={() => setInventoryFilter("LOW_STOCK")}
              className="text-left bg-zinc-950 border border-white/10 hover:border-yellow-500 rounded-2xl p-5 transition"
            >
              <p className="text-gray-400 text-sm mb-2">Low Stock</p>
              <h2 className="text-3xl font-extrabold text-yellow-400">
                {inventoryStats.lowStock}
              </h2>
            </button>

            <button
              type="button"
              onClick={() => setInventoryFilter("OUT_OF_STOCK")}
              className="text-left bg-zinc-950 border border-white/10 hover:border-red-500 rounded-2xl p-5 transition"
            >
              <p className="text-gray-400 text-sm mb-2">Out of Stock</p>
              <h2 className="text-3xl font-extrabold text-red-400">
                {inventoryStats.outOfStock}
              </h2>
            </button>
          </div>

          <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 mb-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
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
                    <option
                      key={category}
                      value={category}
                      className="bg-black"
                    >
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

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Inventory
                </label>

                <select
                  value={inventoryFilter}
                  onChange={(event) =>
                    setInventoryFilter(event.target.value)
                  }
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="ALL" className="bg-black">
                    All Inventory
                  </option>
                  <option value="TRACKED" className="bg-black">
                    Tracked
                  </option>
                  <option value="LOW_STOCK" className="bg-black">
                    Low Stock
                  </option>
                  <option value="OUT_OF_STOCK" className="bg-black">
                    Out of Stock
                  </option>
                  <option value="NOT_TRACKED" className="bg-black">
                    Not Tracked
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
                <span className="text-white font-bold">
                  {products.length}
                </span>{" "}
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

                    <p className="text-gray-400 text-sm mt-3 min-h-[40px]">
                      {product.description || "No description provided."}
                    </p>

                    <p className="text-orange-500 text-2xl font-extrabold mt-6">
                      Rs. {product.price}
                    </p>

                    <div className="mt-5 bg-black border border-white/10 rounded-2xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        {getInventoryBadge(product)}

                        {product.trackInventory && (
                          <span className="text-sm text-gray-300">
                            Stock:{" "}
                            <span className="font-bold text-white">
                              {product.stockQuantity}
                            </span>
                          </span>
                        )}
                      </div>

                      {product.trackInventory && (
                        <p className="text-xs text-gray-500 mt-3">
                          Low stock alert at {product.lowStockThreshold} item(s).
                        </p>
                      )}
                    </div>

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
                        {deletingId === product.id
                          ? "Processing..."
                          : "Delete / Archive"}
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
