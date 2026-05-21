import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getPublicSettings } from "../../../services/api"

function Hero() {
  const [heroImage, setHeroImage] = useState(
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
  )

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getPublicSettings()

        if (settings.heroImageUrl) {
          setHeroImage(settings.heroImageUrl)
        }
      } catch {
        // Keep fallback image
      }
    }

    fetchSettings()
  }, [])

  return (
    <section className="min-h-screen flex items-center pt-24 px-6 bg-gradient-to-br from-black via-zinc-950 to-orange-950">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-500 font-semibold mb-4">
            Fresh • Fast • Delicious
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Order Your Favorite Food Online
          </h1>

          <p className="text-gray-300 mt-6 text-lg max-w-xl">
            Enjoy hot, fresh, and tasty meals delivered with a smooth online ordering experience.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <button className="bg-orange-500 hover:bg-orange-600 px-7 py-3 rounded-full font-bold transition">
              Explore Menu
            </button>

            <button className="border border-white/20 hover:border-orange-500 px-7 py-3 rounded-full font-bold transition">
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="w-80 h-80 md:w-[450px] md:h-[450px] mx-auto rounded-full bg-orange-500/20 blur-3xl absolute inset-0"></div>

          <motion.div
            className="relative bg-white/10 border border-white/10 rounded-[3rem] p-6 shadow-2xl"
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={heroImage}
              alt="Restaurant hero"
              className="rounded-[2rem] w-full h-[420px] object-cover"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
