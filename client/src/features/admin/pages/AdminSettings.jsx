import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import AdminLayout from "../layouts/AdminLayout"

import {
  getAdminSettings,
  updateAdminSettings,
  uploadProductImage,
} from "../../../services/api"

const initialFormData = {
  restaurantName: "",
  logoUrl: "",
  heroImageUrl: "",
  phone: "",
  email: "",
  address: "",
  openingHours: "",
  aboutTitle: "",
  aboutDescription: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  whatsappNumber: "",
  jazzcashTitle: "",
  jazzcashNumber: "",
  easypaisaTitle: "",
  easypaisaNumber: "",
  bankName: "",
  bankAccountTitle: "",
  bankAccountNumber: "",
  bankIban: "",
  deliveryFee: 150,
  freeDeliveryEnabled: false,
  freeDeliveryMinimumOrder: 600,
  isOnlinePaymentOn: true,
  isCashOnDeliveryOn: true,
}

function AdminSettings() {
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [error, setError] = useState("")

  const normalizeSettings = (settings) => ({
    restaurantName: settings.restaurantName || "",
    logoUrl: settings.logoUrl || "",
    heroImageUrl: settings.heroImageUrl || "",
    phone: settings.phone || "",
    email: settings.email || "",
    address: settings.address || "",
    openingHours: settings.openingHours || "",
    aboutTitle: settings.aboutTitle || "",
    aboutDescription: settings.aboutDescription || "",
    facebookUrl: settings.facebookUrl || "",
    instagramUrl: settings.instagramUrl || "",
    tiktokUrl: settings.tiktokUrl || "",
    whatsappNumber: settings.whatsappNumber || "",
    jazzcashTitle: settings.jazzcashTitle || "",
    jazzcashNumber: settings.jazzcashNumber || "",
    easypaisaTitle: settings.easypaisaTitle || "",
    easypaisaNumber: settings.easypaisaNumber || "",
    bankName: settings.bankName || "",
    bankAccountTitle: settings.bankAccountTitle || "",
    bankAccountNumber: settings.bankAccountNumber || "",
    bankIban: settings.bankIban || "",
    deliveryFee: settings.deliveryFee ?? 150,
    freeDeliveryEnabled: settings.freeDeliveryEnabled ?? false,
    freeDeliveryMinimumOrder:
      settings.freeDeliveryMinimumOrder ?? 600,
    isOnlinePaymentOn: settings.isOnlinePaymentOn ?? true,
    isCashOnDeliveryOn: settings.isCashOnDeliveryOn ?? true,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setError("")

        const response = await getAdminSettings()
        const settings = response.data ? response.data : response

        setFormData(normalizeSettings(settings))
      } catch (error) {
        setError(error.message || "Failed to load settings.")
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

  const uploadImageToField = async (file, fieldName, setUploading) => {
    if (!file) return

    try {
      setUploading(true)

      const imageUrl = await uploadProductImage(file)

      setFormData((currentData) => ({
        ...currentData,
        [fieldName]: imageUrl,
      }))

      toast.success("Image uploaded successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to upload image.")
    } finally {
      setUploading(false)
    }
  }

  const handleLogoUpload = async (event) => {
    await uploadImageToField(
      event.target.files?.[0],
      "logoUrl",
      setUploadingLogo
    )
  }

  const handleHeroUpload = async (event) => {
    await uploadImageToField(
      event.target.files?.[0],
      "heroImageUrl",
      setUploadingHero
    )
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

    if (Number(formData.freeDeliveryMinimumOrder) < 0) {
      toast.error("Free delivery minimum order cannot be negative.")
      return
    }

    try {
      setSaving(true)

      const updatedSettings = await updateAdminSettings({
        ...formData,
        deliveryFee: Number(formData.deliveryFee),
        freeDeliveryMinimumOrder: Number(
          formData.freeDeliveryMinimumOrder
        ),
      })

      setFormData(normalizeSettings(updatedSettings))

      toast.success("Restaurant settings saved successfully.")
    } catch (error) {
      toast.error(error.message || "Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-gray-400">Loading settings...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Restaurant Settings
            </p>

            <h1 className="text-4xl font-extrabold">
              Business Configuration
            </h1>

            <p className="text-gray-400 mt-3">
              Manage branding, hero image, contact information, social links,
              delivery rules, payment details, and customer-facing settings.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">Branding</h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Restaurant Name"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="Restaurant Logo URL"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Logo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                {uploadingLogo && (
                  <p className="text-orange-500 text-sm mt-3">
                    Uploading logo...
                  </p>
                )}
              </div>

              {formData.logoUrl && (
                <div className="mt-6">
                  <p className="text-sm text-gray-400 mb-3">
                    Logo Preview
                  </p>

                  <img
                    src={formData.logoUrl}
                    alt="Restaurant Logo"
                    className="w-28 h-28 object-cover rounded-2xl border border-white/10 bg-black"
                  />
                </div>
              )}
            </section>

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Hero Cover Image
              </h2>

              <input
                type="text"
                name="heroImageUrl"
                value={formData.heroImageUrl}
                onChange={handleChange}
                placeholder="Hero Image URL"
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <div className="mt-5">
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Hero Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  disabled={uploadingHero}
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                {uploadingHero && (
                  <p className="text-orange-500 text-sm mt-3">
                    Uploading hero image...
                  </p>
                )}
              </div>

              {formData.heroImageUrl && (
                <div className="mt-6">
                  <p className="text-sm text-gray-400 mb-3">
                    Hero Preview
                  </p>

                  <img
                    src={formData.heroImageUrl}
                    alt="Hero Preview"
                    className="w-full max-h-80 object-cover rounded-2xl border border-white/10 bg-black"
                  />
                </div>
              )}
            </section>

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Basic Business Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Business Email"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleChange}
                  placeholder="Opening Hours"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="number"
                  name="deliveryFee"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  placeholder="Delivery Fee"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />
              </div>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Restaurant Address"
                className="mt-5 w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />
            </section>

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Delivery Rules
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <label className="bg-black border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <p className="font-bold">Free Delivery</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Enable free delivery after a minimum order amount.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="freeDeliveryEnabled"
                    checked={formData.freeDeliveryEnabled}
                    onChange={handleChange}
                    className="w-5 h-5 accent-orange-500"
                  />
                </label>

                <input
                  type="number"
                  name="freeDeliveryMinimumOrder"
                  min="0"
                  value={formData.freeDeliveryMinimumOrder}
                  onChange={handleChange}
                  placeholder="Free Delivery Minimum Order"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />
              </div>
            </section>

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">About Section</h2>

              <div className="space-y-5">
                <input
                  type="text"
                  name="aboutTitle"
                  value={formData.aboutTitle}
                  onChange={handleChange}
                  placeholder="About Section Title"
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <textarea
                  name="aboutDescription"
                  value={formData.aboutDescription}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Restaurant About Description"
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />
              </div>
            </section>

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Social & Contact Links
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  placeholder="Facebook URL e.g. https://facebook.com"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="Instagram URL e.g. https://instagram.com"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="tiktokUrl"
                  value={formData.tiktokUrl}
                  onChange={handleChange}
                  placeholder="TikTok URL e.g. https://tiktok.com"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="WhatsApp Number"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />
              </div>
            </section>

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Payment Availability
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <label className="bg-black border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <p className="font-bold">Online Payments</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Enable JazzCash, Easypaisa, and bank transfer.
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

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">
                JazzCash Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="jazzcashTitle"
                  value={formData.jazzcashTitle}
                  onChange={handleChange}
                  placeholder="JazzCash Account Title"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="jazzcashNumber"
                  value={formData.jazzcashNumber}
                  onChange={handleChange}
                  placeholder="JazzCash Number"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />
              </div>
            </section>

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Easypaisa Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="easypaisaTitle"
                  value={formData.easypaisaTitle}
                  onChange={handleChange}
                  placeholder="Easypaisa Account Title"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="easypaisaNumber"
                  value={formData.easypaisaNumber}
                  onChange={handleChange}
                  placeholder="Easypaisa Number"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />
              </div>
            </section>

            <section className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Bank Transfer Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="bankAccountTitle"
                  value={formData.bankAccountTitle}
                  onChange={handleChange}
                  placeholder="Bank Account Title"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  placeholder="Bank Account Number"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="text"
                  name="bankIban"
                  value={formData.bankIban}
                  onChange={handleChange}
                  placeholder="IBAN"
                  className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
                />
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || uploadingLogo || uploadingHero}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed px-8 py-4 rounded-full font-bold transition"
              >
                {saving ? "Saving Settings..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminLayout>
  )
}

export default AdminSettings
