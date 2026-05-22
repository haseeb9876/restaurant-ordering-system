import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

const getCartKey = (item) => {
  return item.variantId ? `${item.id}-${item.variantId}` : `${item.id}`
}

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
    const incomingKey = getCartKey(item)

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.cartKey === incomingKey
      )

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.cartKey === incomingKey
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      return [
        ...prevItems,
        {
          ...item,
          cartKey: incomingKey,
          quantity: 1,
        },
      ]
    })

    setIsCartOpen(true)
  }

  const increaseQuantity = (cartKey) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartKey === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (cartKey) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (cartKey) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartKey !== cartKey)
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
