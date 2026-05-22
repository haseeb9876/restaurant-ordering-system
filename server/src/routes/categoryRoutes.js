import express from "express"

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js"

import {
  allowRoles,
  protect,
} from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", getCategories)

router.post(
  "/",
  protect,
  allowRoles("ADMIN"),
  createCategory
)

router.patch(
  "/:id",
  protect,
  allowRoles("ADMIN"),
  updateCategory
)

router.delete(
  "/:id",
  protect,
  allowRoles("ADMIN"),
  deleteCategory
)

export default router
