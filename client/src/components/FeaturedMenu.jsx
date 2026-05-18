import { menuItems } from "../data/menuData"
import { useCart } from "../context/CartContext"

function FeaturedMenu() {
  const { addToCart } = useCart()

  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-orange-500 font-semibold mb-3">
              Featured Dishes
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold">
              Customer Favorites
            </h2>
          </div>

          <button className="self-start md:self-auto border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-bold transition">
            View Full Menu
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:-translate-y-2 transition duration-300 shadow-xl"
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
                    type="button"
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
      </div>
    </section>
  )
}

export default FeaturedMenu
