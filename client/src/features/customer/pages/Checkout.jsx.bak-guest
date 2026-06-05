import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import MobileBottomNav from "../components/MobileBottomNav"
import { useCart } from "../../cart/context/CartContext"
import { useAuth } from "../../auth/context/AuthContext"
import {
  createOrder,
  getPublicSettings,
} from "../../../services/api"

function formatPaymentMethod(method) {
  if (method === "CASH_ON_DELIVERY") return "Cash on Delivery"
  if (method === "JAZZCASH") return "JazzCash"
  if (method === "EASYPAISA") return "Easypaisa"
  if (method === "BANK_TRANSFER") return "Bank Transfer"

  return method || "Payment"
}

function Checkout() {
  const { cartItems, clearCart, saveLatestOrder } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [settings, setSettings] = useState(null)
  const [loadingSettings, setLoadingSettings] = useState(true)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: "",
    email: user?.email || "",
    address: "",
    notes: "",
    paymentMethod: "CASH_ON_DELIVERY",
    transactionId: "",
  })

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const baseDeliveryFee = settings?.deliveryFee || 0
  const freeDeliveryEnabled = settings?.freeDeliveryEnabled || false
  const freeDeliveryMinimumOrder =
    settings?.freeDeliveryMinimumOrder || 600

  const isFreeDeliveryApplied =
    cartItems.length > 0 &&
    freeDeliveryEnabled &&
    subtotal >= freeDeliveryMinimumOrder

  const remainingForFreeDelivery =
    freeDeliveryEnabled && subtotal < freeDeliveryMinimumOrder
      ? freeDeliveryMinimumOrder - subtotal
      : 0

  const deliveryFee =
    cartItems.length > 0
      ? isFreeDeliveryApplied
        ? 0
        : baseDeliveryFee
      : 0

  const total = subtotal + deliveryFee

  const paymentAccounts = useMemo(() => {
    if (!settings) return []

    const methods = []

    if (settings.isCashOnDeliveryOn) {
      methods.push({
        key: "CASH_ON_DELIVERY",
        title: "Cash on Delivery",
        description: "Pay when your food is delivered.",
      })
    }

    if (settings.isOnlinePaymentOn) {
      if (settings.jazzcashNumber) {
        methods.push({
          key: "JAZZCASH",
          title: "JazzCash",
          description: "Send payment to JazzCash and enter transaction ID.",
          details: [
            ["Account Title", settings.jazzcashTitle],
            ["Number", settings.jazzcashNumber],
          ],
        })
      }

      if (settings.easypaisaNumber) {
        methods.push({
          key: "EASYPAISA",
          title: "Easypaisa",
          description: "Send payment to Easypaisa and enter transaction ID.",
          details: [
            ["Account Title", settings.easypaisaTitle],
            ["Number", settings.easypaisaNumber],
          ],
        })
      }

      if (settings.bankAccountNumber || settings.bankIban) {
        methods.push({
          key: "BANK_TRANSFER",
          title: "Bank Transfer",
          description: "Transfer payment to bank and enter transaction ID.",
          details: [
            ["Bank Name", settings.bankName],
            ["Account Title", settings.bankAccountTitle],
            ["Account Number", settings.bankAccountNumber],
            ["IBAN", settings.bankIban],
          ],
        })
      }
    }

    return methods
  }, [settings])

  const selectedPaymentMethod = paymentAccounts.find(
    (method) => method.key === formData.paymentMethod
  )

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/checkout")
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoadingSettings(true)

        const publicSettings = await getPublicSettings()
        setSettings(publicSettings)
      } catch (error) {
        setError(error.message || "Failed to load restaurant settings.")
      } finally {
        setLoadingSettings(false)
      }
    }

    fetchSettings()
  }, [])

  useEffect(() => {
    if (paymentAccounts.length === 0) return

    const selectedStillAvailable = paymentAccounts.some(
      (method) => method.key === formData.paymentMethod
    )

    if (!selectedStillAvailable) {
      setFormData((currentData) => ({
        ...currentData,
        paymentMethod: paymentAccounts[0].key,
        transactionId: "",
      }))
    }
  }, [paymentAccounts, formData.paymentMethod])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePlaceOrder = async () => {
    setError("")

    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add food items before checkout.")
      return
    }

    if (loadingSettings) {
      setError("Restaurant settings are still loading. Please wait.")
      return
    }

    if (paymentAccounts.length === 0) {
      setError("No payment method is currently available. Please contact the restaurant.")
      return
    }

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.address
    ) {
      setError("Please fill all required fields.")
      return
    }

    if (
      formData.paymentMethod !== "CASH_ON_DELIVERY" &&
      !formData.transactionId.trim()
    ) {
      setError("Transaction ID is required for online payment.")
      return
    }

    try {
      setIsSubmitting(true)

      const orderPayload = {
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        address: formData.address,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        items: cartItems.map((item) => ({
          id: item.id,
          variantId: item.variantId || null,
          quantity: item.quantity,
        })),
      }

      const createdOrder = await createOrder(orderPayload)

      const latestOrderData = {
        orderId: createdOrder.orderNumber,
        customer: {
          fullName: createdOrder.customerName,
          phone: createdOrder.customerPhone,
          email: createdOrder.customerEmail,
          address: createdOrder.address,
          notes: createdOrder.notes,
        },
        items: createdOrder.items.map((item) => ({
          id: item.product.id,
          name: item.variantName
            ? `${item.product.name} (${item.variantName})`
            : item.product.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: createdOrder.subtotal,
        deliveryFee: createdOrder.deliveryFee,
        total: createdOrder.total,
        status: createdOrder.status,
        paymentMethod: createdOrder.paymentMethod,
        paymentStatus: createdOrder.paymentStatus,
        transactionId: createdOrder.transactionId,
        estimatedTime: createdOrder.estimatedTime,
        createdAt: new Date(createdOrder.createdAt).toLocaleString(),
      }

      saveLatestOrder(latestOrderData)
      clearCart()
      navigate("/order-success")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CartSidebar />

      <main className="pt-28 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-500 font-semibold mb-3">
              Secure Checkout
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Complete Your Order
            </h1>

            <p className="text-gray-400 mt-3">
              Confirm your delivery details and payment method.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-4 rounded-2xl">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-8">
              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Delivery Information
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 md:col-span-2"
                  />

                  <textarea
                    name="address"
                    placeholder="Delivery Address *"
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 md:col-span-2"
                  ></textarea>

                  <textarea
                    name="notes"
                    placeholder="Order Notes (optional)"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 md:col-span-2"
                  ></textarea>
                </div>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Payment Method
                </h2>

                {loadingSettings ? (
                  <p className="text-gray-400">Loading payment methods...</p>
                ) : paymentAccounts.length === 0 ? (
                  <p className="text-red-400">
                    No payment method is currently available.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {paymentAccounts.map((method) => (
                      <label
                        key={method.key}
                        className={`block cursor-pointer rounded-2xl border p-5 transition ${
                          formData.paymentMethod === method.key
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-white/10 bg-black hover:border-orange-500/50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.key}
                            checked={formData.paymentMethod === method.key}
                            onChange={handleChange}
                            className="mt-1"
                          />

                          <div>
                            <h3 className="font-bold text-lg">
                              {method.title}
                            </h3>

                            <p className="text-gray-400 text-sm mt-1">
                              {method.description}
                            </p>

                            {method.details && (
                              <div className="mt-4 space-y-2 text-sm">
                                {method.details
                                  .filter(([, value]) => value)
                                  .map(([label, value]) => (
                                    <p key={label} className="text-gray-300">
                                      <span className="text-gray-500">
                                        {label}:
                                      </span>{" "}
                                      {value}
                                    </p>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {formData.paymentMethod !== "CASH_ON_DELIVERY" && (
                  <div className="mt-6">
                    <label className="block text-sm text-gray-400 mb-2">
                      Transaction ID *
                    </label>

                    <input
                      type="text"
                      name="transactionId"
                      placeholder="Enter payment transaction ID"
                      value={formData.transactionId}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                    />
                  </div>
                )}

                {selectedPaymentMethod && (
                  <p className="text-gray-500 text-sm mt-4">
                    Selected: {formatPaymentMethod(selectedPaymentMethod.key)}
                  </p>
                )}
              </div>
            </section>

            <aside className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 h-fit sticky top-28">
              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-400">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartKey}
                      className="flex justify-between gap-4 border-b border-white/10 pb-4"
                    >
                      <div>
                        <p className="font-bold">
                          {item.name}
                        </p>

                        {item.variantName && (
                          <p className="text-xs text-orange-400 mt-1">
                            {item.variantName}
                          </p>
                        )}

                        <p className="text-gray-400 text-sm">
                          Qty: {item.quantity} × Rs. {item.price}
                        </p>
                      </div>

                      <p className="text-orange-500 font-bold">
                        Rs. {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span>
                    {isFreeDeliveryApplied ? "Free" : `Rs. ${deliveryFee}`}
                  </span>
                </div>

                {remainingForFreeDelivery > 0 && (
                  <p className="text-yellow-400 text-sm">
                    Add Rs. {remainingForFreeDelivery} more for free delivery.
                  </p>
                )}

                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-extrabold">
                  <span>Total</span>
                  <span className="text-orange-500">Rs. {total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || loadingSettings || cartItems.length === 0}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed py-4 rounded-full font-bold transition"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </aside>
          </div>
        </div>
      </main>
          <MobileBottomNav />
    </div>
  )
}

export default Checkout
