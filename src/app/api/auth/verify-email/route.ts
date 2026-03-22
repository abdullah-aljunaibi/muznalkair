import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const loginUrl = new URL("/login", request.url);

  if (!token) {
    loginUrl.searchParams.set("error", "invalid_token");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const now = new Date();

    // Atomic: claim token first with conditional write, then verify user
    const result = await prisma.$transaction(async (tx) => {
      // Conditionally update only if token is unused and not expired
      const claimed = await tx.emailVerificationToken.updateMany({
        where: {
          tokenHash,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      });

      if (claimed.count === 0) return null;

      // Find the token to get userId
      const claimedToken = await tx.emailVerificationToken.findFirst({
        where: { tokenHash },
        select: { userId: true },
      });

      if (!claimedToken) return null;

      await tx.user.update({
        where: { id: claimedToken.userId },
        data: { emailVerified: now },
      });

      return { verified: true };
    });

    if (!result) {
      loginUrl.searchParams.set("error", "invalid_token");
      return NextResponse.redirect(loginUrl);
    }

    loginUrl.searchParams.set("verified", "1");
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Verify email error:", error);
    loginUrl.searchParams.set("error", "invalid_token");
    return NextResponse.redirect(loginUrl);
  }
}
