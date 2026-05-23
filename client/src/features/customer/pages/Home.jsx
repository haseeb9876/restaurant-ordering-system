import { useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Categories from "../components/Categories"
import FeaturedMenu from "../components/FeaturedMenu"
import MenuSection from "../components/MenuSection"
import MenuSearchBar from "../components/MenuSearchBar"
import About from "../components/About"
import Contact from "../components/Contact"
import Footer from "../components/Footer"
import CartSidebar from "../../cart/components/CartSidebar"
import MobileBottomNav from "../components/MobileBottomNav"
import FloatingCheckoutBar from "../components/FloatingCheckoutBar"

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <Hero />

      <MenuSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Categories
        setSelectedCategory={setSelectedCategory}
      />

      <FeaturedMenu />

      <div id="menu">
        <MenuSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
        />
      </div>
      <About />
      <Contact />
      <Footer />
      <FloatingCheckoutBar />
      <MobileBottomNav />
    </div>
  )
}

export default Home
