import multer from "multer"

const storage = multer.memoryStorage()

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]

const fileFilter = (req, file, callback) => {
  if (allowedImageTypes.includes(file.mimetype)) {
    callback(null, true)
    return
  }

  callback(new Error("Only JPG, PNG, WEBP, HEIC, and HEIF image files are allowed."), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
})

export default upload
