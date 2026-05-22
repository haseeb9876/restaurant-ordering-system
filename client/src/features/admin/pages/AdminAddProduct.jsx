import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import AdminLayout from "../layouts/AdminLayout"
import {
  createProduct,
  getCategories,
  uploadProductImage,
} from "../../../services/api"

const defaultVariant = { name: "", price: "", isAvailable: true }

function AdminAddProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    productType: "SIMPLE",
    isAvailable: true,
    trackInventory: false,
    stockQuantity: 0,
    lowStockThreshold: 5,
    variants: [
      { name: "Small", price: "", isAvailable: true },
      { name: "Medium", price: "", isAvailable: true },
      { name: "Large", price: "", isAvailable: true },
      { name: "X Large", price: "", isAvailable: true },
    ],
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        const message = error.message || "Failed to load categories."
        setError(message)
        toast.error(message)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleVariantChange = (index, field, value) => {
    setFormData((currentData) => {
      const updatedVariants = [...currentData.variants]

      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: field === "isAvailable" ? Boolean(value) : value,
      }

      return {
        ...currentData,
        variants: updatedVariants,
      }
    })
  }

  const addVariant = () => {
    setFormData((currentData) => ({
      ...currentData,
      variants: [...currentData.variants, { ...defaultVariant }],
    }))
  }

  const removeVariant = (index) => {
    setFormData((currentData) => ({
      ...currentData,
      variants: currentData.variants.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0]

    if (!imageFile) return

    if (!imageFile.type.startsWith("image/")) {
      const message = "Please select a valid image file."
      setError(message)
      toast.error(message)
      return
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      const message = "Image size must be less than 5MB."
      setError(message)
      toast.error(message)
      return
    }

    try {
      setUploadingImage(true)
      setError("")
      toast.loading("Uploading image...", { id: "product-image-upload" })

      const imageUrl = await uploadProductImage(imageFile)

      setFormData((prevData) => ({
        ...prevData,
        image: imageUrl,
      }))

      toast.success("Image uploaded successfully.", {
        id: "product-image-upload",
      })
    } catch (error) {
      const message =
        error.message ||
        "Image upload failed. Check Cloudinary keys and try again."

      setError(message)
      toast.error(message, { id: "product-image-upload" })
    } finally {
      setUploadingImage(false)
    }
  }

  const validateForm = () => {
    const trimmedName = formData.name.trim()
    const trimmedDescription = formData.description.trim()
    const trimmedImage = formData.image.trim()
    const price = Number(formData.price)
    const stockQuantity = Number(formData.stockQuantity)
    const lowStockThreshold = Number(formData.lowStockThreshold)

    if (!trimmedName) {
      return { isValid: false, message: "Product name is required." }
    }

    if (!formData.price || price <= 0) {
      return { isValid: false, message: "Base price must be greater than 0." }
    }

    if (!trimmedImage) {
      return {
        isValid: false,
        message:
          "Product image is required. Upload an image first or paste an image URL.",
      }
    }

    if (!formData.categoryId) {
      return { isValid: false, message: "Please select a category." }
    }

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      return { isValid: false, message: "Stock quantity cannot be negative." }
    }

    if (Number.isNaN(lowStockThreshold) || lowStockThreshold < 0) {
      return { isValid: false, message: "Low stock threshold cannot be negative." }
    }

    const cleanVariants = formData.variants
      .map((variant) => ({
        name: variant.name.trim(),
        price: Number(variant.price),
        isAvailable: variant.isAvailable,
      }))
      .filter((variant) => variant.name || variant.price)

    if (formData.productType === "VARIANT") {
      if (cleanVariants.length === 0) {
        return {
          isValid: false,
          message: "Variant products need at least one size/option.",
        }
      }

      const invalidVariant = cleanVariants.find(
        (variant) =>
          !variant.name ||
          Number.isNaN(variant.price) ||
          variant.price <= 0
      )

      if (invalidVariant) {
        return {
          isValid: false,
          message: "Every variant must have a name and price greater than 0.",
        }
      }
    }

    return {
      isValid: true,
      data: {
        name: trimmedName,
        description: trimmedDescription,
        price,
        image: trimmedImage,
        categoryId: Number(formData.categoryId),
        productType: formData.productType,
        isAvailable: formData.isAvailable,
        trackInventory: formData.trackInventory,
        stockQuantity,
        lowStockThreshold,
        variants:
          formData.productType === "VARIANT"
            ? cleanVariants
            : [],
      },
    }
  }

  const handleSubmit = async () => {
    setError("")

    if (uploadingImage) {
      const message = "Please wait until image upload completes."
      setError(message)
      toast.error(message)
      return
    }

    const validation = validateForm()

    if (!validation.isValid) {
      setError(validation.message)
      toast.error(validation.message)
      return
    }

    try {
      setLoading(true)
      await createProduct(validation.data)
      toast.success("Product created successfully.")
      navigate("/admin/products")
    } catch (error) {
      const message = error.message || "Failed to create product."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <main className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Admin Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Add Product
            </h1>

            <p className="text-gray-400 mt-3">
              Add simple items, deals, or pizza-style products with sizes.
            </p>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 md:p-8">
            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid gap-5">
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
              >
                <option value="SIMPLE" className="bg-black">
                  Simple Product
                </option>
                <option value="VARIANT" className="bg-black">
                  Product With Sizes / Variants
                </option>
                <option value="DEAL" className="bg-black">
                  Deal / Combo
                </option>
              </select>

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
                placeholder={
                  formData.productType === "VARIANT"
                    ? "Base / starting price *"
                    : "Price *"
                }
                value={formData.price}
                onChange={handleChange}
                className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
              />

              {formData.productType === "VARIANT" && (
                <div className="bg-black border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-lg font-bold">
                        Sizes / Variants
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Example: Small, Medium, Large, X Large.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addVariant}
                      className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full font-bold transition"
                    >
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 bg-zinc-950 border border-white/10 rounded-xl p-3"
                      >
                        <input
                          type="text"
                          placeholder="Variant name"
                          value={variant.name}
                          onChange={(event) =>
                            handleVariantChange(index, "name", event.target.value)
                          }
                          className="bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                        />

                        <input
                          type="number"
                          placeholder="Variant price"
                          value={variant.price}
                          onChange={(event) =>
                            handleVariantChange(index, "price", event.target.value)
                          }
                          className="bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                        />

                        <label className="flex items-center gap-2 text-gray-300">
                          <input
                            type="checkbox"
                            checked={variant.isAvailable}
                            onChange={(event) =>
                              handleVariantChange(
                                index,
                                "isAvailable",
                                event.target.checked
                              )
                            }
                          />
                          Active
                        </label>

                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-400 hover:text-red-300 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-black border border-white/10 rounded-xl p-4">
                <label className="block text-gray-300 font-semibold mb-3">
                  Product Image *
                </label>

                <label className="block cursor-pointer border border-dashed border-orange-500/50 hover:border-orange-500 rounded-xl p-5 text-center transition">
                  <span className="text-orange-500 font-bold">
                    Click to upload product image
                  </span>

                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, WEBP supported. Max 5MB.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="image"
                  placeholder="Or paste image URL here"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-4 w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                />

                {uploadingImage && (
                  <p className="text-orange-500 text-sm mt-3">
                    Uploading image...
                  </p>
                )}

                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-56 object-cover rounded-xl border border-white/10"
                    />

                    <p className="text-xs text-green-400 mt-2">
                      Image ready.
                    </p>
                  </div>
                )}
              </div>

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

              <div className="bg-black border border-white/10 rounded-xl p-4">
                <label className="flex items-center gap-3 text-gray-300 font-semibold">
                  <input
                    type="checkbox"
                    name="trackInventory"
                    checked={formData.trackInventory}
                    onChange={handleChange}
                  />
                  Track inventory for this product
                </label>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Stock Quantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  />

                  <input
                    type="number"
                    name="lowStockThreshold"
                    placeholder="Low Stock Alert Threshold"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    min="0"
                    className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  If inventory tracking is enabled and stock becomes 0, the product will automatically become unavailable.
                </p>
              </div>

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
                disabled={loading || uploadingImage}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-4 rounded-full font-bold transition"
              >
                {loading ? "Creating Product..." : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  )
}

export default AdminAddProduct
