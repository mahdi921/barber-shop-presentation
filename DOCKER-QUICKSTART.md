# 🚀 راهنمای سریع Docker

راهنمای سریع برای اجرای پروژه با Docker.

## نصب سریع (3 دقیقه)

### گام ۱: کپی environment variables

```bash
cp .env.docker.example .env
```

### گام ۲: ویرایش فایل `.env`

```bash
nano .env
```

حداقل این متغیر را تنظیم کنید:
```env
VITE_NANOBANANA_API_URL=https://api.nanobanana.example.com
```

### گام ۳: اجرا

```bash
docker-compose up -d
```

### گام ۴: باز کردن در مرورگر

وب‌سایت روی این آدرس در دسترس است:
```
http://localhost
```

## دستورات اصلی

| دستور | توضیحات |
|-------|---------|
| `docker-compose up -d` | اجرای کانتینرها |
| `docker-compose down` | توقف کانتینرها |
| `docker-compose logs -f` | مشاهده logs |
| `docker-compose ps` | وضعیت کانتینرها |
| `docker-compose restart` | ریستارت کانتینرها |

## استقرار با Backend

اگر می‌خواهید از backend Node.js استفاده کنید:

### گام ۱: ایجاد دایرکتوری backend

```bash
mkdir backend
cp backend-example.js backend/server.js
cp Dockerfile.backend backend/Dockerfile
```

### گام ۲: تنظیم environment variables

فایل `.env` را ویرایش کنید:
```env
VITE_NANOBANANA_API_URL=/api/nanobanana
NANOBANANA_API_KEY=your_api_key_here
NANOBANANA_API_URL=https://api.nanobanana.example.com
```

### گام ۳: فعال‌سازی backend در docker-compose

فایل `docker-compose.yml` را باز کنید و کامنت‌های بخش `backend` را بردارید.

### گام ۴: اجرا

```bash
docker-compose up -d
```

## استقرار در سرور

### گام ۱: کپی فایل‌ها

```bash
tar -czf barber.tar.gz --exclude=node_modules --exclude=dist .
scp barber.tar.gz user@server:/opt/barber-shop/
```

### گام ۲: در سرور

```bash
ssh user@server
cd /opt/barber-shop
tar -xzf barber.tar.gz
cp .env.docker.example .env
nano .env  # تنظیم مقادیر production
docker-compose up -d
```

## عیب‌یابی

### کانتینر start نمی‌شود

```bash
docker-compose logs frontend
```

### پاکسازی و rebuild

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## مستندات کامل

برای اطلاعات بیشتر، فایل [`README.md`](./README.md) را مطالعه کنید.
