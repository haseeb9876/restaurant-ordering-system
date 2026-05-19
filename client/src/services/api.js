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

export const getCategories = async () => {
  const result = await apiRequest("/categories")

  return result.data
}

export const createOrder = async (orderData) => {
  const result = await apiRequest("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })

  return result.data
}

export const getOrders = async () => {
  const result = await apiRequest("/orders", {
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
