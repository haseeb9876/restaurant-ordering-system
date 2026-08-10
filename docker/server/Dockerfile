FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./

RUN npm install

# Copy application code
COPY server/ ./

# Generate Prisma Client with dummy build env to bypass schema check
ENV DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/restaurant_db?schema=public"
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
