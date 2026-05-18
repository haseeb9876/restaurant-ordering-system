import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Categories from "../components/Categories"
import FeaturedMenu from "../components/FeaturedMenu"
import MenuSection from "../components/MenuSection"
import About from "../components/About"
import Contact from "../components/Contact"
import Footer from "../components/Footer"
import CartSidebar from "../components/CartSidebar"

function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <Hero />
      <Categories />
      <FeaturedMenu />
      <MenuSection />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
