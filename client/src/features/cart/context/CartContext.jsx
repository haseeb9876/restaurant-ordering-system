import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems")
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [latestOrder, setLatestOrder] = useState(() => {
    const savedOrder = localStorage.getItem("latestOrder")
    return savedOrder ? JSON.parse(savedOrder) : null
  })

  const [orderHistory, setOrderHistory] = useState(() => {
    const savedOrders = localStorage.getItem("orderHistory")
    return savedOrders ? JSON.parse(savedOrders) : []
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("latestOrder", JSON.stringify(latestOrder))
  }, [latestOrder])

  useEffect(() => {
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
  }, [orderHistory])

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      )

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      return [...prevItems, { ...item, quantity: 1 }]
    })

    setIsCartOpen(true)
  }

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    )
  }

  const syncCartWithAvailableProducts = (availableProducts) => {
    const availableProductIds = availableProducts.map(
      (product) => product.id
    )

    let removedItems = []

    setCartItems((prevItems) => {
      removedItems = prevItems.filter(
        (item) => !availableProductIds.includes(item.id)
      )

      return prevItems.filter((item) =>
        availableProductIds.includes(item.id)
      )
    })

    return removedItems
  }

  const clearCart = () => {
    setCartItems([])
  }

  const saveLatestOrder = (order) => {
    setLatestOrder(order)

    setOrderHistory((prevOrders) => [
      order,
      ...prevOrders,
    ])
  }

  const clearOrderHistory = () => {
    setOrderHistory([])
    localStorage.removeItem("orderHistory")
  }

  const openCart = () => setIsCartOpen(true)

  const closeCart = () => setIsCartOpen(false)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        syncCartWithAvailableProducts,
        clearCart,
        latestOrder,
        orderHistory,
        saveLatestOrder,
        clearOrderHistory,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
