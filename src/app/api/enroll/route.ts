import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod, PurchaseStatus } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const enrollSchema = z.object({
  courseId: z.string().min(1, "معرّف الدورة مطلوب"),
});

function successResponse(request: NextRequest, redirectUrl: string, alreadyEnrolled = false) {
  const acceptsHtml = request.headers.get("accept")?.includes("text/html");

  if (acceptsHtml) {
    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl.origin), { status: 303 });
  }

  return NextResponse.json({
    success: true,
    alreadyEnrolled,
    redirectUrl,
  });
}

function errorResponse(request: NextRequest, message: string, status: number) {
  const acceptsHtml = request.headers.get("accept")?.includes("text/html");

  if (acceptsHtml) {
    const redirectUrl = new URL("/courses", request.nextUrl.origin);
    redirectUrl.searchParams.set("error", message);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  return NextResponse.json({ error: message }, { status });
}

async function parseRequestBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null);
    return enrollSchema.safeParse(body);
  }

  const formData = await request.formData().catch(() => null);
  return enrollSchema.safeParse({
    courseId: typeof formData?.get("courseId") === "string" ? formData.get("courseId") : "",
  });
}

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseRequestBody(request);

    if (!parsed.success) {
      return errorResponse(request, "البيانات غير صحيحة", 400);
    }

    const { courseId } = parsed.data;
    const session = await auth();

    if (!session?.user?.id) {
      const loginUrl = new URL("/login", request.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", `/courses/${courseId}`);
      return NextResponse.redirect(loginUrl, { status: 303 });
    }

    const userId = session.user.id;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        isActive: true,
      },
      select: {
        id: true,
        price: true,
      },
    });

    if (!course) {
      return errorResponse(request, "الدورة غير موجودة", 404);
    }

    if (course.price > 0) {
      return errorResponse(request, "هذه الدورة ليست مجانية", 400);
    }

    const redirectUrl = `/dashboard/courses/${course.id}`;
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: userId,
        courseId: course.id,
        status: PurchaseStatus.COMPLETED,
      },
      select: {
        id: true,
      },
    });

    if (existingPurchase) {
      await prisma.progress.upsert({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: course.id,
          },
        },
        update: {
          lastAccessedAt: new Date(),
        },
        create: {
          userId: userId,
          courseId: course.id,
        },
      });

      return successResponse(request, redirectUrl, true);
    }

    await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findFirst({
        where: {
          userId: userId,
          courseId: course.id,
          status: PurchaseStatus.COMPLETED,
        },
        select: {
          id: true,
        },
      });

      if (!purchase) {
        await tx.purchase.create({
          data: {
            userId: userId,
            courseId: course.id,
            amount: 0,
            discountAmount: 0,
            status: PurchaseStatus.COMPLETED,
            paymentMethod: PaymentMethod.WHATSAPP_BANK_TRANSFER,
          },
        });
      }

      await tx.progress.upsert({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: course.id,
          },
        },
        update: {
          lastAccessedAt: new Date(),
        },
        create: {
          userId: userId,
          courseId: course.id,
        },
      });
    });

    return successResponse(request, redirectUrl);
  } catch (error) {
    console.error("Enroll error:", error);
    return errorResponse(request, "حدث خطأ أثناء التسجيل في الدورة", 500);
  }
}
