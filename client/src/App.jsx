import { Routes, Route } from "react-router-dom"

import ProtectedRoute from "./features/auth/components/ProtectedRoute"

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
import NotFound from "./features/customer/pages/NotFound"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin", "staff"]}>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin", "staff"]}>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin", "staff"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
          <ProtectedRoute allowedRoles={["staff", "admin"]}>
            <KitchenPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
