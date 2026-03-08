import Link from "next/link";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="font-amiri text-4xl font-bold text-[#0A2830]">{title}</h1>
        {description ? <p className="mt-2 text-sm text-[#6E5B4D]">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-[#E7DDD2] bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

export function KPI({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <AdminCard>
      <div className="text-sm text-[#7A6555]">{label}</div>
      <div className="mt-3 text-3xl font-bold text-[#0A2830]">{value}</div>
      {hint ? <div className="mt-2 text-xs text-[#9A8675]">{hint}</div> : null}
    </AdminCard>
  );
}

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: "success" | "warning" | "danger" | "neutral" | "info" }) {
  const toneClass = {
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    neutral: "bg-stone-100 text-stone-700 border-stone-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  }[tone];

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${toneClass}`}>{label}</span>;
}

export function AdminButton({ href, children, variant = "primary" }: { href?: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  const className =
    variant === "primary"
      ? "rounded-2xl bg-[#0A2830] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
      : "rounded-2xl border border-[#D4AF37]/40 bg-white px-5 py-3 text-sm font-medium text-[#9E7E2C] transition hover:bg-[#FFF8E6]";

  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <button className={className}>{children}</button>;
}
