# نانوبانانا - صفحه فرود آرایشگاهی

یک صفحه فرود واکنش‌گرا و حرفه‌ای برای محصول آرایشگاهی ایرانی با قابلیت پیش‌نمایش زنده با هوش مصنوعی.

## ویژگی‌ها

- ✅ **طراحی RTL کامل** با فونت Vazirmatn
- ✅ **پلیر ویدیو پیشرفته** با Plyr.js (autoplay muted, playsinline)
- ✅ **آزمایش آنلاین** با دوربین و آپلود عکس
- ✅ **واکنش‌گرا** برای موبایل، تبلت و دسکتاپ
- ✅ **دسترسی‌پذیر** با ARIA labels و keyboard navigation
- ✅ **فرم تماس** با اعتبارسنجی شماره موبایل ایرانی
- ✅ **انیمیشن‌های روان** با احترام به `prefers-reduced-motion`

## نصب و اجرا

### روش ۱: اجرای سریع با Docker 🐳 (توصیه می‌شود)

**گام ۱**: کپی environment variables
```bash
cp .env.docker.example .env
nano .env  # تنظیم VITE_NANOBANANA_API_URL
```

**گام ۲**: اجرا
```bash
docker-compose up -d
```

**گام ۳**: باز کردن در مرورگر
```
http://localhost
```

📖 [راهنمای کامل Docker](./DOCKER-QUICKSTART.md)

---

### روش ۲: اجرای Local (Development)


### پیش‌نیازها

- Node.js (نسخه ۱۶ یا بالاتر)
- npm یا yarn

### مراحل اجرا

```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev

# ساخت نسخه production
npm run build
```

سرور توسعه روی `http://localhost:5174` اجرا می‌شود.

## ساختار پروژه

```
src/
├── components/
│   ├── Navbar.jsx                  # نوار ناوبری sticky با smooth scroll
│   ├── HeroVideo.jsx               # بخش hero با Plyr
│   ├── Benefits.jsx                # بخش مزایا
│   ├── FeatureCards.jsx            # کارت‌های امکانات
│   ├── LiveTest.jsx                # آزمایش آنلاین (دوربین/آپلود)
│   ├── Plans.jsx                   # پلن‌های قیمتی
│   └── ContactFooter.jsx           # فوتر و فرم تماس
├── styles/                         # (اختیاری) استایل‌های shared
├── assets/                         # تصاویر و فایل‌های استاتیک
├── App.jsx                         # کامپوننت اصلی
├── index.css                       # استایل‌های global و variables
└── main.jsx                        # نقطه ورود
```

## تنظیمات مهم

### تعویض ویدیو

فایل `src/components/HeroVideo.jsx` را باز کنید و URL ویدیو را تغییر دهید:

```javascript
const videoSource = {
  type: 'video',
  sources: [
    {
      src: 'YOUR_VIDEO_URL_HERE.mp4',  // ← URL ویدیو خود را قرار دهید
      type: 'video/mp4',
    },
  ],
  poster: '/poster-image.jpg',  // ← تصویر poster
};
```

### اتصال به API نانوبانانا و مدیریت API Key

#### ⚠️ هشدار امنیتی مهم

**هرگز API key را مستقیماً در کد frontend قرار ندهید!**

API key شما اگر در کد React قرار بگیرد:
- ✗ در bundle نهایی قابل مشاهده است
- ✗ هر کسی می‌تواند آن را ببیند و سوء‌استفاده کند
- ✗ محافظتی در برابر استفاده غیرمجاز ندارد

#### روش توصیه شده: Backend Proxy (امن) 🔒

بهترین روش این است که یک **backend سرور** داشته باشید که:
1. API key را در محیط server نگه‌دارد
2. درخواست‌های frontend را دریافت کند
3. با API key به سرویس NanoBanana درخواست بزند
4. نتیجه را به frontend برگرداند

##### مثال با Node.js + Express

**گام ۱: ایجاد backend ساده**

```bash
# در یک دایرکتوری جدا
mkdir backend
cd backend
npm init -y
npm install express cors dotenv multer axios
```

**گام ۲: ایجاد فایل `.env`** (این فایل را به Git اضافه نکنید!)

```env
# backend/.env
NANOBANANA_API_KEY=your_actual_api_key_here
NANOBANANA_API_URL=https://api.nanobanana.example.com
PORT=8000
```

**گام ۳: ایجاد سرور** (`backend/server.js`)

