import { NextResponse } from "next/server";

/**
 * DEPRECATED: Stripe webhook handler.
 * Payment processing has been migrated to Thawani Pay.
 * This route is kept temporarily for any in-flight Stripe webhooks.
 * Remove once all Stripe webhooks are confirmed stopped.
 */
export async function POST() {
  console.warn("Deprecated Stripe webhook endpoint called — payments have migrated to Thawani.");
  return NextResponse.json({ received: true, deprecated: true });
}
