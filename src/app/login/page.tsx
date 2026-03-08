"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MuznLogo from "@/components/MuznLogo";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

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
            className="text-xl font-bold mb-6 text-center"
            style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
          >
            تسجيل الدخول
          </h2>

          {(error || callbackError) && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              البريد الإلكتروني أو كلمة المرور غير صحيحة
            </div>
          )}

          <form
            action="/api/auth/callback/credentials"
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setError("");

              const formData = new FormData(e.currentTarget);
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;

              if (!email || !password || password.length < 6) {
                setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
                setLoading(false);
                return;
              }

              // Use fetch to call signIn endpoint directly
              fetch("/api/auth/csrf")
                .then((r) => r.json())
                .then(({ csrfToken }) => {
                  return fetch("/api/auth/callback/credentials", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                      email,
                      password,
                      csrfToken,
                      callbackUrl: "/dashboard",
                      json: "true",
                    }),
                    redirect: "follow",
                    credentials: "include",
                  });
                })
                .then((res) => {
                  if (res.url && res.url.includes("/dashboard")) {
                    window.location.href = "/dashboard";
                  } else if (res.url && res.url.includes("error")) {
                    setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
                    setLoading(false);
                  } else {
                    // Try to go to dashboard anyway - session may be set
                    return res.json().catch(() => null);
                  }
                })
                .then((data) => {
                  if (data && data.url) {
                    window.location.href = data.url;
                  } else if (data === null) {
                    // Already handled above
                  } else {
                    window.location.href = "/dashboard";
                  }
                })
                .catch(() => {
                  setError("حدث خطأ ما، يرجى المحاولة مجددًا");
                  setLoading(false);
                });
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                البريد الإلكتروني
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="example@email.com"
                className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-right"
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
                كلمة المرور
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
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
              {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
