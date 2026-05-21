import prisma from "../config/prisma.js"
import asyncHandler from "../utils/asyncHandler.js"

function cleanNullableString(value) {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  return trimmed || null
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

  res.json({
    restaurantName: settings.restaurantName,
    logoUrl: settings.logoUrl,

    phone: settings.phone,
    email: settings.email,
    address: settings.address,

    openingHours: settings.openingHours,
    aboutTitle: settings.aboutTitle,
    aboutDescription: settings.aboutDescription,

    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    whatsappNumber: settings.whatsappNumber,

    jazzcashTitle: settings.jazzcashTitle,
    jazzcashNumber: settings.jazzcashNumber,

    easypaisaTitle: settings.easypaisaTitle,
    easypaisaNumber: settings.easypaisaNumber,

    bankName: settings.bankName,
    bankAccountTitle: settings.bankAccountTitle,
    bankAccountNumber: settings.bankAccountNumber,
    bankIban: settings.bankIban,

    deliveryFee: settings.deliveryFee,

    freeDeliveryEnabled:
      settings.freeDeliveryEnabled,

    freeDeliveryMinimumOrder:
      settings.freeDeliveryMinimumOrder,

    isOnlinePaymentOn:
      settings.isOnlinePaymentOn,

    isCashOnDeliveryOn:
      settings.isCashOnDeliveryOn,
  })
})

export const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings()

  res.json({
    status: "success",
    data: settings,
  })
})

export const updateAdminSettings = asyncHandler(async (req, res) => {
  await getOrCreateSettings()

  const updatedSettings = await prisma.restaurantSettings.update({
    where: {
      id: 1,
    },

    data: {
      restaurantName:
        cleanNullableString(req.body.restaurantName) ||
        "FoodieHub",

      logoUrl: cleanNullableString(req.body.logoUrl),

      phone: cleanNullableString(req.body.phone),
      email: cleanNullableString(req.body.email),
      address: cleanNullableString(req.body.address),

      openingHours: cleanNullableString(
        req.body.openingHours
      ),

      aboutTitle: cleanNullableString(
        req.body.aboutTitle
      ),

      aboutDescription: cleanNullableString(
        req.body.aboutDescription
      ),

      facebookUrl: cleanNullableString(
        req.body.facebookUrl
      ),

      instagramUrl: cleanNullableString(
        req.body.instagramUrl
      ),

      whatsappNumber: cleanNullableString(
        req.body.whatsappNumber
      ),

      jazzcashTitle: cleanNullableString(
        req.body.jazzcashTitle
      ),

      jazzcashNumber: cleanNullableString(
        req.body.jazzcashNumber
      ),

      easypaisaTitle: cleanNullableString(
        req.body.easypaisaTitle
      ),

      easypaisaNumber: cleanNullableString(
        req.body.easypaisaNumber
      ),

      bankName: cleanNullableString(
        req.body.bankName
      ),

      bankAccountTitle: cleanNullableString(
        req.body.bankAccountTitle
      ),

      bankAccountNumber: cleanNullableString(
        req.body.bankAccountNumber
      ),

      bankIban: cleanNullableString(
        req.body.bankIban
      ),

      deliveryFee:
        Number(req.body.deliveryFee) >= 0
          ? Number(req.body.deliveryFee)
          : 150,

      freeDeliveryEnabled:
        req.body.freeDeliveryEnabled === true,

      freeDeliveryMinimumOrder:
        Number(req.body.freeDeliveryMinimumOrder) >= 0
          ? Number(req.body.freeDeliveryMinimumOrder)
          : 600,

      isOnlinePaymentOn:
        req.body.isOnlinePaymentOn !== false,

      isCashOnDeliveryOn:
        req.body.isCashOnDeliveryOn !== false,
    },
  })

  res.json({
    status: "success",
    message:
      "Restaurant settings updated successfully.",

    settings: updatedSettings,
  })
})
