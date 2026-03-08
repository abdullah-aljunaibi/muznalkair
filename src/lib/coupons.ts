import { CouponStatus, CouponDiscountType, type Coupon, type Course } from "@prisma/client";

export type CouponPayload = {
  code?: string;
  description?: string;
  discountType?: CouponDiscountType;
  discountValue?: number;
  status?: CouponStatus;
  usageLimit?: number;
  expiresAt?: string;
  appliesTo?: string;
};

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

export function resolveCouponStatus(coupon: Pick<Coupon, "status" | "expiresAt">) {
  if (coupon.status === CouponStatus.DISABLED) return CouponStatus.DISABLED;
  if (coupon.status === CouponStatus.SCHEDULED) return CouponStatus.SCHEDULED;
  if (coupon.status === CouponStatus.EXPIRED) return CouponStatus.EXPIRED;
  if (new Date(coupon.expiresAt) < new Date()) return CouponStatus.EXPIRED;
  return CouponStatus.ACTIVE;
}

export function validateCouponInput(payload: CouponPayload) {
  const code = normalizeCouponCode(String(payload.code || ""));
  const description = String(payload.description || "").trim();
  const discountType = payload.discountType || CouponDiscountType.PERCENTAGE;
  const discountValue = Number(payload.discountValue || 0);
  const status = payload.status || CouponStatus.ACTIVE;
  const usageLimit = Number(payload.usageLimit || 0);
  const appliesTo = String(payload.appliesTo || "جميع الدورات").trim() || "جميع الدورات";
  const expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;

  if (!code) {
    return { ok: false as const, error: "كود الخصم مطلوب" };
  }

  if (![CouponDiscountType.PERCENTAGE, CouponDiscountType.FIXED].includes(discountType)) {
    return { ok: false as const, error: "نوع الخصم غير صالح" };
  }

  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    return { ok: false as const, error: "قيمة الخصم يجب أن تكون أكبر من صفر" };
  }

  if (discountType === CouponDiscountType.PERCENTAGE && discountValue > 100) {
    return { ok: false as const, error: "نسبة الخصم لا يمكن أن تتجاوز 100٪" };
  }

  if (!Number.isInteger(usageLimit) || usageLimit < 0) {
    return { ok: false as const, error: "حد الاستخدام غير صالح" };
  }

  if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
    return { ok: false as const, error: "تاريخ الانتهاء غير صالح" };
  }

  return {
    ok: true as const,
    data: {
      code,
      description,
      discountType,
      discountValue,
      status,
      usageLimit,
      expiresAt,
      appliesTo,
    },
  };
}

export function calculateDiscount(coupon: Pick<Coupon, "discountType" | "discountValue">, course: Pick<Course, "price">) {
  const rawDiscount =
    coupon.discountType === CouponDiscountType.PERCENTAGE
      ? (course.price * coupon.discountValue) / 100
      : coupon.discountValue;

  const discountAmount = Math.max(0, Math.min(course.price, Number(rawDiscount.toFixed(3))));
  const finalAmount = Math.max(0, Number((course.price - discountAmount).toFixed(3)));

  return { discountAmount, finalAmount };
}

export function canUseCoupon(coupon: Pick<Coupon, "status" | "expiresAt" | "usageCount" | "usageLimit">) {
  const effectiveStatus = resolveCouponStatus(coupon);
  if (effectiveStatus !== CouponStatus.ACTIVE) {
    return { ok: false as const, error: "كود الخصم غير متاح حاليًا" };
  }

  if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
    return { ok: false as const, error: "تم الوصول إلى الحد الأقصى لاستخدام هذا الكوبون" };
  }

  return { ok: true as const };
}
