"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

export type EarningsHistory = {
  id: string;
  worklyid: string;
  name: string;
  amount: string;
  createdAt: string;
  level: number;
};

export const columns: ColumnDef<EarningsHistory>[] = [
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
      <div className="w-full flex items-center justify-between ml-1">
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
    cell: ({ row }) => format(row.getValue("createdAt"), "dd MMM yyyy"),
  },
  {
    accessorKey: "worklyid",
    header: ({ column }) => (
      <div className="w-full flex items-center justify-between ml-1">
        <span>Workly ID</span>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-accent/10 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="w-full flex items-center justify-between ml-1">
        <span>Full Name</span>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-accent/10 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <div className="w-full flex items-center justify-between ml-1">
        <span>Level</span>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-accent/10 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const level = row.getValue("level") as number;
      const levels = [
        "top manager",
        "Sub Company",
        "Sub 1",
        "Sub 2",
        "Sub 3",
        "Sub 4",
      ];
      return <div className="text-center">{levels[level]}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="w-full flex items-center justify-between ml-1">
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
      <div className="text-right">
        LKR {Number(row.getValue("amount")).toLocaleString()}
      </div>
    ),
  },
];
