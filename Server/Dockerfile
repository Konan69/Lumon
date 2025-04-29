# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

COPY . .
RUN npm run build


# Stage 2: Production stage
FROM node:20-alpine AS production


ENV NODE_ENV=production


# Set working directory
WORKDIR /app

# Copy only production dependencies from the build stage
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy Prisma generated files from build stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma


COPY --from=builder /app/prisma ./prisma


COPY --from=builder /app/dist ./dist


# Expose application port (adjust as needed)
EXPOSE 8000

# Command to run the application
CMD ["node", "dist/app.js"]
