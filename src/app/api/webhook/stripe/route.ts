import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
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
        // Create purchase record
        await prisma.purchase.create({
          data: {
            userId,
            courseId,
            stripeSessionId: session.id,
            amount: (session.amount_total || 0) / 1000, // Convert from baisa to OMR
            status: "COMPLETED",
            paymentMethod: "STRIPE",
          },
        });

        // Create initial progress record
        await prisma.progress.upsert({
          where: {
            userId_courseId: { userId, courseId },
          },
          create: {
            userId,
            courseId,
            completedLessons: 0,
          },
          update: {
            lastAccessedAt: new Date(),
          },
        });

        console.log(`Purchase completed for user ${userId}, course ${courseId}`);
      } catch (error) {
        console.error("Error creating purchase record:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