```javascript
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// Endpoint برای پردازش تصویر
app.post('/api/nanobanana/process', upload.single('image'), async (req, res) => {
  try {
    const { preset, instructions, client_timestamp, source } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'تصویر یافت نشد' 
      });
    }

    // ارسال به NanoBanana با API Key
    const formData = new FormData();
    formData.append('image', imageFile.buffer, imageFile.originalname);
    formData.append('preset', preset);
    formData.append('instructions', instructions);

    const response = await axios.post(
      `${process.env.NANOBANANA_API_URL}/process`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
          ...formData.getHeaders()
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('NanoBanana API Error:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'خطا در پردازش تصویر' 
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
```

**گام ۴: اجرای backend**

```bash
node server.js
```

**گام ۵: تنظیم frontend**

فایل `src/components/LiveTest.jsx` را باز کنید و endpoint را تغییر دهید:

```javascript
// خط ~131
const API_ENDPOINT = 'http://localhost:8000/api/nanobanana/process';
// یا برای production:
// const API_ENDPOINT = '/api/nanobanana/process'; (با Nginx proxy)
```

**گام ۶: برای Production، از Nginx استفاده کنید**

فایل `nginx.conf` این پروژه قبلاً شامل پیکربندی proxy است. فقط کافی است backend address را تنظیم کنید:

```nginx
location /api/ {
    proxy_pass http://localhost:8000/;  # ← آدرس backend شما
}
```

---

#### روش جایگزین: متغیرهای محیطی Vite (کمتر امن) ⚠️

اگر API شما محدودیت‌های domain دارد یا rate limiting سخت‌گیری دارد، می‌توانید از environment variables استفاده کنید، **اما همچنان توصیه نمی‌شود**.

**گام ۱: ایجاد فایل `.env`** (در ریشه پروژه frontend)

```env
# .env (این فایل را به Git اضافه نکنید!)
VITE_NANOBANANA_API_KEY=your_api_key_here
VITE_NANOBANANA_API_URL=https://api.nanobanana.example.com
```

**گام ۲: اضافه کردن `.env` به `.gitignore`**

```bash
echo ".env" >> .gitignore
```

**گام ۳: استفاده در کد**

فایل `src/components/LiveTest.jsx` را ویرایش کنید:

```javascript
// خط ~131
const API_ENDPOINT = import.meta.env.VITE_NANOBANANA_API_URL + '/process';
const API_KEY = import.meta.env.VITE_NANOBANANA_API_KEY;

// هنگام ارسال request:
const response = await fetch(API_ENDPOINT, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
  },
  body: formData,
});
```

**⚠️ نکته**: این روش API key را در bundle وارد می‌کند و قابل مشاهده است. فقط برای تست و توسعه استفاده کنید.

---

#### خلاصه مراحل (روش توصیه شده)

1. ✅ API key را در backend server نگه‌دارید (`.env` فایل)
2. ✅ یک endpoint در backend بسازید که درخواست‌های frontend را handle کند
3. ✅ Backend به NanoBanana با API key درخواست بزند
4. ✅ Frontend فقط به backend خودتان درخواست بزند (بدون API key)
5. ✅ برای production از Nginx proxy استفاده کنید

#### مثال کامل ساختار پروژه

```
my-barber-shop-project/
├── frontend/                    # این پروژه React
│   ├── src/
│   ├── package.json
│   └── .env.example            # نمونه (بدون API key واقعی)
│
├── backend/                     # سرور Node.js شما
│   ├── server.js
│   ├── package.json
│   └── .env                    # API key اینجا (در .gitignore)
│
└── nginx.conf                  # پیکربندی production
```

#### چک‌لیست امنیت API Key

- [ ] API key در فایل `.env` قرار دارد
- [ ] فایل `.env` در `.gitignore` اضافه شده
- [ ] API key هرگز در کد frontend hardcode نشده
- [ ] Backend endpoint برای proxy ایجاد شده
- [ ] CORS به درستی تنظیم شده
- [ ] Rate limiting در backend فعال است
- [ ] برای production از HTTPS استفاده می‌شود



### Schema درخواست API

**درخواست POST** (multipart/form-data):

```
POST /api/nanobanana/process

Fields:
- image: file (jpeg/png)
- preset: string (hair_01, beard_02, ...)
- instructions: string (Persian)
- client_timestamp: ISO string
- source: 'camera' | 'upload'
```

**پاسخ موفق (200)**:

```json
{
  "status": "ok",
  "job_id": "uuid",
  "result_url": "https://cdn.example.com/processed/uuid.jpg",
  "meta": {
    "processing_ms": 1234,
    "model_version": "NanoBanana-v1"
  }
}
```

**پاسخ خطا (4xx/5xx)**:

```json
{
  "status": "error",
  "message": "Description of error",
  "code": 400
}
```

### اتصال فرم تماس

فایل `src/components/ContactFooter.jsx` را ویرایش کنید:

**گزینه ۱: API سفارشی**

```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

**گزینه ۲: Formspree**

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**گزینه ۳: EmailJS**

```javascript
import emailjs from '@emailjs/browser';
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData);
```

## استقرار با Docker 🐳

این پروژه شامل پیکربندی کامل Docker است که استقرار را بسیار ساده می‌کند.

### پیش‌نیازها

- Docker Engine (نسخه 20.10 یا بالاتر)
- Docker Compose (نسخه 2.0 یا بالاتر)

### مراحل استقرار

#### گام ۱: کپی فایل environment variables

```bash
# کپی فایل نمونه
cp .env.docker.example .env

# ویرایش فایل .env و مقادیر واقعی را وارد کنید
nano .env
```

#### گام ۲: تنظیم متغیرهای محیطی

فایل `.env` را ویرایش کنید:

```env
# برای فقط frontend (بدون backend)
VITE_NANOBANANA_API_URL=https://api.nanobanana.example.com

# اگر از backend استفاده می‌کنید:
VITE_NANOBANANA_API_URL=/api/nanobanana
NANOBANANA_API_KEY=your_actual_api_key_here
NANOBANANA_API_URL=https://api.nanobanana.example.com
FRONTEND_URL=http://localhost
```

#### گام ۳: اجرای کانتینرها

**فقط Frontend**:
```bash
docker-compose up -d frontend
```

**Frontend + Backend**:

ابتدا بخش backend را در `docker-compose.yml` uncomment کنید، سپس:

```bash
docker-compose up -d
```

#### گام ۴: بررسی وضعیت

```bash
# نمایش کانتینرهای در حال اجرا
docker-compose ps

# مشاهده logs
docker-compose logs -f

# فقط logs frontend
docker-compose logs -f frontend
```

وب‌سایت روی `http://localhost` در دسترس است.

### دستورات مفید Docker

```bash
# توقف کانتینرها
docker-compose down

# توقف و حذف volumes
docker-compose down -v

# rebuild کردن images
docker-compose build

# rebuild و اجرا
docker-compose up -d --build

# مشاهده resource usage
docker stats

# وارد شدن به کانتینر frontend
docker exec -it barber-shop-frontend sh

# پاکسازی کامل
docker-compose down
docker system prune -a
```

### استقرار در سرور Production

#### گام ۱: انتقال فایل‌ها به سرور

```bash
# ایجاد آرشیو
tar -czf barber-shop.tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=.git \
  .

# کپی به سرور
scp barber-shop.tar.gz user@your-server:/opt/barber-shop/

# در سرور
ssh user@your-server
cd /opt/barber-shop
tar -xzf barber-shop.tar.gz
```

#### گام ۲: تنظیم Environment Variables در سرور

```bash
# ایجاد فایل .env
nano .env
```

مقادیر production را وارد کنید:

```env
VITE_NANOBANANA_API_URL=/api/nanobanana
NANOBANANA_API_KEY=your_production_api_key
NANOBANANA_API_URL=https://api.nanobanana.example.com
FRONTEND_URL=https://yourdomain.com
```

#### گام ۳: اجرا با Docker Compose

```bash
docker-compose up -d
```

#### گام ۴: تنظیم Reverse Proxy (Nginx خارجی)

اگر Nginx خارجی دارید (برای SSL و چند سایت):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### گام ۵: تنظیم SSL با Let's Encrypt

```bash
sudo certbot --nginx -d yourdomain.com
```

### استفاده از Backend در Docker

اگر می‌خواهید از backend Node.js استفاده کنید:

**گام ۱: ایجاد دایرکتوری backend**

```bash
mkdir -p backend
```

**گام ۲: کپی فایل‌های backend**

```bash
# کپی backend example
cp backend-example.js backend/server.js
cp backend.env.example backend/.env

# ایجاد package.json در backend
cd backend
npm init -y
npm install express cors dotenv multer axios form-data
```

**گام ۳: کپی Dockerfile**

```bash
cp Dockerfile.backend backend/Dockerfile
```

**گام ۴: Uncomment بخش backend در docker-compose.yml**

فایل `docker-compose.yml` را ویرایش کنید و کامنت‌های بخش backend را بردارید.

**گام ۵: اجرا**

```bash
docker-compose up -d
```

Backend روی `http://localhost:8000` اجرا می‌شود.

### Monitoring و Logs

```bash
# مشاهده health status
docker-compose ps

# مشاهده logs realtime
docker-compose logs -f

# مشاهده resource usage
docker stats

# بررسی health checks
docker inspect barber-shop-frontend | grep Health -A 10
```

### Backup و Restore

```bash
# Backup volumes
docker run --rm \
  -v barber-shop_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data

# Restore
docker run --rm \
  -v barber-shop_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /
```

### عیب‌یابی Docker

**کانتینر start نمی‌شود**:
```bash
docker-compose logs frontend
docker inspect barber-shop-frontend
```

**مشکل network**:
```bash
docker network ls
docker network inspect barber-shop_barber-network
```

**پاکسازی و rebuild کامل**:
```bash
docker-compose down -v
docker system prune -a -f
docker-compose build --no-cache
docker-compose up -d
```

---

## استقرار با Nginx (بدون Docker)

فایل پیکربندی Nginx نمونه (`nginx.conf`) در ریشه پروژه موجود است.

### مراحل استقرار

1. **ساخت production build**:

```bash
npm run build
```

2. **کپی فایل‌های dist به سرور**:

```bash
scp -r dist/* user@server:/var/www/barber-shop/
```

3. **پیکربندی Nginx**:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/barber-shop
sudo ln -s /etc/nginx/sites-available/barber-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

4. **تنظیم SSL** (با certbot):

```bash
sudo certbot --nginx -d yourdomain.com
```

## Nginx به عنوان Proxy برای API

پیکربندی Nginx شامل یک reverse proxy برای `/api` است که درخواست‌ها را به backend واقعی ارسال می‌کند:

```nginx
location /api/ {
    proxy_pass http://backend-server:8000/;
    proxy_set_header Host $host;
    # ...
}
```

این راه‌حل:
- از CORS جلوگیری می‌کند
- API key را مخفی نگه می‌دارد
- امکان caching را فراهم می‌کند

## اعتبارسنجی فرم تماس

فرم تماس شامل اعتبارسنجی برای:

- **شماره موبایل ایرانی**: `^(?:\+98|0)?9\d{9}$`
  - قبول می‌کند: `09123456789`, `+989123456789`, `9123456789`
- **ایمیل**: الگوی استاندارد email
- **فیلدهای الزامی**: نام، ایمیل، شماره تلفن

## دسترسی‌پذیری

این پروژه از استانداردهای WCAG 2.1 AA پیروی می‌کند:

- ✅ همه تصاویر دارای `alt` text
- ✅ فرم‌ها با `label` و `aria-describedby`
- ✅ دکمه‌ها با `aria-label`
- ✅ Navigation با `aria-current`
- ✅ Dialogs با `role="dialog"` و `aria-modal`
- ✅ پشتیبانی کامل از keyboard navigation
- ✅ احترام به `prefers-reduced-motion`

## مرورگرهای پشتیبانی شده

- Chrome/Edge (آخرین 2 نسخه)
- Firefox (آخرین 2 نسخه)
- Safari (آخرین 2 نسخه)
- موبایل: iOS Safari, Chrome Android

## نکات امنیتی

1. **هرگز API key در frontend قرار ندهید**
2. از HTTPS برای production استفاده کنید
3. Rate limiting برای API requests تنظیم کنید
4. فایل‌های آپلود شده را validate کنید
5. از CSP headers استفاده کنید

## نکات عملکرد

- تصاویر قبل از آپلود فشرده می‌شوند (max 1024px, 2MB)
- ویدیو با lazy load بارگذاری می‌شود
- Plyr library به صورت async می‌آید
- استفاده از CSS animations (GPU-accelerated)

## Checklist پذیرش

- [x] صفحه به صورت RTL نمایش داده می‌شود
- [x] فونت Vazirmatn بارگذاری می‌شود
- [x] ویدیو به صورت خودکار و muted پخش می‌شود (autoplay)
- [x] دوربین با permission کار می‌کند
- [x] آپلود فایل و فشرده‌سازی عمل می‌کند
- [x] درخواست mock به API ارسال می‌شود
- [x] نتیجه (mock) نمایش داده می‌شود
- [x] اعتبارسنجی شماره موبایل ایرانی کار می‌کند
- [x] فرم تماس validation دارد

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.

## پشتیبانی

برای سوالات و مشکلات، با تیم نانوبانانا تماس بگیرید.
