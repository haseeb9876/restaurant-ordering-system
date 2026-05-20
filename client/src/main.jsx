import React from "react"
import ReactDOM from "react-dom/client"
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
