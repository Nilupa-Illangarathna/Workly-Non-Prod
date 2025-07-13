import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full px-10 h-screen">
      {/* Title Section */}
      <div className="w-full flex items-center justify-between">
        <Skeleton className="h-8 w-[120px]" />
        <Skeleton className="h-6 w-[120px]" />
      </div>

      <div className="w-full h-[70vh] grid grid-cols-2 grid-rows-2 mt-4 gap-8">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
