# راهنمای عیب‌یابی Docker روی VPS

## خطای: Docker daemon در دسترس نیست

### علت
Docker daemon (سرویس Docker) روی سرور شما در حال اجرا نیست.

## راه‌حل‌ها

### گام ۱: بررسی وضعیت Docker

```bash
sudo systemctl status docker
```

### گام ۲: اگر Docker نصب نیست

**Ubuntu/Debian:**
```bash
# به‌روزرسانی package list
sudo apt update

# نصب Docker
sudo apt install docker.io -y

# نصب Docker Compose
sudo apt install docker-compose -y

# فعال‌سازی Docker
sudo systemctl enable docker
sudo systemctl start docker
```

**CentOS/RHEL:**
```bash
sudo yum install -y docker
sudo yum install -y docker-compose
sudo systemctl enable docker
sudo systemctl start docker
```

### گام ۳: اگر Docker نصب است اما running نیست

```bash
# شروع سرویس Docker
sudo systemctl start docker

# فعال‌سازی برای autostart
sudo systemctl enable docker

# بررسی وضعیت
sudo systemctl status docker
```

### گام ۴: اضافه کردن user به گروه docker (برای اجرا بدون sudo)

```bash
# اضافه کردن user فعلی به گروه docker
sudo usermod -aG docker $USER

# logout و login دوباره یا اجرای:
newgrp docker

# تست بدون sudo
docker ps
```

### گام ۵: تست Docker

```bash
# تست با یک container ساده
docker run hello-world

# اگر موفق بود، پیام خوش‌آمدگویی نمایش داده می‌شود
```

## اگر همچنان کار نکرد

### بررسی لاگ‌های Docker

```bash
sudo journalctl -u docker.service -n 50 --no-pager
```

### بررسی Docker socket

```bash
# بررسی وجود socket file
ls -la /var/run/docker.sock

# اگر وجود نداشت، restart کنید
sudo systemctl restart docker
```

### بررسی فایروال

```bash
# اطمینان از باز بودن پورت‌های Docker
sudo ufw status
```

## پس از حل مشکل Docker

وقتی Docker کار کرد، دستورات زیر را اجرا کنید:

```bash
# رفتن به دایرکتوری پروژه
cd /path/to/barber-shop-presentation

# Build کردن images
docker-compose build

# اجرای containers
docker-compose up -d

# بررسی وضعیت
docker-compose ps

# مشاهده logs
docker-compose logs -f
```

## نکات امنیتی برای VPS

1. **فایروال را تنظیم کنید**:
   ```bash
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw allow 22/tcp    # SSH
   sudo ufw enable
   ```

2. **محدود کردن دسترسی Docker socket**:
   ```bash
   sudo chmod 660 /var/run/docker.sock
   ```

3. **استفاده از non-root user**:
   - همیشه از user معمولی در گروه docker استفاده کنید
   - از root برای اجرای containers استفاده نکنید

## Alternative: اجرای بدون Docker

اگر Docker مشکل دارد، می‌توانید بدون Docker هم اجرا کنید:

### Frontend (Production Build)
```bash
cd /path/to/barber-shop-presentation
npm install
npm run build

# با یک web server ساده
sudo npm install -g serve
serve -s dist -l 80
```

### Backend
```bash
cd /path/to/barber-shop-presentation/backend
npm install
cp .env.example .env
nano .env  # تنظیم environment variables

# اجرا با PM2 (process manager)
sudo npm install -g pm2
pm2 start server.js --name barber-backend
pm2 startup
pm2 save
```

### Nginx (بدون Docker)
```bash
sudo apt install nginx
sudo cp nginx.conf /etc/nginx/sites-available/barber-shop
sudo ln -s /etc/nginx/sites-available/barber-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## پشتیبانی

اگر هنوز مشکل دارید، خروجی این دستورات را بفرستید:

```bash
# نسخه OS
cat /etc/os-release

# وضعیت Docker
sudo systemctl status docker

# خطاهای Docker
sudo journalctl -u docker.service -n 100 --no-pager

# Docker version (اگر کار می‌کند)
docker --version
docker-compose --version
```
