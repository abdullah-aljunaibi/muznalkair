import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendPurchaseSuccessEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/audit";

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.warn("Stripe webhook called without STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const courseId = session.metadata?.courseId;
  const couponId = session.metadata?.couponId || null;
  const discountAmount = Number(session.metadata?.discountAmount || 0);

  if (!session.id || !userId || !courseId) {
    console.warn("Stripe webhook missing required metadata", {
      eventId: event.id,
      sessionId: session.id,
      metadata: session.metadata,
    });
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!course || !user) {
      console.error("Stripe webhook references missing entities", {
        eventId: event.id,
        sessionId: session.id,
        userId,
        courseId,
      });
      return NextResponse.json({ error: "Referenced entity not found" }, { status: 400 });
    }

    const amount = (session.amount_total || 0) / 1000;

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.purchase.findUnique({
        where: { stripeSessionId: session.id },
        select: { id: true, status: true },
      });

      const purchase = await tx.purchase.upsert({
        where: { stripeSessionId: session.id },
        create: {
          userId,
          courseId,
          couponId,
          stripeSessionId: session.id,
          amount,
          discountAmount,
          status: "COMPLETED",
          paymentMethod: "STRIPE",
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

    await createAuditLog({
      actorName: "Stripe Webhook",
      source: "stripe",
      action: "purchase.completed",
      entityType: "purchase",
      entityId: result.purchase.id,
      details: {
        eventId: event.id,
        stripeSessionId: session.id,
        userId,
        courseId,
        couponId,
        amount,
        discountAmount,
      },
    });

    if (result.shouldSendEmail) {
      void sendPurchaseSuccessEmail(user.email, user.name, course.title);
    }

    console.log(`Stripe webhook processed: event=${event.id} session=${session.id} user=${userId} course=${courseId}`);
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
