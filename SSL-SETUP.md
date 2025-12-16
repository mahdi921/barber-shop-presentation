# SSL Certificate Setup Guide

You have SSL certificate files. Here's how to use them with your Dockerized app.

## File Structure

You should have these files:
- **Certificate file**: `your-domain.crt` or `fullchain.pem`
- **Private key**: `your-domain.key` or `privkey.pem`

## Step 1: Create SSL Directory

```bash
# On your VPS
cd ~/barber-shop-presentation
mkdir -p ssl
```

## Step 2: Copy Your SSL Files

**Option A: From your local machine**
```bash
# Copy certificate and key to VPS
scp /path/to/your-domain.crt user@your-vps-ip:~/barber-shop-presentation/ssl/certificate.crt
scp /path/to/your-domain.key user@your-vps-ip:~/barber-shop-presentation/ssl/private.key
```

**Option B: Already on VPS**
```bash
# Move/copy to project
cp /path/to/your-domain.crt ~/barber-shop-presentation/ssl/certificate.crt
cp /path/to/your-domain.key ~/barber-shop-presentation/ssl/private.key
```

## Step 3: Set Correct Permissions

```bash
# On VPS
cd ~/barber-shop-presentation
chmod 600 ssl/private.key
chmod 644 ssl/certificate.crt
```

## Step 4: Update Files (Already done for you!)

I've updated these files:
- ✅ `nginx-ssl.conf` - Nginx config with SSL
- ✅ `docker-compose.yml` - Expose port 443
- ✅ `Dockerfile` - Updated to use SSL config
- ✅ `.gitignore` - Ignore SSL files

## Step 5: Deploy with SSL

```bash
# On VPS
cd ~/barber-shop-presentation

# Make sure SSL files are in place
ls -la ssl/

# Rebuild and restart
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d

# Check status
docker-compose ps
```

## Step 6: Test

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://your-domain.com

# Test HTTPS
curl -I https://your-domain.com
```

## Verify SSL

Visit in browser:
- `https://your-domain.com` - Should show secure 🔒
- Check certificate details in browser

## Files Created

1. **ssl/certificate.crt** - Your SSL certificate
2. **ssl/private.key** - Your private key
3. **ssl/dhparam.pem** - (Optional) Diffie-Hellman parameters for security

## Generate DH Parameters (Optional but Recommended)

```bash
# On VPS - takes 2-5 minutes
cd ~/barber-shop-presentation
openssl dhparam -out ssl/dhparam.pem 2048
```

## Automatic Renewal

If you're using Let's Encrypt, set up auto-renewal:

```bash
# Create renewal script
cat > ~/renew-ssl.sh << 'EOF'
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/your-domain/fullchain.pem ~/barber-shop-presentation/ssl/certificate.crt
cp /etc/letsencrypt/live/your-domain/privkey.pem ~/barber-shop-presentation/ssl/private.key
docker-compose -f ~/barber-shop-presentation/docker-compose.yml restart frontend
EOF

chmod +x ~/renew-ssl.sh

# Add to crontab (runs daily at 2am)
(crontab -l 2>/dev/null; echo "0 2 * * * ~/renew-ssl.sh") | crontab -
```

## Troubleshooting

### Error: Certificate not found
```bash
# Check files exist
ls -la ~/barber-shop-presentation/ssl/
```

### Error: Permission denied
```bash
chmod 600 ~/barber-shop-presentation/ssl/private.key
chmod 644 ~/barber-shop-presentation/ssl/certificate.crt
```

### HTTP works but HTTPS doesn't
```bash
# Check if port 443 is open
sudo ufw allow 443/tcp
sudo ufw status

# Check container logs
docker-compose logs frontend
```

## Security Checklist

- [ ] SSL files are in `ssl/` directory
- [ ] Private key has 600 permissions
- [ ] `ssl/` is in `.gitignore` (already done)
- [ ] Port 443 is open in firewall
- [ ] HTTPS works in browser
- [ ] HTTP redirects to HTTPS
