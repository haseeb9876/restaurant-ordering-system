import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import CartSidebar from "../../cart/components/CartSidebar"
import MobileBottomNav from "../components/MobileBottomNav"
import { useCart } from "../../cart/context/CartContext"

function getPaymentStatusClass(status) {
  if (status === "PAID") return "bg-green-500/20 text-green-400"
  if (status === "FAILED") return "bg-red-500/20 text-red-400"
  if (status === "PENDING") return "bg-yellow-500/20 text-yellow-400"

  return "bg-white/10 text-gray-300"
}

function formatPaymentMethod(method) {
  if (method === "CASH_ON_DELIVERY") return "Cash on Delivery"
  if (method === "JAZZCASH") return "JazzCash"
  if (method === "EASYPAISA") return "Easypaisa"
  if (method === "BANK_TRANSFER") return "Bank Transfer"

  return method || "Not selected"
}

function OrderSuccess() {
  const { latestOrder } = useCart()

  const handlePrintInvoice = () => {
    window.print()
  }

  const downloadInvoiceAsPdf = async () => {
    const invoice = document.getElementById("invoice-section")

    if (!invoice) return

    const [{ default: html2canvas }, { default: jsPDF }] =
      await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ])

    const canvas = await html2canvas(invoice, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: 1200,
    })

    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = pdf.internal.pageSize.getWidth()

    const imgWidth = pageWidth - 20

    const imgHeight =
      (canvas.height * imgWidth) / canvas.width

    const pageHeight = pdf.internal.pageSize.getHeight()
    let heightLeft = imgHeight
    let position = 10

    pdf.addImage(
      imgData,
      "PNG",
      10,
      position,
      imgWidth,
      imgHeight
    )

    heightLeft -= pageHeight - 20

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10
      pdf.addPage()
      pdf.addImage(
        imgData,
        "PNG",
        10,
        position,
        imgWidth,
        imgHeight
      )
      heightLeft -= pageHeight - 20
    }

    pdf.save(
      `invoice-${latestOrder.orderId || "receipt"}.pdf`
    )
  }

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `My order has been placed successfully. Order ID: ${latestOrder.orderId} | Total: Rs. ${latestOrder.total}`
    )

    window.open(
      `https://wa.me/?text=${message}`,
      "_blank"
    )
  }

  return (
    <div className="min-h-screen bg-black text-white print:bg-white print:text-black">
      <div className="print:hidden"><Navbar /></div>
      <div className="print:hidden"><CartSidebar /></div>

      <main className="pt-32 px-6 pb-20 print:pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="print:hidden text-center mb-10">
            <div className="text-7xl mb-6">✅</div>

            <p className="text-orange-500 font-semibold mb-3">
              Order Confirmed
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
              Your Order Has Been Placed
            </h1>

            <p className="text-gray-300 text-lg">
              Our kitchen team has received your order. You can track live
              status updates from your profile.
            </p>
          </div>

          {latestOrder ? (
            <>
              <section
                id="invoice-section"
                className="bg-zinc-950 border border-white/10 rounded-[2rem] p-8 md:p-10 print:bg-white print:border-black"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-white/10 print:border-black pb-8 mb-8">
                  <div>
                    <div className="flex items-center gap-4">
                      <img
                        src="/pwa/logo.jpeg"
                        alt="Restaurant Logo"
                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                      />

                      <div>
                        <p className="text-orange-500 font-bold text-lg">
                          ROYAL PIZZA PALACE
                        </p>

                        <p className="text-gray-400 text-sm">
                          Premium Restaurant Experience
                        </p>
                      </div>
                    </div>

                    <h2 className="text-4xl font-extrabold mt-2">
                      Order Receipt
                    </h2>

                    <p className="text-gray-400 print:text-gray-700 mt-3">
                      Thank you for ordering with us.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 print:text-gray-700 text-sm">
                        Order Number
                      </p>

                      <p className="font-bold text-orange-500">
                        {latestOrder.orderId}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 print:text-gray-700 text-sm">
                        Order Date
                      </p>

                      <p className="font-semibold">
                        {latestOrder.createdAt}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 print:text-gray-700 text-sm">
                        Estimated Time
                      </p>

                      <p className="font-semibold">
                        {latestOrder.estimatedTime || 30} Minutes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black border border-white/10 rounded-2xl p-6 print:bg-gray-100 print:border-black">
                    <h3 className="text-xl font-bold mb-5">
                      Customer Information
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 print:text-gray-700 text-sm">
                          Full Name
                        </p>

                        <p className="font-semibold">
                          {latestOrder.customer.fullName}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 print:text-gray-700 text-sm">
                          Phone Number
                        </p>

                        <p className="font-semibold">
                          {latestOrder.customer.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 print:text-gray-700 text-sm">
                          Email Address
                        </p>

                        <p className="font-semibold break-all">
                          {latestOrder.customer.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 print:text-gray-700 text-sm">
                          Delivery Address
                        </p>

                        <p className="font-semibold">
                          {latestOrder.customer.address}
                        </p>
                      </div>

                      {latestOrder.customer.notes && (
                        <div>
                          <p className="text-gray-400 print:text-gray-700 text-sm">
                            Order Notes
                          </p>

                          <p className="font-semibold">
                            {latestOrder.customer.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 rounded-2xl p-6 print:bg-gray-100 print:border-black">
                    <h3 className="text-xl font-bold mb-5">
                      Payment Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 print:text-gray-700 text-sm">
                          Payment Method
                        </p>

                        <p className="font-semibold">
                          {formatPaymentMethod(
                            latestOrder.paymentMethod
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 print:text-gray-700 text-sm">
                          Payment Status
                        </p>

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${getPaymentStatusClass(
                            latestOrder.paymentStatus
                          )}`}
                        >
                          {latestOrder.paymentStatus || "PENDING"}
                        </span>
                      </div>

                      {latestOrder.transactionId && (
                        <div>
                          <p className="text-gray-400 print:text-gray-700 text-sm">
                            Transaction ID
                          </p>

                          <p className="font-semibold break-all">
                            {latestOrder.transactionId}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-gray-400 print:text-gray-700 text-sm">
                          Order Status
                        </p>

                        <p className="font-semibold">
                          {latestOrder.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto mb-8">
                  <table className="w-full border border-white/10 print:border-black">
                    <thead>
                      <tr className="bg-white/5 print:bg-gray-200">
                        <th className="text-left px-5 py-4 border-b border-white/10 print:border-black">
                          Item
                        </th>

                        <th className="text-center px-5 py-4 border-b border-white/10 print:border-black">
                          Qty
                        </th>

                        <th className="text-right px-5 py-4 border-b border-white/10 print:border-black">
                          Price
                        </th>

                        <th className="text-right px-5 py-4 border-b border-white/10 print:border-black">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {latestOrder.items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-white/5 print:border-black"
                        >
                          <td className="px-5 py-4 font-semibold">
                            {item.name}
                          </td>

                          <td className="px-5 py-4 text-center">
                            {item.quantity}
                          </td>

                          <td className="px-5 py-4 text-right">
                            Rs. {item.price}
                          </td>

                          <td className="px-5 py-4 text-right font-bold">
                            Rs. {item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="max-w-md ml-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-300 print:text-gray-700">
                      <span>Subtotal</span>

                      <span>Rs. {latestOrder.subtotal}</span>
                    </div>

                    <div className="flex justify-between text-gray-300 print:text-gray-700">
                      <span>Delivery Fee</span>

                      <span>Rs. {latestOrder.deliveryFee}</span>
                    </div>

                    <div className="border-t border-white/10 print:border-black pt-4 flex justify-between text-2xl font-extrabold text-orange-500">
                      <span>Total</span>

                      <span>Rs. {latestOrder.total}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 bg-black border border-white/10 rounded-2xl p-6 print:bg-gray-100 print:border-black text-center">
                  <p className="text-orange-500 font-bold text-lg mb-3">
                    Thank You For Ordering ❤️
                  </p>

                  <p className="text-gray-400 print:text-gray-700 text-sm leading-relaxed">
                    This receipt confirms your order submission.
                    Payment verification and order preparation
                    are handled securely by the restaurant system.
                  </p>

                  <div className="mt-5 text-xs text-gray-500">
                    Powered by Royal Pizza Palace Ordering System
                  </div>
                </div>
              </section>

              <div className="print:hidden flex flex-col md:flex-row flex-wrap gap-4 mt-8">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-bold transition"
                >
                  Print Invoice
                </button>

                <button
                  type="button"
                  onClick={downloadInvoiceAsPdf}
                  className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black px-8 py-4 rounded-full font-bold transition"
                >
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={shareOnWhatsApp}
                  className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-black px-8 py-4 rounded-full font-bold transition"
                >
                  Share WhatsApp
                </button>

                <Link
                  to="/profile"
                  className="border border-white/10 hover:border-orange-500 px-8 py-4 rounded-full font-bold transition text-center"
                >
                  Track My Orders
                </Link>

                <Link
                  to="/"
                  className="border border-white/10 hover:border-orange-500 px-8 py-4 rounded-full font-bold transition text-center"
                >
                  Continue Ordering
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-10 text-center">
              <h2 className="text-3xl font-bold mb-5">
                No Recent Order Found
              </h2>

              <p className="text-gray-400 mb-8">
                We could not find your recent order receipt.
              </p>

              <Link
                to="/"
                className="inline-block bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full font-bold transition"
              >
                Back to Menu
              </Link>
            </div>
          )}
        </div>
      </main>
      <div className="print:hidden"><MobileBottomNav /></div>
    </div>
  )
}

export default OrderSuccess
