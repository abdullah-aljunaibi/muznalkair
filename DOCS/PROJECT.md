# مقرأة مُزن الخير — Project Documentation

> **Last Updated:** 2026-03-06  
> **Version:** 0.1.0 (Development)  
> **Status:** In active development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Database Schema](#4-database-schema)
5. [Pages & Routes](#5-pages--routes)
6. [API Reference](#6-api-reference)
7. [Components](#7-components)
8. [Authentication](#8-authentication)
9. [Payments](#9-payments)
10. [Environment Variables](#10-environment-variables)
11. [Setup & Deployment](#11-setup--deployment)
12. [Design System](#12-design-system)
13. [Changelog](#13-changelog)
14. [Known Issues & TODOs](#14-known-issues--todos)

---

## 1. Project Overview

**مقرأة مُزن الخير** (Muzn Al-Khair Quran School) is a full-stack Arabic LMS (Learning Management System) web platform for an Omani women's volunteer Quran education organization.

### What It Does
- Presents the organization's programs and courses to the public
- Allows students to register, purchase courses, and access video lessons
- Tracks student progress per lesson and per course
- Accepts payments via Stripe (card) and WhatsApp (bank transfer)
- Provides a DeepLearning.AI-style course player experience

### Client
- **Organization:** مقرأة مُزن الخير (mozn_alkair)
- **Type:** Omani women's volunteer Quran school
- **Instagram:** [@mozn_alkair](https://instagram.com/mozn_alkair)
- **YouTube:** [@mozn_alkhair](https://youtube.com/@mozn_alkhair)
- **WhatsApp:** +96897021040

### Business Built By
- **Agency:** BxB (bxb-om.com)
- **PM:** Abdullah Al Junaibi

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth.js v5 (Credentials Provider) |
| ORM | Prisma 6 |
| Database | PostgreSQL via Supabase |
| Payments | Stripe (Checkout Sessions) |
| Fonts | Google Fonts — Amiri + Tajawal |
| Deployment | Vercel (planned) |
| Runtime | Node.js v22 |

---

## 3. Architecture

```
muznalkair/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Landing page
│   │   ├── layout.tsx                        # Root layout (RTL, fonts)
│   │   ├── login/page.tsx                    # Login
│   │   ├── register/page.tsx                 # Registration
│   │   ├── checkout/page.tsx                 # Course purchase page
│   │   ├── dashboard/
│   │   │   ├── page.tsx                      # Dashboard home (snapshot)
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx                  # All purchased courses
│   │   │   │   └── [courseId]/
│   │   │   │       ├── page.tsx              # Course overview
│   │   │   │       └── lesson/
│   │   │   │           └── [lessonId]/
│   │   │   │               └── page.tsx      # Video player
│   │   │   └── profile/page.tsx              # Profile settings
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │       │   └── register/route.ts         # User registration
│   │       ├── checkout/route.ts             # Stripe checkout session
│   │       ├── webhook/stripe/route.ts       # Stripe webhook
│   │       ├── courses/
│   │       │   └── [courseId]/
│   │       │       ├── route.ts              # Course + progress data
│   │       │       └── lessons/route.ts      # Course lessons list
│   │       └── user/
│   │           ├── progress/route.ts         # Course progress
│   │           ├── lesson-progress/route.ts  # Lesson-level progress
│   │           └── profile/route.ts          # Profile update
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── IslamicPattern.tsx
│   │   ├── MuznLogo.tsx
│   │   ├── Providers.tsx
│   │   └── LessonPlayer.tsx                  # Video player component
│   └── lib/
│       ├── auth.ts                           # NextAuth config
│       └── prisma.ts                         # Prisma client singleton
├── prisma/
│   ├── schema.prisma                         # Database schema
│   └── seed.ts                               # Seed data (placeholder courses)
├── DOCS/
│   └── PROJECT.md                            # This file
├── .env                                      # Environment variables (git-ignored)
├── .env.example                              # Template for env vars
└── README.md                                 # Arabic setup guide
```

---

## 4. Database Schema

### Models Overview

```
User ──── Purchase ──── Course ──── Lesson ──── Document
  │                       │            │
  └── Progress ───────────┘            └── LessonProgress ──── User
  └── Review
  └── LessonProgress
```

### User
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| name | String | Full name |
| email | String | Unique |
| password | String | bcrypt hashed |
| role | Role enum | STUDENT \| ADMIN |
| createdAt | DateTime | Auto |

### Course
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| title | String | Arabic course name |
| description | String | Full description |
| price | Float | In OMR |
| currency | String | Default: "OMR" |
| thumbnail | String? | Image URL |
| totalLessons | Int | Count |
| isActive | Boolean | Show/hide |

### Lesson
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| courseId | String | FK → Course |
| title | String | Arabic lesson title |
| videoUrl | String? | YouTube embed URL |
| duration | Int | Minutes |
| order | Int | Sort order |
| isPreview | Boolean | Free preview lesson |

### Document
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| lessonId | String | FK → Lesson |
| title | String | Display name |
| fileUrl | String | Direct file URL |
| fileType | String | "pdf", "docx", etc. |

### Purchase
| Field | Type | Notes |
|---|---|---|
| status | PurchaseStatus | PENDING \| COMPLETED \| FAILED \| REFUNDED |
| paymentMethod | PaymentMethod | STRIPE \| WHATSAPP_BANK_TRANSFER |
| stripeSessionId | String? | Stripe session ID |
| amount | Float | Amount charged |

### Progress (Course-level)
| Field | Type | Notes |
|---|---|---|
| completedLessons | Int | Count of done lessons |
| totalMinutesWatched | Int | Cumulative watch time |
| lastAccessedAt | DateTime | For "continue" button |

### LessonProgress
| Field | Type | Notes |
|---|---|---|
| completed | Boolean | Marked done |
| watchedSecs | Int | Seconds watched |
| completedAt | DateTime? | When marked done |

---

## 5. Pages & Routes

### Public Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing page | Hero, stats, about, programs, courses, reviews, pricing |
| `/login` | Login | Email + password auth |
| `/register` | Register | New account creation |
| `/checkout` | Checkout | Course selection + payment options |

### Protected Routes (require login)

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard home | Snapshot: in-progress, completed, minutes |
| `/dashboard/courses` | My Courses | Grid of purchased courses |
| `/dashboard/courses/[courseId]` | Course overview | Lessons list + start button |
| `/dashboard/courses/[courseId]/lesson/[lessonId]` | Video player | Watch, mark complete, download docs |
| `/dashboard/profile` | Profile | Update name, email, password |

---

## 6. API Reference

### Auth

#### `POST /api/auth/register`
Register a new user.
```json
// Request
{ "name": "string", "email": "string", "password": "string" }

// Response 201
{ "message": "تم إنشاء الحساب بنجاح" }

// Response 400
{ "error": "البريد الإلكتروني مستخدم بالفعل" }
```

#### `POST /api/auth/[...nextauth]`
NextAuth handler. Use `/api/auth/signin` with credentials.

---

### Courses

#### `GET /api/courses/[courseId]`
Get course with lessons and user progress. Requires auth + purchase.
```json
// Response 200
{
  "course": {
    "id": "...",
    "title": "...",
    "lessons": [
      {
        "id": "...",
        "title": "...",
        "videoUrl": "...",
        "duration": 15,
        "order": 1,
        "documents": [...],
        "progress": [{ "completed": true, "watchedSecs": 900 }]
      }
    ]
  },
  "progress": {
    "completedLessons": 3,
    "totalLessons": 6,
    "progressPercentage": 50
  }
}
```

#### `GET /api/courses/[courseId]/lessons`
Get lesson list for sidebar. Requires auth + purchase.

---

### Payments

#### `POST /api/checkout`
Create Stripe checkout session.
```json
// Request
{ "courseId": "string" }

// Response 200
{ "url": "https://checkout.stripe.com/..." }

// Response 403
{ "error": "Course already purchased" }
```

#### `POST /api/webhook/stripe`
Stripe webhook. Called by Stripe on payment completion.
- Event: `checkout.session.completed`
- Action: Creates `Purchase` record with `status: COMPLETED`
- Must configure `STRIPE_WEBHOOK_SECRET` in env

---

### User

#### `GET /api/user/progress`
Get all course progress for logged-in user.

#### `POST /api/user/progress`
Update course-level progress.
```json
// Request
{ "courseId": "string", "completedLessons": 3 }
```

#### `POST /api/user/lesson-progress`
Mark a lesson complete or update watch time.
```json
// Request
{ "lessonId": "string", "completed": true, "watchedSecs": 900 }

// Response 200
{ "lessonProgress": {...}, "courseProgress": { "progressPercentage": 50 } }
```

#### `PUT /api/user/profile`
Update name, email, or password.
```json
// Request
{ "name": "string", "email": "string", "currentPassword": "string", "newPassword": "string" }
```

---

## 7. Components

### `<Navbar />`
Sticky top navigation bar.
- RTL: Logo right, CTA buttons left
- Mobile: hamburger menu
- Shows login/register when logged out; dashboard link when logged in

### `<Footer />`
Dark teal footer with social links (Instagram, YouTube, WhatsApp).

### `<DashboardSidebar />`
Right-side sidebar for dashboard pages.
- Teal background, white text
- Links: Dashboard, My Courses, Profile, Logout
- Active state highlighting

### `<MuznLogo />`
SVG component of the brand logo.
- Props: `size` (default 48), `className`
- Colors: teal #1B6B7A + gold #D4AF37

### `<IslamicPattern />`
Subtle repeating star-polygon SVG background.
- Props: `className`
- Opacity: 0.08 by default

### `<LessonPlayer />`
Full video player page component.
- YouTube iframe embed (16:9)
- Lesson sidebar with progress
- Tabs: description + documents
- Mark as complete button
- Prev/next navigation

### `<Providers />`
SessionProvider wrapper for NextAuth.

---

## 8. Authentication

Uses **NextAuth.js v5** with Credentials Provider.

### Flow
1. User submits email + password at `/login`
2. NextAuth calls credentials `authorize()` function
3. Passwords compared with `bcryptjs.compare()`
4. On success: JWT session created, user redirected to `/dashboard`
5. On failure: Error message shown

### Session Object
```typescript
session.user = {
  id: string,
  name: string,
  email: string,
  role: "STUDENT" | "ADMIN"
}
```

### Protecting Routes
All `/dashboard/*` pages use:
```typescript
const session = await auth();
if (!session) redirect("/login");
```

---

## 9. Payments

### Stripe (Card Payments)
1. User clicks "ادفعي الآن" on checkout page
2. Frontend POSTs `{ courseId }` to `/api/checkout`
3. Server creates Stripe Checkout Session
4. User redirected to Stripe hosted page
5. On success → redirected to `/dashboard?payment=success`
6. Stripe fires `checkout.session.completed` webhook
7. `/api/webhook/stripe` receives event, creates `Purchase` record

**Test Cards:**
- Success: `4242 4242 4242 4242` (any future date, any CVC)
- Failure: `4000 0000 0000 0002`

### WhatsApp (Bank Transfer)
1. User clicks WhatsApp button
2. Opens `https://wa.me/96897021040`
3. Manual process: client confirms payment, then admin manually creates `Purchase` record

> **TODO:** Admin panel to manually approve WhatsApp payments

---

## 10. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Supabase pooler connection (port 6543) |
| `DIRECT_URL` | ✅ | Supabase session pooler (port 5432) for migrations |
| `NEXTAUTH_SECRET` | ✅ | Random 32-char secret |
| `NEXTAUTH_URL` | ✅ | App URL (e.g. https://muznalkair.com) |
| `STRIPE_SECRET_KEY` | ✅ | `sk_test_...` or `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | `pk_test_...` or `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | ✅ (prod) | `whsec_...` from Stripe dashboard |
| `WHATSAPP_NUMBER` | ✅ | Without `+`, e.g. `96897021040` |

---

## 11. Setup & Deployment

### Local Development
```bash
# 1. Clone and install
cd /home/abdullah/.openclaw/workspace/muznalkair
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with real values

# 3. Push database schema
npx prisma db push

# 4. (Optional) Seed placeholder data
npx ts-node prisma/seed.ts

# 5. Start dev server
npm run dev
# → http://localhost:3000
```

### Production Deployment (Vercel)
```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/BxB-agency/muznalkair.git
git push -u origin main

# 2. Connect to Vercel
# → vercel.com → New Project → Import from GitHub
# → Add all env vars from .env
# → Deploy

# 3. Set NEXTAUTH_URL to production domain
# 4. Configure Stripe webhook to point at https://yourdomain.com/api/webhook/stripe
# 5. Get STRIPE_WEBHOOK_SECRET from Stripe dashboard and update Vercel env
```

### Database Commands
```bash
# Push schema changes (development)
npx prisma db push

# Create migration (production)
npx prisma migrate deploy

# Open Prisma Studio (DB browser)
npx prisma studio

# Regenerate Prisma client after schema change
npx prisma generate
```

---

## 12. Design System

### Colors
| Name | Hex | Usage |
|---|---|---|
| Primary Teal | `#1B6B7A` | Buttons, headings, sidebar bg |
| Medium Teal | `#3A8D9E` | Hover states, gradients |
| Light Teal | `#A8D5D8` | Progress bars, light accents |
| Gold | `#D4AF37` | Step numbers, accents, CTA |
| Dark Gold | `#9E7E2C` | Gold hover, gradient end |
| Cream BG | `#F5F0E8` | Section backgrounds |
| Light Blue BG | `#D6EAF0` | Hero gradient |
| Text Dark | `#2C2C2C` | Primary text |
| Text Medium | `#4A5568` | Body text |
| Text Light | `#6B7280` | Captions, descriptions |
| Border | `#E5E7EB` | Card borders, dividers |
| Magenta | `#D4267A` | Urgency text, emotional accents |

### Typography
| Role | Font | Weight |
|---|---|---|
| Headings (h1–h3) | Amiri | 700 (Bold) |
| Body text | Tajawal | 400 (Regular) |
| UI buttons/labels | Tajawal | 500 (Medium) |
| Quotes | Amiri | 400 |

### Spacing
- Section padding: `80px` top/bottom
- Card border-radius: `16px`
- Button border-radius: `12px`
- Pill/tag border-radius: `9999px`
- Max content width: `1200px`

### Layout
- Direction: `RTL` (`dir="rtl"`)
- Language: Arabic (`lang="ar"`)
- Mobile-first responsive
- Dashboard sidebar: right side (RTL)

### Decorative Elements
- Islamic star-polygon pattern: subtle overlay, opacity 8%
- Cream-to-teal gradients in hero sections
- Gold diagonal ribbon (for announcements)
- Botanical leaf sprigs (watercolor style)

---

## 13. Changelog

### v0.1.0 — 2026-03-06
**Initial build by IbnKhaldun (BxB Agent)**

#### Added
- Full landing page: Hero, Stats Bar, About, Programs (3 tracks), Courses (6 placeholders), How It Works, Achievements, Reviews, Pricing/Join, Footer
- Authentication: Register, Login (NextAuth v5 + bcryptjs)
- Dashboard home: DeepLearning.AI-style snapshot (in-progress, completed, minutes watched)
- Course overview page with lesson checklist sidebar
- Video player page: YouTube embed, lesson sidebar, mark as complete, description + documents tabs, prev/next navigation
- Stripe checkout flow (session creation + webhook handler)
- WhatsApp payment option
- User profile update (name, email, password)
- Prisma schema: User, Course, Lesson, Document, Purchase, Progress, LessonProgress, Review
- Database: Supabase PostgreSQL (connected + pushed)
- Seed script with 3 placeholder courses and 15 lessons
- Design system: Amiri + Tajawal fonts, teal/gold palette, RTL throughout
- Islamic geometric SVG background pattern
- `<MuznLogo />` SVG component (teal + gold knotwork)
- `.env.example` + Arabic `README.md`

#### Environment
- Database: Supabase (aws-1-ap-northeast-1)
- Stripe: Test keys configured
- WhatsApp: +96897021040
- Server: DigitalOcean VPS (bxb-titan, 159.223.92.255)

---

## 14. Known Issues & TODOs

### High Priority
- [ ] **Admin panel** — Manually approve WhatsApp bank transfer payments
- [ ] **STRIPE_WEBHOOK_SECRET** — Must be set before production launch
- [ ] **NEXTAUTH_URL** — Must be updated to production domain before deploy
- [ ] **Real course content** — Replace placeholder courses, lessons, prices with client data

### Medium Priority
- [ ] **Email notifications** — Send confirmation email on successful purchase
- [ ] **Course thumbnails** — Upload real course images
- [ ] **Video hosting** — Decide: YouTube vs. self-hosted vs. Vimeo/Mux
- [ ] **Arabic number formatting** — Ensure all numbers display in Arabic numerals
- [ ] **Certificate generation** — Generate PDF certificate on course completion

### Low Priority
- [ ] **Search** — Course search on landing page
- [ ] **Course ratings** — Allow students to submit reviews after completion
- [ ] **Dark mode** — Optional
- [ ] **Mobile app** — Future consideration

### Known Bugs
- Stripe `locale: "ar"` not supported in SDK v20 — using `"auto"` instead (auto-detects browser language)
- WhatsApp payment flow is manual (no automated confirmation)
