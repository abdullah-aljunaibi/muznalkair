"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalStudents: number;
  activeCourses: number;
  totalRevenue: number;
  pendingWhatsapp: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "إجمالي الطالبات", value: stats.totalStudents, color: "#0A2830" },
        { label: "الدورات النشطة", value: stats.activeCourses, color: "#D4AF37" },
        {
          label: "الإيرادات (ر.ع)",
          value: stats.totalRevenue.toFixed(3),
          color: "#0A2830",
        },
        {
          label: "تحويلات واتساب معلقة",
          value: stats.pendingWhatsapp,
          color: "#c0392b",
        },
      ]
    : [];

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: "var(--font-amiri)", color: "#0A2830" }}
      >
        لوحة التحكم
      </h1>

      {loading ? (
        <p className="text-gray-500">جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <p className="text-sm text-gray-500 mb-2">{card.label}</p>
              <p
                className="text-3xl font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
