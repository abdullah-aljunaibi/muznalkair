import { auth } from "@/lib/auth";
import { calculateDiscount, canUseCoupon, normalizeCouponCode } from "@/lib/coupons";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }

  const body = await request.json();
  const code = normalizeCouponCode(String(body.code || ""));
  const courseId = String(body.courseId || "");

  if (!code || !courseId) {
    return NextResponse.json({ error: "كود الخصم والدورة مطلوبان" }, { status: 400 });
  }

  const [coupon, course, userUses] = await Promise.all([
    prisma.coupon.findUnique({ where: { code } }),
    prisma.course.findUnique({ where: { id: courseId, isActive: true } }),
    prisma.purchase.count({ where: { userId: session.user.id, status: "COMPLETED", coupon: { code } } }),
  ]);

  if (!coupon) {
    return NextResponse.json({ error: "كود الخصم غير صحيح" }, { status: 404 });
  }

  if (!course) {
    return NextResponse.json({ error: "الدورة غير موجودة" }, { status: 404 });
  }

  const usable = canUseCoupon(coupon, { courseId, userCompletedUses: userUses });
  if (!usable.ok) {
    return NextResponse.json({ error: usable.error }, { status: 400 });
  }

  const { discountAmount, finalAmount } = calculateDiscount(coupon, course);

  return NextResponse.json({
    coupon: {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxUsesPerUser: coupon.maxUsesPerUser,
      appliesToAll: coupon.appliesToAll,
      applicableCourseIds: coupon.applicableCourseIds,
    },
    course: {
      id: course.id,
      title: course.title,
      originalPrice: course.price,
      finalPrice: finalAmount,
      discountAmount,
      currency: course.currency,
    },
  });
}
