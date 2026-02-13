# دیپلوی arzlahzei.ir روی سرور Production

> سرور: `194.5.205.223` — دامنه: `arzlahzei.ir`
> روی همین سرور پروژه hoghogh هم بالاست (postgres + redis + nginx)

---

## ۱. کپی پروژه روی سرور

```bash
# روی سرور
cd /opt
git clone <repo-url> arzlahzei
cd /opt/arzlahzei
```

یا با `scp` / `rsync`:
```bash
# از لوکال
rsync -avz --exclude node_modules --exclude .next --exclude .env \
  ./ root@194.5.205.223:/opt/arzlahzei/
```

---

## ۲. پیدا کردن نام شبکه Docker پروژه hoghogh

```bash
docker network ls | grep hoghogh
```

خروجی مثلاً:
```
abc123  saas-hoghogh-ai_default  bridge  local
```

اگه اسم شبکه فرق داشت، توی `docker-compose.prod.yml` عوض کن:
```yaml
networks:
  hoghogh_net:
    external: true
    name: اسم-واقعی-شبکه    # ← اینجا
```

---

## ۳. ساخت دیتابیس جدید روی PostgreSQL موجود

```bash
# وصل شو به postgres موجود
docker exec -it hoghogh_postgres psql -U user

# توی psql:
CREATE DATABASE arzlahzei;
CREATE USER arzlahzei_user WITH PASSWORD 'Arz$ecur3Pr0d2026!';
GRANT ALL PRIVILEGES ON DATABASE arzlahzei TO arzlahzei_user;
ALTER DATABASE arzlahzei OWNER TO arzlahzei_user;
\q
```

> **نکته:** پسورد `Arz$ecur3Pr0d2026!` باید با `DATABASE_URL` توی `.env.production` یکی باشه.
> اگه یوزر postgres اصلی `user` نیست، از یوزر ادمین خودت استفاده کن.

---

## ۴. تنظیم `.env.production`

```bash
cd /opt/arzlahzei
nano .env.production
```

مقادیر زیر رو **حتماً عوض کن**:

| متغیر | دستور تولید |
|---|---|
| `NEXTAUTH_SECRET` | `openssl rand -base64 48` |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `ADMIN_PASSWORD` | یه پسورد قوی |

بقیه مقادیر (API key ها، دامنه) از قبل ست شده.

---

## ۵. بیلد و اجرای Docker

```bash
cd /opt/arzlahzei

# بیلد
docker compose -f docker-compose.prod.yml build

# اجرا
docker compose -f docker-compose.prod.yml up -d

# چک وضعیت
docker compose -f docker-compose.prod.yml ps
docker logs arzlahzei_app
docker logs arzlahzei_cron
```

---

## ۶. مایگریشن دیتابیس + Seed

```bash
# Push schema به دیتابیس
docker exec arzlahzei_app npx prisma db push

# Seed اولیه (ادمین + قیمت‌های نمونه)
docker exec arzlahzei_app npx tsx prisma/seed.ts

# تست: آیا app جواب میده؟
curl -s http://localhost:14000/api/auth/csrf
```

---

## ۷. تنظیم Nginx + SSL

### ۷.۱ — کپی کانفیگ Nginx

```bash
# کپی کانفیگ
cp /opt/arzlahzei/nginx-arzlahzei.conf /etc/nginx/sites-available/arzlahzei.conf

# لینک فعال‌سازی
ln -s /etc/nginx/sites-available/arzlahzei.conf /etc/nginx/sites-enabled/arzlahzei.conf
```

### ۷.۲ — اول بدون SSL تست کن (موقت)

قبل از گرفتن SSL، بلاک `server :443` رو کامنت کن و بلاک `server :80` رو عوض کن:

```bash
nano /etc/nginx/sites-available/arzlahzei.conf
```

**موقتاً** بلاک 80 رو اینطوری کن:
```nginx
server {
    listen 80;
    server_name arzlahzei.ir www.arzlahzei.ir;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:14000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

و بلاک `server :443` رو کامنت کن. بعد:

```bash
# تست کانفیگ
nginx -t

# ری‌لود
systemctl reload nginx
```

### ۷.۳ — گرفتن SSL با Certbot

```bash
# نصب certbot (اگه نداری)
apt install -y certbot python3-certbot-nginx

# گرفتن SSL
certbot --nginx -d arzlahzei.ir -d www.arzlahzei.ir
```

### ۷.۴ — برگردوندن کانفیگ اصلی

بعد از گرفتن SSL، کانفیگ اصلی رو برگردون:

```bash
cp /opt/arzlahzei/nginx-arzlahzei.conf /etc/nginx/sites-available/arzlahzei.conf
nginx -t && systemctl reload nginx
```

> **نکته:** اگه certbot خودش کانفیگ رو تغییر داده و SSL بلاک اضافه کرده، نیازی به برگردوندن نیست.

---

## ۸. تست نهایی

```bash
# سایت باز بشه
curl -I https://arzlahzei.ir

# ادمین لاگین
curl -s https://arzlahzei.ir/api/auth/csrf

# آپدیت قیمت‌ها (دستی)
curl -X POST https://arzlahzei.ir/api/cron/update-prices \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# چک لاگ cron
docker logs -f arzlahzei_cron
```

---

## دستورات مفید

```bash
# ری‌استارت
docker compose -f docker-compose.prod.yml restart

# ری‌بیلد بعد از تغییر کد
docker compose -f docker-compose.prod.yml build && \
docker compose -f docker-compose.prod.yml up -d

# لاگ‌ها
docker logs -f arzlahzei_app
docker logs -f arzlahzei_cron

# ورود به کانتینر
docker exec -it arzlahzei_app sh

# آپدیت دیتابیس بعد از تغییر schema
docker exec arzlahzei_app npx prisma db push
```

---

## ساختار پورت‌ها

| سرویس | پورت داخلی | پورت خارجی |
|---|---|---|
| arzlahzei (Next.js) | 3000 | 14000 |
| hoghogh (Frontend) | 3000 | 13000 |
| hoghogh (Backend) | 8000 | 18000 |
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | — (internal) |
| Nginx | — | 80, 443 |
