import { useEffect, useState } from "react"
import { getPublicSettings } from "../../../services/api"

function About() {
  const [settings, setSettings] = useState({
    restaurantName: "Restaurant",

    aboutDescription:
      "Modern restaurant ordering platform designed to make food ordering simple, beautiful, and fast. Customers can explore meals, add items to cart, checkout securely, and track their order experience with ease.",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings()

        setSettings({
          restaurantName:
            data.restaurantName || "Restaurant",

          aboutDescription:
            data.aboutDescription ||
            "Modern restaurant ordering platform designed to make food ordering simple, beautiful, and fast.",
        })
      } catch {
        // Keep fallback values
      }
    }

    fetchSettings()
  }, [])

  return (
    <section
      id="about"
      className="py-24 px-6 bg-zinc-950 text-white"
    >
      <div className="max-w-5xl mx-auto text-center">

        <p className="text-orange-500 font-semibold mb-4">
          About Us
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold">
          Welcome To {settings.restaurantName}
        </h2>

        <p className="text-gray-400 text-lg mt-8 leading-relaxed">
          {settings.aboutDescription}
        </p>

      </div>
    </section>
  )
}

export default About
