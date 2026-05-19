import express from "express"
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js"

const router = express.Router()

router.get("/", getOrders)
router.post("/", createOrder)
router.patch("/:id/status", updateOrderStatus)

export default router
