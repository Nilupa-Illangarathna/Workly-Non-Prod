"use server";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getStudents } from "@/data/admin";

export type Student = {
  id: string;
  createdAt: Date;
  loginId: string;
  worklyId: string;
  name: string;
  email: string;
  nic: string;
  courseFee: number;
  amountPaid: number;
  remainingBalance: number;
  regMethod: "Direct" | "Referral";
  level: number | null;
  kycStatus: string | null;
};

export default async function StudentsTable() {
  const students = await getStudents();
  const sortedStudents = students.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-bold my-4">Students List</h1>
      <DataTable columns={columns} data={sortedStudents} />
    </div>
  );
}
