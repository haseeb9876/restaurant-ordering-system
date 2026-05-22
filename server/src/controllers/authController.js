import bcrypt from "bcryptjs"
import prisma from "../config/prisma.js"
import authResponse from "../utils/authResponse.js"
import { generateOtp, getOtpExpiry } from "../utils/otp.js"
import { sendOtpEmail } from "../utils/mailService.js"

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function registerUser(req, res) {
  try {
    const fullName = req.body.fullName?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password

    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Full name, email, and password are required.",
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address.",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long.",
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

    const verificationOtp = generateOtp()

    await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
        emailVerificationOtp: verificationOtp,
        emailVerificationExpiry: getOtpExpiry(),
      },
    })

    await sendOtpEmail({
      to: email,
      fullName,
      otp: verificationOtp,
      purpose: "EMAIL_VERIFICATION",
    })

    res.status(201).json({
      status: "success",
      message:
        "Account created successfully. Verification OTP sent to your email.",
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to register user.",
      error: error.message,
    })
  }
}

export async function verifyEmailOtp(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const otp = req.body.otp?.trim()

    if (!email || !otp) {
      return res.status(400).json({
        status: "error",
        message: "Email and OTP are required.",
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified.",
      })
    }

    if (
      !user.emailVerificationOtp ||
      user.emailVerificationOtp !== otp
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP.",
      })
    }

    if (
      !user.emailVerificationExpiry ||
      new Date(user.emailVerificationExpiry) < new Date()
    ) {
      return res.status(400).json({
        status: "error",
        message: "OTP has expired.",
      })
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
        emailVerificationOtp: null,
        emailVerificationExpiry: null,
      },
    })

    res.json({
      status: "success",
      message: "Email verified successfully.",
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to verify email.",
      error: error.message,
    })
  }
}

export async function forgotPassword(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase()

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required.",
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      const passwordResetOtp = generateOtp()

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordResetOtp,
          passwordResetExpiry: getOtpExpiry(),
        },
      })

      await sendOtpEmail({
        to: user.email,
        fullName: user.fullName,
        otp: passwordResetOtp,
        purpose: "PASSWORD_RESET",
      })
    }

    res.json({
      status: "success",
      message:
        "If an account exists, a password reset OTP has been sent.",
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to process forgot password request.",
      error: error.message,
    })
  }
}

export async function resetPassword(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const otp = req.body.otp?.trim()
    const newPassword = req.body.newPassword

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: "error",
        message:
          "Email, OTP, and new password are required.",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message:
          "Password must be at least 6 characters long.",
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      })
    }

    if (
      !user.passwordResetOtp ||
      user.passwordResetOtp !== otp
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP.",
      })
    }

    if (
      !user.passwordResetExpiry ||
      new Date(user.passwordResetExpiry) < new Date()
    ) {
      return res.status(400).json({
        status: "error",
        message: "OTP has expired.",
      })
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    )

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        passwordResetOtp: null,
        passwordResetExpiry: null,
      },
    })

    res.json({
      status: "success",
      message: "Password reset successfully.",
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to reset password.",
      error: error.message,
    })
  }
}

export async function loginUser(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password

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

    if (!user.isEmailVerified) {
      return res.status(403).json({
        status: "error",
        message:
          "Please verify your email before logging in.",
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
