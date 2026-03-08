function PulseCard() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="h-8 w-8 animate-pulse rounded-full bg-[#D6EAF0]" />
      <div className="mt-4 h-8 w-20 animate-pulse rounded bg-[#E7DDD2]" />
      <div className="mt-2 h-4 w-28 animate-pulse rounded bg-[#F0EBE3]" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="h-7 w-40 animate-pulse rounded bg-[#E7DDD2]" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <PulseCard />
        <PulseCard />
        <PulseCard />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
    </div>
  );
}
