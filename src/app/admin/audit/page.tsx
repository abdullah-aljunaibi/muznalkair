import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { formatDate } from "@/lib/admin/utils";

export default async function AdminAuditPage() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    redirect("/login");
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <AdminPageHeader
        title="سجل التدقيق"
        description="سجل آخر الإجراءات الحساسة: تغييرات المدفوعات ومعالجة Webhook الدفع."
      />

      <AdminCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] text-sm">
            <thead className="bg-[#0A2830] text-white">
              <tr>
                <th className="px-5 py-4 text-right font-medium">الوقت</th>
                <th className="px-5 py-4 text-right font-medium">الجهة</th>
                <th className="px-5 py-4 text-right font-medium">الإجراء</th>
                <th className="px-5 py-4 text-right font-medium">الكيان</th>
                <th className="px-5 py-4 text-right font-medium">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[#F1E7DC] align-top">
                  <td className="px-5 py-4 whitespace-nowrap text-[#7A6555]">{formatDate(log.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#0A2830]">{log.actorName}</div>
                    <div className="text-xs text-[#7A6555]">{log.source}</div>
                  </td>
                  <td className="px-5 py-4 font-medium text-[#0A2830]">{log.action}</td>
                  <td className="px-5 py-4 text-[#7A6555]">{log.entityType} • {log.entityId}</td>
                  <td className="px-5 py-4">
                    <pre className="max-w-[420px] overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-[#F9F5F0] p-3 text-xs text-[#6B5A4E]">{JSON.stringify(log.details, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
