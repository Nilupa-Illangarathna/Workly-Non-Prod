"use server";

import { columns } from "./columns";
import { DataTable } from "@/components/admin/data-table";
import { getPendingUsers } from "@/data/admin";

export default async function DemoPage() {
  const data = await getPendingUsers();
  const sortedData = data.sort((a, b) => {
    return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
  });

  return (
    <div className="container mx-auto py-4">
      <div className="space-y-0.5 mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Pending Approvals</h2>
        <p className="text-muted-foreground">
          Approve new registered users and partners
        </p>
      </div>
      <DataTable
        columns={columns}
        data={sortedData}
        tableTitle="Pending Approvals"
      />
    </div>
  );
}
