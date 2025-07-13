import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Loading */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-6 w-[120px]" />
      </div>

      {/* Cards Loading */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 md:col-span-2" />
        <Skeleton className="h-32" />
      </div>

      {/* Table Loading */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
