import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import AdminOrders from "./pages/AdminOrders"
import AdminDashboard from "./pages/AdminDashboard"
import AdminProducts from "./pages/AdminProducts"
import AdminAddProduct from "./pages/AdminAddProduct"
import AdminEditProduct from "./pages/AdminEditProduct"
import KitchenPanel from "./pages/KitchenPanel"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
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
