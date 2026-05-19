import bcrypt from "bcryptjs"
import prisma from "../config/prisma.js"
import authResponse from "../utils/authResponse.js"

export async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Full name, email, and password are required.",
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists.",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    })

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      data: authResponse(user),
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to register user.",
      error: error.message,
    })
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required.",
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      })
    }

    res.json({
      status: "success",
      message: "User logged in successfully.",
      data: authResponse(user),
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to login user.",
      error: error.message,
    })
  }
}

export async function getCurrentUser(req, res) {
  res.json({
    status: "success",
    message: "Current user fetched successfully.",
    data: {
      user: req.user,
    },
  })
}
