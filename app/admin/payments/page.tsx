import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPendingPayments } from "@/data/admin";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";

export default async function AdminPaymentsPage() {
  const payments = await getPendingPayments();

  return (
    <div className="p-4 space-y-4 h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-bold">Pending Payment Approvals</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <DataTable
          data={payments}
          columns={columns}
          tableTitle="Pending Payments"
        />
      </Suspense>
    </div>
  );
}
