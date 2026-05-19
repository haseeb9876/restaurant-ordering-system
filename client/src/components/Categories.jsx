import { useEffect, useState } from "react"
import { getCategories } from "../services/api"

const categoryIcons = {
  Pizza: "🍕",
  Burger: "🍔",
  Biryani: "🍛",
  Drinks: "🥤",
  Desserts: "🍰",
}

function Categories({ setSelectedCategory }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName)

    const menuSection = document.getElementById("menu")

    if (menuSection) {
      menuSection.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-zinc-950 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold mb-3">
            Popular Categories
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold">
            Explore Our Menu
          </h2>
        </div>

        {loading && (
          <p className="text-center text-gray-400">
            Loading categories...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-orange-500 hover:-translate-y-2 transition duration-300 cursor-pointer"
              >
                <div className="text-5xl mb-4">
                  {categoryIcons[category.name] || "🍽️"}
                </div>

                <h3 className="text-xl font-bold">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  {category.products.length} Items
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Categories
