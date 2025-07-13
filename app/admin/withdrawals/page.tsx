"use server";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminWithdrawals } from "@/data/admin";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";

export default async function AdminWithdrawalsPage() {
  const rawData = await getAdminWithdrawals();
  const data = rawData.map((item) => ({
    ...item,
    partner: {
      ...item.partner,
      name: item.partner.name as string, // Assuming name is always a string
    },
  }));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Pending Withdrawal Requests</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <DataTable
          columns={columns}
          data={data}
          tableTitle="Pending Withdrawals"
        />
      </Suspense>
    </div>
  );
}
