import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPurchaseSuccessEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/audit";
import { getSession as getThawaniSession } from "@/lib/thawani";

/**
 * Thawani webhook/callback handler.
 *
 * Thawani sends a POST to this URL when a payment completes.
 * Since Thawani doesn't provide signature verification like Stripe,
 * we verify the payment by calling the Thawani API to confirm session status.
 */
export async function POST(request: NextRequest) {
    let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Extract session_id from the callback payload
  // Thawani may send it at top level or nested under data
  const data = (payload.data ?? {}) as Record<string, unknown>;
  const sessionId = String(
    payload.session_id ?? payload.sessionId ?? data.session_id ?? "",
  );

  if (!sessionId) {
    console.warn("Thawani webhook missing session_id", payload);
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  // ── Verify payment with Thawani API (don't trust the webhook payload alone) ──
  let thawaniSession;
  try {
    thawaniSession = await getThawaniSession(sessionId);
  } catch (error) {
    console.error("Failed to verify Thawani session:", error);
    return NextResponse.json({ error: "Session verification failed" }, { status: 502 });
  }

  if (thawaniSession.payment_status !== "paid") {
    console.log(`Thawani webhook: session ${sessionId} status is "${thawaniSession.payment_status}", skipping.`);
    return NextResponse.json({ received: true, status: thawaniSession.payment_status });
  }

  // ── Extract metadata ──
  const metadata = thawaniSession.metadata || {};
  const userId = metadata.userId;
  const courseId = metadata.courseId;
  const couponId = metadata.couponId || null;
  const discountAmount = Number(metadata.discountAmount || 0);

  if (!userId || !courseId) {
    console.warn("Thawani webhook missing required metadata", {
      sessionId,
      metadata,
    });
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  try {
    // ── Verify referenced entities exist ──
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!course || !user) {
      console.error("Thawani webhook references missing entities", {
        sessionId,
        userId,
        courseId,
      });
      return NextResponse.json({ error: "Referenced entity not found" }, { status: 400 });
    }

    const amount = (thawaniSession.total_amount || 0) / 1000; // baisa → OMR

    // ── Atomic transaction: purchase + progress + coupon ──
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.purchase.findUnique({
        where: { paymentSessionId: sessionId },
        select: { id: true, status: true },
      });

      const purchase = await tx.purchase.upsert({
        where: { paymentSessionId: sessionId },
        create: {
          userId,
          courseId,
          couponId,
          paymentSessionId: sessionId,
          amount,
          discountAmount,
          status: "COMPLETED",
          paymentMethod: "THAWANI",
        },
        update: {
          status: "COMPLETED",
          amount,
          discountAmount,
          couponId,
        },
      });

      await tx.progress.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: {
          userId,
          courseId,
          completedLessons: 0,
        },
        update: { lastAccessedAt: new Date() },
      });

      // Increment coupon usage only on first COMPLETED transition (replay-safe)
      const shouldIncrementCoupon = !!couponId && (!existing || existing.status !== "COMPLETED");
      if (shouldIncrementCoupon) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        }).catch(() => null);
      }

      return {
        purchase,
        shouldSendEmail: !existing || existing.status !== "COMPLETED",
      };
    });

    // ── Audit log ──
    await createAuditLog({
      actorName: "Thawani Webhook",
      source: "thawani",
      action: "purchase.completed",
      entityType: "purchase",
      entityId: result.purchase.id,
      details: {
        thawaniSessionId: sessionId,
        clientReferenceId: thawaniSession.client_reference_id,
        userId,
        courseId,
        couponId,
        amount,
        discountAmount,
      },
    });

    // ── Email on first completion only ──
    if (result.shouldSendEmail) {
      void sendPurchaseSuccessEmail(user.email, user.name, course.title);
    }

    console.log(`Thawani webhook processed: session=${sessionId} user=${userId} course=${courseId}`);
  } catch (error) {
    console.error("Error processing Thawani webhook:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
