import { useEffect, useState } from "react"
import { getCategories, getProducts } from "../services/api"
import { useCart } from "../context/CartContext"

function MenuSection({ selectedCategory, setSelectedCategory }) {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState(["All"])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { addToCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getProducts()
        const categoryData = await getCategories()

        const availableProducts = products.filter(
          (product) => product.isAvailable
        )

        setMenuItems(availableProducts)
        setCategories(["All", ...categoryData.map((category) => category.name)])
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || item.category.name === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <section id="menu" className="bg-zinc-950 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-orange-500 font-semibold mb-3">Full Menu</p>

          <h2 className="text-4xl md:text-5xl font-extrabold">
            Find Your Favorite Meal
          </h2>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-full px-6 py-4 outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-semibold transition ${
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
          <p className="text-center text-gray-400">Loading menu items...</p>
        )}

        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-black border border-white/10 rounded-[2rem] overflow-hidden hover:-translate-y-2 transition duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                      {item.category.name}
                    </span>

                    <span className="text-yellow-400 font-semibold">
                      ⭐ 4.8
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{item.name}</h3>

                  <p className="text-gray-400 text-sm mb-5">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-orange-500 text-2xl font-extrabold">
                      Rs. {item.price}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: item.name,
                          category: item.category.name,
                          price: item.price,
                          image: item.image,
                        })
                      }
                      className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-full font-bold transition"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No available food item found.
          </p>
        )}
      </div>
    </section>
  )
}

export default MenuSection
