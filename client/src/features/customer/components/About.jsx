import { useEffect, useState } from "react"
import { getPublicSettings } from "../../../services/api"

function About() {
  const [settings, setSettings] = useState({
    restaurantName: "FoodieHub",
    aboutTitle: "Fresh Food, Fast Delivery, Better Experience",
    aboutDescription:
      "FoodieHub is a modern restaurant ordering platform designed to make food ordering simple, beautiful, and fast. Customers can explore meals, add items to cart, checkout securely, and track their order experience with ease.",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings()

        setSettings({
          restaurantName: data.restaurantName || "FoodieHub",
          aboutTitle:
            data.aboutTitle ||
            "Fresh Food, Fast Delivery, Better Experience",
          aboutDescription:
            data.aboutDescription ||
            "FoodieHub is a modern restaurant ordering platform designed to make food ordering simple, beautiful, and fast.",
        })
      } catch {
        // Keep fallback values
      }
    }

    fetchSettings()
  }, [])

  return (
    <section id="about" className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-orange-500 font-semibold mb-3">
            About {settings.restaurantName}
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            {settings.aboutTitle}
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            {settings.aboutDescription}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5 text-center">
              <h3 className="text-3xl font-extrabold text-orange-500">50+</h3>
              <p className="text-gray-400 text-sm mt-2">Dishes</p>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5 text-center">
              <h3 className="text-3xl font-extrabold text-orange-500">Fast</h3>
              <p className="text-gray-400 text-sm mt-2">Service</p>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5 text-center">
              <h3 className="text-3xl font-extrabold text-orange-500">4.9</h3>
              <p className="text-gray-400 text-sm mt-2">Rating</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full"></div>

          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
            alt="Restaurant interior"
            className="relative rounded-[2rem] w-full h-[450px] object-cover border border-white/10 shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}

export default About
