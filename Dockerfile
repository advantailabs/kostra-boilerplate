# Production Dockerfile (multi-stage)
# Steps:
# 1) Set working directory
# 2) Copy package files and install dependencies
# 3) Copy source and build Next.js
# 4) Expose port and start app

# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Deps ----
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ---- Builder ----
FROM deps AS builder
# Copy the rest of the application, excluding .env via .dockerignore
COPY . .
# Build args for Next.js to pick up during build
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
RUN npm run build

# ---- Runner ----
FROM base AS runner
ENV NODE_ENV=production
# Copy only necessary artifacts
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/src ./src

EXPOSE 3000
ENV HOST=0.0.0.0
CMD ["npm", "run", "start"]
