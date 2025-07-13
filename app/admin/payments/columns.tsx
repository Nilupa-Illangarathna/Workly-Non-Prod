"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { PendingPayment } from "@/types";
import { Download, SquareArrowOutUpRight } from "lucide-react";
import PaymentApprove from "@/components/admin/payment-approve";
import PaymentReject from "@/components/admin/payment-reject";
import { EditPaymentDialog } from "@/components/admin/edit-payment";

export const columns: ColumnDef<PendingPayment>[] = [
  {
    accessorKey: "createdat",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("createdat")).toLocaleDateString(),
  },
  {
    accessorKey: "user.worklyid",
    header: "Workly ID",
  },
  {
    accessorKey: "user.name",
    header: "Name",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "user.phone",
    header: "Phone",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `LKR ${row.getValue("amount")}`,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("type")}</span>
    ),
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original.id;
      const userId = row.original.user.id;

      return (
        <div className="flex gap-2">
          <EditPaymentDialog
            paymentId={payment}
            userId={userId}
            currentAmount={Number(row.original.amount)}
          />
          <PaymentApprove paymentId={payment} userid={userId} />
          <PaymentReject paymentId={payment} />
        </div>
      );
    },
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
