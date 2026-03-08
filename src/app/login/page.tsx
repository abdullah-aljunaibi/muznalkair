"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import MuznLogo from "@/components/MuznLogo";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setLoading(false);
      } else if (result?.ok) {
        toast.success("تم تسجيل الدخول بنجاح");
        // Wait for session cookie to be set before redirecting
        setTimeout(() => {
          window.location.replace("/dashboard");
        }, 500);
      } else {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setLoading(false);
      }
    } catch {
      toast.error("حدث خطأ ما، يرجى المحاولة مجددًا");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#F5F0E8" }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
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
            تسجيل الدخول
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-right"
                style={{
                  borderColor: errors.email ? "#ef4444" : "#E5E7EB",
                  fontFamily: "var(--font-tajawal)",
                  color: "#2C2C2C",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1B6B7A")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.email ? "#ef4444" : "#E5E7EB")
                }
              />
              {errors.email && (
                <span
                  className="text-xs text-red-500"
                  style={{ fontFamily: "var(--font-tajawal)" }}
                >
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
                onFocus={(e) => (e.target.style.borderColor = "#1B6B7A")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.password ? "#ef4444" : "#E5E7EB")
                }
              />
              {errors.password && (
                <span
                  className="text-xs text-red-500"
                  style={{ fontFamily: "var(--font-tajawal)" }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>

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
              {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          {/* Link to register */}
          <p
            className="text-center mt-6 text-sm"
            style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
          >
            ليس لديكِ حساب؟{" "}
            <Link
              href="/register"
              className="font-medium hover:underline"
              style={{ color: "#1B6B7A" }}
            >
              سجّلي الآن
            </Link>
          </p>
        </div>

        {/* Back to home */}
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
