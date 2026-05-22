import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

dotenv.config()

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

const image = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

async function createVariantProduct(categoryId, product) {
  return prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.basePrice,
      image: product.image,
      productType: "VARIANT",
      categoryId,
      trackInventory: true,
      stockQuantity: product.stockQuantity ?? 50,
      lowStockThreshold: 5,
      variants: { create: product.variants },
    },
  })
}

async function createSimpleProduct(categoryId, product) {
  return prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      productType: product.productType ?? "SIMPLE",
      categoryId,
      trackInventory: true,
      stockQuantity: product.stockQuantity ?? 50,
      lowStockThreshold: 5,
    },
  })
}

const classicPizzaVariants = [
  { name: "Small 7 inch", price: 650 },
  { name: "Medium 11 inch", price: 1200 },
  { name: "Large 13 inch", price: 1600 },
  { name: "X Large 16 inch", price: 2200 },
]

const specialPizzaVariants = [
  { name: "Small 7 inch", price: 700 },
  { name: "Medium 11 inch", price: 1250 },
  { name: "Large 13 inch", price: 1750 },
  { name: "X Large 16 inch", price: 2400 },
]

const premiumPizzaVariants = [
  { name: "Medium 11 inch", price: 1500 },
  { name: "Large 13 inch", price: 2200 },
  { name: "X Large 16 inch", price: 2800 },
]

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const hashedAdminPassword = await bcrypt.hash("admin123", 10)
  const hashedStaffPassword = await bcrypt.hash("staff123", 10)

  await prisma.user.upsert({
    where: { email: "admin@foodiehub.com" },
    update: { fullName: "Admin User", password: hashedAdminPassword, role: "ADMIN" },
    create: { fullName: "Admin User", email: "admin@foodiehub.com", password: hashedAdminPassword, role: "ADMIN" },
  })

  await prisma.user.upsert({
    where: { email: "staff@foodiehub.com" },
    update: { fullName: "Kitchen Staff", password: hashedStaffPassword, role: "STAFF" },
    create: { fullName: "Kitchen Staff", email: "staff@foodiehub.com", password: hashedStaffPassword, role: "STAFF" },
  })

  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {
      restaurantName: "Royal Pizza Palace",
      phone: "0313-9133330, 0333-4447050, 091-2604674",
      email: "royalpizzapalace@example.com",
      address: "Main GT Road Chamkani near City Home, Peshawar",
      openingHours: "11:30 AM - 01:00 AM",
      aboutTitle: "Hot Fresh & Healthy",
      aboutDescription:
        "Royal Pizza Palace is a great fast food and Chinese family restaurant offering dine-in, takeaway and home delivery.",
      whatsappNumber: "923139133330",
      deliveryFee: 150,
      freeDeliveryEnabled: true,
      freeDeliveryMinimumOrder: 600,
      isOnlinePaymentOn: true,
      isCashOnDeliveryOn: true,
    },
    create: {
      id: 1,
      restaurantName: "Royal Pizza Palace",
      phone: "0313-9133330, 0333-4447050, 091-2604674",
      email: "royalpizzapalace@example.com",
      address: "Main GT Road Chamkani near City Home, Peshawar",
      openingHours: "11:30 AM - 01:00 AM",
      aboutTitle: "Hot Fresh & Healthy",
      aboutDescription:
        "Royal Pizza Palace is a great fast food and Chinese family restaurant offering dine-in, takeaway and home delivery.",
      whatsappNumber: "923139133330",
      deliveryFee: 150,
      freeDeliveryEnabled: true,
      freeDeliveryMinimumOrder: 600,
      isOnlinePaymentOn: true,
      isCashOnDeliveryOn: true,
    },
  })

  const categories = {}
  for (const name of [
    "Pizza",
    "Special Pizza",
    "Premium Pizza",
    "Pizza Deals",
    "Burgers",
    "Burger Deals",
    "Fried Chicken",
    "Fries",
    "Shawarma",
    "Rolls",
    "Chinese Rice",
    "Chinese Specials",
    "Chinese Deals",
    "Soups",
    "Ice Cream",
    "Family Deals",
    "Party Deals",
    "Extras",
    "Sauces",
  ]) {
    categories[name] = await prisma.category.create({ data: { name } })
  }

  const classicPizzas = [
    "Chicken Tikka Pizza",
    "Chicken Fajita Pizza",
    "Chicken Supreme Pizza",
    "Tandoori Pizza",
    "Calzone Pizza",
    "Chicken Lover Pizza",
    "Vegetarian Pizza",
  ]

  for (const name of classicPizzas) {
    await createVariantProduct(categories["Pizza"].id, {
      name,
      description: `${name} with fresh dough, cheese, chicken, vegetables and Royal special sauce.`,
      basePrice: 650,
      image: image("photo-1565299624946-b28f40a0ae38"),
      variants: classicPizzaVariants,
    })
  }

  const specialPizzas = [
    "Royal Special Pizza",
    "Chicken Achar Pizza",
    "Grilled Pizza",
    "Hot-N-Spicy Pizza",
    "Beef Kabab Pizza",
    "Afghani Pizza",
    "Four Season Pizza",
  ]

  for (const name of specialPizzas) {
    await createVariantProduct(categories["Special Pizza"].id, {
      name,
      description: `${name} prepared with special chicken, cheese, olives, mushrooms, tomato, capsicum and Royal sauce.`,
      basePrice: 700,
      image: image("photo-1574071318508-1cdbab80d002"),
      variants: specialPizzaVariants,
    })
  }

  const premiumPizzas = [
    "Crown Crust Pizza",
    "Special Creamy Pizza",
    "Chef Special Pizza",
    "Jamaican Pizza",
    "Malai Botti Pizza",
    "Fish Pizza",
  ]

  for (const name of premiumPizzas) {
    await createVariantProduct(categories["Premium Pizza"].id, {
      name,
      description: `${name} premium Royal Pizza Palace flavour with rich toppings and extra cheese.`,
      basePrice: 1500,
      image: image("photo-1604382354936-07c5d9983bd3"),
      variants: premiumPizzaVariants,
    })
  }

  const products = [
    {
      category: "Pizza Deals",
      name: "Pizza Deal 1",
      description: "2 Chicken Tikka Pizza Small\n1 Tandoori Pizza Small\n1 Liter Drink",
      price: 2000,
      productType: "DEAL",
      image: image("photo-1513104890138-7c749659a591"),
    },
    {
      category: "Pizza Deals",
      name: "Pizza Deal 2",
      description: "2 Chicken Tikka Pizza Medium\n1 Tandoori Pizza Medium\n1.5 Liter Drink",
      price: 3500,
      productType: "DEAL",
      image: image("photo-1601924582975-7cc8e6bb7d69"),
    },
    {
      category: "Pizza Deals",
      name: "Pizza Deal 3",
      description: "2 Chicken Tikka Pizza Large\n1 Tandoori Pizza Large\n1.5 Liter Drink",
      price: 4700,
      productType: "DEAL",
      image: image("photo-1543352634-a1c51d9f1fa7"),
    },
    {
      category: "Pizza Deals",
      name: "Pizza Deal 4",
      description: "2 Chicken Tikka Pizza X Large\n1 Tandoori Pizza X Large\n2 Liter Drink",
      price: 6500,
      productType: "DEAL",
      image: image("photo-1555939594-58d7cb561ad1"),
    },

    {
      category: "Burgers",
      name: "Zinger Burger",
      description: "Crispy zinger burger with mayo and fresh salad.",
      price: 450,
      image: image("photo-1568901346375-23c9450c58cd"),
    },
    {
      category: "Burgers",
      name: "Zinger Burger with Cheese",
      description: "Crispy zinger burger with cheese slice.",
      price: 500,
      image: image("photo-1568901346375-23c9450c58cd"),
    },
    {
      category: "Burgers",
      name: "Chicken Burger",
      description: "Crispy patty chicken burger.",
      price: 350,
      image: image("photo-1550547660-d9450f859349"),
    },
    {
      category: "Burgers",
      name: "Beef Patty Burger with Cheese",
      description: "Beef patty burger with cheese.",
      price: 400,
      image: image("photo-1568901346375-23c9450c58cd"),
    },
    {
      category: "Burgers",
      name: "Tower Burger with Cheese",
      description: "Large tower burger with cheese and special sauce.",
      price: 650,
      image: image("photo-1553979459-d2229ba7433b"),
    },
    {
      category: "Burgers",
      name: "Mighty Burger with Cheese",
      description: "Heavy mighty burger with cheese and premium sauce.",
      price: 700,
      image: image("photo-1553979459-d2229ba7433b"),
    },
    {
      category: "Burgers",
      name: "Royal Pizza Burger",
      description: "Royal style pizza burger with special sauce.",
      price: 750,
      image: image("photo-1568901346375-23c9450c58cd"),
    },
    {
      category: "Burgers",
      name: "Pizza Sandwich with Fries",
      description: "Pizza sandwich served with fries.",
      price: 1000,
      image: image("photo-1528735602780-2552fd46c7af"),
    },
    {
      category: "Burgers",
      name: "Mexican Sandwich",
      description: "Spicy Mexican sandwich with special sauce.",
      price: 1000,
      image: image("photo-1528735602780-2552fd46c7af"),
    },

    {
      category: "Fried Chicken",
      name: "Full Fried Chicken 8 Pieces",
      description: "Full fried chicken with 8 crispy pieces.",
      price: 2000,
      image: image("photo-1626645738196-c2a7c87a8f58"),
    },
    {
      category: "Fried Chicken",
      name: "Half Fried Chicken 4 Pieces",
      description: "Half fried chicken with 4 crispy pieces.",
      price: 1000,
      image: image("photo-1626645738196-c2a7c87a8f58"),
    },
    {
      category: "Fried Chicken",
      name: "Hot Wings 6 Pieces",
      description: "Spicy hot wings 6 pieces.",
      price: 450,
      image: image("photo-1527477396000-e27163b481c2"),
    },
    {
      category: "Fried Chicken",
      name: "Hot Wings 10 Pieces",
      description: "Spicy hot wings 10 pieces.",
      price: 700,
      image: image("photo-1527477396000-e27163b481c2"),
    },
    {
      category: "Fried Chicken",
      name: "Chicken Nuggets 10 Pieces",
      description: "Crispy chicken nuggets 10 pieces.",
      price: 650,
      image: image("photo-1562967916-eb82221dfb92"),
    },
    {
      category: "Fried Chicken",
      name: "Chicken Strips 10 Pieces with Fries",
      description: "Chicken strips served with fries.",
      price: 850,
      image: image("photo-1562967916-eb82221dfb92"),
    },
    {
      category: "Fried Chicken",
      name: "Fish & Chips 4 Pieces",
      description: "Fish and chips 4 pieces.",
      price: 1000,
      image: image("photo-1579208575657-c595a05383b7"),
    },

    {
      category: "Fries",
      name: "French Fries Medium",
      description: "Fresh crispy french fries medium.",
      price: 300,
      image: image("photo-1630384060421-cb20d0e0649d"),
    },
    {
      category: "Fries",
      name: "French Fries Large",
      description: "Fresh crispy french fries large.",
      price: 450,
      image: image("photo-1630384060421-cb20d0e0649d"),
    },
    {
      category: "Fries",
      name: "Cheese Fries Medium",
      description: "Cheese loaded fries medium.",
      price: 450,
      image: image("photo-1573080496219-bb080dd4f877"),
    },
    {
      category: "Fries",
      name: "Cheese Fries Large",
      description: "Cheese loaded fries large.",
      price: 600,
      image: image("photo-1573080496219-bb080dd4f877"),
    },
    {
      category: "Fries",
      name: "Garlic Mayo Fries Large",
      description: "Large fries with garlic mayo.",
      price: 650,
      image: image("photo-1573080496219-bb080dd4f877"),
    },
    {
      category: "Fries",
      name: "Loaded Chicken Cheese Fries",
      description: "Loaded fries with chicken and cheese.",
      price: 650,
      image: image("photo-1573080496219-bb080dd4f877"),
    },
    {
      category: "Fries",
      name: "Pizza Fries",
      description: "Pizza style fries with cheese and sauce.",
      price: 750,
      image: image("photo-1573080496219-bb080dd4f877"),
    },

    {
      category: "Rolls",
      name: "Chicken Paratha Roll",
      description: "Chicken paratha roll with chutney and vegetables.",
      price: 350,
      image: image("photo-1562967916-eb82221dfb92"),
    },
    {
      category: "Rolls",
      name: "Mayo Paratha Roll",
      description: "Mayo paratha roll with chicken.",
      price: 350,
      image: image("photo-1562967916-eb82221dfb92"),
    },
    {
      category: "Rolls",
      name: "Cheese Paratha Roll",
      description: "Cheese paratha roll with chicken.",
      price: 400,
      image: image("photo-1562967916-eb82221dfb92"),
    },
    {
      category: "Rolls",
      name: "Zinger Paratha Roll",
      description: "Crispy zinger paratha roll.",
      price: 400,
      image: image("photo-1562967916-eb82221dfb92"),
    },
    {
      category: "Rolls",
      name: "Chicken Wraps",
      description: "Chicken wraps with special sauce.",
      price: 550,
      image: image("photo-1562967916-eb82221dfb92"),
    },
    {
      category: "Shawarma",
      name: "Chicken Shawarma",
      description: "Chicken shawarma with garlic sauce.",
      price: 300,
      image: image("photo-1529006557810-274b9b2fc783"),
    },
    {
      category: "Shawarma",
      name: "Chicken Cheese Shawarma",
      description: "Chicken shawarma with cheese.",
      price: 350,
      image: image("photo-1529006557810-274b9b2fc783"),
    },
    {
      category: "Shawarma",
      name: "Zinger Shawarma",
      description: "Zinger shawarma with mayo.",
      price: 400,
      image: image("photo-1529006557810-274b9b2fc783"),
    },

    {
      category: "Chinese Rice",
      name: "Chicken Fried Rice",
      description: "Chicken fried rice for 2 persons.",
      price: 700,
      image: image("photo-1603133872878-684f208fb84b"),
    },
    {
      category: "Chinese Rice",
      name: "Royal Special Rice",
      description: "Royal special rice for 2 persons.",
      price: 800,
      image: image("photo-1603133872878-684f208fb84b"),
    },
    {
      category: "Chinese Rice",
      name: "Beef Kabab Rice",
      description: "Beef kabab rice for 2 persons.",
      price: 800,
      image: image("photo-1603133872878-684f208fb84b"),
    },
    {
      category: "Chinese Rice",
      name: "Masala Rice",
      description: "Masala rice for 2 persons.",
      price: 800,
      image: image("photo-1603133872878-684f208fb84b"),
    },
    {
      category: "Chinese Rice",
      name: "Vegetable Rice",
      description: "Vegetable rice.",
      price: 500,
      image: image("photo-1603133872878-684f208fb84b"),
    },
    {
      category: "Chinese Rice",
      name: "Chinese Plain Rice",
      description: "Chinese plain rice.",
      price: 500,
      image: image("photo-1603133872878-684f208fb84b"),
    },

    {
      category: "Chinese Specials",
      name: "Chicken Chowmein Full",
      description: "Full chicken chowmein.",
      price: 750,
      image: image("photo-1585032226651-759b368d7246"),
    },
    {
      category: "Chinese Specials",
      name: "Grilled Special Chowmein",
      description: "Grilled special chowmein.",
      price: 800,
      image: image("photo-1585032226651-759b368d7246"),
    },
    {
      category: "Chinese Specials",
      name: "Chicken Manchurian with White Rice",
      description: "Chicken Manchurian served with white rice.",
      price: 1100,
      image: image("photo-1525755662778-989d0524087e"),
    },
    {
      category: "Chinese Specials",
      name: "Chicken Shashlik with White Rice",
      description: "Chicken shashlik served with white rice.",
      price: 1200,
      image: image("photo-1525755662778-989d0524087e"),
    },
    {
      category: "Chinese Specials",
      name: "Lasagna Pasta",
      description: "Lasagna pasta with rich sauce.",
      price: 1200,
      image: image("photo-1551183053-bf91a1d81141"),
    },
    {
      category: "Chinese Specials",
      name: "Alfredo Creamy Pasta",
      description: "Alfredo creamy pasta.",
      price: 1100,
      image: image("photo-1551183053-bf91a1d81141"),
    },
    {
      category: "Chinese Specials",
      name: "Crunchy Chicken Cheese Pasta",
      description: "Crunchy chicken cheese pasta.",
      price: 1100,
      image: image("photo-1551183053-bf91a1d81141"),
    },

    {
      category: "Chinese Deals",
      name: "Royal Rice Platter",
      description: "2 Vegetable Rice\n15 BBQ Wings Pieces\n10 Pieces Hot Shots\n8 Seekh Kabab\n1.5 Liter Drink\n2 Mint Raita",
      price: 3500,
      productType: "DEAL",
      image: image("photo-1603133872878-684f208fb84b"),
    },
    {
      category: "Chinese Deals",
      name: "Rice Deal 1",
      description: "1 Chicken Fried Rice\n10 Pieces Hot Wings\n1 Medium Fries\n1 Liter Drink",
      price: 1700,
      productType: "DEAL",
      image: image("photo-1603133872878-684f208fb84b"),
    },
    {
      category: "Chinese Deals",
      name: "Rice Deal 2",
      description: "1 Chicken Fried Rice Full\n1 Chicken Chowmein Full\n4 Chicken Pieces\n1 Liter Drink",
      price: 2400,
      productType: "DEAL",
      image: image("photo-1603133872878-684f208fb84b"),
    },

    {
      category: "Soups",
      name: "Royal Special Soup",
      description: "Royal special hot soup.",
      price: 700,
      image: image("photo-1547592166-23ac45744acd"),
    },
    {
      category: "Soups",
      name: "Chicken Corn Soup",
      description: "Chicken corn hot soup.",
      price: 600,
      image: image("photo-1547592166-23ac45744acd"),
    },
    {
      category: "Soups",
      name: "Hot & Sour Soup",
      description: "Hot and sour soup.",
      price: 600,
      image: image("photo-1547592166-23ac45744acd"),
    },
    {
      category: "Ice Cream",
      name: "Vanilla Ice Cream",
      description: "Royal Dairy ice cream vanilla flavour.",
      price: 300,
      image: image("photo-1563805042-7684c019e1cb"),
    },
    {
      category: "Ice Cream",
      name: "Chocolate Ice Cream",
      description: "Royal Dairy ice cream chocolate flavour.",
      price: 300,
      image: image("photo-1563805042-7684c019e1cb"),
    },
    {
      category: "Ice Cream",
      name: "Family Pack Ice Cream Mix Special",
      description: "Family pack ice cream mix special.",
      price: 1200,
      image: image("photo-1563805042-7684c019e1cb"),
    },

    {
      category: "Burger Deals",
      name: "Burger Deal 1",
      description: "4 Zinger Burgers",
      price: 1700,
      productType: "DEAL",
      image: image("photo-1568901346375-23c9450c58cd"),
    },
    {
      category: "Burger Deals",
      name: "Burger Deal 2",
      description: "5 Chicken Patty Burgers",
      price: 1650,
      productType: "DEAL",
      image: image("photo-1568901346375-23c9450c58cd"),
    },
    {
      category: "Burger Deals",
      name: "Burger Deal 3",
      description: "3 Zinger Burgers\n3 Chicken Burgers",
      price: 2250,
      productType: "DEAL",
      image: image("photo-1568901346375-23c9450c58cd"),
    },
    {
      category: "Burger Deals",
      name: "Burger Deal 4",
      description: "6 Zinger Burgers\n4 Chicken Burgers",
      price: 3850,
      productType: "DEAL",
      image: image("photo-1568901346375-23c9450c58cd"),
    },

    {
      category: "Family Deals",
      name: "Classic Deal 1",
      description: "1 Chicken Tikka Pizza Small\n2 Zinger Burgers\n1 Medium Fries\n1 500ml Drink",
      price: 1800,
      productType: "DEAL",
      image: image("photo-1543352634-a1c51d9f1fa7"),
    },
    {
      category: "Family Deals",
      name: "Classic Deal 2",
      description: "1 Chicken Tikka Pizza Medium\n3 Zinger Burgers\n1 Large Fries\n1 1.5 Liter Drink",
      price: 2900,
      productType: "DEAL",
      image: image("photo-1543352634-a1c51d9f1fa7"),
    },
    {
      category: "Family Deals",
      name: "Classic Deal 3",
      description: "1 Chicken Tikka Pizza Large\n4 Zinger Burgers\n4 Chicken Pieces\n2 Medium Fries\n2 1 Liter Drinks",
      price: 4900,
      productType: "DEAL",
      image: image("photo-1543352634-a1c51d9f1fa7"),
    },
    {
      category: "Family Deals",
      name: "Royal Family Deal 13",
      description: "6 Chicken Burgers\n4 Beef Burgers\n6 Chicken Pieces\n1 Large Fries\n1.5 Liter Drink",
      price: 5400,
      productType: "DEAL",
      image: image("photo-1555939594-58d7cb561ad1"),
    },
    {
      category: "Family Deals",
      name: "Royal Family Deal 14",
      description: "8 Zinger Burgers\n8 Chicken Pieces\n20 Pieces Nuggets\n2 Large Fries\n2 1 Liter Drinks",
      price: 7500,
      productType: "DEAL",
      image: image("photo-1555939594-58d7cb561ad1"),
    },
    {
      category: "Party Deals",
      name: "Birthday & Party Deal 1",
      description: "4 Chicken Tikka Pizza Large\n4 Zinger Burgers\n4 Chicken Burgers\n2 Large Fries\n4 1 Liter Drinks",
      price: 10500,
      productType: "DEAL",
      image: image("photo-1555939594-58d7cb561ad1"),
    },
    {
      category: "Party Deals",
      name: "Birthday & Party Deal 2",
      description: "5 Chicken Tikka Pizza Large\n10 Zinger Burgers\n30 Chicken Nuggets\n20 Leg Pieces\n4 1.5 Liter Drinks",
      price: 18500,
      productType: "DEAL",
      image: image("photo-1555939594-58d7cb561ad1"),
    },

    {
      category: "Extras",
      name: "Extra Topping Regular",
      description: "Extra topping regular size.",
      price: 100,
      image: image("photo-1486297678162-eb2a19b0a32d"),
    },
    {
      category: "Extras",
      name: "Extra Topping Medium",
      description: "Extra topping medium size.",
      price: 150,
      image: image("photo-1486297678162-eb2a19b0a32d"),
    },
    {
      category: "Extras",
      name: "Extra Topping Large",
      description: "Extra topping large size.",
      price: 200,
      image: image("photo-1486297678162-eb2a19b0a32d"),
    },
    {
      category: "Extras",
      name: "Extra Topping X Large",
      description: "Extra topping X large size.",
      price: 300,
      image: image("photo-1486297678162-eb2a19b0a32d"),
    },
    {
      category: "Sauces",
      name: "Dip Sauce",
      description: "Dip sauce.",
      price: 80,
      image: image("photo-1472476443507-c7a5948772fc"),
    },
    {
      category: "Sauces",
      name: "Garlic Mayo",
      description: "Garlic mayo sauce.",
      price: 80,
      image: image("photo-1472476443507-c7a5948772fc"),
    },
    {
      category: "Sauces",
      name: "Special Mayo",
      description: "Special mayo sauce.",
      price: 80,
      image: image("photo-1472476443507-c7a5948772fc"),
    },
  ]

  for (const product of products) {
    await createSimpleProduct(categories[product.category].id, product)
  }

  console.log("Royal Pizza Palace complete real menu seeded successfully")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
