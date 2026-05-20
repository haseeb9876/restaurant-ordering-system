import express from "express"

import { uploadImage } from "../controllers/uploadController.js"

import upload from "../middleware/uploadMiddleware.js"

import {
  allowRoles,
  protect,
} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post(
  "/image",
  protect,
  allowRoles("ADMIN"),
  upload.single("image"),
  uploadImage
)

export default router
