import { useCart } from "../../cart/context/CartContext"

function RecentlyOrdered() {
  const { orderHistory, addToCart } = useCart()

  const recentItems = []

  orderHistory.forEach((order) => {
    order.items?.forEach((item) => {
      const key = item.variantId ? `${item.id}-${item.variantId}` : `${item.id}`

      if (!recentItems.some((currentItem) => currentItem.key === key)) {
        recentItems.push({
          key,
          ...item,
        })
      }
    })
  })

  const visibleItems = recentItems
    .filter((item) => item.image)
    .slice(0, 6)

  if (visibleItems.length === 0) return null

  return (
    <section className="bg-black text-white px-4 md:px-6 py-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-orange-500 font-semibold mb-1">
              Welcome Back
            </p>

            <h2 className="text-2xl md:text-3xl font-extrabold">
              Order Again
            </h2>
          </div>

          <a
            href="#menu"
            className="text-sm font-bold text-orange-400 hover:text-orange-300"
          >
            Full Menu
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {visibleItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                addToCart({
                  id: item.id,
                  variantId: item.variantId || null,
                  variantName: item.variantName || "",
                  name: item.name,
                  category: item.category || "Food",
                  price: item.price,
                  image: item.image,
                })
              }
              className="min-w-[220px] bg-zinc-950 border border-white/10 rounded-2xl p-3 text-left hover:border-orange-500 transition"
            >
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />

                <div className="min-w-0">
                  <h3 className="font-bold line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-orange-500 font-extrabold mt-1">
                    Rs. {item.price}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Tap to add
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentlyOrdered
