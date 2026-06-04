# Welcomer-Style Discord Welcome Bot

بوت ترحيب احترافي بـ **Discord.js v14** + **Canvas** (صورة ترحيب تلقائية) + **Embed** ذهبي/أسود + **PM2** للتشغيل 24/7.

## المميزات

- صورة ترحيب **Canvas** (Welcomer style): صورة العضو، الاسم، السيرفر، عدد الأعضاء، تاريخ الانضمام
- خلفية مخصصة عبر `/setbanner`
- **Embed** تحت الصورة
- رول **Member** تلقائي للأعضاء الجدد
- سجلات دخول / خروج / حذف رسائل
- **PM2** محلي أو **VPS / Railway / Render** للعمل 24/7 بدون جهازك

## هيكلة المشروع

```
├── commands/           # Slash Commands
├── events/
├── config/config.json
├── utils/
│   ├── welcomeCanvas.js   # توليد الصورة
│   └── welcome.js         # Embed + إرسال
├── Dockerfile
├── render.yaml
├── railway.json
├── ecosystem.config.cjs   # PM2
└── index.js
```

## التثبيت المحلي

```bash
npm install
```

عدّل `config/config.json` أو انسخ من `config/config.example.json`.

```bash
npm run deploy
npm start
```

### تشغيل 24/7 على جهازك (PM2)

```bash
npm run 24
npm run 24:status
```

> عند **إغلاق الكمبيوتر** يتوقف البوت. للتشغيل الدائم استخدم استضافة سحابية أدناه.

## الأوامر

| الأمر | الوصف |
|--------|--------|
| `/setwelcome` | قناة الترحيب |
| `/setbanner` | رابط خلفية صورة Canvas |
| `/setmemberrole` | رول تلقائي |
| `/welcome-preview` | معاينة الترحيب |
| `/help` | المساعدة |

## Intents (Developer Portal)

- **Server Members Intent**
- **Message Content Intent**

## صلاحيات البوت

`Send Messages`, `Embed Links`, `Attach Files`, `View Channels`, `Manage Roles`, `Read Message History`

---

## النشر على VPS Ubuntu (24/7)

1. استأجر VPS (مثل DigitalOcean / Hetzner).
2. ارفع المشروع أو `git clone`.
3. نفّذ:

```bash
chmod +x scripts/vps-setup.sh
./scripts/vps-setup.sh
```

أو يدوياً:

```bash
sudo apt update && sudo apt install -y nodejs npm git
git clone <your-repo> && cd discord-test
npm install
# ضع التوكن في config/config.json
npm run deploy
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

البوت يعمل **24/7** حتى تغلق السيرفر.

---

## النشر على Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub.
2. أضف **Variables**:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
   - `WELCOME_CHANNEL_ID` (اختياري)
3. يستخدم المشروع `Dockerfile` و `railway.json`.
4. عند النشر يشغّل: `npm run deploy && npm start`.

> Railway يعيد التشغيل تلقائياً عند التعطل.

---

## النشر على Render

1. [render.com](https://render.com) → New **Background Worker** (ليس Web Service).
2. اربط المستودع.
3. Environment: Docker أو Node — استخدم `render.yaml`.
4. أضف نفس متغيرات البيئة من `.env.example`.
5. **Start Command:** `npm run deploy && npm start`

> اختر **Background Worker** لأن البوت لا يحتاج منفذ HTTP.

---

## متغيرات البيئة (الاستضافة)

| المتغير | الوصف |
|---------|--------|
| `DISCORD_TOKEN` | توكن البوت |
| `CLIENT_ID` | Application ID |
| `GUILD_ID` | معرف السيرفر |
| `WELCOME_CHANNEL_ID` | قناة الترحيب |
| `WELCOME_BACKGROUND_URL` | خلفية Canvas |
| `LOG_CHANNEL_ID` | قناة السجلات |
| `MEMBER_ROLE_ID` | رول تلقائي |

---

## ملاحظات

- لا ترفع `config.json` الذي يحتوي التوكن إلى GitHub.
- `/setbanner url:https://...` — صورة عالية الجودة 1100×500 أو أكبر.
- `welcomeCanvasEnabled: false` في config لتعطيل الصورة والاكتفاء بالـ Embed.

## الترخيص

MIT
