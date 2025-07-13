"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type WithdrawalHistory = {
  createdAt: string;
  id: string;
  amount: string;
  method_id: string;
  status: "approved" | "pending" | "rejected";
  paymentMethod: {
    number: string | null;
    id: string;
    bank: string | null;
    type: string;
    email: string | null;
    branch: string | null;
  };
};

export const columns: ColumnDef<WithdrawalHistory>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">No.</div>,
    cell: ({ row }) => {
      const index = row.index + 1;
      return <div className="text-center">{index}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="w-full flex items-center justify-between">
        <span>Date</span>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-accent/10 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    accessorKey: "paymentMethod.type",
    header: ({ column }) => (
      <div className="w-full flex items-center justify-between">
        <span>Method</span>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-accent/10 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.original.paymentMethod.type}</div>
    ),
  },
  {
    accessorKey: "details",
    header: "Account Details",
    cell: ({ row }) => {
      const method = row.original.paymentMethod;
      return method.type === "bank" ? (
        <div className="space-y-1">
          <p className="font-medium">{method.number}</p>
          <p className="text-sm">{`${method.bank} - ${method.branch}`}</p>
        </div>
      ) : (
        <p>{method.email}</p>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="w-full flex items-center justify-between">
        <span>Amount</span>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-accent/10 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div>LKR {Number(row.getValue("amount")).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="w-full flex items-center justify-between">
        <span>Status</span>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-accent/10 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "approved"
            ? "default"
            : row.getValue("status") === "rejected"
            ? "destructive"
            : "outline"
        }>
        {row.getValue("status")}
      </Badge>
    ),
  },
];
