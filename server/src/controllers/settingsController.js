import prisma from "../config/prisma.js"
import asyncHandler from "../utils/asyncHandler.js"

function cleanNullableString(value) {
  if (value === undefined) return undefined

  const cleanedValue = String(value).trim()

  if (!cleanedValue) return null

  return cleanedValue
}

function cleanBoolean(value) {
  if (value === undefined) return undefined

  return Boolean(value)
}

function cleanDeliveryFee(value) {
  if (value === undefined) return undefined

  const numberValue = Number(value)

  if (!Number.isInteger(numberValue) || numberValue < 0) {
    return null
  }

  return numberValue
}

async function getOrCreateSettings() {
  let settings = await prisma.restaurantSettings.findUnique({
    where: {
      id: 1,
    },
  })

  if (!settings) {
    settings = await prisma.restaurantSettings.create({
      data: {
        id: 1,
      },
    })
  }

  return settings
}

export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings()

  res.status(200).json({
    restaurantName: settings.restaurantName,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    jazzcashTitle: settings.jazzcashTitle,
    jazzcashNumber: settings.jazzcashNumber,
    easypaisaTitle: settings.easypaisaTitle,
    easypaisaNumber: settings.easypaisaNumber,
    bankName: settings.bankName,
    bankAccountTitle: settings.bankAccountTitle,
    bankAccountNumber: settings.bankAccountNumber,
    bankIban: settings.bankIban,
    deliveryFee: settings.deliveryFee,
    isOnlinePaymentOn: settings.isOnlinePaymentOn,
    isCashOnDeliveryOn: settings.isCashOnDeliveryOn,
  })
})

export const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings()

  res.status(200).json(settings)
})

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const deliveryFee = cleanDeliveryFee(req.body.deliveryFee)

  if (deliveryFee === null) {
    return res.status(400).json({
      status: "error",
      message: "Delivery fee must be a valid positive number.",
    })
  }

  const data = {
    restaurantName: cleanNullableString(req.body.restaurantName),
    phone: cleanNullableString(req.body.phone),
    email: cleanNullableString(req.body.email),
    address: cleanNullableString(req.body.address),
    jazzcashTitle: cleanNullableString(req.body.jazzcashTitle),
    jazzcashNumber: cleanNullableString(req.body.jazzcashNumber),
    easypaisaTitle: cleanNullableString(req.body.easypaisaTitle),
    easypaisaNumber: cleanNullableString(req.body.easypaisaNumber),
    bankName: cleanNullableString(req.body.bankName),
    bankAccountTitle: cleanNullableString(req.body.bankAccountTitle),
    bankAccountNumber: cleanNullableString(req.body.bankAccountNumber),
    bankIban: cleanNullableString(req.body.bankIban),
    deliveryFee,
    isOnlinePaymentOn: cleanBoolean(req.body.isOnlinePaymentOn),
    isCashOnDeliveryOn: cleanBoolean(req.body.isCashOnDeliveryOn),
  }

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      delete data[key]
    }
  })

  if (data.restaurantName === null) {
    return res.status(400).json({
      status: "error",
      message: "Restaurant name is required.",
    })
  }

  const settings = await prisma.restaurantSettings.upsert({
    where: {
      id: 1,
    },
    update: data,
    create: {
      id: 1,
      ...data,
    },
  })

  res.status(200).json({
    status: "success",
    message: "Restaurant settings updated successfully.",
    settings,
  })
})
