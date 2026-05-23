import prisma from "./config/prisma.js"
import app from "./app.js"

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})

server.on("error", (error) => {
  console.error("Server failed to start:", error)
  process.exit(1)
})

process.on("SIGINT", async () => {
  console.info("\nShutting down server...")

  await prisma.$disconnect()

  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.info("\nServer terminated")

  await prisma.$disconnect()

  process.exit(0)
})
