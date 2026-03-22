import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/email";

const resendVerificationSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});

const RESEND_VERIFICATION_RATE_LIMIT = {
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resendVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "البيانات المُدخلة غير صحيحة" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const rateLimit = checkRateLimit(
      `resend-verification:${email}`,
      RESEND_VERIFICATION_RATE_LIMIT
    );

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          message:
            "إذا كان الحساب بحاجة إلى تفعيل، فسنرسل رسالة جديدة إلى بريدكِ عند توفر المحاولة التالية.",
        },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    if (user && !user.emailVerified) {
      const plainToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(plainToken).digest("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.$transaction([
        prisma.emailVerificationToken.deleteMany({
          where: { userId: user.id },
        }),
        prisma.emailVerificationToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt,
          },
        }),
      ]);

      void sendVerificationEmail(user.email, user.name, plainToken);
    }

    return NextResponse.json(
      {
        message:
          "إذا كان الحساب بحاجة إلى تفعيل، فسنرسل رسالة جديدة إلى بريدكِ الإلكتروني.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم، يرجى المحاولة لاحقًا" },
      { status: 500 }
    );
  }
}
