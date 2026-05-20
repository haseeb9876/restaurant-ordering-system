export function notFound(req, res, next) {
  const error = new Error(`Route not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    status: "error",
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  })
}
