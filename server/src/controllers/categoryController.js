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
