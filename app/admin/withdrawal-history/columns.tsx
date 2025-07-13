"use client";

import { ColumnDef } from "@tanstack/react-table";
import { withdrawalHistory } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<withdrawalHistory>[] = [
  {
    accessorKey: "createdat",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.getValue("createdat")).toLocaleDateString(),
  },
  {
    accessorKey: "partner.worklyid",
    header: "Workly ID",
  },
  {
    accessorKey: "partner.name",
    header: "Name",
  },
  {
    accessorKey: "partner.email",
    header: "Email",
  },
  {
    accessorKey: "partner.phone",
    header: "Phone",
  },
  {
    accessorKey: "paymentMethod.type",
    header: "Method",
    cell: ({ row }) => (
      <p className="capitalize">{row.original.paymentMethod.type}</p>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Method Details",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" size="sm">
            View Method
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Method Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {row.original.paymentMethod.bank ? (
              <>
                <p>
                  <strong>Bank:</strong> {row.original.paymentMethod.bank}
                </p>
                <p>
                  <strong>Account Holder:</strong>{" "}
                  {row.original.paymentMethod.holder}
                </p>
                <p>
                  <strong>Account Number:</strong>{" "}
                  {row.original.paymentMethod.number}
                </p>
                <p>
                  <strong>Branch:</strong> {row.original.paymentMethod.branch}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Email:</strong> {row.original.paymentMethod.email}
                </p>
                <p>
                  <strong>Type:</strong> {row.original.paymentMethod.type}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
