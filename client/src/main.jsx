import React from "react"
import ReactDOM from "react-dom/client"
import { registerSW } from "virtual:pwa-register"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import App from "./App.jsx"
import "./index.css"
import { CartProvider } from "./features/cart/context/CartContext.jsx"
import { AuthProvider } from "./features/auth/context/AuthContext.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)


registerSW({
  immediate: true,

  onNeedRefresh() {
    const shouldUpdate = window.confirm(
      "New version available. Update now?"
    )

    if (shouldUpdate) {
      window.location.reload()
    }
  },

  onOfflineReady() {
    console.log("App ready for offline usage.")
  },
})
