"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/AdminUI";
import { courseVisibilityLabels } from "@/lib/admin/mock-data";
import { formatCurrency } from "@/lib/admin/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  visibilityStatus: keyof typeof courseVisibilityLabels;
  totalLessons: number;
  _count: { lessons: number; purchases: number };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="إدارة الدورات"
        description="إضافة وتعديل بيانات الدورات الأساسية وإدارة ظهورها في الموقع واللوحة الداخلية."
        action={<Link href="/admin/courses/new" className="rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white hover:opacity-90">إضافة دورة</Link>}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-sm text-[#7A6555]">جاري تحميل الدورات...</p>
        ) : (
          courses.map((course) => (
            <AdminCard key={course.id} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-amiri text-2xl font-bold text-[#0A2830]">{course.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-[#7A6555]">{course.description}</p>
                </div>
                <StatusBadge label={courseVisibilityLabels[course.visibilityStatus]} tone={course.visibilityStatus === "PUBLISHED" ? "success" : "warning"} />
              </div>

              <div className="mt-5 grid gap-3 text-sm text-[#6E5B4D] sm:grid-cols-2">
                <div>السعر: <span className="font-semibold text-[#0A2830]">{formatCurrency(course.price)}</span></div>
                <div>الدروس: <span className="font-semibold text-[#0A2830]">{course._count.lessons || course.totalLessons}</span></div>
                <div>الطلبات: <span className="font-semibold text-[#0A2830]">{course._count.purchases}</span></div>
                <div>الحالة العامة: <span className="font-semibold text-[#0A2830]">{course.isActive ? "مفعّلة" : "مخفية"}</span></div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link href={`/admin/courses/${course.id}`} className="rounded-2xl border border-[#D4AF37]/40 px-4 py-3 text-sm font-medium text-[#9E7E2C] hover:bg-[#FFF8E6]">تعديل</Link>
              </div>
            </AdminCard>
          ))
        )}
      </div>
    </div>
  );
}
