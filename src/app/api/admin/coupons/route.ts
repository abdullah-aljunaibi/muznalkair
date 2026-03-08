import { auth } from "@/lib/auth";
import { couponsSeed } from "@/lib/admin/mock-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(couponsSeed);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const coupon = {
    id: `coupon_${Date.now()}`,
    code: body.code,
    description: body.description || "",
    discountType: body.discountType || "PERCENTAGE",
    discountValue: Number(body.discountValue || 0),
    status: body.status || "ACTIVE",
    expiresAt: body.expiresAt,
    usageCount: 0,
    usageLimit: Number(body.usageLimit || 0),
    appliesTo: body.appliesTo || "جميع الدورات",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(
    {
      ...coupon,
      note: "TODO: ربط إنشاء الكوبونات بقاعدة البيانات لاحقًا. الاستجابة الحالية مهيأة لواجهة الإدارة فقط.",
    },
    { status: 201 }
  );
}
