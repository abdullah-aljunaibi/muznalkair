import { auth } from "@/lib/auth";
import { uploadsSeed } from "@/lib/admin/mock-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    items: uploadsSeed,
    storageConfigured: false,
    todo: [
      "ربط النموذج بـ S3 أو Supabase Storage أو Cloudinary",
      "إضافة رفع فعلي للملفات وتخزين الروابط في قاعدة البيانات",
      "ربط الملفات بالدروس أو الوحدات التعليمية بشكل دائم",
    ],
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();

  return NextResponse.json(
    {
      success: true,
      title: formData.get("title"),
      courseName: formData.get("courseName"),
      lessonName: formData.get("lessonName"),
      type: formData.get("type"),
      note: "تم تجهيز التدفق الأمامي للرفع. ما يزال الربط الفعلي مع التخزين الخلفي مطلوبًا.",
    },
    { status: 201 }
  );
}
