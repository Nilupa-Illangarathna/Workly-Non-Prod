"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download, SquareArrowOutUpRight } from "lucide-react";

import { ArrowUpDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import ApproveUser from "@/components/admin/approve-user";
import RejectUser from "@/components/admin/reject-user";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import ProfileViewBtn from "@/components/admin/profile-view-button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Registrations = {
  id: string;
  datetime: string;
  loginID: string;
  worklyID: string;
  name: string;
  email: string;
  regMethod: string;
  level: string;
  paymentSlip: string;
};

export const columns: ColumnDef<Registrations>[] = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Reg. Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "datetime",
    cell: ({ row }) => {
      // parse the date type to readable format
      const date = new Date(row.getValue("datetime")).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <p>{date}</p>;
    },
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Login ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "loginID",
  },
  {
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
    accessorKey: "worklyID",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "name",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          E-mail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "email",
  },
  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => `${parseFloat(row.getValue("amountPaid")).toFixed(2)}`,
  },
  {
    header: "Slips",
    accessorKey: "paymentSlip",
    cell: ({ row }) => {
      const slipUrl = row.getValue("paymentSlip");
      return slipUrl ? (
        <div className="flex items-center gap-x-3">
          <Link
            href={getPaymentSlipUrl(slipUrl as string)}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "icon" })}>
            <SquareArrowOutUpRight />
          </Link>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => downloadFile(slipUrl as string)}>
            <Download />
          </Button>
        </div>
      ) : (
        <span className="text-muted-foreground">Not Paid Yet</span>
      );
    },
  },
  {
    header: "Reg. Method",
    accessorKey: "regMethod",
  },
  {
    header: "Level",
    accessorKey: "level",
    cell: ({ row }) => {
      if (Number(row.original.level) === -1) return "Admin";
      const levels = [
        "Top Manager",
        "Sub Company",
        "Sub 1",
        "Sub 2",
        "Sub 3",
        "Student",
      ];
      return levels[Number(row.original.level) + 1] || "Unknown";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center justify-center gap-x-2">
          <ApproveUser userID={user.id} type="icon" />
          <RejectUser userID={user.id} type="icon" />
          <ProfileViewBtn id={row.original.id} />
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
