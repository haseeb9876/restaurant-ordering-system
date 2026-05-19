import prisma from "../config/prisma.js"

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      notes,
      subtotal,
      deliveryFee,
      total,
      items,
    } = req.body

    if (
      !customerName ||
      !customerPhone ||
      !customerEmail ||
      !address ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "Missing required order fields",
      })
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        customerName,
        customerPhone,
        customerEmail,
        address,
        notes,
        subtotal,
        deliveryFee,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
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

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create order",
      error: error.message,
    })
  }
}

export const getOrders = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch orders",
      error: error.message,
    })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const allowedStatuses = [
      "PENDING",
      "PREPARING",
      "READY",
      "COMPLETED",
      "CANCELLED",
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid order status",
      })
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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update order status",
      error: error.message,
    })
  }
}
