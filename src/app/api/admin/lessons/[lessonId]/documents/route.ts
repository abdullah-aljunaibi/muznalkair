import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lessonId } = await params;
  const body = await req.json();
  const { title, fileUrl, fileType } = body;

  if (!title || !fileUrl) {
    return NextResponse.json({ error: "العنوان والرابط مطلوبان" }, { status: 400 });
  }

  const document = await prisma.document.create({
    data: {
      lessonId,
      title,
      fileUrl,
      fileType: fileType || "pdf",
    },
  });

  return NextResponse.json(document, { status: 201 });
}
