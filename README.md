# Restaurant Ordering System

A production-style full-stack Restaurant Ordering System built with React, Node.js, Express, Prisma, PostgreSQL, JWT authentication, Cloudinary uploads, and OTP email verification.

## Features

- Customer ordering website
- Admin dashboard
- Kitchen/staff panel
- Product and category management
- Cart and checkout flow
- Order management
- Payment status management
- Restaurant settings and branding
- Delivery fee and free delivery rules
- JWT authentication
- Role-based access: CUSTOMER, ADMIN, STAFF
- Email verification with OTP
- Forgot/reset password with OTP
- Resend verification OTP
- Resend reset OTP
- Admin-created staff accounts verified automatically
- Cloudinary image uploads
- PostgreSQL database with Prisma ORM
- Helmet and rate limiting for production security

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- React Hot Toast
- Framer Motion
- React Icons

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- Nodemailer
- Cloudinary
- Multer
- Helmet
- Express Rate Limit

## Project Structure

```bash
restaurant-ordering-system/
├── client/
├── server/
├── assets/
├── docs/
└── README.md
cd server
npm install
npx prisma migrate dev
npm run dev
cd client
npm install
npm run dev
server/.env.example
client/.env.example
Frontend: Vercel
Backend: Render
Database: Neon PostgreSQL
Images: Cloudinary
Emails: Gmail SMTP

Haseeb ullah
