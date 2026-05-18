const categories = [
  { id: 1, name: "Pizza", icon: "🍕", items: "12 Items" },
  { id: 2, name: "Burger", icon: "🍔", items: "9 Items" },
  { id: 3, name: "Biryani", icon: "🍛", items: "7 Items" },
  { id: 4, name: "Drinks", icon: "🥤", items: "15 Items" },
  { id: 5, name: "Desserts", icon: "🍰", items: "6 Items" },
]

function Categories() {
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-orange-500 hover:-translate-y-2 transition duration-300 cursor-pointer"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold">{category.name}</h3>
              <p className="text-sm text-gray-400 mt-2 group-hover:text-white">
                {category.items}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
