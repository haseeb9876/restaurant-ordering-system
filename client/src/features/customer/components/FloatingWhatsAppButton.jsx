import { useEffect, useState } from "react"
import { getPublicSettings } from "../../../services/api"

function FloatingWhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPublicSettings()
        setWhatsappNumber(data.whatsappNumber || "")
      } catch {
        setWhatsappNumber("")
      }
    }

    fetchSettings()
  }, [])

  if (!whatsappNumber) return null

  const cleanNumber = whatsappNumber.replace(/\D/g, "")
  const message = encodeURIComponent(
    "Hello, I want to ask about my food order."
  )

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 bottom-24 md:bottom-6 z-[998] bg-green-500 hover:bg-green-600 text-white shadow-2xl shadow-green-500/30 rounded-full px-4 py-3 flex items-center gap-2 font-extrabold transition hover:-translate-y-1"
      aria-label="Contact restaurant on WhatsApp"
    >
      <span className="text-2xl">💬</span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}

export default FloatingWhatsAppButton
