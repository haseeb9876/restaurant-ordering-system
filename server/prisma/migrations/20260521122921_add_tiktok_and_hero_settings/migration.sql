-- AlterTable
ALTER TABLE "RestaurantSettings" ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "tiktokUrl" TEXT,
ALTER COLUMN "restaurantName" SET DEFAULT 'Restaurant';
