import { auth } from "@/lib/auth";
import { couponsSeed } from "@/lib/admin/mock-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ couponId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { couponId } = await params;
  const coupon = couponsSeed.find((item) => item.id === couponId);

  if (!coupon) {
    return NextResponse.json({ error: "الكوبون غير موجود" }, { status: 404 });
  }

  return NextResponse.json(coupon);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ couponId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { couponId } = await params;
  const body = await req.json();

  return NextResponse.json({
    id: couponId,
    ...body,
    note: "TODO: حفظ تحديثات الكوبون في قاعدة البيانات أو خدمة الخصومات عند توفرها.",
  });
}
