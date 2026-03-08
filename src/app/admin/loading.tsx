export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-56 animate-pulse rounded bg-[#E7DDD2]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-[#E7DDD2] bg-white p-6 shadow-sm">
            <div className="h-4 w-28 animate-pulse rounded bg-[#F0EBE3]" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded bg-[#D6EAF0]" />
          </div>
        ))}
      </div>
    </div>
  );
}
