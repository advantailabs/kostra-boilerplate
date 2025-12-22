# =============================================================================
# Stage 1: Base Image
# =============================================================================
# Use Node.js 20 Alpine for smaller image size
FROM node:24-alpine AS base

# Install system dependencies needed for some npm packages
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# pnpm installation
RUN corepack enable && corepack prepare pnpm@latest --activate

# =============================================================================
# Stage 2: Dependencies Installation
# =============================================================================
FROM base AS deps

# Copy package & lock files first for better Docker layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install all dependencies (including devDependencies for build stage)
RUN pnpm install

# =============================================================================
# Stage 3: Build Stage
# =============================================================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Generate Prisma client before building
RUN pnpm run generate

# Build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Set environment variables for build
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}

# Build the Next.js application
RUN pnpm run build

# =============================================================================
# Stage 4: Production Runtime
# =============================================================================
FROM base AS runner

# Set production environment
ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm prune --prod

# Copy built application from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma files for database operations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose port
EXPOSE 3000

# Set hostname for Next.js
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["pnpm", "run", "start"]