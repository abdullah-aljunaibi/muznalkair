import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { lessons: true, purchases: true } },
    },
  });

  return NextResponse.json(
    courses.map((course) => ({
      ...course,
      visibilityStatus: course.isActive ? "PUBLISHED" : "DRAFT",
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, price, thumbnail, totalLessons, visibilityStatus } = body;

  if (!title || !description || price == null) {
    return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      title,
      description,
      price,
      thumbnail,
      totalLessons: Number(totalLessons || 0),
      isActive: visibilityStatus === "PUBLISHED",
    },
  });

  return NextResponse.json(
    {
      ...course,
      visibilityStatus: course.isActive ? "PUBLISHED" : "DRAFT",
    },
    { status: 201 }
  );
}
