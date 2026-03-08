import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveCouponStatus, validateCouponInput } from "@/lib/coupons";
import { NextRequest, NextResponse } from "next/server";

function ensureAdmin(role?: string) {
  return role === "ADMIN";
}

export async function GET() {
  const session = await auth();
  if (!ensureAdmin((session?.user as { role?: string })?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    coupons.map((coupon) => ({
      ...coupon,
      status: resolveCouponStatus(coupon),
    }))
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

  const coupon = await prisma.coupon.create({
    data: parsed.data,
  });

  return NextResponse.json(
    {
      ...coupon,
      status: resolveCouponStatus(coupon),
    },
    { status: 201 }
  );
}
