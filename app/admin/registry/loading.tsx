import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-48 mb-4" />

      {/* Tabs and Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-full sm:w-48" />
      </div>

      {/* Table Skeleton */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-2 sm:grid-cols-7 gap-4 p-2">
                {[...Array(7)].map((_, j) => (
                  <Skeleton key={j} className="h-4" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
