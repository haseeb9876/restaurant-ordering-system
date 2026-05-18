import { useState } from "react"
import { menuItems } from "../data/menuData"
import { useCart } from "../context/CartContext"

const categories = ["All", "Pizza", "Burger", "Biryani", "Drinks", "Desserts"]

function MenuSection() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const { addToCart } = useCart()

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory

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
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                activeCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

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
                    {item.category}
                  </span>
                  <span className="text-yellow-400 font-semibold">
                    ⭐ {item.rating}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-3">{item.name}</h3>

                <div className="flex items-center justify-between">
                  <p className="text-orange-500 text-2xl font-extrabold">
                    Rs. {item.price}
                  </p>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-full font-bold transition"
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No food item found.
          </p>
        )}
      </div>
    </section>
  )
}

export default MenuSection
