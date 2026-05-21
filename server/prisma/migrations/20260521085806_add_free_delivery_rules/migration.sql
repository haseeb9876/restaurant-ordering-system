-- AlterTable
ALTER TABLE "RestaurantSettings" ADD COLUMN     "freeDeliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freeDeliveryMinimumOrder" INTEGER NOT NULL DEFAULT 600;
