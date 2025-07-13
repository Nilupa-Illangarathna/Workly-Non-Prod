import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      {/* Progress Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
      </div>

      {/* Events Skeleton */}
      <Skeleton className="h-48" />
    </div>
  );
}
