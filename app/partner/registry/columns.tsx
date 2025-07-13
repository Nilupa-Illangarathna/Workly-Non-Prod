"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PromoteToPartner } from "@/components/admin/promote-to-partner";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import PaymentHistoryDialog from "@/components/partners/student-payment-history";
// import { PaymentStatus } from "@/components/partners/payment-status";

export type ReferralUser = {
  currentPartnerLevel: number;
  currentPartnerCommission: string;
  level: number;
  totalpaid: number;
  firstname: string;
  lastname: string;
  district: string;
  phone: string;
  whatsapp: string;
  email: string;
  role: string;
  id: string;
  name: string;
  sponsor_worklyid: string;
  sponsor_firstname: string;
  sponsor_lastname: string;
  commissionrate: string;
};

export const columns: ColumnDef<ReferralUser>[] = [
  {
    accessorKey: "id",
    header: "No.",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "createdat",
    header: ({ column }) => (
      <div className="w-full flex justify-between items-center ml-1">
        <p>Reg. Date</p>
        <Button
          variant="ghost"
          className="hover:bg-accent/10 hover:text-white"
          size={"icon"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => new Date(row.getValue("createdat")).toLocaleDateString(),
  },
  {
    accessorKey: "worklyid",
    header: "Workly ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="w-full flex justify-between items-center ml-1">
        <p>Name</p>
        <Button
          variant="ghost"
          className="hover:bg-accent/10 hover:text-white"
          size={"icon"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "sponsor",
    header: ({ column }) => (
      <div className="w-full flex justify-between items-center ml-1">
        <p>Sponsor</p>
        <Button
          variant="ghost"
          className="hover:bg-accent/10 hover:text-white"
          size={"icon"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "district",
    header: ({ column }) => (
      <div className="w-full flex justify-between items-center ml-1">
        <p>District</p>
        <Button
          variant="ghost"
          className="hover:bg-accent/10 hover:text-white"
          size={"icon"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <p className="capitalize">{row.original.district}</p>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "whatsapp",
    header: "Whatsapp",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "commissionrate",
    header: ({ column }) => (
      <div className="w-full flex justify-between items-center ml-1">
        <p>SLC</p>
        <Button
          variant="ghost"
          className="hover:bg-accent/10 hover:text-white"
          size={"icon"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      if (row.getValue("commissionrate") === null) {
        return <p>0</p>;
      } else {
        return <p>{row.original.commissionrate}</p>;
      }
    },
  },
  {
    accessorKey: "role",
    header: "User Type",
    cell: ({ row }) => <p className="capitalize">{row.original.role}</p>,
  },
  {
    accessorKey: "totalpaid",
    header: ({ column }) => (
      <div className="w-full flex justify-between items-center ml-1">
        <p>Stu. Paid</p>
        <Button
          variant="ghost"
          className="hover:bg-accent/10 hover:text-white"
          size={"icon"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <>
          {row.original.role === "student" &&
            row.original.level === row.original.currentPartnerLevel + 1 &&
            row.original.level !== 5 && (
              <PromoteToPartner
                userId={row.original.id}
                type="text"
                label="Partner"
                level={Number(row.original.currentPartnerLevel) + 1}
                partnerCommission={row.original.currentPartnerCommission}
              />
            )}
          <PaymentHistoryDialog userId={row.original.id} />
        </>
      );
    },
  },
];
