const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const getAuthToken = () => {
  return localStorage.getItem("token")
}

const getAuthHeaders = () => {
  const token = getAuthToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

const clearAuthStorage = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

  const result = await response.json()

  if (response.status === 401) {
    clearAuthStorage()
  }

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong")
  }

  return result
}

export const registerUser = async (userData) => {
  const result = await apiRequest("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  return result.data
}

export const verifyEmailOtp = async (verificationData) => {
  const result = await apiRequest("/auth/verify-email-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verificationData),
  })

  return result
}

export const forgotPassword = async (emailData) => {
  const result = await apiRequest("/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  })

  return result
}

export const resetPassword = async (resetData) => {
  const result = await apiRequest("/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetData),
  })

  return result
}

export const loginUser = async (userData) => {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  return result.data
}

export const getCurrentUser = async () => {
  const result = await apiRequest("/auth/me", {
    headers: {
      ...getAuthHeaders(),
    },
  })

  return result.data.user
}

export const getProducts = async () => {
  const result = await apiRequest("/products")

  return result.data
}

export const getProduct = async (productId) => {
  const result = await apiRequest(`/products/${productId}`)

  return result.data
}

export const createProduct = async (productData) => {
  const result = await apiRequest("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
  })

  return result.data
}

export const updateProduct = async (productId, productData) => {
  const result = await apiRequest(`/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
  })

  return result.data
}

export const deleteProduct = async (productId) => {
  const result = await apiRequest(`/products/${productId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })

  return result
}

export const uploadProductImage = async (imageFile) => {
  const formData = new FormData()

  formData.append("image", imageFile)

  const result = await apiRequest("/uploads/image", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  })

  return result.data.imageUrl
}

export const getCategories = async () => {
  const result = await apiRequest("/categories")

  return result.data
}

export const createCategory = async (name) => {
  const result = await apiRequest("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name }),
  })

  return result.data
}

export const updateCategory = async (categoryId, name) => {
  const result = await apiRequest(`/categories/${categoryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name }),
  })

  return result.data
}

export const deleteCategory = async (categoryId) => {
  const result = await apiRequest(`/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })

  return result
}

export const createOrder = async (orderData) => {
  const result = await apiRequest("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(orderData),
  })

  return result.data
}

export const getOrders = async ({
  range = "TODAY",
  status = "ALL",
  paymentStatus = "ALL",
  paymentMethod = "ALL",
  search = "",
  page = 1,
  limit = 20,
} = {}) => {
  const query = new URLSearchParams({
    range,
    status,
    paymentStatus,
    paymentMethod,
    search,
    page,
    limit,
  })

  const result = await apiRequest(`/orders?${query.toString()}`, {
    headers: {
      ...getAuthHeaders(),
    },
  })

  return result
}

export const getMyOrders = async () => {
  const result = await apiRequest("/orders/my-orders", {
    headers: {
      ...getAuthHeaders(),
    },
  })

  return result.data
}

export const updateOrderStatus = async (orderId, status) => {
  const result = await apiRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  })

  return result.data
}

export const updatePaymentStatus = async (
  orderId,
  paymentStatus
) => {
  const result = await apiRequest(
    `/orders/${orderId}/payment-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ paymentStatus }),
    }
  )

  return result.data
}

export const getUsers = async () => {
  const result = await apiRequest("/users", {
    headers: {
      ...getAuthHeaders(),
    },
  })

  return result.data
}

export const createStaffUser = async (staffData) => {
  const result = await apiRequest("/users/staff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(staffData),
  })

  return result.data
}

export const updateUserRole = async (userId, role) => {
  const result = await apiRequest(`/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ role }),
  })

  return result.data
}

export const deleteUser = async (userId) => {
  const result = await apiRequest(`/users/${userId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })

  return result
}

export const getAdminSettings = async () => {
  const result = await apiRequest("/settings/admin", {
    headers: {
      ...getAuthHeaders(),
    },
  })

  return result
}

export const updateAdminSettings = async (settingsData) => {
  const result = await apiRequest("/settings/admin", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(settingsData),
  })

  return result.settings
}

export const getPublicSettings = async () => {
  const result = await apiRequest("/settings/public")

  return result
}
