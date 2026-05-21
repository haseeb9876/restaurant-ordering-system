import prisma from "../config/prisma.js"

const parseBoolean = (value) => {
  return value === true || value === "true"
}

const validateInventoryFields = ({
  stockQuantity,
  lowStockThreshold,
}) => {
  const parsedStockQuantity = Number(stockQuantity || 0)
  const parsedLowStockThreshold = Number(lowStockThreshold || 5)

  if (
    Number.isNaN(parsedStockQuantity) ||
    parsedStockQuantity < 0
  ) {
    return {
      isValid: false,
      message: "Stock quantity cannot be negative",
    }
  }

  if (
    Number.isNaN(parsedLowStockThreshold) ||
    parsedLowStockThreshold < 0
  ) {
    return {
      isValid: false,
      message: "Low stock threshold cannot be negative",
    }
  }

  return {
    isValid: true,
    stockQuantity: parsedStockQuantity,
    lowStockThreshold: parsedLowStockThreshold,
  }
}

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json({
      status: "success",
      results: products.length,
      data: products,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
      error: error.message,
    })
  }
}

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
      },
    })

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      })
    }

    res.json({
      status: "success",
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
      error: error.message,
    })
  }
}

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      categoryId,
      isAvailable,
      trackInventory,
      stockQuantity,
      lowStockThreshold,
    } = req.body

    if (!name || !price || !image || !categoryId) {
      return res.status(400).json({
        status: "error",
        message: "Name, price, image, and category are required",
      })
    }

    const parsedPrice = Number(price)

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Price must be greater than 0",
      })
    }

    const inventoryValidation = validateInventoryFields({
      stockQuantity,
      lowStockThreshold,
    })

    if (!inventoryValidation.isValid) {
      return res.status(400).json({
        status: "error",
        message: inventoryValidation.message,
      })
    }

    const shouldTrackInventory = parseBoolean(trackInventory)

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: parsedPrice,
        image: image.trim(),
        categoryId: Number(categoryId),
        isAvailable:
          shouldTrackInventory &&
          inventoryValidation.stockQuantity === 0
            ? false
            : isAvailable ?? true,
        trackInventory: shouldTrackInventory,
        stockQuantity: inventoryValidation.stockQuantity,
        lowStockThreshold: inventoryValidation.lowStockThreshold,
      },

      include: {
        category: true,
      },
    })

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create product",
      error: error.message,
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      })
    }

    const updateData = {}

    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) {
        return res.status(400).json({
          status: "error",
          message: "Product name cannot be empty",
        })
      }

      updateData.name = req.body.name.trim()
    }

    if (req.body.description !== undefined) {
      updateData.description = req.body.description?.trim() || null
    }

    if (req.body.price !== undefined) {
      const parsedPrice = Number(req.body.price)

      if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({
          status: "error",
          message: "Price must be greater than 0",
        })
      }

      updateData.price = parsedPrice
    }

    if (req.body.image !== undefined) {
      if (!req.body.image.trim()) {
        return res.status(400).json({
          status: "error",
          message: "Product image is required",
        })
      }

      updateData.image = req.body.image.trim()
    }

    if (req.body.categoryId !== undefined) {
      updateData.categoryId = Number(req.body.categoryId)
    }

    if (req.body.isAvailable !== undefined) {
      updateData.isAvailable = Boolean(req.body.isAvailable)
    }

    if (req.body.trackInventory !== undefined) {
      updateData.trackInventory = parseBoolean(req.body.trackInventory)
    }

    if (req.body.stockQuantity !== undefined) {
      const parsedStockQuantity = Number(req.body.stockQuantity)

      if (
        Number.isNaN(parsedStockQuantity) ||
        parsedStockQuantity < 0
      ) {
        return res.status(400).json({
          status: "error",
          message: "Stock quantity cannot be negative",
        })
      }

      updateData.stockQuantity = parsedStockQuantity
    }

    if (req.body.lowStockThreshold !== undefined) {
      const parsedLowStockThreshold = Number(
        req.body.lowStockThreshold
      )

      if (
        Number.isNaN(parsedLowStockThreshold) ||
        parsedLowStockThreshold < 0
      ) {
        return res.status(400).json({
          status: "error",
          message: "Low stock threshold cannot be negative",
        })
      }

      updateData.lowStockThreshold = parsedLowStockThreshold
    }

    const finalTrackInventory =
      updateData.trackInventory ?? existingProduct.trackInventory

    const finalStockQuantity =
      updateData.stockQuantity ?? existingProduct.stockQuantity

    if (finalTrackInventory && finalStockQuantity === 0) {
      updateData.isAvailable = false
    }

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },

      data: updateData,

      include: {
        category: true,
      },
    })

    res.json({
      status: "success",
      message: "Product updated successfully",
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update product",
      error: error.message,
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        orderItems: true,
      },
    })

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      })
    }

    if (existingProduct.orderItems.length > 0) {
      const product = await prisma.product.update({
        where: {
          id: Number(id),
        },
        data: {
          isAvailable: false,
        },
        include: {
          category: true,
        },
      })

      return res.json({
        status: "success",
        message:
          "Product has previous orders, so it was archived instead of deleted.",
        data: product,
      })
    }

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    })

    res.json({
      status: "success",
      message: "Product deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete product",
      error: error.message,
    })
  }
}
