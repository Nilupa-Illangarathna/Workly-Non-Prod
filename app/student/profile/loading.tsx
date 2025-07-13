import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <UserInfo />
      <div className="lg:col-span-2 space-y-6">
        <KYC />
        <Payments />
      </div>
    </div>
  );
}

function UserInfo() {
  return (
    <Card className="border-2 border-muted h-fit">
      <CardHeader className="pb-4 space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function KYC() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 md:col-span-2" />
    </div>
  );
}

function Payments() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Skeleton className="h-10 w-full md:w-48" />
        <Skeleton className="h-10 w-full md:w-48" />
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
