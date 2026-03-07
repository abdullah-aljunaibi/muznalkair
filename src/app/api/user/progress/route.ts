import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
    }

    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            totalLessons: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { lastAccessedAt: "desc" },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Progress GET error:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

const updateProgressSchema = z.object({
  courseId: z.string(),
  completedLessons: z.number().int().min(0),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "البيانات غير صحيحة" }, { status: 400 });
    }

    const { courseId, completedLessons } = parsed.data;

    const progress = await prisma.progress.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      update: {
        completedLessons,
        lastAccessedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        courseId,
        completedLessons,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Progress POST error:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
