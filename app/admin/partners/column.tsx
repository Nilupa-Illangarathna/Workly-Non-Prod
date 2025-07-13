"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateStudentPayments from "@/components/admin/update-student-payment";
import ProfileViewBtn from "@/components/admin/profile-view-button";

export type Partner = {
  id: string;
  createdAt: Date;
  loginId: string;
  worklyId: string;
  name: string;
  email: string;
  level: number;
  commission: string;
  amountPaid: string;
  totalAmount: string;
  totalReferrals: number;
};

export const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Reg Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
  },
  {
    accessorKey: "loginId",
    header: "Login ID",
  },
  {
    accessorKey: "worklyId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Workly ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const levels = [
        "Top Manager",
        "Sub Company",
        "Sub 1",
        "Sub 2",
        "Sub 3",
        "Admin",
      ];
      return levels[row.original.level] || "Unknown";
    },
  },
  {
    accessorKey: "commission",
    header: "Commission",
    cell: ({ row }) => {
      if (Number(row.original.commission) < 100) {
        return `${parseInt(row.original.commission)}%`;
      } else {
        return parseInt(row.original.commission);
      }
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Earnings",
    cell: ({ row }) => parseFloat(row.original.totalAmount).toFixed(2),
  },
  {
    accessorKey: "totalReferrals",
    header: "Total Referrals",
  },
  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => parseFloat(row.original.amountPaid).toFixed(2),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <TooltipProvider key={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <UpdateStudentPayments studentid={row.original.id} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Update Payment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ProfileViewBtn id={row.original.id} />
      </div>
    ),
  },
];
