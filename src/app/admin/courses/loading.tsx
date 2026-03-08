export default function AdminCoursesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-56 animate-pulse rounded bg-[#E7DDD2]" />
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-[#E7DDD2] bg-white p-6 shadow-sm">
            <div className="h-7 w-2/3 animate-pulse rounded bg-[#D6EAF0]" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#F0EBE3]" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-[#F0EBE3]" />
            <div className="mt-6 h-10 w-24 animate-pulse rounded-xl bg-[#E7DDD2]" />
          </div>
        ))}
      </div>
    </div>
  );
}
