import { useState } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Categories from "../components/Categories"
import FeaturedMenu from "../components/FeaturedMenu"
import MenuSection from "../components/MenuSection"
import About from "../components/About"
import Contact from "../components/Contact"
import Footer from "../components/Footer"
import CartSidebar from "../features/cart/components/CartSidebar"

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <Hero />
      <Categories setSelectedCategory={setSelectedCategory} />
      <FeaturedMenu />
      <MenuSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
