import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import AdminLayout from "../layouts/AdminLayout"
import {
  getAdminSettings,
  updateAdminSettings,
} from "../../../services/api"

const initialFormData = {
  restaurantName: "",
  phone: "",
  email: "",
  address: "",
  jazzcashTitle: "",
  jazzcashNumber: "",
  easypaisaTitle: "",
  easypaisaNumber: "",
  bankName: "",
  bankAccountTitle: "",
  bankAccountNumber: "",
  bankIban: "",
  deliveryFee: 150,
  isOnlinePaymentOn: true,
  isCashOnDeliveryOn: true,
}

function AdminSettings() {
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setError("")

        const settings = await getAdminSettings()

        setFormData({
          restaurantName: settings.restaurantName || "",
          phone: settings.phone || "",
          email: settings.email || "",
          address: settings.address || "",
          jazzcashTitle: settings.jazzcashTitle || "",
          jazzcashNumber: settings.jazzcashNumber || "",
          easypaisaTitle: settings.easypaisaTitle || "",
          easypaisaNumber: settings.easypaisaNumber || "",
          bankName: settings.bankName || "",
          bankAccountTitle: settings.bankAccountTitle || "",
          bankAccountNumber: settings.bankAccountNumber || "",
          bankIban: settings.bankIban || "",
          deliveryFee: settings.deliveryFee ?? 150,
          isOnlinePaymentOn: settings.isOnlinePaymentOn ?? true,
          isCashOnDeliveryOn: settings.isCashOnDeliveryOn ?? true,
        })
      } catch (error) {
        const message = error.message || "Failed to load settings."
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.restaurantName.trim()) {
      toast.error("Restaurant name is required.")
      return
    }

    if (Number(formData.deliveryFee) < 0) {
      toast.error("Delivery fee cannot be negative.")
      return
    }

    try {
      setSaving(true)

      const updatedSettings = await updateAdminSettings({
        ...formData,
        deliveryFee: Number(formData.deliveryFee),
      })

      setFormData({
        restaurantName: updatedSettings.restaurantName || "",
        phone: updatedSettings.phone || "",
        email: updatedSettings.email || "",
        address: updatedSettings.address || "",
        jazzcashTitle: updatedSettings.jazzcashTitle || "",
        jazzcashNumber: updatedSettings.jazzcashNumber || "",
        easypaisaTitle: updatedSettings.easypaisaTitle || "",
        easypaisaNumber: updatedSettings.easypaisaNumber || "",
        bankName: updatedSettings.bankName || "",
        bankAccountTitle: updatedSettings.bankAccountTitle || "",
        bankAccountNumber: updatedSettings.bankAccountNumber || "",
        bankIban: updatedSettings.bankIban || "",
        deliveryFee: updatedSettings.deliveryFee ?? 150,
        isOnlinePaymentOn: updatedSettings.isOnlinePaymentOn ?? true,
        isCashOnDeliveryOn: updatedSettings.isCashOnDeliveryOn ?? true,
      })

      toast.success("Restaurant settings saved successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <main className="p-6">
        <div className="max-w-6xl">
          <div className="mb-8">
            <p className="text-orange-500 font-semibold mb-3">
              Restaurant Configuration
            </p>

            <h1 className="text-4xl font-extrabold">
              Settings
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl">
              Manage restaurant contact details, payment account information,
              delivery fee, and payment availability.
            </p>
          </div>

          {loading && (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
              <p className="text-gray-400">Loading settings...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {!loading && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Restaurant Details
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="0300 0000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="restaurant@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Delivery Fee
                    </label>
                    <input
                      type="number"
                      name="deliveryFee"
                      min="0"
                      value={formData.deliveryFee}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 resize-none"
                      placeholder="Restaurant address"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Payment Availability
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <label className="bg-black border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="font-bold">Online Payments</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Enable JazzCash, Easypaisa, and bank transfer details.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="isOnlinePaymentOn"
                      checked={formData.isOnlinePaymentOn}
                      onChange={handleChange}
                      className="w-5 h-5 accent-orange-500"
                    />
                  </label>

                  <label className="bg-black border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="font-bold">Cash on Delivery</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Allow customers to pay cash after delivery.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="isCashOnDeliveryOn"
                      checked={formData.isCashOnDeliveryOn}
                      onChange={handleChange}
                      className="w-5 h-5 accent-orange-500"
                    />
                  </label>
                </div>
              </section>

              <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                <h2 className="text-2xl font-bold mb-6">
                  JazzCash Details
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Account Title
                    </label>
                    <input
                      type="text"
                      name="jazzcashTitle"
                      value={formData.jazzcashTitle}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="Account holder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      JazzCash Number
                    </label>
                    <input
                      type="text"
                      name="jazzcashNumber"
                      value={formData.jazzcashNumber}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="03XX XXXXXXX"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Easypaisa Details
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Account Title
                    </label>
                    <input
                      type="text"
                      name="easypaisaTitle"
                      value={formData.easypaisaTitle}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="Account holder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Easypaisa Number
                    </label>
                    <input
                      type="text"
                      name="easypaisaNumber"
                      value={formData.easypaisaNumber}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="03XX XXXXXXX"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Bank Transfer Details
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="Meezan Bank"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Account Title
                    </label>
                    <input
                      type="text"
                      name="bankAccountTitle"
                      value={formData.bankAccountTitle}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="Account holder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="Account number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      IBAN
                    </label>
                    <input
                      type="text"
                      name="bankIban"
                      value={formData.bankIban}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                      placeholder="PK00..."
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed px-8 py-4 rounded-full font-bold transition"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </AdminLayout>
  )
}

export default AdminSettings
