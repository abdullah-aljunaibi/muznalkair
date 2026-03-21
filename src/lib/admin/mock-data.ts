export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentMethodType = "THAWANI" | "STRIPE" | "WHATSAPP_BANK_TRANSFER";
export type CourseVisibility = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type StudentAccessStatus = "ACTIVE" | "PENDING_PAYMENT" | "SUSPENDED";
export type CouponStatus = "ACTIVE" | "SCHEDULED" | "EXPIRED" | "DISABLED";
export type UploadStatus = "READY" | "PROCESSING" | "FAILED" | "PENDING_STORAGE";

export interface CouponRecord {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  status: CouponStatus;
  expiresAt: string;
  usageCount: number;
  usageLimit: number;
  appliesTo: string;
  createdAt: string;
}

export interface UploadRecord {
  id: string;
  title: string;
  courseName: string;
  lessonName: string;
  type: "VIDEO" | "PDF" | "AUDIO" | "WORKSHEET";
  status: UploadStatus;
  updatedAt: string;
  uploadedBy: string;
  notes?: string;
}

export interface ActivityRecord {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "order" | "student" | "course" | "payment" | "upload" | "coupon";
}

export const couponsSeed: CouponRecord[] = [
  {
    id: "coupon_ramadan_10",
    code: "RAMADAN10",
    description: "خصم موسمي لدورات رمضان",
    discountType: "PERCENTAGE",
    discountValue: 10,
    status: "ACTIVE",
    expiresAt: "2026-04-01T00:00:00.000Z",
    usageCount: 18,
    usageLimit: 100,
    appliesTo: "جميع الدورات المنشورة",
    createdAt: "2026-02-20T09:00:00.000Z",
  },
  {
    id: "coupon_new_student_5",
    code: "NEW5",
    description: "خصم ترحيبي للطالبات الجديدات",
    discountType: "FIXED",
    discountValue: 5,
    status: "ACTIVE",
    expiresAt: "2026-06-01T00:00:00.000Z",
    usageCount: 7,
    usageLimit: 50,
    appliesTo: "دورات المستوى التأسيسي",
    createdAt: "2026-02-12T09:00:00.000Z",
  },
  {
    id: "coupon_hifz_launch",
    code: "HIFZ15",
    description: "عرض إطلاق مسار الحفظ",
    discountType: "PERCENTAGE",
    discountValue: 15,
    status: "SCHEDULED",
    expiresAt: "2026-05-15T00:00:00.000Z",
    usageCount: 0,
    usageLimit: 30,
    appliesTo: "برامج الحفظ فقط",
    createdAt: "2026-03-01T09:00:00.000Z",
  },
];

export const uploadsSeed: UploadRecord[] = [
  {
    id: "upload_001",
    title: "الدرس الأول — مخارج الحروف",
    courseName: "أحكام التجويد للمبتدئين",
    lessonName: "مخارج الحروف",
    type: "VIDEO",
    status: "PENDING_STORAGE",
    updatedAt: "2026-03-07T12:10:00.000Z",
    uploadedBy: "مشرفة المحتوى",
    notes: "بانتظار ربط التخزين السحابي النهائي.",
  },
  {
    id: "upload_002",
    title: "ملف التمارين الأسبوعية",
    courseName: "حفظ جزء عم مع التفسير",
    lessonName: "خطة الحفظ الأسبوعية",
    type: "PDF",
    status: "READY",
    updatedAt: "2026-03-06T15:40:00.000Z",
    uploadedBy: "مشرفة المحتوى",
  },
  {
    id: "upload_003",
    title: "تسجيل مراجعة صوتي",
    courseName: "القراءة الصحيحة للقرآن الكريم",
    lessonName: "قراءة تطبيقية من المصحف",
    type: "AUDIO",
    status: "PROCESSING",
    updatedAt: "2026-03-08T02:10:00.000Z",
    uploadedBy: "قسم الأكاديمية",
    notes: "جارٍ تجهيز نسخة منخفضة الحجم للطالبات.",
  },
];

export const recentActivitySeed: ActivityRecord[] = [
  {
    id: "activity_1",
    title: "تم اعتماد دفعة جديدة",
    description: "تم تحويل حالة طلب الطالبة مريم إلى مدفوع.",
    time: "منذ 12 دقيقة",
    type: "payment",
  },
  {
    id: "activity_2",
    title: "طالبة جديدة سجّلت",
    description: "انضمت طالبة جديدة إلى دورة القراءة الصحيحة.",
    time: "منذ 28 دقيقة",
    type: "student",
  },
  {
    id: "activity_3",
    title: "تحديث دورة",
    description: "تم تعديل وصف وسعر دورة التجويد للمبتدئين.",
    time: "منذ ساعة",
    type: "course",
  },
  {
    id: "activity_4",
    title: "رفع محتوى جديد",
    description: "تمت إضافة ملف PDF جديد إلى برنامج الحفظ.",
    time: "منذ ساعتين",
    type: "upload",
  },
];

export const orderStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "معلّق",
  COMPLETED: "مدفوع",
  FAILED: "فشل الدفع",
  REFUNDED: "مسترد",
};

export const paymentMethodLabels: Record<PaymentMethodType, string> = {
  STRIPE: "Stripe",
  THAWANI: "Thawani",
  WHATSAPP_BANK_TRANSFER: "تحويل بنكي / واتساب",
};

export const courseVisibilityLabels: Record<CourseVisibility, string> = {
  PUBLISHED: "منشورة",
  DRAFT: "مسودة",
  ARCHIVED: "مؤرشفة",
};

export const studentAccessLabels: Record<StudentAccessStatus, string> = {
  ACTIVE: "نشط",
  PENDING_PAYMENT: "بانتظار الدفع",
  SUSPENDED: "موقوف",
};

export const couponStatusLabels: Record<CouponStatus, string> = {
  ACTIVE: "نشط",
  SCHEDULED: "مجدول",
  EXPIRED: "منتهي",
  DISABLED: "معطّل",
};

export const uploadStatusLabels: Record<UploadStatus, string> = {
  READY: "جاهز",
  PROCESSING: "قيد المعالجة",
  FAILED: "فشل",
  PENDING_STORAGE: "بانتظار التخزين",
};
