import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const getStripe = () =>
  process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      console.warn("Checkout requested but STRIPE_SECRET_KEY is missing.");
      return NextResponse.json(
        { error: "خدمة الدفع غير مهيأة حاليًا" },
        { status: 503 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "معرّف الدورة مطلوب" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, isActive: true },
    });

    if (!course) {
      return NextResponse.json(
        { error: "الدورة غير موجودة" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: "auto" as Stripe.Checkout.SessionCreateParams.Locale,
      line_items: [
        {
          price_data: {
            currency: "omr",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.price * 1000), // OMR in baisa
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: course.id,
        userId: session.user.id,
      },
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء جلسة الدفع" },
      { status: 500 }
    );
  }
}
