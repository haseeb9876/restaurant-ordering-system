import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
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
          name: item.product.name,
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
              Checkout
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold">
              Complete Your Order
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <form className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-[2rem] p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">
                Customer Details
              </h2>

              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

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
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
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

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-5">
                  Payment Method
                </h2>

                {loadingSettings ? (
                  <div className="bg-black border border-white/10 rounded-2xl p-5">
                    <p className="text-gray-400">
                      Loading payment methods...
                    </p>
                  </div>
                ) : paymentAccounts.length === 0 ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                    <p className="text-red-300 font-bold">
                      No payment method is currently available.
                    </p>

                    <p className="text-red-200/80 text-sm mt-2">
                      Please contact the restaurant before placing an order.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {paymentAccounts.map((method) => (
                      <label
                        key={method.key}
                        className={`cursor-pointer border rounded-2xl p-5 transition ${
                          formData.paymentMethod === method.key
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-white/10 bg-black hover:border-orange-500/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.key}
                          checked={formData.paymentMethod === method.key}
                          onChange={handleChange}
                          className="hidden"
                        />

                        <p className="font-bold">{method.title}</p>

                        <p className="text-gray-400 text-sm mt-2">
                          {method.description}
                        </p>
                      </label>
                    ))}
                  </div>
                )}

                {selectedPaymentMethod?.key !== "CASH_ON_DELIVERY" &&
                  selectedPaymentMethod && (
                    <div className="mt-5 bg-black border border-white/10 rounded-2xl p-5">
                      <p className="text-orange-500 font-bold mb-2">
                        Payment Instructions
                      </p>

                      <p className="text-gray-300 text-sm mb-4">
                        Send payment using the account details below, then enter
                        your transaction/reference ID.
                      </p>

                      <div className="grid md:grid-cols-2 gap-3 mb-5">
                        {selectedPaymentMethod?.details
                          ?.filter((detail) => detail[1])
                          .map(([label, value]) => (
                            <div
                              key={label}
                              className="bg-zinc-950 border border-white/10 rounded-xl p-4"
                            >
                              <p className="text-gray-400 text-xs">
                                {label}
                              </p>

                              <p className="font-bold mt-1 break-words">
                                {value}
                              </p>
                            </div>
                          ))}
                      </div>

                      <input
                        type="text"
                        name="transactionId"
                        placeholder="Transaction / Reference ID *"
                        value={formData.transactionId}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500"
                      />
                    </div>
                  )}
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || loadingSettings}
                className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-4 rounded-full font-bold transition"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>

            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 md:p-8 h-fit">
              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.length === 0 ? (
                  <p className="text-gray-400">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>

                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-orange-500 font-bold">
                        Rs. {item.price * item.quantity}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && freeDeliveryEnabled && (
                <div className="mb-5 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
                  {isFreeDeliveryApplied ? (
                    <p className="text-green-400 font-bold">
                      Free delivery applied to this order.
                    </p>
                  ) : (
                    <p className="text-orange-300 font-semibold">
                      Add Rs. {remainingForFreeDelivery} more to get free
                      delivery.
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-white/10 pt-5 space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span>
                    {isFreeDeliveryApplied ? (
                      <span className="text-green-400 font-bold">
                        Free
                      </span>
                    ) : (
                      `Rs. ${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Estimated Time</span>
                  <span>20–60 min</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Payment</span>
                  <span>
                    {formatPaymentMethod(formData.paymentMethod)}
                  </span>
                </div>

                <div className="flex justify-between text-xl font-extrabold text-orange-500 pt-3">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Checkout
