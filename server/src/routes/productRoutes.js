import express from "express"
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js"
import { allowRoles, protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", getProducts)
router.get("/:id", getProduct)

router.post("/", protect, allowRoles("ADMIN"), createProduct)
router.patch("/:id", protect, allowRoles("ADMIN"), updateProduct)
router.delete("/:id", protect, allowRoles("ADMIN"), deleteProduct)

export default router
