import { Skeleton } from '@/components/ui/skeleton'

/* The shape of the report that is loading, faded out behind the progress card.
   Decorative only — the progress card carries the announcement. */
export function ReportSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-6 opacity-55">
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-3 w-30" />
        <Skeleton className="h-6 w-65" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="border-border bg-card flex h-42 flex-col gap-4 rounded-md border p-5"
          >
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-10 w-2/5" />
            <Skeleton className="h-1.5" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="border-border bg-card h-75 rounded-md border" />
        ))}
      </div>
    </div>
  )
}
