import express from "express"

import {
  createStaffUser,
  getUsers,
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

export default router
