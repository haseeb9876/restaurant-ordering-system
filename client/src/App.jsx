import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"

import InstallAppPrompt from "./features/pwa/components/InstallAppPrompt"

import ProtectedRoute from "./features/auth/components/ProtectedRoute"
import PublicOnlyRoute from "./features/auth/components/PublicOnlyRoute"

const Home = lazy(() => import("./features/customer/pages/Home"))
const Checkout = lazy(() => import("./features/customer/pages/Checkout"))
const OrderSuccess = lazy(() => import("./features/customer/pages/OrderSuccess"))
const Profile = lazy(() => import("./features/customer/pages/Profile"))
const KitchenPanel = lazy(() => import("./features/kitchen/pages/KitchenPanel"))

const Login = lazy(() => import("./features/auth/pages/Login"))
const Register = lazy(() => import("./features/auth/pages/Register"))
const VerifyOtp = lazy(() => import("./features/auth/pages/VerifyOtp"))
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPassword"))
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword"))

const AdminDashboard = lazy(() => import("./features/admin/pages/AdminDashboard"))
const AdminOrders = lazy(() => import("./features/admin/pages/AdminOrders"))
const AdminProducts = lazy(() => import("./features/admin/pages/AdminProducts"))
const AdminAddProduct = lazy(() => import("./features/admin/pages/AdminAddProduct"))
const AdminEditProduct = lazy(() => import("./features/admin/pages/AdminEditProduct"))
const AdminCustomers = lazy(() => import("./features/admin/pages/AdminCustomers"))
const AdminSettings = lazy(() => import("./features/admin/pages/AdminSettings"))

const NotFound = lazy(() => import("./features/customer/pages/NotFound"))

function PageLoader() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-5xl mb-5 animate-bounce">🍕</div>
        <p className="text-orange-500 font-black text-xl">Loading Royal Pizza...</p>
        <p className="text-gray-400 mt-2">Preparing your experience</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <InstallAppPrompt />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <PublicOnlyRoute>
                <VerifyOtp />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <PublicOnlyRoute>
                <ResetPassword />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN", "STAFF"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN", "STAFF"]}>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN", "STAFF"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

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
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminCustomers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminSettings />
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
      </Suspense>
    </>
  )
}

export default App
