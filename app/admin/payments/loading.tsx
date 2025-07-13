import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-8 w-[120px] my-4" />
      <div className="w-full flex items-center justify-between">
        <Skeleton className="h-8 w-[240px]" />
        <Skeleton className="h-8 w-[60px]" />
      </div>
      {/* Header Row */}
      <Skeleton className="h-12 w-full" />

      {/* Data Rows */}
      <div className="w-full flex flex-col gap-y-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="w-full h-8" />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-end gap-2 mt-4">
        <Skeleton className="h-8 w-[80px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
    </div>
  );
}
