"use server";

import { getPartners } from "@/data/partners";
import { columns } from "./column";
import { DataTable } from "./data-table";

export default async function AdminPartnersPage() {
  const partners = await getPartners();
  const sortedPartners = partners.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-bold my-4">Partners Management</h1>
      <DataTable columns={columns} data={sortedPartners} />
    </div>
  );
}
