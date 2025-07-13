// app/(partner)/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-64" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48 mt-4" />
          </Card>
        ))}
      </div>

      {/* Referral Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4 sm:p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-[200px] sm:h-[300px] w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
