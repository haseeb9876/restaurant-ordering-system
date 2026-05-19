const API_BASE_URL = "http://localhost:5000/api"

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

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to register user")
  }

  return result.data
}

export const loginUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to login user")
  }

  return result.data
}

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch current user")
  }

  return result.data.user
}

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch products")
  }

  return result.data
}

export const getProduct = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch product")
  }

  return result.data
}

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to create product")
  }

  return result.data
}

export const updateProduct = async (productId, productData) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to update product")
  }

  return result.data
}

export const deleteProduct = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete product")
  }

  return result
}

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch categories")
  }

  return result.data
}

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to create order")
  }

  return result.data
}

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: {
      ...getAuthHeaders(),
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch orders")
  }

  return result.data
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to update order status")
  }

  return result.data
}
