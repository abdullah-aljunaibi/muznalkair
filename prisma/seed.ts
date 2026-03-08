import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create 3 courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: "course_tajweed_001" },
      update: {},
      create: {
        id: "course_tajweed_001",
        title: "أحكام التجويد للمبتدئين",
        description:
          "دورة شاملة في أحكام التجويد من الصفر حتى الاحتراف، تشمل مخارج الحروف وصفاتها وأحكام النون الساكنة والتنوين والمد والقصر",
        price: 25.0,
        currency: "OMR",
        totalLessons: 5,
        isActive: true,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_hifz_001" },
      update: {},
      create: {
        id: "course_hifz_001",
        title: "حفظ جزء عم مع التفسير",
        description:
          "برنامج متكامل لحفظ الجزء الثلاثين من القرآن الكريم مع شرح معاني الآيات الكريمة وأسباب النزول",
        price: 30.0,
        currency: "OMR",
        totalLessons: 6,
        isActive: true,
      },
    }),
    prisma.course.upsert({
      where: { id: "course_quran_reading_001" },
      update: {},
      create: {
        id: "course_quran_reading_001",
        title: "القراءة الصحيحة للقرآن الكريم",
        description:
          "تعلّمي قراءة القرآن الكريم بطريقة صحيحة من خلال منهج القاعدة النورانية مع التطبيق العملي على آيات من الذكر الحكيم",
        price: 20.0,
        currency: "OMR",
        totalLessons: 4,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${courses.length} courses`);

  // Course 1 Lessons — التجويد
  const tajweedLessons = await Promise.all([
    prisma.lesson.upsert({
      where: { id: "lesson_taj_01" },
      update: {},
      create: {
        id: "lesson_taj_01",
        courseId: "course_tajweed_001",
        title: "مقدمة في علم التجويد",
        description:
          "تعرّفي على علم التجويد وأهميته وتاريخه، ولماذا يجب على كل مسلم تعلّمه. سنستعرض في هذا الدرس تعريف التجويد وحكمه ومراتبه.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 15,
        order: 1,
        isPreview: true,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_taj_02" },
      update: {},
      create: {
        id: "lesson_taj_02",
        courseId: "course_tajweed_001",
        title: "مخارج الحروف",
        description:
          "دراسة تفصيلية لمخارج الحروف العربية الثمانية والعشرين مع التطبيق العملي على كل حرف. سنتعلم كيفية إخراج كل حرف من مخرجه الصحيح.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 25,
        order: 2,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_taj_03" },
      update: {},
      create: {
        id: "lesson_taj_03",
        courseId: "course_tajweed_001",
        title: "أحكام النون الساكنة والتنوين",
        description:
          "شرح مفصّل لأحكام النون الساكنة والتنوين الأربعة: الإظهار، الإدغام، الإقلاب، والإخفاء مع أمثلة تطبيقية من القرآن الكريم.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 30,
        order: 3,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_taj_04" },
      update: {},
      create: {
        id: "lesson_taj_04",
        courseId: "course_tajweed_001",
        title: "أحكام المد والقصر",
        description:
          "تعلّمي أنواع المد المختلفة: المد الطبيعي، المد المتصل، المد المنفصل، وغيرها مع بيان مقدار كل مد وأمثلة من القرآن.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 28,
        order: 4,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_taj_05" },
      update: {},
      create: {
        id: "lesson_taj_05",
        courseId: "course_tajweed_001",
        title: "التطبيق العملي والاختبار",
        description:
          "تطبيق شامل لجميع ما تعلّمناه على سورة الفاتحة وقصار السور مع الاختبار التقييمي لقياس مستوى التقدم.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 35,
        order: 5,
        isPreview: false,
      },
    }),
  ]);

  // Documents for tajweed lessons
  await Promise.all([
    prisma.document.upsert({
      where: { id: "doc_taj_01_a" },
      update: {},
      create: {
        id: "doc_taj_01_a",
        lessonId: "lesson_taj_01",
        title: "ملخص مقدمة التجويد",
        fileUrl: "/docs/tajweed-intro.pdf",
        fileType: "pdf",
      },
    }),
    prisma.document.upsert({
      where: { id: "doc_taj_02_a" },
      update: {},
      create: {
        id: "doc_taj_02_a",
        lessonId: "lesson_taj_02",
        title: "جدول مخارج الحروف",
        fileUrl: "/docs/makhraj-table.pdf",
        fileType: "pdf",
      },
    }),
    prisma.document.upsert({
      where: { id: "doc_taj_02_b" },
      update: {},
      create: {
        id: "doc_taj_02_b",
        lessonId: "lesson_taj_02",
        title: "تمارين على المخارج",
        fileUrl: "/docs/makhraj-exercises.pdf",
        fileType: "pdf",
      },
    }),
    prisma.document.upsert({
      where: { id: "doc_taj_03_a" },
      update: {},
      create: {
        id: "doc_taj_03_a",
        lessonId: "lesson_taj_03",
        title: "ملخص أحكام النون الساكنة",
        fileUrl: "/docs/noon-rules.pdf",
        fileType: "pdf",
      },
    }),
    prisma.document.upsert({
      where: { id: "doc_taj_04_a" },
      update: {},
      create: {
        id: "doc_taj_04_a",
        lessonId: "lesson_taj_04",
        title: "جدول أنواع المد",
        fileUrl: "/docs/madd-types.pdf",
        fileType: "pdf",
      },
    }),
  ]);

  // Course 2 Lessons — جزء عم
  const hifzLessons = await Promise.all([
    prisma.lesson.upsert({
      where: { id: "lesson_hifz_01" },
      update: {},
      create: {
        id: "lesson_hifz_01",
        courseId: "course_hifz_001",
        title: "مقدمة في حفظ القرآن",
        description:
          "أسرار ونصائح للحفظ السريع والثبات، ومنهجية الحفظ اليومي المجربة. كيف تنظّمين وقتك وتُهيّئين بيئة الحفظ المثالية.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 20,
        order: 1,
        isPreview: true,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_hifz_02" },
      update: {},
      create: {
        id: "lesson_hifz_02",
        courseId: "course_hifz_001",
        title: "سورة النبأ والنازعات",
        description:
          "حفظ سورة النبأ وسورة النازعات مع شرح معاني الآيات الكريمة وأسباب التسمية والموضوعات الرئيسية.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 40,
        order: 2,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_hifz_03" },
      update: {},
      create: {
        id: "lesson_hifz_03",
        courseId: "course_hifz_001",
        title: "سورة عبس والتكوير",
        description:
          "حفظ سورة عبس وسورة التكوير مع التفسير الميسّر وربط الآيات بالواقع المعاصر.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 35,
        order: 3,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_hifz_04" },
      update: {},
      create: {
        id: "lesson_hifz_04",
        courseId: "course_hifz_001",
        title: "سور الانفطار حتى الأعلى",
        description:
          "مجموعة السور القصيرة من الانفطار حتى الأعلى مع التدبر والتفسير.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 45,
        order: 4,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_hifz_05" },
      update: {},
      create: {
        id: "lesson_hifz_05",
        courseId: "course_hifz_001",
        title: "سور الغاشية حتى القدر",
        description:
          "حفظ سور الغاشية والفجر والبلد والشمس والليل والضحى والشرح والتين والعلق والقدر.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 50,
        order: 5,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_hifz_06" },
      update: {},
      create: {
        id: "lesson_hifz_06",
        courseId: "course_hifz_001",
        title: "سور البيّنة حتى الناس ومراجعة شاملة",
        description:
          "إتمام جزء عم بحفظ السور الأخيرة ومراجعة جميع ما حُفظ مع اختبار نهائي.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 60,
        order: 6,
        isPreview: false,
      },
    }),
  ]);

  // Documents for hifz lessons
  await Promise.all([
    prisma.document.upsert({
      where: { id: "doc_hifz_01_a" },
      update: {},
      create: {
        id: "doc_hifz_01_a",
        lessonId: "lesson_hifz_01",
        title: "خطة الحفظ الأسبوعية",
        fileUrl: "/docs/hifz-plan.pdf",
        fileType: "pdf",
      },
    }),
    prisma.document.upsert({
      where: { id: "doc_hifz_02_a" },
      update: {},
      create: {
        id: "doc_hifz_02_a",
        lessonId: "lesson_hifz_02",
        title: "تفسير سورة النبأ",
        fileUrl: "/docs/tafseer-naba.pdf",
        fileType: "pdf",
      },
    }),
    prisma.document.upsert({
      where: { id: "doc_hifz_04_a" },
      update: {},
      create: {
        id: "doc_hifz_04_a",
        lessonId: "lesson_hifz_04",
        title: "ورقة مراجعة السور",
        fileUrl: "/docs/review-sheet.pdf",
        fileType: "pdf",
      },
    }),
  ]);

  // Course 3 Lessons — القراءة الصحيحة
  const qiraahLessons = await Promise.all([
    prisma.lesson.upsert({
      where: { id: "lesson_qir_01" },
      update: {},
      create: {
        id: "lesson_qir_01",
        courseId: "course_quran_reading_001",
        title: "القاعدة النورانية - الحروف الهجائية",
        description:
          "تعلّمي نطق الحروف الهجائية بطريقة القاعدة النورانية الصحيحة من مخارجها الأصيلة.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 20,
        order: 1,
        isPreview: true,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_qir_02" },
      update: {},
      create: {
        id: "lesson_qir_02",
        courseId: "course_quran_reading_001",
        title: "الحركات والتنوين",
        description:
          "دراسة الفتحة والضمة والكسرة والتنوين بأنواعه مع التدريب على قراءة الكلمات.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 25,
        order: 2,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_qir_03" },
      update: {},
      create: {
        id: "lesson_qir_03",
        courseId: "course_quran_reading_001",
        title: "المد والسكون والشدة",
        description:
          "فهم علامات المد وحروفه، والسكون والشدة وتأثيرها على قراءة الكلمة.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 22,
        order: 3,
        isPreview: false,
      },
    }),
    prisma.lesson.upsert({
      where: { id: "lesson_qir_04" },
      update: {},
      create: {
        id: "lesson_qir_04",
        courseId: "course_quran_reading_001",
        title: "قراءة تطبيقية من المصحف",
        description:
          "تطبيق عملي شامل على قراءة صفحات من المصحف الشريف بتطبيق جميع قواعد القراءة الصحيحة.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: 30,
        order: 4,
        isPreview: false,
      },
    }),
  ]);

  // Documents for qiraah lessons
  await Promise.all([
    prisma.document.upsert({
      where: { id: "doc_qir_01_a" },
      update: {},
      create: {
        id: "doc_qir_01_a",
        lessonId: "lesson_qir_01",
        title: "جدول الحروف الهجائية",
        fileUrl: "/docs/arabic-letters.pdf",
        fileType: "pdf",
      },
    }),
    prisma.document.upsert({
      where: { id: "doc_qir_01_b" },
      update: {},
      create: {
        id: "doc_qir_01_b",
        lessonId: "lesson_qir_01",
        title: "أوراق التدريب - الدرس الأول",
        fileUrl: "/docs/practice-01.pdf",
        fileType: "pdf",
      },
    }),
    prisma.document.upsert({
      where: { id: "doc_qir_03_a" },
      update: {},
      create: {
        id: "doc_qir_03_a",
        lessonId: "lesson_qir_03",
        title: "ورقة المد والسكون",
        fileUrl: "/docs/madd-sukoon.pdf",
        fileType: "pdf",
      },
    }),
  ]);

  const coupons = await Promise.all([
    prisma.coupon.upsert({
      where: { code: "RAMADAN10" },
      update: {},
      create: {
        code: "RAMADAN10",
        description: "خصم موسمي لدورات رمضان",
        discountType: "PERCENTAGE",
        discountValue: 10,
        status: "ACTIVE",
        expiresAt: new Date("2026-04-01T00:00:00.000Z"),
        usageLimit: 100,
        appliesTo: "جميع الدورات المنشورة",
      },
    }),
    prisma.coupon.upsert({
      where: { code: "WELCOME5" },
      update: {},
      create: {
        code: "WELCOME5",
        description: "خصم ترحيبي للطالبات الجديدات",
        discountType: "FIXED",
        discountValue: 5,
        status: "ACTIVE",
        expiresAt: new Date("2026-06-01T00:00:00.000Z"),
        usageLimit: 50,
        appliesTo: "جميع الدورات",
      },
    }),
  ]);

  console.log("✅ Seed complete!");
  console.log(`  - ${courses.length} courses`);
  console.log(`  - ${tajweedLessons.length + hifzLessons.length + qiraahLessons.length} lessons`);
  console.log(`  - ${coupons.length} coupons`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
