"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import MuznLogo from "@/components/MuznLogo";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error");
  const errorCode = searchParams.get("code");
  const registered = searchParams.get("registered") === "1";
  const resetSuccess = searchParams.get("reset") === "1";
  const verified = searchParams.get("verified") === "1";
  const invalidToken = searchParams.get("error") === "invalid_token";
  const email = searchParams.get("email") || "";
  const showEmailNotVerified = hasError === "CredentialsSignin" && errorCode === "EMAIL_NOT_VERIFIED";
  const resendTargetEmail = resendEmail || email;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#F5F0E8" }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl bg-white p-6 shadow-lg sm:p-8"
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

          {hasError && !showEmailNotVerified && !invalidToken && (
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

          {showEmailNotVerified && (
            <div
              className="mb-4 rounded-xl p-3 text-center text-sm"
              style={{
                background: "#FEFCE8",
                color: "#A16207",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              <p>البريد الإلكتروني غير مُفعّل. تحققي من بريدكِ الوارد.</p>
              {resendTargetEmail ? (
                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={async () => {
                    setResendLoading(true);
                    setResendMessage(null);
                    try {
                      const res = await fetch("/api/auth/resend-verification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: resendTargetEmail }),
                      });
                      const data = await res.json().catch(() => null);
                      setResendMessage(
                        data?.message ||
                          "إذا كان الحساب بحاجة إلى تفعيل، فسنرسل رسالة جديدة إلى بريدكِ."
                      );
                    } catch {
                      setResendMessage(
                        "إذا كان الحساب بحاجة إلى تفعيل، فسنرسل رسالة جديدة إلى بريدكِ."
                      );
                    } finally {
                      setResendLoading(false);
                    }
                  }}
                  className="mt-2 font-medium underline underline-offset-2"
                  style={{ color: "#1B6B7A" }}
                >
                  {resendLoading ? "جارٍ إعادة الإرسال..." : "إعادة إرسال رابط التفعيل"}
                </button>
              ) : null}
            </div>
          )}

          {registered && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#ECFDF5",
                color: "#047857",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              تم إنشاء حسابكِ بنجاح. أرسلنا رابط التفعيل إلى بريدكِ الإلكتروني.
            </div>
          )}

          {verified && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#ECFDF5",
                color: "#047857",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              تم تفعيل حسابكِ بنجاح. يمكنكِ تسجيل الدخول الآن.
            </div>
          )}

          {invalidToken && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              رابط التفعيل غير صالح أو منتهي الصلاحية.
            </div>
          )}

          {resetSuccess && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#ECFDF5",
                color: "#047857",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              تم تحديث كلمة المرور بنجاح. سجّلي الدخول بكلمة المرور الجديدة.
            </div>
          )}

          {formError && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              <p>{formError}</p>
              {formError === "البريد الإلكتروني غير مُفعّل. تحققي من بريدكِ الوارد." && resendTargetEmail ? (
                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={async () => {
                    setResendLoading(true);
                    setResendMessage(null);
                    try {
                      const res = await fetch("/api/auth/resend-verification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: resendTargetEmail }),
                      });
                      const data = await res.json().catch(() => null);
                      setResendMessage(
                        data?.message ||
                          "إذا كان الحساب بحاجة إلى تفعيل، فسنرسل رسالة جديدة إلى بريدكِ."
                      );
                    } catch {
                      setResendMessage(
                        "إذا كان الحساب بحاجة إلى تفعيل، فسنرسل رسالة جديدة إلى بريدكِ."
                      );
                    } finally {
                      setResendLoading(false);
                    }
                  }}
                  className="mt-2 font-medium underline underline-offset-2"
                  style={{ color: "#1B6B7A" }}
                >
                  {resendLoading ? "جارٍ إعادة الإرسال..." : "إعادة إرسال رابط التفعيل"}
                </button>
              ) : null}
            </div>
          )}

          {resendMessage && (
            <div
              className="mb-4 p-3 rounded-xl text-center text-sm"
              style={{
                background: "#EFF6FF",
                color: "#1D4ED8",
                fontFamily: "var(--font-tajawal)",
              }}
            >
              {resendMessage}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setFormError(null);
              try {
                const form = new FormData(e.currentTarget);
                const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

                const submittedEmail = String(form.get("email") || "").trim().toLowerCase();
                setResendEmail(submittedEmail);

                const result = await signIn("credentials", {
                  email: submittedEmail,
                  password: form.get("password"),
                  callbackUrl,
                  redirect: false,
                });

                if (result?.error) {
                  if (result.code === "EMAIL_NOT_VERIFIED") {
                    setFormError("البريد الإلكتروني غير مُفعّل. تحققي من بريدكِ الوارد.");
                  } else {
                    setFormError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
                  }
                  setLoading(false);
                  return;
                }

                if (!result?.ok) {
                  setFormError(
                    result?.status === 429
                      ? "تم تجاوز عدد محاولات تسجيل الدخول. يرجى المحاولة بعد قليل."
                      : "تعذر تسجيل الدخول الآن، يرجى المحاولة مجددًا."
                  );
                  setLoading(false);
                  return;
                }

                const target = result?.url || callbackUrl;
                if (typeof window !== "undefined") {
                  window.location.assign(target);
                } else {
                  router.replace(target);
                }
              } catch {
                setFormError("تعذر تسجيل الدخول الآن، يرجى المحاولة مجددًا.");
                setLoading(false);
              }
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                البريد الإلكتروني
              </label>
              <input
                name="email"
                id="email"
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
                htmlFor="password"
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}
              >
                كلمة المرور
              </label>
              <input
                name="password"
                id="password"
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

            <div className="text-sm text-left -mt-1">
              <Link
                href="/forgot-password"
                className="hover:underline"
                aria-label="الانتقال إلى صفحة استعادة كلمة المرور"
                style={{ color: "#1B6B7A", fontFamily: "var(--font-tajawal)" }}
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 min-h-11 w-full rounded-xl py-3 font-medium text-white transition-all duration-200 disabled:opacity-70"
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
              aria-label="الانتقال إلى صفحة إنشاء حساب"
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
            aria-label="العودة إلى الصفحة الرئيسية"
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
