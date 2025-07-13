import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-12 w-32" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-2 text-right">
          <Skeleton className="h-6 w-48 ml-auto" />
          <Skeleton className="h-4 w-64 ml-auto" />
          <Skeleton className="h-4 w-64 ml-auto" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64 ml-auto" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
