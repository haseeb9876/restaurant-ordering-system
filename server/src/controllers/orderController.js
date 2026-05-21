import prisma from "../config/prisma.js"
import asyncHandler from "../utils/asyncHandler.js"

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidOrderItem(item) {
  return (
    item &&
    Number.isInteger(Number(item.id)) &&
    Number.isInteger(Number(item.quantity)) &&
    Number(item.quantity) > 0
  )
}

export const createOrder = asyncHandler(async (req, res) => {
  const customerName = req.body.customerName?.trim()
  const customerPhone = req.body.customerPhone?.trim()
  const customerEmail = req.body.customerEmail?.trim().toLowerCase()
  const address = req.body.address?.trim()
  const notes = req.body.notes?.trim() || null
  const paymentMethod = req.body.paymentMethod || "CASH_ON_DELIVERY"
  const transactionId = req.body.transactionId?.trim() || null
  const paymentProof = req.body.paymentProof?.trim() || null
  const items = req.body.items

  const allowedPaymentMethods = [
    "CASH_ON_DELIVERY",
    "JAZZCASH",
    "EASYPAISA",
    "BANK_TRANSFER",
  ]

  if (
    !customerName ||
    !customerPhone ||
    !customerEmail ||
    !address ||
    !items ||
    items.length === 0
  ) {
    res.status(400)
    throw new Error("Missing required order fields.")
  }

  if (!isValidEmail(customerEmail)) {
    res.status(400)
    throw new Error("Please provide a valid customer email.")
  }

  if (!allowedPaymentMethods.includes(paymentMethod)) {
    res.status(400)
    throw new Error("Invalid payment method.")
  }

  if (paymentMethod !== "CASH_ON_DELIVERY" && !transactionId) {
    res.status(400)
    throw new Error("Transaction ID is required for online payments.")
  }

  if (!Array.isArray(items) || !items.every(isValidOrderItem)) {
    res.status(400)
    throw new Error("Invalid order items.")
  }

  const productIds = items.map((item) => Number(item.id))

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  })

  if (products.length !== productIds.length) {
    res.status(400)
    throw new Error("One or more products are invalid.")
  }

  const unavailableProduct = products.find(
    (product) => !product.isAvailable
  )

  if (unavailableProduct) {
    res.status(400)
    throw new Error(`${unavailableProduct.name} is currently unavailable.`)
  }

  const insufficientStockItem = items.find((item) => {
    const product = products.find(
      (currentProduct) => currentProduct.id === Number(item.id)
    )

    return (
      product?.trackInventory &&
      Number(item.quantity) > product.stockQuantity
    )
  })

  if (insufficientStockItem) {
    const product = products.find(
      (currentProduct) =>
        currentProduct.id === Number(insufficientStockItem.id)
    )

    res.status(400)

    throw new Error(
      `${product.name} has only ${product.stockQuantity} item(s) in stock.`
    )
  }

  const calculatedItems = items.map((item) => {
    const product = products.find(
      (currentProduct) => currentProduct.id === Number(item.id)
    )

    return {
      productId: product.id,
      quantity: Number(item.quantity),
      price: product.price,
    }
  })

  const subtotal = calculatedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const settings = await prisma.restaurantSettings.findUnique({
    where: {
      id: 1,
    },
  })

  let deliveryFee = 0

  if (subtotal > 0) {
    const baseDeliveryFee = settings?.deliveryFee || 0
    const freeDeliveryEnabled = settings?.freeDeliveryEnabled || false
    const freeDeliveryMinimumOrder =
      settings?.freeDeliveryMinimumOrder || 600

    if (
      freeDeliveryEnabled &&
      subtotal >= freeDeliveryMinimumOrder
    ) {
      deliveryFee = 0
    } else {
      deliveryFee = baseDeliveryFee
    }
  }

  const total = subtotal + deliveryFee

  const estimatedTime = Math.floor(
    Math.random() * (60 - 20 + 1) + 20
  )

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        status: "PENDING",

        paymentMethod,
        paymentStatus: "PENDING",

        transactionId,
        paymentProof,

        customerName,
        customerPhone,
        customerEmail,

        address,
        notes,

        subtotal,
        deliveryFee,
        total,

        estimatedTime,

        userId:
          req.user?.role === "CUSTOMER"
            ? req.user.id
            : null,

        items: {
          create: calculatedItems,
        },
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    for (const item of calculatedItems) {
      const product = products.find(
        (currentProduct) => currentProduct.id === item.productId
      )

      if (!product.trackInventory) {
        continue
      }

      const newStockQuantity = product.stockQuantity - item.quantity

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          stockQuantity: newStockQuantity,
          isAvailable: newStockQuantity > 0,
        },
      })
    }

    return createdOrder
  })

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  })
})

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  })

  res.json({
    status: "success",
    results: orders.length,
    data: orders,
  })
})

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        {
          userId: req.user.id,
        },
        {
          customerEmail: req.user.email,
        },
      ],
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  })

  res.json({
    status: "success",
    results: orders.length,
    data: orders,
  })
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const allowedStatuses = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
  ]

  if (!allowedStatuses.includes(status)) {
    res.status(400)
    throw new Error("Invalid order status")
  }

  const order = await prisma.order.update({
    where: {
      id: Number(id),
    },

    data: {
      status,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  res.json({
    status: "success",
    message: "Order status updated successfully",
    data: order,
  })
})

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { paymentStatus } = req.body

  const allowedPaymentStatuses = ["PENDING", "PAID", "FAILED"]

  if (!allowedPaymentStatuses.includes(paymentStatus)) {
    res.status(400)
    throw new Error("Invalid payment status")
  }

  const order = await prisma.order.update({
    where: {
      id: Number(id),
    },

    data: {
      paymentStatus,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  res.json({
    status: "success",
    message: "Payment status updated successfully",
    data: order,
  })
})
