# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy source files needed for migrations and seeds (for production execution)
COPY src/database ./src/database
COPY src/modules ./src/modules
COPY src/common ./src/common
COPY src/config ./src/config
COPY src/seeds ./src/seeds
COPY tsconfig*.json ./

# Install ts-node and typescript for running migrations and seeds in production
RUN npm install --save-dev ts-node typescript @types/node

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
