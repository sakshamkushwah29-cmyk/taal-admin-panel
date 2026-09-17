import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailsSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 text-sm">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-transparent border border-gray-200 shadow-sm rounded-md p-4 space-y-4"
        >
          <Skeleton className="h-4 w-32 bg-muted" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="space-y-1.5">
                <Skeleton className="h-3 w-20 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
