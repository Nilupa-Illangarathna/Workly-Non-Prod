import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPendingKYCs } from "@/data/admin";
import { columns } from "./columns";
import { DataTable } from "@/components/admin/data-table";

export default async function AdminKYCPage() {
  const kycRequests = await getPendingKYCs();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Pending KYC Approvals</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <DataTable
          data={kycRequests}
          columns={columns}
          tableTitle="Pending KYC"
        />
      </Suspense>
    </div>
  );
}
