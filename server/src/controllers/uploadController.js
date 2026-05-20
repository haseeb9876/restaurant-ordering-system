import streamifier from "streamifier"
import cloudinary from "../config/cloudinary.js"
import asyncHandler from "../utils/asyncHandler.js"

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error("Please upload an image file.")
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "restaurant-products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve(result)
      }
    )

    streamifier.createReadStream(req.file.buffer).pipe(stream)
  })

  res.status(201).json({
    status: "success",
    message: "Image uploaded successfully.",
    data: {
      imageUrl: uploadResult.secure_url,
    },
  })
})
