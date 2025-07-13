"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateStudentPayments from "@/components/admin/update-student-payment";
import ProfileViewBtn from "@/components/admin/profile-view-button";
import { Badge } from "@/components/ui/badge";
import ApproveUser from "@/components/admin/approve-user";
import RejectUser from "@/components/admin/reject-user";
import { DataTableColumnHeader } from "@/components/data-table-column";

export type AdminUser = {
  id: string;
  loginid: string;
  nicnumber: string;
  worklyid: string;
  name: string;
  district: string;
  phone: string;
  whatsapp: string;
  email: string;
  createdat: Date;
  status: string;
  role: string;
  level: number;
  totalpaid: number;
  sponsor_worklyid: string;
  sponsor_firstname: string;
  sponsor_lastname: string;
  sponsor: string;
  commissionrate: string;
  registration_method: string;
  kyc_status: string;
  referrals: number;
  balance: number;
};

export const adminColumns: ColumnDef<AdminUser>[] = [
  {
    header: "No.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "createdat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reg Date" />
    ),
    cell: ({ row }) => new Date(row.getValue("createdat")).toLocaleDateString(),
  },
  {
    accessorKey: "loginid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Login ID" />
    ),
  },
  {
    accessorKey: "worklyid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Workly ID" />
    ),
  },
  {
    accessorKey: "nicnumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIC" />
    ),
  },
  {
    accessorKey: "name",
    size: 50,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => (
      <span className="w-20 overflow-x-hidden text-ellipsis">
        {row.original.name}
      </span>
    ),
  },
  {
    size: 50,
    accessorKey: "sponsor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sponsor" />
    ),
    cell: ({ row }) => (
      <span className="w-full overflow-x-hidden text-ellipsis">
        {row.original.sponsor}
      </span>
    ),
  },
  {
    accessorKey: "district",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="District" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.original.district}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "whatsapp",
    header: "WhatsApp",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "User Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.role.replace("_", " ")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={`capitalize ${
          row.original.status === "pending" &&
          "bg-highlight-yellow border-highlight-yellow"
        }`}
        variant={row.original.status === "approved" ? "default" : "outline"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "kyc_status",
    header: "KYC Status",
    cell: ({ row }) => (
      <Badge
        className={`capitalize ${
          row.original.status === "pending" &&
          "bg-highlight-yellow border-highlight-yellow"
        }`}
        variant={row.original.status === "approved" ? "default" : "outline"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "registration_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
  },
  {
    accessorKey: "commissionrate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLC" />
    ),
    cell: ({ row }) => {
      if (
        Number(row.original.commissionrate) <= 100 &&
        Number(row.original.commissionrate) > 0
      ) {
        return `${Number(row.original.commissionrate)}%`;
      } else {
        return Number(row.original.commissionrate).toFixed(2);
      }
    },
  },
  {
    accessorKey: "totalpaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Paid" />
    ),
    cell: ({ row }) => `${Number(row.original.totalpaid).toFixed(2)}`,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Earning Bal." />
    ),
    cell: ({ row }) => `${Number(row.original.balance).toFixed(2)}`,
  },
  {
    accessorKey: "referrals",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tot. Referrals" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {row.original.status === "pending" && (
          <div className="flex items-center justify-center gap-x-2">
            <ApproveUser userID={row.original.id} type="icon" />
            <RejectUser userID={row.original.id} type="icon" />
          </div>
        )}
        {row.original.status === "approved" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <UpdateStudentPayments studentid={row.original.id} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Update Payment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <ProfileViewBtn id={row.original.id} />
      </div>
    ),
  },
];
