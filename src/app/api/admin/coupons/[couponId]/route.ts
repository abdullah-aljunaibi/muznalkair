import { auth } from "@/lib/auth";
import { formatCouponAppliesTo, resolveCouponStatus, validateCouponInput } from "@/lib/coupons";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function ensureAdmin(role?: string) {
  return role === "ADMIN";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ couponId: string }> }
) {
  const session = await auth();
  if (!ensureAdmin((session?.user as { role?: string })?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { couponId } = await params;
  const [coupon, courses] = await Promise.all([
    prisma.coupon.findUnique({
      where: { id: couponId },
      include: {
        purchases: {
          where: { status: "COMPLETED" },
          include: { user: { select: { id: true } }, course: { select: { id: true, title: true } } },
        },
      },
    }),
    prisma.course.findMany({ select: { id: true, title: true }, where: { isActive: true } }),
  ]);

  if (!coupon) {
    return NextResponse.json({ error: "الكوبون غير موجود" }, { status: 404 });
  }

  const courseTitlesById = Object.fromEntries(courses.map((course) => [course.id, course.title]));

  return NextResponse.json({
    ...coupon,
    status: resolveCouponStatus(coupon),
    appliesTo: formatCouponAppliesTo(coupon, courseTitlesById),
    applicableCourses: coupon.applicableCourseIds.map((id) => ({ id, title: courseTitlesById[id] || id })),
    availableCourses: courses,
    analytics: {
      revenue: coupon.purchases.reduce((sum, purchase) => sum + purchase.amount, 0),
      totalDiscount: coupon.purchases.reduce((sum, purchase) => sum + purchase.discountAmount, 0),
      uniqueUsers: new Set(coupon.purchases.map((purchase) => purchase.userId)).size,
      purchaseCount: coupon.purchases.length,
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ couponId: string }> }
) {
  const session = await auth();
  if (!ensureAdmin((session?.user as { role?: string })?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { couponId } = await params;
  const body = await req.json();
  const parsed = validateCouponInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const existing = await prisma.coupon.findFirst({
    where: {
      code: parsed.data.code,
      NOT: { id: couponId },
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "كود الخصم مستخدم بالفعل" }, { status: 409 });
  }

  try {
    const coupon = await prisma.coupon.update({ where: { id: couponId }, data: parsed.data });
    return NextResponse.json({
      ...coupon,
      status: resolveCouponStatus(coupon),
      appliesTo: formatCouponAppliesTo(coupon),
    });
  } catch {
    return NextResponse.json({ error: "الكوبون غير موجود" }, { status: 404 });
  }
}
