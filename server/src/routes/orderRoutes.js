import express from "express"
import {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js"

import {
  allowRoles,
  optionalProtect,
  protect,
} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", optionalProtect, createOrder)

router.get(
  "/my-orders",
  protect,
  allowRoles("CUSTOMER"),
  getMyOrders
)

router.get(
  "/",
  protect,
  allowRoles("ADMIN", "STAFF"),
  getOrders
)

router.patch(
  "/:id/status",
  protect,
  allowRoles("ADMIN", "STAFF"),
  updateOrderStatus
)

export default router
