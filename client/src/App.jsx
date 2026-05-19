import { Routes, Route } from "react-router-dom"

import Home from "./features/customer/pages/Home"
import Checkout from "./features/customer/pages/Checkout"
import OrderSuccess from "./features/customer/pages/OrderSuccess"
import Profile from "./features/customer/pages/Profile"
import KitchenPanel from "./features/kitchen/pages/KitchenPanel"

import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"

import AdminDashboard from "./features/admin/pages/AdminDashboard"
import AdminOrders from "./features/admin/pages/AdminOrders"
import AdminProducts from "./features/admin/pages/AdminProducts"
import AdminAddProduct from "./features/admin/pages/AdminAddProduct"
import AdminEditProduct from "./features/admin/pages/AdminEditProduct"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/products/new" element={<AdminAddProduct />} />
      <Route
        path="/admin/products/:id/edit"
        element={<AdminEditProduct />}
      />

      <Route path="/kitchen" element={<KitchenPanel />} />
    </Routes>
  )
}

export default App
