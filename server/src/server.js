import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import prisma from "./config/prisma.js"
import productRoutes from "./routes/productRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Ordering System API is running",
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  })
})

app.get("/api/db-test", async (req, res) => {
  try {
    const users = await prisma.user.findMany()

    res.json({
      status: "success",
      message: "Database connected successfully",
      usersCount: users.length,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    })
  }
})

app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
