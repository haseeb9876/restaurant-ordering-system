import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"
import { getPublicSettings } from "../../../services/api"

const normalizeUrl = (url, fallbackUrl = "") => {
  if (!url) return fallbackUrl

  const cleanUrl = url.trim()

  if (!cleanUrl) return fallbackUrl

  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://")
  ) {
    return cleanUrl
  }

  return `https://${cleanUrl}`
}

function Footer() {
  const [settings, setSettings] = useState({
    restaurantName: "Restaurant",
    logoUrl: "",
    aboutDescription:
      "Modern restaurant ordering experience with delicious meals, fast delivery, and premium customer service.",
    address: "Peshawar, Pakistan",
    phone: "+92 300 1234567",
    email: "support@restaurant.com",
    openingHours: "11 AM - 11 PM",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    tiktokUrl: "https://tiktok.com",
    whatsappNumber: "",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings()

        setSettings({
          restaurantName: data.restaurantName || "Restaurant",
          logoUrl: data.logoUrl || "",
          aboutDescription:
            data.aboutDescription ||
            "Modern restaurant ordering experience with delicious meals, fast delivery, and premium customer service.",
          address: data.address || "Peshawar, Pakistan",
          phone: data.phone || "+92 300 1234567",
          email: data.email || "support@restaurant.com",
          openingHours: data.openingHours || "11 AM - 11 PM",
          facebookUrl: normalizeUrl(
            data.facebookUrl,
            "https://facebook.com"
          ),
          instagramUrl: normalizeUrl(
            data.instagramUrl,
            "https://instagram.com"
          ),
          tiktokUrl: normalizeUrl(
            data.tiktokUrl,
            "https://tiktok.com"
          ),
          whatsappNumber: data.whatsappNumber || "",
        })
      } catch {
        // Keep fallback values
      }
    }

    fetchSettings()
  }, [])

  const whatsappLink = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`
    : ""

  return (
    <footer className="bg-black border-t border-white/10 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-3">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt={settings.restaurantName}
                className="w-12 h-12 rounded-full object-cover border border-white/10"
              />
            )}

            <span className="text-3xl font-extrabold text-orange-500">
              {settings.restaurantName}
            </span>
          </Link>

          <p className="text-gray-400 mt-5 leading-relaxed">
            {settings.aboutDescription}
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
            <li>📍 {settings.address}</li>
            <li>📞 {settings.phone}</li>
            <li className="break-all">✉ {settings.email}</li>
            <li>⏰ {settings.openingHours}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-5">Follow Us</h3>

          <div className="flex gap-4 flex-wrap">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer"
              title="Facebook"
              className="w-12 h-12 rounded-full bg-zinc-950 border border-white/10 hover:border-blue-500 transition flex items-center justify-center text-lg"
            >
              <FaFacebookF />
            </a>

            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              title="Instagram"
              className="w-12 h-12 rounded-full bg-zinc-950 border border-white/10 hover:border-pink-500 transition flex items-center justify-center text-lg"
            >
              <FaInstagram />
            </a>

            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              title="TikTok"
              className="w-12 h-12 rounded-full bg-zinc-950 border border-white/10 hover:border-white transition flex items-center justify-center text-lg"
            >
              <FaTiktok />
            </a>

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                className="w-12 h-12 rounded-full bg-zinc-950 border border-white/10 hover:border-green-500 transition flex items-center justify-center text-lg"
              >
                <FaWhatsapp />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">
        © 2026 {settings.restaurantName}. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
