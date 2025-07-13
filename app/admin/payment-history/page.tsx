import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { getPaymentHistory } from "@/data/admin";

export default async function PaymentHistoryPage() {
  const payments = await getPaymentHistory();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Payment History</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <DataTable
          columns={columns}
          data={payments}
          tableTitle="Payment History"
        />
      </Suspense>
    </div>
  );
}
