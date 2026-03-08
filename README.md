# مقرأة مُزن الخير — الموقع الإلكتروني

أول مقرأة عُمانية نسائية تطوعية لتعليم القرآن الكريم عن بُعد.

## التقنيات المستخدمة

- **Next.js 15** — إطار العمل (App Router)
- **React 19** — واجهة المستخدم
- **TypeScript** — لغة البرمجة
- **Tailwind CSS 4** — التنسيقات
- **NextAuth.js v5** — تسجيل الدخول والمصادقة
- **Prisma ORM** — إدارة قاعدة البيانات
- **PostgreSQL** — قاعدة البيانات (متوافق مع Supabase)
- **Stripe** — بوابة الدفع الإلكتروني

## التثبيت والتشغيل

### ١. استنساخ المشروع

```bash
cd muznalkair
```

### ٢. تثبيت المكتبات

```bash
npm install
```

### ٣. إعداد المتغيرات البيئية

انسخي ملف `.env.example` إلى `.env` وعدّلي القيم:

```bash
cp .env.example .env
```

عدّلي الملف `.env` بالقيم الخاصة بكِ:

| المتغير | الوصف |
|---------|-------|
| `DATABASE_URL` | رابط قاعدة بيانات PostgreSQL |
| `DIRECT_URL` | رابط مباشر لقاعدة البيانات (مطلوب لـ Prisma في الإنتاج) |
| `NEXTAUTH_SECRET` | مفتاح سري (أنشئيه بـ `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | رابط الموقع (http://localhost:3000 للتطوير) |
| `STRIPE_SECRET_KEY` | المفتاح السري من لوحة Stripe |
| `STRIPE_PUBLISHABLE_KEY` | المفتاح العام من لوحة Stripe |
| `STRIPE_WEBHOOK_SECRET` | مفتاح Webhook من Stripe (مطلوب لتفعيل `/api/webhook/stripe`) |
| `RESEND_API_KEY` | مفتاح Resend لإرسال البريد الإلكتروني |
| `EMAIL_FROM` | البريد المرسل منه (مثل: `Muzn Al Khair <noreply@domain.com>`) |
| `WHATSAPP_NUMBER` | رقم واتساب التواصل |

### ٤. إعداد قاعدة البيانات

```bash
npx prisma db push
```

أو لإنشاء ملفات الترحيل:

```bash
npx prisma migrate dev --name init
```

### ٥. تشغيل المشروع

```bash
npm run dev
```

افتحي المتصفح على: [http://localhost:3000](http://localhost:3000)

## هيكل المشروع

```
src/
├── app/
│   ├── page.tsx              ← الصفحة الرئيسية
│   ├── layout.tsx            ← التخطيط العام
│   ├── globals.css           ← الأنماط العامة
│   ├── login/page.tsx        ← تسجيل الدخول
│   ├── register/page.tsx     ← إنشاء حساب
│   ├── checkout/page.tsx     ← صفحة الدفع
│   ├── dashboard/
│   │   ├── layout.tsx        ← تخطيط لوحة التحكم
│   │   ├── page.tsx          ← الرئيسية
│   │   ├── courses/page.tsx  ← دوراتي
│   │   └── profile/page.tsx  ← الملف الشخصي
│   └── api/
│       ├── auth/             ← مسارات المصادقة
│       ├── checkout/         ← إنشاء جلسة دفع
│       ├── webhook/stripe/   ← Webhook من Stripe
│       └── user/             ← بيانات المستخدم
├── components/
│   ├── MuznLogo.tsx          ← شعار المقرأة (SVG)
│   ├── IslamicPattern.tsx    ← النمط الهندسي الإسلامي
│   ├── Navbar.tsx            ← شريط التنقل
│   ├── Footer.tsx            ← التذييل
│   ├── DashboardSidebar.tsx  ← القائمة الجانبية
│   └── Providers.tsx         ← SessionProvider
└── lib/
    ├── auth.ts               ← إعدادات NextAuth
    ├── prisma.ts             ← عميل Prisma
    └── utils.ts              ← أدوات مساعدة
```

## إعداد Stripe

١. أنشئي حسابًا على [Stripe](https://stripe.com)
٢. احصلي على المفاتيح من لوحة التحكم (Dashboard → API Keys)
٣. أنشئي Webhook endpoint يُشير إلى: `https://your-domain.com/api/webhook/stripe`
٤. اختاري الحدث: `checkout.session.completed`
٥. انسخي `Signing secret` وضعيه في `STRIPE_WEBHOOK_SECRET` على Vercel
٦. في بيئة التطوير يمكن استخدام:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## استعادة كلمة المرور

- صفحة طلب إعادة التعيين: `/forgot-password`
- صفحة التعيين الفعلية: `/reset-password?token=...`
- التوكن صالح لمدة ساعة، ومرة واحدة فقط
- عند نجاح إعادة التعيين يتم تحديث كلمة المرور بشكل مشفر (`bcryptjs`)

## البريد الإلكتروني (Resend)

- الرسائل المفعلة:
  - رسالة ترحيب بعد التسجيل
  - رسالة إعادة تعيين كلمة المرور
  - رسالة تأكيد شراء الدورة (Stripe + الموافقة اليدوية)
- عند عدم ضبط `RESEND_API_KEY` أو `EMAIL_FROM`:
  - لن يتوقف التطبيق
  - سيتم تسجيل تحذير في السجلات فقط

## ملاحظة Prisma Migrations

إذا كانت قاعدة البيانات موجودة مسبقًا بدون تاريخ migrations، استخدمي:

```bash
npx prisma db push
```

ثم طبقي ملف الترحيل الخاص بهذه المرحلة يدويًا أو عبر SQL editor:

`prisma/migrations/20260308_phase1_auth_email_hardening/migration.sql`

## إعداد قاعدة البيانات (Supabase)

١. أنشئي مشروعًا على [Supabase](https://supabase.com)
٢. انسخي رابط `DATABASE_URL` من Settings → Database
٣. ضعيه في ملف `.env`
٤. شغّلي `npx prisma db push`

## النشر (Deployment)

يمكن نشر المشروع على [Vercel](https://vercel.com):

```bash
npm run build
```

ثم اربطي المشروع بـ Vercel واضيفي المتغيرات البيئية.

---

© ٢٠٢٥ مقرأة مُزن الخير — جميع الحقوق محفوظة
