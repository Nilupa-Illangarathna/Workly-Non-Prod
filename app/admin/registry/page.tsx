"use server";

import { getAllUsersWithLevels } from "@/data/admin";
import { auth } from "@/auth";
import AdminRegistryTable from "@/components/admin/registry-table";
import { cache } from "react";

const getCachedUsers = cache(getAllUsersWithLevels);

export default async function AdminRegistryPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return <div className="p-6">Unauthorized</div>;
  }

  const users = await getCachedUsers();

  return (
    <div className="w-full space-y-4 py-4 sm:py-4">
      <h1 className="text-xl sm:text-2xl font-bold">Admin Registry</h1>
      <AdminRegistryTable data={users} />
    </div>
  );
}
