import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateDiscount, canUseCoupon, normalizeCouponCode } from "@/lib/coupons";
import Stripe from "stripe";

const getStripe = () =>
  process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      console.warn("Checkout requested but STRIPE_SECRET_KEY is missing.");
      return NextResponse.json({ error: "خدمة الدفع غير مهيأة حاليًا" }, { status: 503 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
    }

    const body = await request.json();
    const courseId = String(body.courseId || "");
    const couponCode = body.couponCode ? normalizeCouponCode(String(body.couponCode)) : "";

    if (!courseId) {
      return NextResponse.json({ error: "معرّف الدورة مطلوب" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, isActive: true },
    });

    if (!course) {
      return NextResponse.json({ error: "الدورة غير موجودة" }, { status: 404 });
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId: session.user.id, courseId, status: "COMPLETED" },
      select: { id: true },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: "لقد اشتركتِ في هذه الدورة بالفعل" }, { status: 409 });
    }

    let couponId = "";
    let discountAmount = 0;
    let finalAmount = course.price;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon) {
        return NextResponse.json({ error: "كود الخصم غير صحيح" }, { status: 404 });
      }

      const usable = canUseCoupon(coupon);
      if (!usable.ok) {
        return NextResponse.json({ error: usable.error }, { status: 400 });
      }

      couponId = coupon.id;
      const pricing = calculateDiscount(coupon, course);
      discountAmount = pricing.discountAmount;
      finalAmount = pricing.finalAmount;
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
              description: couponCode
                ? `${course.description}\nكود الخصم المطبق: ${couponCode}`
                : course.description,
            },
            unit_amount: Math.round(finalAmount * 1000),
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: course.id,
        userId: session.user.id,
        couponId,
        couponCode,
        discountAmount: discountAmount.toString(),
        originalAmount: course.price.toString(),
      },
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({
      url: checkoutSession.url,
      pricing: {
        originalAmount: course.price,
        discountAmount,
        finalAmount,
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء جلسة الدفع" }, { status: 500 });
  }
}
