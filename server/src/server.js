import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import prisma from "./config/prisma.js"

import productRoutes from "./routes/productRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import userRoutes from "./routes/userRoutes.js"

import {
  errorHandler,
  notFound,
} from "./middleware/errorMiddleware.js"

dotenv.config()

const app = express()

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean)

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    status: "error",
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
  })
)

app.use(express.json({ limit: "100kb" }))

app.use("/api", apiLimiter)
app.use("/api/auth", authLimiter)
app.use("/api/users", userRoutes)
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

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/uploads", uploadRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
