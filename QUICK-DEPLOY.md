# Quick Deployment Guide

## فقط 3 گام! 🚀

### گام ۱: تنظیم VPS (یک بار)

```bash
# روی VPS
cd ~/barber-shop-presentation
chmod +x deploy.sh
./deploy.sh  # تست
```

### گام ۲: تنظیم GitHub Secrets (یک بار)

```bash
# روی VPS - تولید SSH key
ssh-keygen -t ed25519 -f ~/.ssh/github-actions -N ""
cat ~/.ssh/github-actions  # کپی کنید
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
```

در GitHub → Settings → Secrets → Actions:
- `VPS_HOST`: IP سرور شما
- `VPS_USERNAME`: username (مثلاً `ubuntu`)
- `VPS_SSH_KEY`: محتوای `~/.ssh/github-actions`
- `VPS_PORT`: `22`
- `VPS_PROJECT_PATH`: `/home/ubuntu/barber-shop-presentation`

### گام ۳: Push و تماشا کن! 🎉

```bash
git add .
git commit -m "feat: auto-deployment setup"
git push origin main
```

در GitHub → Actions → مشاهده deployment

---

## تست Manual

```bash
# روی VPS
./deploy.sh
```

---

## مستندات کامل

برای جزئیات بیشتر: [`DEPLOYMENT-GUIDE.md`](./DEPLOYMENT-GUIDE.md)
