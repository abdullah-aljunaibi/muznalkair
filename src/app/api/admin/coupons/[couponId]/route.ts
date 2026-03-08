import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveCouponStatus, validateCouponInput } from "@/lib/coupons";
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
  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!coupon) {
    return NextResponse.json({ error: "الكوبون غير موجود" }, { status: 404 });
  }

  return NextResponse.json({
    ...coupon,
    status: resolveCouponStatus(coupon),
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
    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: parsed.data,
    });

    return NextResponse.json({
      ...coupon,
      status: resolveCouponStatus(coupon),
    });
  } catch {
    return NextResponse.json({ error: "الكوبون غير موجود" }, { status: 404 });
  }
}
