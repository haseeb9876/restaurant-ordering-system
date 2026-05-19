import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"

function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center bg-zinc-950 border border-white/10 rounded-[2rem] p-10">
          <p className="text-orange-500 font-semibold mb-4">
            404 - Page Not Found
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            This page does not exist
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            The link may be incorrect, or the page may have been moved.
          </p>

          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-bold transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}

export default NotFound
