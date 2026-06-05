import { useEffect, useState } from "react"
import { getCategories } from "../../../services/api"

function CategoryChips({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState(["All"])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(["All", ...data.map((category) => category.name)])
      } catch {
        setCategories(["All"])
      }
    }

    fetchCategories()
  }, [])

  const handleSelect = (category) => {
    setSelectedCategory(category)

    document
      .getElementById("menu")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="sticky top-[137px] md:top-[132px] z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleSelect(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-extrabold border transition whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-zinc-950 border-white/10 text-gray-300 hover:border-orange-500 hover:text-orange-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryChips
