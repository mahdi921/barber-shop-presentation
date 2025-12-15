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

### اتصال به API نانوبانانا

فایل `src/components/LiveTest.jsx` را باز کنید و endpoint واقعی را جایگزین کنید:

```javascript
// خط ~108
const API_ENDPOINT = 'https://api.example.com/nanobanana/process';
```

**⚠️ هشدار امنیتی**: هرگز API key را مستقیماً در کد frontend قرار ندهید!

برای production، از یک **backend proxy** استفاده کنید. مثال Nginx در فایل `nginx.conf` موجود است.

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

## استقرار با Nginx

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
