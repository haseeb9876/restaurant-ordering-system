import express from "express"

import {
  createStaffUser,
  deleteUser,
  getUsers,
  updateUserRole,
} from "../controllers/userController.js"

import {
  allowRoles,
  protect,
} from "../middleware/authMiddleware.js"

const router = express.Router()

router.get(
  "/",
  protect,
  allowRoles("ADMIN"),
  getUsers
)

router.post(
  "/staff",
  protect,
  allowRoles("ADMIN"),
  createStaffUser
)

router.patch(
  "/:id/role",
  protect,
  allowRoles("ADMIN"),
  updateUserRole
)

router.delete(
  "/:id",
  protect,
  allowRoles("ADMIN"),
  deleteUser
)

export default router
