import assert from "node:assert/strict";
import "dotenv/config";
import { PrismaClient, CouponStatus, CouponDiscountType } from "@prisma/client";
import { calculateDiscount, canUseCoupon } from "../src/lib/coupons";
import { firstUnlockedLessonIndex, isLessonUnlocked } from "../src/lib/lessons";

const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
  assert.ok(courses.length >= 3, "expected at least 3 active courses");

  const ramadan = await prisma.coupon.findUnique({ where: { code: "RAMADAN10" } });
  const welcome = await prisma.coupon.findUnique({ where: { code: "WELCOME5" } });

  assert.ok(ramadan, "RAMADAN10 coupon must exist");
  assert.ok(welcome, "WELCOME5 coupon must exist");

  assert.equal(ramadan!.appliesToAll, true, "RAMADAN10 should apply to all courses");
  assert.equal(welcome!.appliesToAll, false, "WELCOME5 should be course-targeted");
  assert.ok(welcome!.applicableCourseIds.length > 0, "WELCOME5 should target specific courses");

  const percentageDiscount = calculateDiscount(
    { discountType: CouponDiscountType.PERCENTAGE, discountValue: 10 },
    { price: 20 }
  );
  assert.equal(percentageDiscount.discountAmount, 2);
  assert.equal(percentageDiscount.finalAmount, 18);

  const fixedDiscount = calculateDiscount(
    { discountType: CouponDiscountType.FIXED, discountValue: 5 },
    { price: 20 }
  );
  assert.equal(fixedDiscount.discountAmount, 5);
  assert.equal(fixedDiscount.finalAmount, 15);

  const targetedFail = canUseCoupon(
    {
      status: CouponStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 86400000),
      usageCount: 0,
      usageLimit: 10,
      appliesToAll: false,
      applicableCourseIds: ["course_quran_reading_001"],
      maxUsesPerUser: 1,
    },
    { courseId: "course_hifz_001", userCompletedUses: 0 }
  );
  assert.equal(targetedFail.ok, false, "targeted coupon should reject wrong course");

  const overuseFail = canUseCoupon(
    {
      status: CouponStatus.ACTIVE,
      expiresAt: new Date(Date.now() + 86400000),
      usageCount: 0,
      usageLimit: 10,
      appliesToAll: true,
      applicableCourseIds: [],
      maxUsesPerUser: 1,
    },
    { courseId: "course_quran_reading_001", userCompletedUses: 1 }
  );
  assert.equal(overuseFail.ok, false, "coupon should reject when per-user limit is reached");

  const completedFlags = [true, false, false];
  assert.equal(isLessonUnlocked(0, completedFlags), true);
  assert.equal(isLessonUnlocked(1, completedFlags), true);
  assert.equal(isLessonUnlocked(2, completedFlags), false);
  assert.equal(firstUnlockedLessonIndex(completedFlags), 1);

  console.log("✅ Smoke checks passed");
  console.log(`- Active courses: ${courses.length}`);
  console.log(`- Coupons present: ${[ramadan!.code, welcome!.code].join(", ")}`);
}

main()
  .catch((error) => {
    console.error("❌ Smoke checks failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
