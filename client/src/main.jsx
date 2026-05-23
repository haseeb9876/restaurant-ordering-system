import React from "react"
import ReactDOM from "react-dom/client"
import { registerSW } from "virtual:pwa-register"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import App from "./App.jsx"
import "./index.css"
import { CartProvider } from "./features/cart/context/CartContext.jsx"
import { AuthProvider } from "./features/auth/context/AuthContext.jsx"
import ErrorBoundary from "./components/ErrorBoundary.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,

                style: {
                  background: "#111111",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "16px",
                  fontWeight: "600",
                  boxShadow:
                    "0 10px 40px rgba(0,0,0,0.45)",
                },

                success: {
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#ffffff",
                  },
                },

                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
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
    
  },
})
