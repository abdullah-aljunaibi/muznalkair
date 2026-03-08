import { auth } from "@/lib/auth";
import { formatCouponAppliesTo, resolveCouponStatus, validateCouponInput } from "@/lib/coupons";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function ensureAdmin(role?: string) {
  return role === "ADMIN";
}

export async function GET() {
  const session = await auth();
  if (!ensureAdmin((session?.user as { role?: string })?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [coupons, courses] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        purchases: {
          where: { status: "COMPLETED" },
          include: {
            user: { select: { id: true } },
            course: { select: { id: true, title: true } },
          },
        },
      },
    }),
    prisma.course.findMany({ select: { id: true, title: true }, where: { isActive: true } }),
  ]);

  const courseTitlesById = Object.fromEntries(courses.map((course) => [course.id, course.title]));

  return NextResponse.json(
    coupons.map((coupon) => {
      const revenue = coupon.purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
      const totalDiscount = coupon.purchases.reduce((sum, purchase) => sum + purchase.discountAmount, 0);
      const uniqueUsers = new Set(coupon.purchases.map((purchase) => purchase.userId)).size;

      return {
        ...coupon,
        status: resolveCouponStatus(coupon),
        appliesTo: formatCouponAppliesTo(coupon, courseTitlesById),
        applicableCourses: coupon.applicableCourseIds.map((id) => ({ id, title: courseTitlesById[id] || id })),
        analytics: {
          revenue,
          totalDiscount,
          uniqueUsers,
          purchaseCount: coupon.purchases.length,
        },
      };
    })
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!ensureAdmin((session?.user as { role?: string })?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = validateCouponInput(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({
    where: { code: parsed.data.code },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "كود الخصم مستخدم بالفعل" }, { status: 409 });
  }

  const coupon = await prisma.coupon.create({ data: parsed.data });

  return NextResponse.json(
    {
      ...coupon,
      status: resolveCouponStatus(coupon),
      appliesTo: formatCouponAppliesTo(coupon),
      applicableCourses: [],
      analytics: { revenue: 0, totalDiscount: 0, uniqueUsers: 0, purchaseCount: 0 },
    },
    { status: 201 }
  );
}
