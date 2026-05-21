import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { getCategories, getProducts } from "../../../services/api"
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

function MenuCardSkeleton() {
  return (
    <div className="bg-black border border-white/10 rounded-[2rem] overflow-hidden animate-pulse">
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

function MenuSection({ selectedCategory, setSelectedCategory }) {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState(["All"])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { addToCart, syncCartWithAvailableProducts } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("")

        const [products, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ])

        const visibleProducts = products.filter((product) => product.isAvailable)

        setMenuItems(visibleProducts)

        setCategories([
          "All",
          ...categoryData.map((category) => category.name),
        ])

        const removedItems =
          syncCartWithAvailableProducts(visibleProducts)

        if (removedItems.length > 0) {
          toast.error(
            `${removedItems[0].name} was removed because it is unavailable.`
          )
        }
      } catch (error) {
        setError(error.message || "Failed to load menu.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 5000)

    return () => clearInterval(interval)
  }, [syncCartWithAvailableProducts])

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return menuItems.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        [item.name, item.description, item.category?.name]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch)
          )

      const matchesCategory =
        selectedCategory === "All" ||
        item.category?.name === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [menuItems, search, selectedCategory])

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
    <section id="menu" className="bg-zinc-950 text-white py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-orange-500 font-semibold mb-3">
            Full Menu
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold">
            Find Your Favorite Meal
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Search by food name, description, or category and add your favorite
            dishes to cart instantly.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search food, category, or flavor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-full px-6 py-4 outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 mb-12 overflow-x-auto pb-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-5 py-3 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <MenuCardSkeleton key={item} />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-[2rem] p-8 text-center">
            <p className="text-red-300 font-bold">
              {error}
            </p>

            <p className="text-red-200/80 text-sm mt-2">
              Please refresh the page or try again later.
            </p>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const outOfStock = isOutOfStock(item)
              const lowStock = isLowStock(item)

              return (
                <div
                  key={item.id}
                  className="bg-black border border-white/10 rounded-[2rem] overflow-hidden hover:-translate-y-2 hover:border-orange-500/40 transition duration-300"
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

        {!loading && !error && filteredItems.length === 0 && (
          <div className="bg-black border border-white/10 rounded-[2rem] p-10 text-center">
            <p className="text-2xl font-bold mb-3">
              No food item found
            </p>

            <p className="text-gray-400 mb-6">
              Try changing the search text or selecting another category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("")
                setSelectedCategory("All")
              }}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition"
            >
              Reset Menu
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default MenuSection
