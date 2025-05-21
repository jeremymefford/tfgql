# Use a minimal and secure base image for Node.js
FROM --platform=$BUILDPLATFORM node:24-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies separately to leverage Docker layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the application code
COPY . .

# Expose the app port (adjust if needed)
EXPOSE 4000

# Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the application
CMD ["node", "dist/index.js"]