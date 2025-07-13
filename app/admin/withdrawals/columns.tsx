"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  approveWithdrawal,
  rejectWithdrawal,
} from "@/actions/admin/withdrawals";
import { pendingWithdrawal } from "@/types";
import { ArrowUpDown, Check, X } from "lucide-react";

export const columns: ColumnDef<pendingWithdrawal>[] = [
  {
    accessorKey: "createdAt",
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
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
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
    accessorKey: "partner.totalEarnings",
    header: "Total Earnings",
    cell: ({ row }) =>
      `LKR ${Number(row.original.partner.totalEarnings).toLocaleString()}`,
  },
  {
    accessorKey: "amount",
    header: "Withdrawal Amount",
    cell: ({ row }) => `LKR ${Number(row.original.amount).toLocaleString()}`,
  },
  {
    accessorKey: "paymentMethod.type",
    header: "Method",
    cell: ({ row }) => {
      <p className="capitalize">{row.original.paymentMethod.type}</p>;
    },
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="icon"
          onClick={async () => {
            try {
              await approveWithdrawal(row.original.id);
              toast.success("Withdrawal approved");
            } catch {
              toast.error("Approval failed");
            }
          }}>
          <Check />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={async () => {
            try {
              await rejectWithdrawal(row.original.id);
              toast.success("Withdrawal rejected");
            } catch {
              toast.error("Rejection failed");
            }
          }}>
          <X />
        </Button>
      </div>
    ),
  },
];
