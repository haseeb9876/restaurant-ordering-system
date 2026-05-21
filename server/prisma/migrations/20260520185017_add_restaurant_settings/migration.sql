-- CreateTable
CREATE TABLE "RestaurantSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "restaurantName" TEXT NOT NULL DEFAULT 'FoodieHub',
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "jazzcashTitle" TEXT,
    "jazzcashNumber" TEXT,
    "easypaisaTitle" TEXT,
    "easypaisaNumber" TEXT,
    "bankName" TEXT,
    "bankAccountTitle" TEXT,
    "bankAccountNumber" TEXT,
    "bankIban" TEXT,
    "deliveryFee" INTEGER NOT NULL DEFAULT 150,
    "isOnlinePaymentOn" BOOLEAN NOT NULL DEFAULT true,
    "isCashOnDeliveryOn" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantSettings_pkey" PRIMARY KEY ("id")
);
