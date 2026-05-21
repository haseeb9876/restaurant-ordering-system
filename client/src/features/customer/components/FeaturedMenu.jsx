import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { getProducts } from "../../../services/api"
import { useCart } from "../../cart/context/CartContext"

const fallbackImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"

function isOutOfStock(item) {
  return item.trackInventory && item.stockQuantity <= 0
}

function isLowStock(item) {
  return (
    item.trackInventory &&
    item.stockQuantity > 0 &&
    item.stockQuantity <= item.lowStockThreshold
  )
}

function FeaturedSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden animate-pulse">
      <div className="h-64 bg-white/10" />

      <div className="p-6">
        <div className="h-5 w-24 bg-white/10 rounded-full mb-5" />
        <div className="h-7 w-3/4 bg-white/10 rounded mb-4" />
        <div className="h-4 w-full bg-white/10 rounded mb-3" />
        <div className="h-4 w-2/3 bg-white/10 rounded mb-6" />

        <div className="flex items-center justify-between">
          <div className="h-8 w-24 bg-white/10 rounded" />
          <div className="h-10 w-24 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function FeaturedMenu() {
  const [featuredItems, setFeaturedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { addToCart } = useCart()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setError("")

        const products = await getProducts()

        const availableProducts = products.filter(
          (product) => product.isAvailable
        )

        setFeaturedItems(availableProducts.slice(0, 3))
      } catch (error) {
        setError(error.message || "Failed to load featured dishes.")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = (item) => {
    if (isOutOfStock(item)) {
      toast.error(`${item.name} is out of stock.`)
      return
    }

    addToCart({
      id: item.id,
      name: item.name,
      category: item.category?.name || "Food",
      price: item.price,
      image: item.image || fallbackImage,
      trackInventory: item.trackInventory,
      stockQuantity: item.stockQuantity,
    })
  }

  return (
    <section className="bg-black text-white py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-orange-500 font-semibold mb-3">
              Featured Dishes
            </p>

            <h2 className="text-4xl md:text-5xl font-extrabold">
              Customer Favorites
            </h2>

            <p className="text-gray-400 mt-4 max-w-2xl">
              Popular dishes selected from the live restaurant menu.
            </p>
          </div>

          <a
            href="/#menu"
            className="self-start md:self-auto border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-bold transition"
          >
            View Full Menu
          </a>
        </div>

        {loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <FeaturedSkeleton key={item} />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-[2rem] p-8 text-center">
            <p className="text-red-300 font-bold">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && featuredItems.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredItems.map((item) => {
              const outOfStock = isOutOfStock(item)
              const lowStock = isLowStock(item)

              return (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:-translate-y-2 hover:border-orange-500/40 transition duration-300 shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={item.image || fallbackImage}
                      alt={item.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage
                      }}
                      className={`h-64 w-full object-cover ${
                        outOfStock ? "opacity-50 grayscale" : ""
                      }`}
                    />

                    {outOfStock && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Out of Stock
                      </span>
                    )}

                    {lowStock && (
                      <span className="absolute top-4 left-4 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                        Only {item.stockQuantity} left
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-sm bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                        {item.category?.name || "Food"}
                      </span>

                      <span className="text-yellow-400 font-semibold">
                        ⭐ 4.8
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3">
                      {item.name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-5 min-h-10">
                      {item.description || "Freshly prepared restaurant meal."}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      <p className="text-orange-500 text-2xl font-extrabold">
                        Rs. {item.price}
                      </p>

                      <button
                        type="button"
                        disabled={outOfStock}
                        onClick={() => handleAddToCart(item)}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed px-5 py-3 rounded-full font-bold transition"
                      >
                        {outOfStock ? "Unavailable" : "Add +"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && !error && featuredItems.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 text-center">
            <p className="text-2xl font-bold mb-3">
              No featured dishes available
            </p>

            <p className="text-gray-400">
              Add available products from the admin panel to display featured
              dishes here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedMenu
