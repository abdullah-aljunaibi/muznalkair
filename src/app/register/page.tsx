"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import MuznLogo from "@/components/MuznLogo";

const registerSchema = z
  .object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, "يجب الموافقة على الشروط"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "حدث خطأ أثناء إنشاء الحساب");
      } else {
        toast.success("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول");
        router.push("/login");
      }
    } catch {
      toast.error("حدث خطأ ما، يرجى المحاولة مجددًا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#F5F0E8" }}
    >
      <div className="w-full max-w-md">
        <div
          className="bg-white rounded-2xl p-8 shadow-lg"
          style={{ boxShadow: "0 8px 40px rgba(27,107,122,0.12)" }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <MuznLogo size={56} />
            <h1
              className="text-2xl font-bold mt-4 text-center"
              style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
            >
              مقرأة مُزن الخير
            </h1>
          </div>

          <h2
            className="text-xl font-bold mb-6 text-center"
            style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
          >
            إنشاء حساب جديد
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                الاسم الكامل
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="مثال: فاطمة محمد"
                className="px-4 py-3 rounded-xl border focus:outline-none text-right"
                style={{
                  borderColor: errors.name ? "#ef4444" : "#E5E7EB",
                  fontFamily: "var(--font-tajawal)",
                  color: "#2C2C2C",
                }}
              />
              {errors.name && (
                <span className="text-xs text-red-500" style={{ fontFamily: "var(--font-tajawal)" }}>
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                البريد الإلكتروني
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="example@email.com"
                className="px-4 py-3 rounded-xl border focus:outline-none text-right"
                style={{
                  borderColor: errors.email ? "#ef4444" : "#E5E7EB",
                  fontFamily: "var(--font-tajawal)",
                  color: "#2C2C2C",
                }}
              />
              {errors.email && (
                <span className="text-xs text-red-500" style={{ fontFamily: "var(--font-tajawal)" }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                كلمة المرور
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="px-4 py-3 rounded-xl border focus:outline-none text-right"
                style={{
                  borderColor: errors.password ? "#ef4444" : "#E5E7EB",
                  fontFamily: "var(--font-tajawal)",
                  color: "#2C2C2C",
                }}
              />
              {errors.password && (
                <span className="text-xs text-red-500" style={{ fontFamily: "var(--font-tajawal)" }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                تأكيد كلمة المرور
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="px-4 py-3 rounded-xl border focus:outline-none text-right"
                style={{
                  borderColor: errors.confirmPassword ? "#ef4444" : "#E5E7EB",
                  fontFamily: "var(--font-tajawal)",
                  color: "#2C2C2C",
                }}
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-500" style={{ fontFamily: "var(--font-tajawal)" }}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-3">
              <input
                {...register("terms")}
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded accent-teal-700"
                style={{ accentColor: "#1B6B7A" }}
              />
              <label
                htmlFor="terms"
                className="text-sm"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                أوافق على{" "}
                <span className="font-medium" style={{ color: "#1B6B7A" }}>
                  الشروط والأحكام
                </span>
              </label>
            </div>
            {errors.terms && (
              <span className="text-xs text-red-500 -mt-2" style={{ fontFamily: "var(--font-tajawal)" }}>
                {errors.terms.message}
              </span>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-70 mt-2"
              style={{
                background: loading ? "#3A8D9E" : "#1B6B7A",
                fontFamily: "var(--font-tajawal)",
                fontSize: "1rem",
              }}
            >
              {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
            </button>
          </form>

          <p
            className="text-center mt-6 text-sm"
            style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
          >
            لديكِ حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="font-medium hover:underline"
              style={{ color: "#1B6B7A" }}
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm hover:underline"
            style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
          >
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
