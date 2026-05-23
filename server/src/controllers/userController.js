import bcrypt from "bcryptjs"
import prisma from "../config/prisma.js"
import asyncHandler from "../utils/asyncHandler.js"

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  })

  res.json({
    status: "success",
    results: users.length,
    data: users,
  })
})

export const createStaffUser = asyncHandler(async (req, res) => {
  const fullName = req.body.fullName?.trim()

  const email = req.body.email?.trim().toLowerCase()

  const password = req.body.password

  const role = req.body.role || "STAFF"

  const allowedRoles = ["STAFF", "ADMIN"]

  if (!fullName || !email || !password) {
    res.status(400)

    throw new Error(
      "Full name, email, and password are required."
    )
  }

  if (!isValidEmail(email)) {
    res.status(400)

    throw new Error(
      "Please provide a valid email address."
    )
  }

  if (password.length < 6) {
    res.status(400)

    throw new Error(
      "Password must be at least 6 characters long."
    )
  }

  if (!allowedRoles.includes(role)) {
    res.status(400)

    throw new Error("Invalid staff role.")
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    res.status(409)

    throw new Error(
      "User with this email already exists."
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role,
      isEmailVerified: true,
      emailVerificationOtp: null,
      emailVerificationExpiry: null,
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  res.status(201).json({
    status: "success",
    message: "Staff user created successfully.",
    data: user,
  })
})

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params

  const { role } = req.body

  const allowedRoles = [
    "CUSTOMER",
    "STAFF",
    "ADMIN",
  ]

  if (!allowedRoles.includes(role)) {
    res.status(400)

    throw new Error("Invalid role.")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!user) {
    res.status(404)

    throw new Error("User not found.")
  }

  if (req.user.id === user.id && role !== "ADMIN") {
    res.status(400)

    throw new Error(
      "You cannot remove your own admin access."
    )
  }

  if (user.role === "ADMIN" && role !== "ADMIN") {
    const adminCount = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    })

    if (adminCount <= 1) {
      res.status(400)

      throw new Error(
        "Cannot remove the last admin account."
      )
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: Number(id),
    },

    data: {
      role,
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  res.json({
    status: "success",
    message: "User role updated successfully.",
    data: updatedUser,
  })
})

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!user) {
    res.status(404)

    throw new Error("User not found.")
  }

  if (req.user.id === user.id) {
    res.status(400)

    throw new Error(
      "You cannot delete your own account."
    )
  }

  if (user.role === "ADMIN") {
    const adminCount = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    })

    if (adminCount <= 1) {
      res.status(400)

      throw new Error(
        "Cannot delete the last admin account."
      )
    }
  }

  await prisma.order.updateMany({
    where: {
      userId: user.id,
    },

    data: {
      userId: null,
    },
  })

  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  })

  res.json({
    status: "success",
    message: "User deleted successfully.",
  })
})
