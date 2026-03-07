"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  courseCount: number;
  totalSpent: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchStudents = (query: string) => {
    setLoading(true);
    const params = query ? `?search=${encodeURIComponent(query)}` : "";
    fetch(`/api/admin/students${params}`)
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents("");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(search);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ar-OM", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        إدارة الطالبات
      </h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو البريد..."
          className="flex-1 max-w-md px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
          style={{ focusRingColor: "#D4AF37" } as React.CSSProperties}
        />
        <button
          type="submit"
          className="px-6 py-2.5 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: "#0A2830" }}
        >
          بحث
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">جاري التحميل...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">لا توجد طالبات</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#0A2830" }}>
                <th className="text-right text-white px-6 py-4 font-medium">الاسم</th>
                <th className="text-right text-white px-6 py-4 font-medium">البريد الإلكتروني</th>
                <th className="text-right text-white px-6 py-4 font-medium">تاريخ الانضمام</th>
                <th className="text-right text-white px-6 py-4 font-medium">عدد الدورات</th>
                <th className="text-right text-white px-6 py-4 font-medium">إجمالي الإنفاق</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => router.push(`/admin/students/${student.id}`)}
                  className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(student.createdAt)}</td>
                  <td className="px-6 py-4">{student.courseCount}</td>
                  <td className="px-6 py-4">{student.totalSpent.toFixed(3)} ر.ع</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
