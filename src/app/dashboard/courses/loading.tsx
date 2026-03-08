export default function DashboardCoursesLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="h-9 w-36 animate-pulse rounded bg-[#E7DDD2]" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="h-36 animate-pulse bg-[#D6EAF0]" />
            <div className="space-y-3 p-5">
              <div className="h-6 w-3/4 animate-pulse rounded bg-[#E7DDD2]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#F0EBE3]" />
              <div className="h-2 w-full animate-pulse rounded bg-[#D6EAF0]" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-[#E7DDD2]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
