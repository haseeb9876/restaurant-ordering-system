import jwt from "jsonwebtoken"
import prisma from "../config/prisma.js"

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized. Token missing.",
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized. User no longer exists.",
      })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({
      status: "error",
      message: "Not authorized. Token invalid or expired.",
    })
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden. You do not have permission.",
      })
    }

    next()
  }
}
