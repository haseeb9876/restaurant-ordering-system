import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

dotenv.config()

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const hashedAdminPassword = await bcrypt.hash("admin123", 10)
  const hashedStaffPassword = await bcrypt.hash("staff123", 10)

  await prisma.user.upsert({
    where: { email: "admin@foodiehub.com" },
    update: {
      fullName: "Admin User",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
    create: {
      fullName: "Admin User",
      email: "admin@foodiehub.com",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  })

  await prisma.user.upsert({
    where: { email: "staff@foodiehub.com" },
    update: {
      fullName: "Kitchen Staff",
      password: hashedStaffPassword,
      role: "STAFF",
    },
    create: {
      fullName: "Kitchen Staff",
      email: "staff@foodiehub.com",
      password: hashedStaffPassword,
      role: "STAFF",
    },
  })

  const pizza = await prisma.category.create({
    data: { name: "Pizza" },
  })

  const burger = await prisma.category.create({
    data: { name: "Burger" },
  })

  const biryani = await prisma.category.create({
    data: { name: "Biryani" },
  })

  const drinks = await prisma.category.create({
    data: { name: "Drinks" },
  })

  const desserts = await prisma.category.create({
    data: { name: "Desserts" },
  })

  await prisma.product.createMany({
    data: [
      {
        name: "Cheese Burst Pizza",
        description: "Loaded cheese pizza with rich tomato sauce.",
        price: 1299,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
        categoryId: pizza.id,
      },
      {
        name: "Zinger Burger",
        description: "Crispy chicken burger with spicy mayo.",
        price: 649,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        categoryId: burger.id,
      },
      {
        name: "Chicken Biryani",
        description: "Traditional spicy chicken biryani.",
        price: 399,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
        categoryId: biryani.id,
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate dessert with molten center.",
        price: 499,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
        categoryId: desserts.id,
      },
      {
        name: "Cold Coffee",
        description: "Refreshing cold coffee with creamy texture.",
        price: 299,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
        categoryId: drinks.id,
      },
      {
        name: "Grilled Chicken Burger",
        description: "Juicy grilled chicken burger with fresh salad.",
        price: 799,
        image: "https://images.unsplash.com/photo-1550547660-d9450c58cd",
        categoryId: burger.id,
      },
    ],
  })

  console.log("Database seeded successfully")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
