"use client";

import Link from "next/link";
import { useState } from "react";
import MuznLogo from "@/components/MuznLogo";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
            استعادة كلمة المرور
          </h2>

          <p
            className="text-sm text-center mb-6"
            style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
          >
            أدخلي بريدكِ الإلكتروني وسنرسل لكِ رابط إعادة التعيين.
          </p>

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
              setLoading(true);
              setError(null);
              setSuccess(null);

              try {
                const response = await fetch("/api/auth/forgot-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });

                const json = await response.json();
                if (!response.ok) {
                  setError(json.error || "تعذر إرسال رابط إعادة التعيين");
                } else {
                  setSuccess(
                    json.message ||
                      "إذا كان البريد مسجلًا لدينا، فستصلكِ رسالة إعادة التعيين."
                  );
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
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="px-4 py-3 rounded-xl border focus:outline-none text-right"
                style={{
                  borderColor: "#E5E7EB",
                  fontFamily: "var(--font-tajawal)",
                  color: "#2C2C2C",
                }}
              />
            </div>

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
              {loading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
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
