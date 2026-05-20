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
    throw new Error("Full name, email, and password are required.")
  }

  if (!isValidEmail(email)) {
    res.status(400)
    throw new Error("Please provide a valid email address.")
  }

  if (password.length < 6) {
    res.status(400)
    throw new Error("Password must be at least 6 characters long.")
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
    throw new Error("User with this email already exists.")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
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

  res.status(201).json({
    status: "success",
    message: "Staff user created successfully.",
    data: user,
  })
})
