import prisma from "../config/prisma.js"

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    res.json({
      status: "success",
      results: categories.length,
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch categories",
      error: error.message,
    })
  }
}

export const createCategory = async (req, res) => {
  try {
    const name = req.body.name?.trim()

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Category name is required",
      })
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    })

    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: category,
    })
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        status: "error",
        message: "Category already exists",
      })
    }

    res.status(500).json({
      status: "error",
      message: "Failed to create category",
      error: error.message,
    })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const name = req.body.name?.trim()

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Category name is required",
      })
    }

    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    })

    res.json({
      status: "success",
      message: "Category updated successfully",
      data: category,
    })
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        status: "error",
        message: "Category already exists",
      })
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      })
    }

    res.status(500).json({
      status: "error",
      message: "Failed to update category",
      error: error.message,
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        products: true,
      },
    })

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      })
    }

    if (category.products.length > 0) {
      return res.status(400).json({
        status: "error",
        message:
          "This category has products. Move or delete products before deleting the category.",
      })
    }

    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    })

    res.json({
      status: "success",
      message: "Category deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete category",
      error: error.message,
    })
  }
}
