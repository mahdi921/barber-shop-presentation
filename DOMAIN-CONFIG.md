# Domain Configuration Guide

## Quick Setup

Your nginx-ssl.conf now uses a `DOMAIN_NAME` placeholder that gets automatically replaced during deployment.

### Step 1: Set Domain in .env File

On your VPS, edit the `.env` file:

```bash
# Edit .env on VPS
nano ~/barber-shop-presentation/.env

# Add this line (replace with your actual domain):
DOMAIN_NAME=barbershop.ir
```

### Step 2: Deploy

The `deploy.sh` script will automatically:
1. Load `.env` file
2. Replace `DOMAIN_NAME` in `nginx-ssl.conf` with your actual domain
3. Pull latest code
4. Rebuild and restart containers

```bash
# On VPS
cd ~/barber-shop-presentation
./deploy.sh
```

### Step 3: Or Use GitHub Actions

When you push to GitHub, the deployment will automatically use the `DOMAIN_NAME` from your VPS's `.env` file.

## Example .env File

```env
# Frontend
VITE_NANOBANANA_API_URL=/api/nanobanana

# Backend
NANOBANANA_API_KEY=your_api_key_here
NANOBANANA_API_URL=https://api.nanobanana.example.com
FRONTEND_URL=https://barbershop.ir

# Domain for SSL
DOMAIN_NAME=barbershop.ir
```

## How It Works

1. **In Git**: `nginx-ssl.conf` contains `DOMAIN_NAME` placeholder
2. **On VPS**: `.env` has your actual domain
3. **During deployment**: `deploy.sh` replaces placeholder with real domain
4. **Result**: Nginx serves on your domain with SSL

## Benefits

✅ Domain not hardcoded in Git
✅ Easy to deploy to different domains (staging/production)
✅ Git stays clean and reusable
✅ Auto-deployment works seamlessly

## Manual Override

If you want to hardcode your domain instead:

1. Edit `nginx-ssl.conf` directly
2. Replace all `DOMAIN_NAME` with your actual domain
3. Commit to Git
4. Skip the environment variable approach

Both approaches work - environment variables are more flexible!
