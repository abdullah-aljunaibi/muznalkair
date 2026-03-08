import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendPurchaseSuccessEmail } from "@/lib/email";

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
    console.warn(
      "Stripe webhook called without STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET"
    );
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 }
    );
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (userId && courseId) {
      try {
        const amount = (session.amount_total || 0) / 1000;
        const existed = await prisma.purchase.findUnique({
          where: { stripeSessionId: session.id },
          select: { id: true, status: true },
        });

        const purchase = await prisma.purchase.upsert({
          where: { stripeSessionId: session.id },
          create: {
            userId,
            courseId,
            stripeSessionId: session.id,
            amount,
            status: "COMPLETED",
            paymentMethod: "STRIPE",
          },
          update: {
            status: "COMPLETED",
            amount,
          },
        });

        await prisma.progress.upsert({
          where: { userId_courseId: { userId, courseId } },
          create: {
            userId,
            courseId,
            completedLessons: 0,
          },
          update: { lastAccessedAt: new Date() },
        });

        if (!existed && purchase.status === "COMPLETED") {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true },
          });
          const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { title: true },
          });
          if (user && course) {
            void sendPurchaseSuccessEmail(user.email, user.name, course.title);
          }
        }

        console.log(
          `Stripe webhook processed: session=${session.id} user=${userId} course=${courseId}`
        );
      } catch (error) {
        console.error("Error creating purchase record:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    } else {
      console.warn(
        "Stripe webhook missing metadata",
        session.id,
        session.metadata
      );
    }
  }

  return NextResponse.json({ received: true });
}
