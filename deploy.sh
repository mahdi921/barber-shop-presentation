#!/bin/bash

# Auto-deployment script for VPS
# این اسکریپت را روی VPS در دایرکتوری پروژه قرار دهید

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project directory (change if needed)
PROJECT_DIR="/root/projects/barber-shop-presentation"

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1

echo -e "${YELLOW}📂 Current directory: $(pwd)${NC}"

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo -e "${GREEN}✅ Environment variables loaded${NC}"
fi

# Replace domain placeholder in nginx-ssl.conf if DOMAIN_NAME is set
if [ ! -z "$DOMAIN_NAME" ]; then
    echo -e "${YELLOW}🌐 Configuring domain: $DOMAIN_NAME${NC}"
    if [ -f nginx-ssl.conf ]; then
        # Create a temporary copy with domain replaced
        sed "s/DOMAIN_NAME/$DOMAIN_NAME/g" nginx-ssl.conf > nginx-ssl.conf.tmp
        mv nginx-ssl.conf.tmp nginx-ssl.conf
        echo -e "${GREEN}✅ Domain configured in nginx-ssl.conf${NC}"
    fi
fi

# Pull latest changes from Git
echo -e "${YELLOW}📥 Pulling latest changes from GitHub...${NC}"
git pull origin main || git pull origin master

# Stop running containers
echo -e "${YELLOW}🛑 Stopping containers...${NC}"
docker-compose down

# Remove old images (optional - saves disk space)
echo -e "${YELLOW}🗑️  Removing old images...${NC}"
docker image prune -f || true

# Rebuild images
echo -e "${YELLOW}🔨 Building new images...${NC}"
docker-compose build --no-cache

# Start containers
echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

# Wait for containers to be healthy
echo -e "${YELLOW}⏳ Waiting for containers to be healthy...${NC}"
sleep 10

# Check container status
echo -e "${YELLOW}📊 Container status:${NC}"
docker-compose ps

# Show logs (last 20 lines)
echo -e "${YELLOW}📝 Recent logs:${NC}"
docker-compose logs --tail=20

# Health check
echo -e "${YELLOW}🏥 Running health checks...${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/health || echo "000")

if [ "$FRONTEND_STATUS" = "200" ] || [ "$FRONTEND_STATUS" = "301" ] || [ "$FRONTEND_STATUS" = "302" ]; then
    echo -e "${GREEN}✅ Frontend is healthy (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Frontend is not responding (HTTP $FRONTEND_STATUS)${NC}"
fi

if [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Backend is healthy (HTTP $BACKEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Backend is not responding (HTTP $BACKEND_STATUS)${NC}"
fi

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}🌐 Frontend: http://YOUR_DOMAIN${NC}"
echo -e "${GREEN}🔧 Backend: http://YOUR_DOMAIN:8001${NC}"
