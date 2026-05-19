import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../components/CartSidebar"
import {
  getCategories,
  getProduct,
  updateProduct,
} from "../services/api"

function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    isAvailable: true,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [product, categoryData] = await Promise.all([
          getProduct(id),
          getCategories(),
        ])

        setCategories(categoryData)

        setFormData({
          name: product.name,
          description: product.description || "",
          price: product.price,
          image: product.image,
          categoryId: product.categoryId,
          isAvailable: product.isAvailable,
        })
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async () => {
    setError("")

    if (
      !formData.name ||
      !formData.price ||
      !formData.image ||
      !formData.categoryId
    ) {
      setError("Name, price, image, and category are required.")
      return
    }

    try {
      setSubmitting(true)

      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
      })

      navigate("/admin/products")
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Admin Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Edit Product
            </h1>
          </div>

          {loading && <p className="text-gray-400">Loading product...</p>}

          {!loading && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 md:p-8">
              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                />

                <textarea
                  name="description"
                  placeholder="Product Description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                ></textarea>

                <input
                  type="number"
                  name="price"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="image"
                  placeholder="Image URL *"
                  value={formData.image}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                />

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                >
                  <option value="">Select Category *</option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-black"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-3 text-gray-300">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  Product is available
                </label>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-4 rounded-full font-bold transition"
                >
                  {submitting ? "Updating Product..." : "Update Product"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminEditProduct
