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
          <ProtectedRoute
            allowedRoles={["CUSTOMER", "ADMIN", "STAFF"]}
          >
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute
            allowedRoles={["CUSTOMER", "ADMIN", "STAFF"]}
          >
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute
            allowedRoles={["CUSTOMER", "ADMIN", "STAFF"]}
          >
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminAddProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminEditProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kitchen"
        element={
          <ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}>
            <KitchenPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
