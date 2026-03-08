function SkeletonRow() {
  return (
    <tr className="border-b border-[#F1E7DC]">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 w-24 animate-pulse rounded bg-[#F0EBE3]" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminPaymentsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-56 animate-pulse rounded bg-[#E7DDD2]" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-[#E7DDD2] bg-white p-6 shadow-sm">
            <div className="h-4 w-20 animate-pulse rounded bg-[#F0EBE3]" />
            <div className="mt-4 h-8 w-24 animate-pulse rounded bg-[#D6EAF0]" />
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-3xl border border-[#E7DDD2] bg-white shadow-sm">
        <table className="min-w-[900px] text-sm">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
