import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";
import { hashResetToken } from "@/lib/reset-password";

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getRequestIp(request);
    const rateLimit = checkRateLimit(`reset:${ip}`, RATE_LIMITS.resetPassword);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "تم تجاوز عدد المحاولات. يرجى المحاولة بعد قليل." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "البيانات المُدخلة غير صحيحة" },
        { status: 400 }
      );
    }

    const tokenHash = hashResetToken(parsed.data.token);
    const now = new Date();

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < now) {
      return NextResponse.json(
        { error: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
        },
        data: { usedAt: now },
      }),
    ]);

    return NextResponse.json(
      { message: "تم تحديث كلمة المرور بنجاح. يمكنكِ تسجيل الدخول الآن." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم، يرجى المحاولة لاحقًا" },
      { status: 500 }
    );
  }
}
