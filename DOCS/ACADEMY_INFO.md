# مقرأة مُزن الخير — Academy Reference Document
> Source: PDF presentation provided by Abdullah (Feb 7, 2026, created in Canva)
> Extracted: Mar 20, 2026

## Identity

| Field | Arabic | English |
|-------|--------|---------|
| Full Name | مقرأة مُزن الخير الإلكترونية لتعليم القرآن الكريم | Muzn Al-Khair Electronic Academy for Teaching the Holy Quran |
| Short Name | مقرأة مُزن الخير | Muzn Al-Khair Academy |
| Founder | الأستاذة آمنة الجنيبية | Ustadha Amena Al-Junaibiya |
| Type | Online (إلكترونية) | Online Quran Teaching Academy |
| Target Audience | Women & children | Women & children |
| Domain | muznalkair.com | |

---

## Three Divisions

### 1. المقرأة العامة (General Academy)

**Programs (7):**
1. حلقات تصحيح التلاوة واستخراج الأحكام — Recitation Correction & Tajweed Rules Extraction
2. دروس تجويد متنوعة — Various Tajweed Lessons
3. دروس في أحكام الفقه — Islamic Jurisprudence (Fiqh) Lessons
4. دروس في المنظومات — Poetic Texts (Mandhumas) Lessons
5. دورة كتاب المنير — Al-Munir Book Course
6. حلقات لغير الناطقات بالعربية — Circles for Non-Arabic Speakers
7. حلقات للأطفال — Children's Circles

**Statistics (2025):**
- Teachers: 60

**Statistics (2026):**
- Teachers: 32
- Supervisors: 71
- Community members: 15,000 women
- Daily circle participants: 700 women

---

### 2. مقرأة الأمهات (Mothers' Academy)

**Programs (5):**
1. حلقات تصحيح التلاوة — Recitation Correction Circles
2. دروس في التجويد — Tajweed Lessons
3. القاعدة النورانية — Al-Qa'ida Al-Nooraniyya
4. تلقين جزئي عم وتبارك — Dictation of Juz' Amma & Juz' Tabaraka
5. دروس في التدبر — Quranic Contemplation Lessons

**Statistics (2025):**
- Teachers: 73
- Supervisors: 62
- Community members: 1,950 women
- Daily circle participants: 500 women
- Nooraniyya enrolled: 200 women
- Dictation circles enrolled: 400 women

**Statistics (2026):**
- Teachers: 71
- Supervisors: 69
- Community members: 1,100 women
- Daily circle participants: 500 women
- Nooraniyya enrolled: 120 women
- Dictation circles enrolled: 700 women

---

### 3. مقرأة الحفظ (Memorization Academy)

**Programs (3):**
1. برنامج الأترجة — Al-Utruja Program
   - Three tracks: مسار الإذخر (Idhkhar) — مسار السنا (Sana) — مسار قنوان (Qinwan)
2. البرامج الرمضانية — Ramadan Programs
3. برامج السرد القرآني (رواء الآي) — Quran Narration Programs (Rawa' Al-Ay)

**Statistics (2024):**
- Al-Utruja: 990 memorizers
- Ramadan Program: 90 memorizers
- Quran Narration (Rawa' Al-Ay): 348 memorizers

**Statistics (2025):**
- Al-Utruja: 1,500 memorizers
- Ramadan Program: 200 memorizers
- Quran Narration (Rawa' Al-Ay): 420 memorizers
- Ayat Bayyinat Narration Program: 620 memorizers

**Statistics (2026):**
- Al-Utruja: 1,700 memorizers
- Quran Narration (Rawa' Al-Ay): 460 memorizers

---

## Overall Scale (combined estimates from PDF)

| Metric | Value |
|--------|-------|
| Total community members (General) | ~15,000 women |
| Total community members (Mothers) | ~1,100 women |
| Total daily participants | ~1,200+ women/day |
| Total teachers (General + Mothers) | ~103 teachers |
| Total supervisors (General + Mothers) | ~140 supervisors |
| Memorization program participants (2026) | ~2,160+ |

---

## Resolved Information
- [x] **Pricing** → All programs are FREE (volunteer/تطوعي)
- [x] **Contact** → WhatsApp/Phone: +968 9702 1040
- [x] **Social media** → Instagram: @mozn_alkair (https://www.instagram.com/mozn_alkair/)
- [x] **Branding** → Logo saved at `public/logo-muzn.jpg` (640×640 JPEG). Colors: Teal #1A6B9A, Gold #C9A227, White #FFFFFF, Dark #2C2C2C

## Future TODOs

- [ ] **Zoom link** — Get the academy's Zoom link (5000+ capacity) and wire into schedule modal + join CTA (one-line change in `src/app/page.tsx` → `ZOOM_LINK` constant)
- [ ] **Real schedule times** — Replace placeholder days/times in the schedule modal with actual program schedules from the academy
- [ ] **About the founder** — Bio/qualifications for Ustadha Amena Al-Junaibiya
- [ ] **Registration process** details — How do students actually sign up for circles?
- [ ] **Testimonials** or student reviews
- [ ] **Certificate** information (if any)
- [ ] **Replace MuznLogo SVG** — Wire the real logo image (`public/logo-muzn.jpg`) into the MuznLogo component (currently uses a placeholder SVG)
- [ ] **Replace hero stock photos** — Get academy-specific images for the hero slides
- [ ] **DKIM domain verification** — Complete Resend email domain verification
- [ ] **Video hosting solution** — Currently placeholder/iframe
- [ ] **Phase 5 — Auth/security review** — Admin route protection audit, CSRF/mutation safety, password reset abuse checks, brute-force tightening
- [ ] **Richer automated tests** beyond smoke
- [ ] **Conversion tracking / lead capture**
- [ ] **Landing page optimization**
