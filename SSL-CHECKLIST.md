# SSL Configuration Checklist

## Current Status Check

### ✅ Configured:
- [x] `nginx-ssl.conf` created with SSL configuration
- [x] `docker-compose.yml` has port 443 exposed
- [x] `docker-compose.yml` has SSL volume mount (`./ssl:/etc/nginx/ssl:ro`)
- [x] `DOMAIN_NAME` environment variable support added
- [x] SSL files ignored in `.gitignore`

### ⚠️ Needs Action:

#### 1. Enable SSL Config in Dockerfile

**Current:** Dockerfile uses `nginx.conf` (HTTP only)
**Needed:** Switch to `nginx-ssl.conf` (HTTPS)

**Edit `Dockerfile` lines 21-24:**

```dockerfile
# For SSL: uncomment the next line and comment out the regular nginx.conf
COPY nginx-ssl.conf /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
```

#### 2. Add SSL Certificate Files on VPS

You need to copy your SSL certificate and private key to the VPS:

```bash
# On VPS, create ssl directory
mkdir -p ~/barber-shop-presentation/ssl

# Copy your certificate (rename to certificate.crt)
cp /path/to/your-cert.crt ~/barber-shop-presentation/ssl/certificate.crt

# Copy your private key (rename to private.key)
cp /path/to/your-key.key ~/barber-shop-presentation/ssl/private.key

# Set correct permissions
chmod 644 ~/barber-shop-presentation/ssl/certificate.crt
chmod 600 ~/barber-shop-presentation/ssl/private.key
```

#### 3. Set Domain Name in .env

```bash
# On VPS
nano ~/barber-shop-presentation/.env

# Add:
DOMAIN_NAME=your-actual-domain.com
```

## Quick Verification Commands

### Before Deployment:
```bash
# Check SSL files exist
ls -la ~/barber-shop-presentation/ssl/

# Should show:
# certificate.crt (644 permissions)
# private.key (600 permissions)
```

### After Deployment:
```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://your-domain.com

# Test HTTPS
curl -I https://your-domain.com

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

## Full Deployment Steps

1. **Edit Dockerfile** - Enable nginx-ssl.conf
2. **Copy SSL files** to `ssl/` directory
3. **Set DOMAIN_NAME** in `.env`
4. **Commit and push** (if using auto-deploy)
   ```bash
   git add Dockerfile
   git commit -m "feat: enable SSL configuration"
   git push origin main
   ```
5. **Or deploy manually**
   ```bash
   ./deploy.sh
   ```

## Common Issues

### Issue: "Certificate not found"
- Check files are in `ssl/` directory
- Check filenames are exact: `certificate.crt` and `private.key`
- Check permissions: `ls -la ssl/`

### Issue: "Connection refused" on port 443
- Check firewall: `sudo ufw allow 443/tcp`
- Check container ports: `docker-compose ps`

### Issue: "Invalid certificate"
- Make sure certificate matches domain
- Check if certificate includes full chain
- Verify with: `openssl x509 -in ssl/certificate.crt -text -noout`

## Certificate Types

### If you have Let's Encrypt:
```bash
# Copy from Let's Encrypt directory
sudo cp /etc/letsencrypt/live/your-domain/fullchain.pem ssl/certificate.crt
sudo cp /etc/letsencrypt/live/your-domain/privkey.pem ssl/private.key
```

### If you have separate files:
- **Certificate**: Usually `.crt` or `.pem`
- **Private Key**: Usually `.key` or `-key.pem`
- **Chain/Bundle**: If separate, concatenate with certificate:
  ```bash
  cat your-cert.crt intermediate.crt > ssl/certificate.crt
  ```

## Next Steps

1. ✅ Check if you have SSL certificate files ready
2. ✅ Follow "Needs Action" steps above
3. ✅ Deploy and test
4. ✅ Verify HTTPS works in browser (should see 🔒)
