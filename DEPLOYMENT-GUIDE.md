# راهنمای تنظیم Auto-Deployment با GitHub Actions

این پروژه شامل اسکریپت‌های deployment خودکار است که هر بار که به GitHub push می‌کنید، پروژه روی VPS شما به‌روز می‌شود.

## روش ۱: GitHub Actions (توصیه می‌شود) 🚀

### گام ۱: تنظیم VPS

1. **کپی فایل deploy.sh به VPS**:
   ```bash
   # روی کامپیوتر خودتان
   scp deploy.sh user@your-vps-ip:~/barber-shop-presentation/
   
   # یا اگر پروژه را clone کردید، فایل از قبل موجود است
   ```

2. **Executable کردن اسکریپت**:
   ```bash
   # روی VPS
   cd ~/barber-shop-presentation
   chmod +x deploy.sh
   ```

3. **تست دستی اسکریپت**:
   ```bash
   ./deploy.sh
   ```

### گام ۲: تولید SSH Key برای GitHub Actions

```bash
# روی VPS اجرا کنید
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions -N ""

# نمایش private key (این را در GitHub Secrets قرار می‌دهید)
cat ~/.ssh/github-actions

# اضافه کردن public key به authorized_keys
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### گام ۳: تنظیم GitHub Secrets

در GitHub repository خود:

1. برو به **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** را بزن و این secrets را اضافه کن:

| Secret Name | Value | مثال |
|------------|-------|------|
| `VPS_HOST` | IP یا domain VPS | `123.45.67.89` یا `yourdomain.com` |
| `VPS_USERNAME` | Username VPS | `ubuntu` یا `root` |
| `VPS_SSH_KEY` | Private key که ساختید | محتوای `~/.ssh/github-actions` |
| `VPS_PORT` | Port SSH (معمولاً 22) | `22` |
| `VPS_PROJECT_PATH` | مسیر پروژه روی VPS | `/home/ubuntu/barber-shop-presentation` |

### گام ۴: Push و تست

```bash
# تغییراتی ایجاد کنید
git add .
git commit -m "test: auto-deployment"
git push origin main

# در GitHub:
# Actions → Deploy to VPS → مشاهده لاگ
```

---

## روش ۲: Webhook (جایگزین) 🔗

اگر GitHub Actions را دوست ندارید، می‌توانید از webhook استفاده کنید.

### گام ۱: نصب webhook listener روی VPS

```bash
# نصب webhook
sudo apt install webhook -y

# یا با Go
go install github.com/adnanh/webhook@latest
```

### گام ۲: ایجاد webhook script

فایل `/home/ubuntu/hooks.json`:
```json
[
  {
    "id": "deploy-barber-shop",
    "execute-command": "/home/ubuntu/barber-shop-presentation/deploy.sh",
    "command-working-directory": "/home/ubuntu/barber-shop-presentation",
    "pass-arguments-to-command": [],
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha256",
        "secret": "YOUR_SECRET_HERE",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature-256"
        }
      }
    }
  }
]
```

### گام ۳: اجرای webhook server

```bash
webhook -hooks /home/ubuntu/hooks.json -verbose -port 9000
```

یا با systemd:
```bash
sudo nano /etc/systemd/system/webhook.service
```

محتوا:
```ini
[Unit]
Description=Webhook Server
After=network.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/bin/webhook -hooks /home/ubuntu/hooks.json -verbose -port 9000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable webhook
sudo systemctl start webhook
```

### گام ۴: تنظیم GitHub Webhook

در GitHub repository:
1. **Settings** → **Webhooks** → **Add webhook**
2. **Payload URL**: `http://your-vps-ip:9000/hooks/deploy-barber-shop`
3. **Content type**: `application/json`
4. **Secret**: همان secret که در `hooks.json` گذاشتید
5. **Events**: فقط `push`

---

## روش ۳: Cron Job (اجرای دوره‌ای) ⏰

اگر نمی‌خواهید webhook یا GitHub Actions راه‌اندازی کنید:

```bash
# روی VPS
crontab -e

# اضافه کردن این خط (هر 5 دقیقه چک می‌کند)
*/5 * * * * cd ~/barber-shop-presentation && git fetch && [ $(git rev-parse HEAD) != $(git rev-parse @{u}) ] && ./deploy.sh >> ~/deploy.log 2>&1
```

---

## روش ۴: Manual Deployment 🖐️

ساده‌ترین روش - هر بار که push کردید، دستی اجرا کنید:

```bash
# روی VPS
cd ~/barber-shop-presentation
./deploy.sh
```

---

## عیب‌یابی

### خطا: Permission denied

```bash
# روی VPS
chmod +x deploy.sh
chmod 755 ~/barber-shop-presentation
```

### خطا: Git pull failed

```bash
# تنظیم Git credentials روی VPS
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# یا استفاده از SSH key برای GitHub
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub  # اضافه کنید به GitHub SSH keys
```

### خطا: Docker permission denied

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### چک کردن لاگ‌ها

```bash
# Deployment logs
tail -f ~/deploy.log

# Docker logs
docker-compose logs -f
```

---

## نکات امنیتی

1. **هرگز secrets را commit نکنید**
   - `.env` در `.gitignore` است ✅
   - فایل `deploy.sh` را می‌توانید commit کنید ✅

2. **محدود کردن GitHub Actions**
   - SSH key فقط دسترسی به پروژه داشته باشد
   - از user غیر root استفاده کنید

3. **فایروال**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   # فقط اگر از webhook استفاده می‌کنید:
   # sudo ufw allow 9000/tcp
   ```

---

## Rollback (بازگشت به نسخه قبلی)

اگر deployment مشکل داشت:

```bash
cd ~/barber-shop-presentation
git log --oneline  # پیدا کردن commit قبلی
git reset --hard COMMIT_HASH
./deploy.sh
```

---

## مانیتورینگ

پس از هر deployment:

```bash
# چک کردن وضعیت
docker-compose ps

# چک کردن logs
docker-compose logs --tail=50

# تست endpoints
curl http://localhost
curl http://localhost:8001/api/health
```

---

## خلاصه دستورات

```bash
# تنظیم اولیه (فقط یک بار)
cd ~/barber-shop-presentation
chmod +x deploy.sh

# هر بار که می‌خواهید deploy کنید (manual)
./deploy.sh

# یا بگذارید GitHub Actions خودکار انجام دهد!
```
