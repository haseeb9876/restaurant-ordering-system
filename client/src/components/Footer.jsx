import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <Link
            to="/"
            className="text-3xl font-extrabold text-orange-500"
          >
            Foodie<span className="text-white">Hub</span>
          </Link>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Modern restaurant ordering experience with delicious meals,
            fast delivery, and premium customer service.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-5">Quick Links</h3>

          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="/#menu" className="hover:text-orange-500">
                Menu
              </a>
            </li>

            <li>
              <a href="/#about" className="hover:text-orange-500">
                About
              </a>
            </li>

            <li>
              <a href="/#contact" className="hover:text-orange-500">
                Contact
              </a>
            </li>

            <li>
              <Link to="/profile" className="hover:text-orange-500">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-5">Contact</h3>

          <ul className="space-y-3 text-gray-400">
            <li>📍 Peshawar, Pakistan</li>
            <li>📞 +92 300 1234567</li>
            <li>✉ support@foodiehub.com</li>
            <li>⏰ 11 AM - 11 PM</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-5">
            Follow Us
          </h3>

          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full bg-zinc-950 border border-white/10 hover:border-orange-500 transition text-xl">
              📘
            </button>

            <button className="w-12 h-12 rounded-full bg-zinc-950 border border-white/10 hover:border-orange-500 transition text-xl">
              📸
            </button>

            <button className="w-12 h-12 rounded-full bg-zinc-950 border border-white/10 hover:border-orange-500 transition text-xl">
              🐦
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">
        © 2026 FoodieHub. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
