# Backend Service - Barber Shop Presentation

Backend proxy server برای سرویس NanoBanana API.

## نصب

```bash
npm install
```

## تنظیمات

فایل `.env.example` را کپی کنید:

```bash
cp .env.example .env
```

فایل `.env` را ویرایش کنید و مقادیر واقعی را وارد کنید:

```env
PORT=8000
NANOBANANA_API_KEY=your_actual_api_key_here
NANOBANANA_API_URL=https://api.nanobanana.example.com
FRONTEND_URL=http://localhost
```

## اجرا

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Endpoints

### Health Check
```
GET /api/health
```

**Response**:
```json
{
  "status": "ok",
  "message": "Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Process Image
```
POST /api/nanobanana/process
```

**Request** (multipart/form-data):
- `image`: File (jpeg/png)
- `preset`: String (hair_01, beard_02, etc.)
- `instructions`: String (optional)
- `client_timestamp`: ISO string
- `source`: 'camera' | 'upload'

**Success Response (200)**:
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

**Error Response**:
```json
{
  "status": "error",
  "message": "Error description",
  "code": 400
}
```

## Docker

برای استفاده در Docker، از `Dockerfile` در همین دایرکتوری استفاده کنید.

## نکات امنیتی

- ⚠️ هرگز `.env` را commit نکنید
- ✅ از HTTPS در production استفاده کنید
- ✅ Rate limiting را فعال کنید
- ✅ CORS را به درستی تنظیم کنید
