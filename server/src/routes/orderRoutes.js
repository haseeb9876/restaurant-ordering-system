import express from "express"
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js"
import { allowRoles, protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", createOrder)

router.get("/", protect, allowRoles("ADMIN", "STAFF"), getOrders)
router.patch(
  "/:id/status",
  protect,
  allowRoles("ADMIN", "STAFF"),
  updateOrderStatus
)

export default router
