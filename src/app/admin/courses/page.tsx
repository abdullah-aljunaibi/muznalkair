"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  price: number;
  isActive: boolean;
  _count: { lessons: number; purchases: number };
}

export default function AdminCoursesPage() {
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
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
        >
          إدارة الدورات
        </h1>
        <Link
          href="/admin/courses/new"
          className="px-6 py-2.5 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: "#D4AF37" }}
        >
          إضافة دورة جديدة
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">جاري التحميل...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">لا توجد دورات بعد</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100" style={{ backgroundColor: "#0A2830" }}>
                <th className="text-right text-white px-6 py-4 font-medium">العنوان</th>
                <th className="text-right text-white px-6 py-4 font-medium">السعر</th>
                <th className="text-right text-white px-6 py-4 font-medium">الدروس</th>
                <th className="text-right text-white px-6 py-4 font-medium">المشتريات</th>
                <th className="text-right text-white px-6 py-4 font-medium">الحالة</th>
                <th className="text-right text-white px-6 py-4 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium">{course.title}</td>
                  <td className="px-6 py-4">{course.price} ر.ع</td>
                  <td className="px-6 py-4">{course._count.lessons}</td>
                  <td className="px-6 py-4">{course._count.purchases}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {course.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
                        style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
                      >
                        تعديل
                      </Link>
                      <Link
                        href={`/admin/courses/${course.id}/lessons`}
                        className="text-sm px-3 py-1 rounded text-white"
                        style={{ backgroundColor: "#0A2830" }}
                      >
                        الدروس
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
