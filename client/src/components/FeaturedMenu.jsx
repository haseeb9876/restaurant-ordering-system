import { useEffect, useState } from "react"
import { getProducts } from "../services/api"
import { useCart } from "../features/cart/context/CartContext"

function FeaturedMenu() {
  const [featuredItems, setFeaturedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { addToCart } = useCart()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getProducts()

        const availableProducts = products.filter(
          (product) => product.isAvailable
        )

        setFeaturedItems(availableProducts.slice(0, 3))
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

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

          <a
            href="/#menu"
            className="self-start md:self-auto border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-bold transition"
          >
            View Full Menu
          </a>
        </div>

        {loading && (
          <p className="text-center text-gray-400">
            Loading featured dishes...
          </p>
        )}

        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
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

        {!loading && !error && featuredItems.length === 0 && (
          <p className="text-center text-gray-400">
            No featured dishes available.
          </p>
        )}
      </div>
    </section>
  )
}

export default FeaturedMenu
