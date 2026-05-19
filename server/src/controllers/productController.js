import prisma from "../config/prisma.js"

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
    const { name, description, price, image, categoryId, isAvailable } =
      req.body

    if (!name || !price || !image || !categoryId) {
      return res.status(400).json({
        status: "error",
        message: "Name, price, image, and category are required",
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image,
        categoryId: Number(categoryId),
        isAvailable: isAvailable ?? true,
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
    const { name, description, price, image, categoryId, isAvailable } =
      req.body

    if (!name || !price || !image || !categoryId) {
      return res.status(400).json({
        status: "error",
        message: "Name, price, image, and category are required",
      })
    }

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
        price: Number(price),
        image,
        categoryId: Number(categoryId),
        isAvailable,
      },
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
