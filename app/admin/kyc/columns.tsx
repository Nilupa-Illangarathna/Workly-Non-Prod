"use client";

import { ColumnDef } from "@tanstack/react-table";
import { KYC } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { approveKYC, rejectKYC } from "@/actions/admin/kyc";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Download, SquareArrowOutUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const columns: ColumnDef<KYC>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) =>
      `${row.original.user.firstname} ${row.original.user.lastname}`,
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <p className="capitalize">{row.original.type}</p>,
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
    accessorKey: "idFront",
    header: "ID Front",
    cell: ({ row }) => (
      <DocumentActions document={row.original.idFront} label="Front" />
    ),
  },
  {
    accessorKey: "idBack",
    header: "ID Back",
    cell: ({ row }) => (
      <DocumentActions document={row.original.idBack} label="Back" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={async () => {
            try {
              await approveKYC(row.original.id);
              toast.success("KYC approved");
            } catch {
              toast.error("Approval failed");
            }
          }}
          disabled={row.original.status !== "pending"}>
          Approve
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            try {
              await rejectKYC(row.original.id);
              toast.success("KYC rejected");
            } catch {
              toast.error("Rejection failed");
            }
          }}
          disabled={row.original.status !== "pending"}>
          Reject
        </Button>
      </div>
    ),
  },
];

const DocumentActions = ({
  document: doc,
}: {
  document: string;
  label: string;
}) => {
  const url = getKYCDocumentUrl(doc);

  return (
    <div className="flex items-center gap-x-3">
      <Link
        href={url}
        target="_blank"
        className={buttonVariants({ variant: "outline", size: "icon" })}>
        <SquareArrowOutUpRight />
      </Link>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => downloadFile(url as string)}>
        <Download />
      </Button>
    </div>
  );
};

const getKYCDocumentUrl = (path: string) => {
  return supabase.storage.from("kyc-documents").getPublicUrl(path).data
    .publicUrl;
};

const downloadFile = async (filename: string) => {
  const { data, error } = await supabase.storage
    .from("kyc-documents")
    .download(filename);

  if (error) {
    return;
  }

  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.split("/").pop() || "kyc-documents";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
