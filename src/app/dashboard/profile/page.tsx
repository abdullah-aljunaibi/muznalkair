"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const profileSchema = z
  .object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) return false;
      return true;
    },
    { message: "يرجى إدخال كلمة المرور الحالية", path: ["currentPassword"] }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmNewPassword)
        return false;
      return true;
    },
    { message: "كلمتا المرور الجديدتان غير متطابقتين", path: ["confirmNewPassword"] }
  );

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "حدث خطأ أثناء الحفظ");
      } else {
        toast.success("تم حفظ التغييرات بنجاح");
        await update({ name: data.name });
      }
    } catch {
      toast.error("حدث خطأ ما، يرجى المحاولة مجددًا");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError: boolean) => ({
    borderColor: hasError ? "#ef4444" : "#E5E7EB",
    fontFamily: "var(--font-tajawal)",
    color: "#2C2C2C",
  });

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-amiri)", color: "#1B6B7A" }}
        >
          ملفي الشخصي
        </h1>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
        >
          تحديث معلوماتك الشخصية
        </p>
      </div>

      {/* Avatar */}
      <div
        className="bg-white rounded-2xl p-6 mb-6 flex items-center gap-4"
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{ background: "#1B6B7A", color: "#D4AF37", fontFamily: "var(--font-amiri)" }}
        >
          {session?.user?.name?.charAt(0) || "م"}
        </div>
        <div>
          <p
            className="font-bold text-lg"
            style={{ fontFamily: "var(--font-amiri)", color: "#2C2C2C" }}
          >
            {session?.user?.name}
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-tajawal)", color: "#6B7280" }}
          >
            {session?.user?.email}
          </p>
        </div>
      </div>

      {/* Form */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Name */}
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
              className="px-4 py-3 rounded-xl border focus:outline-none text-right"
              style={inputStyle(!!errors.name)}
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
              className="px-4 py-3 rounded-xl border focus:outline-none text-right"
              style={inputStyle(!!errors.email)}
            />
            {errors.email && (
              <span className="text-xs text-red-500" style={{ fontFamily: "var(--font-tajawal)" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password toggle */}
          <div>
            <button
              type="button"
              className="text-sm font-medium hover:underline"
              style={{ fontFamily: "var(--font-tajawal)", color: "#1B6B7A" }}
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields ? "إلغاء تغيير كلمة المرور" : "تغيير كلمة المرور"}
            </button>
          </div>

          {showPasswordFields && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}>
                  كلمة المرور الحالية
                </label>
                <input
                  {...register("currentPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="px-4 py-3 rounded-xl border focus:outline-none text-right"
                  style={inputStyle(!!errors.currentPassword)}
                />
                {errors.currentPassword && (
                  <span className="text-xs text-red-500" style={{ fontFamily: "var(--font-tajawal)" }}>
                    {errors.currentPassword.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}>
                  كلمة المرور الجديدة
                </label>
                <input
                  {...register("newPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="px-4 py-3 rounded-xl border focus:outline-none text-right"
                  style={inputStyle(!!errors.newPassword)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" style={{ fontFamily: "var(--font-tajawal)", color: "#4A5568" }}>
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  {...register("confirmNewPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="px-4 py-3 rounded-xl border focus:outline-none text-right"
                  style={inputStyle(!!errors.confirmNewPassword)}
                />
                {errors.confirmNewPassword && (
                  <span className="text-xs text-red-500" style={{ fontFamily: "var(--font-tajawal)" }}>
                    {errors.confirmNewPassword.message}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-70"
            style={{
              background: loading ? "#3A8D9E" : "#1B6B7A",
              fontFamily: "var(--font-tajawal)",
              fontSize: "1rem",
            }}
          >
            {loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  );
}
