import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess"
import Profile from "./pages/Profile"
import KitchenPanel from "./pages/KitchenPanel"

import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import ProtectedRoute from "./features/auth/components/ProtectedRoute"

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

      <Route
        path="/order-success"
        element={<OrderSuccess />}
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin", "staff"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAddProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminEditProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kitchen"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]}>
            <KitchenPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
