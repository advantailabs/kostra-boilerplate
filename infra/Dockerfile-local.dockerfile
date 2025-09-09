# Local development Dockerfile
# Steps:
# 1) Set working directory
# 2) Install dependencies
# 3) Copy application files
# 4) Expose port and run dev server

FROM node:20-alpine

# 1. Working directory
WORKDIR /app

# 2. Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci


# 3. Copy application files
COPY . .

# 4. Expose port and start Next.js dev server
EXPOSE 3000
ENV HOST=0.0.0.0
CMD ["npm", "run", "dev"]
