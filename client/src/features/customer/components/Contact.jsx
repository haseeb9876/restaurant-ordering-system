import { useEffect, useState } from "react"
import { getPublicSettings } from "../../../services/api"

function Contact() {
  const [settings, setSettings] = useState({
    address: "Peshawar, Pakistan",
    phone: "+92 300 1234567",
    email: "support@foodiehub.com",
    openingHours: "Mon - Sun: 11:00 AM - 11:00 PM",
    whatsappNumber: "",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings()

        setSettings({
          address: data.address || "Peshawar, Pakistan",
          phone: data.phone || "+92 300 1234567",
          email: data.email || "support@foodiehub.com",
          openingHours:
            data.openingHours || "Mon - Sun: 11:00 AM - 11:00 PM",
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
    : null

  return (
    <section id="contact" className="bg-zinc-950 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold mb-3">
            Contact Us
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold">
            We Are Ready To Serve You
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-black border border-white/10 rounded-[2rem] p-8 text-center">
            <div className="text-5xl mb-5">📍</div>
            <h3 className="text-xl font-bold mb-3">Location</h3>
            <p className="text-gray-400">{settings.address}</p>
          </div>

          <div className="bg-black border border-white/10 rounded-[2rem] p-8 text-center">
            <div className="text-5xl mb-5">📞</div>
            <h3 className="text-xl font-bold mb-3">Phone</h3>
            <p className="text-gray-400">{settings.phone}</p>
          </div>

          <div className="bg-black border border-white/10 rounded-[2rem] p-8 text-center">
            <div className="text-5xl mb-5">✉️</div>
            <h3 className="text-xl font-bold mb-3">Email</h3>
            <p className="text-gray-400 break-all">{settings.email}</p>
          </div>

          <div className="bg-black border border-white/10 rounded-[2rem] p-8 text-center">
            <div className="text-5xl mb-5">⏰</div>
            <h3 className="text-xl font-bold mb-3">Opening Hours</h3>
            <p className="text-gray-400">{settings.openingHours}</p>
          </div>
        </div>

        {whatsappLink && (
          <div className="text-center mt-10">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-full font-bold transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

export default Contact
