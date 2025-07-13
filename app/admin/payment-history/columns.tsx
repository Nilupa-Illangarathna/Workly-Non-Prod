"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PaymentHistory } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpDown, Download, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export const columns: ColumnDef<PaymentHistory>[] = [
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
    accessorKey: "worklyid",
    header: "Workly ID",
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
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "totalamount",
    header: "Total Amount",
  },
  {
    accessorKey: "type",
    header: "Payment Method",
  },
  {
    accessorKey: "image",
    header: "Payment Slip",
    cell: ({ row }) => {
      const fileUrl = row.getValue("image");
      return fileUrl ? (
        <div className="flex items-center gap-x-3">
          <Link
            href={getPaymentSlipUrl(fileUrl as string)}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "icon" })}>
            <SquareArrowOutUpRight />
          </Link>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => downloadFile(fileUrl as string)}>
            <Download />
          </Button>
        </div>
      ) : (
        "No File"
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "approved" ? "default" : "destructive"
        }
        className={
          row.getValue("status") === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : ""
        }>
        {row.getValue("status")}
      </Badge>
    ),
  },
];

const getPaymentSlipUrl = (filename: string) => {
  return supabase.storage.from("payment-slips").getPublicUrl(filename).data
    .publicUrl;
};

const downloadFile = async (filename: string) => {
  const { data, error } = await supabase.storage
    .from("payment-slips")
    .download(filename);

  if (error) {
    toast.error("Download failed");
    return;
  }

  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.split("/").pop() || "payment-slip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
