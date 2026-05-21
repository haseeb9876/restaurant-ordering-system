import express from "express"

import {
  getAdminSettings,
  getPublicSettings,
  updateAdminSettings,
} from "../controllers/settingsController.js"

import {
  allowRoles,
  protect,
} from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/public", getPublicSettings)

router.get(
  "/admin",
  protect,
  allowRoles("ADMIN"),
  getAdminSettings
)

router.patch(
  "/admin",
  protect,
  allowRoles("ADMIN"),
  updateAdminSettings
)

export default router
