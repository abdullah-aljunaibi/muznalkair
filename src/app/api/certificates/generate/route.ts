import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateCertificateCode() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";

  for (let index = 0; index < 6; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return `MUZN-${suffix}`;
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json().catch(() => null);
  const courseId = body?.courseId;

  if (!courseId || typeof courseId !== "string") {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      courseId,
      status: "COMPLETED",
    },
    select: { id: true },
  });

  if (!purchase) {
    return NextResponse.json({ error: "Course not purchased" }, { status: 403 });
  }

  const totalLessons = await prisma.lesson.count({
    where: { courseId },
  });

  if (totalLessons === 0) {
    return NextResponse.json({ error: "الدورة لا تحتوي على دروس" }, { status: 400 });
  }

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      completed: true,
      lesson: { courseId },
    },
  });

  if (completedLessons !== totalLessons) {
    return NextResponse.json({ error: "لم يتم إكمال جميع الدروس بعد" }, { status: 400 });
  }

  const existingCertificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: {
      id: true,
      code: true,
      issuedAt: true,
    },
  });

  if (existingCertificate) {
    return NextResponse.json({ certificate: existingCertificate });
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      const certificate = await prisma.certificate.create({
        data: {
          userId,
          courseId,
          code: generateCertificateCode(),
        },
        select: {
          id: true,
          code: true,
          issuedAt: true,
        },
      });

      return NextResponse.json({ certificate });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const currentCertificate = await prisma.certificate.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
          select: {
            id: true,
            code: true,
            issuedAt: true,
          },
        });

        if (currentCertificate) {
          return NextResponse.json({ certificate: currentCertificate });
        }

        continue;
      }

      throw error;
    }
  }

  return NextResponse.json({ error: "تعذر إنشاء الشهادة" }, { status: 500 });
}
