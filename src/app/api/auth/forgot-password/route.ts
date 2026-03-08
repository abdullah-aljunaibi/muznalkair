import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";
import { generateResetToken } from "@/lib/reset-password";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getRequestIp(request);
    const ipRateLimit = checkRateLimit(`forgot:${ip}`, RATE_LIMITS.forgotPassword);
    if (!ipRateLimit.success) {
      return NextResponse.json(
        { error: "تم تجاوز عدد المحاولات. يرجى المحاولة بعد قليل." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "البيانات المُدخلة غير صحيحة" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
          OR: [{ usedAt: { not: null } }, { expiresAt: { lt: new Date() } }],
        },
      });

      const emailRateLimit = checkRateLimit(
        `forgot-email:${email}`,
        RATE_LIMITS.forgotPassword
      );

      if (!emailRateLimit.success) {
        return NextResponse.json(
          { error: "تم تجاوز عدد المحاولات. يرجى المحاولة بعد قليل." },
          { status: 429 }
        );
      }

      const { rawToken, tokenHash, expiresAt } = generateResetToken();

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      void sendPasswordResetEmail(user.email, rawToken);
    }

    return NextResponse.json(
      {
        message:
          "إذا كان البريد الإلكتروني مسجلًا لدينا، فستصلكِ رسالة لإعادة تعيين كلمة المرور.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم، يرجى المحاولة لاحقًا" },
      { status: 500 }
    );
  }
}
