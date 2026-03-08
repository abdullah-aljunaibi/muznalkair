"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import MuznLogo from "@/components/MuznLogo";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasToken = Boolean(token);

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
            className="text-xl font-bold mb-3 text-center"
            style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
          >
            إعادة تعيين كلمة المرور
          </h2>

          {!hasToken && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              رابط إعادة التعيين غير صالح.
            </div>
          )}

          {error && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#ECFDF5",
                color: "#047857",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              {success}
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!token) return;

              if (password.length < 6) {
                setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
                return;
              }

              if (password !== confirmPassword) {
                setError("كلمتا المرور غير متطابقتين");
                return;
              }

              setLoading(true);
              setError(null);
              setSuccess(null);

              try {
                const response = await fetch("/api/auth/reset-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token, password }),
                });

                const json = await response.json();
                if (!response.ok) {
                  setError(json.error || "تعذرت إعادة تعيين كلمة المرور");
                } else {
                  setSuccess(json.message || "تم تحديث كلمة المرور بنجاح");
                  setTimeout(() => router.push("/login?reset=1"), 1200);
                }
              } catch {
                setError("حدث خطأ ما، يرجى المحاولة مجددًا");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={!hasToken}
                className="px-4 py-3 rounded-xl border focus:outline-none text-right disabled:opacity-60"
                style={{
                  borderColor: "#E5E7EB",
                  fontFamily: "var(--font-tajawal)",
                  color: "#2C2C2C",
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={!hasToken}
                className="px-4 py-3 rounded-xl border focus:outline-none text-right disabled:opacity-60"
                style={{
                  borderColor: "#E5E7EB",
                  fontFamily: "var(--font-tajawal)",
                  color: "#2C2C2C",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !hasToken}
              className="w-full py-3 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-70 mt-2"
              style={{
                background: loading ? "#3A8D9E" : "#1B6B7A",
                fontFamily: "var(--font-tajawal)",
                fontSize: "1rem",
              }}
            >
              {loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
            </button>
          </form>

          <p
            className="text-center mt-6 text-sm"
            style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
          >
            <Link href="/login" className="hover:underline" style={{ color: "#1B6B7A" }}>
              العودة إلى تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
