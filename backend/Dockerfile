# Backend Dockerfile (اختیاری)
# اگر از backend Node.js استفاده می‌کنید، این را در دایرکتوری backend استفاده کنید

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --production

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
